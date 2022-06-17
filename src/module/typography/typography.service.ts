import { Injectable, Logger, HttpService } from '@nestjs/common';
import {
  TypographyEntity,
  TypographyObject,
  TypographySourceObject,
} from './typography.entity'
import { Success } from 'typings/graphql.schema'
import { BrandEntity } from '@module/brand/brand.entity'
import { DatabaseService } from '@module/database/database.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class TypographyService {
  constructor(
    private readonly db: DatabaseService,
    private readonly httpService: HttpService,
  ) { }
  private readonly logger = new Logger(TypographyService.name)

  async typographyByBrandId(
    brandId: BrandEntity['brandId'],
  ): Promise<TypographyEntity> {
    const typography = await this.db.conn
      .one(
        `SELECT draft_guideline_obj->'typography' as typography
          FROM draft_guidelines
          WHERE draft_guideline_id IN (
            SELECT draft_guideline_id
            FROM brands
            WHERE brand_id = $1
          ) and deleted_at is null;`,
        [brandId],
      )
    // this.logger.log(`typographyByBrandId - typography -> ${JSON.stringify(typography)}`)
    return typography
  }

  // query a font by the family name
  async findFont(
    fontFamily: string,
    _id: string,
    brandId: BrandEntity['brandId'],
  ): Promise<TypographyObject['fontFamily']> {
    const url = process.env.GOOGLE_FONT_URL
      + '?key='
      + process.env.GOOGLE_FONT_API_KEY

    // query the google api
    let response = await this.httpService.get(url)
      .toPromise()
      .then(res => {
        for (let i in res.data['items']) {
          if (res.data['items'][i]['family']
            ===
            fontFamily.charAt(0).toUpperCase() + fontFamily.substr(1).toLowerCase()) {
            let item = res.data['items'][i]
            let result = {
              "source": {
                "provider": "GOOGLE_FONT",
                "ref": process.env.GOOGLE_FONT_URL,
              },
              "variants": item['files'],
            }
            return result
          }
        }
        // query the typekit api
        this.httpService.get(process.env.ADOBE_FONTS_URL

          + '?q='
          + fontFamily, {
            'headers': {
              'X-Api-Key': process.env.ADOBE_FONTS_API_KEY
            }
          }).toPromise().then(res => {
            const webFont = res.data[0]['display_font']['font']['web']
            let result = {
              "source": {
                "provider": "ADOBE_FONT",
                "fontId": webFont['font_id'],
                "ref": process.env.ADOBE_FONTS_URL
              },
              "variants": [webFont['fvd']]
            }
            return result
          })
      })

    return this.db.conn.one(
      `with typographies as (
        select draft_guideline_obj->'typography' as typography
        from draft_guidelines
        WHERE draft_guideline_id IN (
          SELECT draft_guideline_id
          FROM brands
          WHERE brand_id = $1
        ) and deleted_at is null
      ),
      font_index as (
        select index-1 as value from typographies,jsonb_array_elements(typography)
        with ordinality arr(i, index) where i->>'_id' = $2
      ),
      source_path as (
        select (
          select '{typography,'||font_index.value||'}'
        )::text[] as value from font_index
      ),
      font_path as (
        select (
          select '{'||font_index.value||'}'
        )::text[] as value from font_index
      )
      update draft_guidelines
      set draft_guideline_obj = jsonb_set(draft_guideline_obj,
        source_path.value,
        draft_guideline_obj->'typography'#>font_path.value
        ||
        $3::jsonb
      ) from font_path,source_path where brand_id = $1
      returning draft_guideline_obj->'typography'#>font_path.value->'source' as source,
      draft_guideline_obj->'typography'#>font_path.value->'variants' as variants;`,
      [brandId, _id, response]
    )
  }

  // NOT COMPLETE - does font resolve in google hosted css fonts
  async googleFontCss(
    fontFamily: TypographyObject['fontFamily'],
  ) {
    const url = `https://fonts.googleapis.com/css?family=${fontFamily}`

    const response = await this.httpService.get(url)
      .toPromise()
      .then(res => {
        this.logger.log(`findFont - res -> ${JSON.stringify(res.status)}`)
        const source = {
          provider: 'GOOGLE_FONT',
          ref: url,
        }
        return source
      }).catch(err => this.logger.error(err))
  }

  async fetchTypographySource(
    brandId: BrandEntity['brandId'],
    objId: string,
  ): Promise<TypographySourceObject> {
    return await this.db.conn.one(
      `SELECT obj.value as typographyObj
        FROM draft_guideline_id
        JOIN LATERAL jsonb_array_elements(draft_guideline_obj->'typography') obj(value)
        ON obj.value->>'_id' = $2
        WHERE draft_guideline_id IN (
          SELECT draft_guideline_id
          FROM brands
          WHERE brand_id = $1
        ) and deleted_at is null;`,
        [brandId, objId],
    ).then((typographyObj: TypographyObject) => {
      this.logger.log(JSON.stringify(typographyObj))
      if (typographyObj.source === undefined || typographyObj.source.ref === '') {
        this.findFont(
          typographyObj.fontFamily,
          objId,
          brandId,
        )
      }
      return typographyObj.source
    })
  }

  async addTypography(
    brandId: BrandEntity['brandId'],
    typographyObj: TypographyObject,
  ): Promise<Success> {
    typographyObj._id = uuidv4()
    return await this.db.conn.one(
      `update draft_guidelines
        set draft_guideline_obj = jsonb_set(
          draft_guideline_obj,
          '{typography}'::text[],
          draft_guideline_obj->'typography' || $2::jsonb
        )
        WHERE draft_guideline_id IN (
          SELECT draft_guideline_id
          FROM brands
          WHERE brand_id = $1
        ) returning true as success;`,
      [brandId, typographyObj],
    )
  }

  async replaceTypographyObj(
    brandId: BrandEntity['brandId'],
    objId: string,
    typographyObj: TypographyObject,
  ): Promise<Success> {
    return await this.db.conn.one(
      `update draft_guidelines
         set draft_guideline_obj = jsonb_set(
           draft_guideline_obj,
           '{typography}'::text[],
           (((draft_guideline_obj -> 'typography')
            -
           (select i from generate_series(
             0,
             jsonb_array_length(draft_guideline_obj->'typography') - 1)
            as i where (
             draft_guideline_obj->'typography'->i->>'_id' = $2
           )))::jsonb || $3::jsonb))
          WHERE draft_guideline_id IN (
            SELECT draft_guideline_id
            FROM brands
            WHERE brand_id = $1
          ) returning true as success;`,
      [brandId, objId, typographyObj],
    )
  }
}
