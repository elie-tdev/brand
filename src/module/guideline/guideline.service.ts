import { Injectable, Logger } from '@nestjs/common';
import { BrandEntity } from '@module/brand/brand.entity'
import { DatabaseService } from '@module/database/database.service'
import {
  TitleTagsPayload,
  ScratchResponse,
  DraftGuidelinesEntity
 } from './guideline.entity';
import { Success } from 'typings/graphql.schema';
import { keysToCamel } from '@common/util/keysToCamel'

@Injectable()
export class GuidelineService {
  constructor(
    private readonly db: DatabaseService,
  ) { }
  private readonly logger = new Logger(GuidelineService.name)

  async getTitleTagsByObjId(
    brandId: BrandEntity['brandId'],
    objId: string,
  ): Promise<TitleTagsPayload> {
    const result = await this.db.conn.one(
      `SELECT obj.value->>'_id' as _id,
        obj.value->>'title' as title,
        obj.value->'tags' as tags
      FROM draft_guidelines, jsonb_each(draft_guideline_obj) sobj
      JOIN LATERAL jsonb_array_elements(to_jsonb(sobj.value)) obj(value)
      ON obj.value->>'_id' = $2
      where draft_guideline_id IN (
        SELECT draft_guideline_id
        FROM brands
        WHERE brand_id = $1
      ) and deleted_at is null;`, [brandId, objId],
    )
    // this.logger.log(`getTitleTagsByObjId - result -> ${JSON.stringify(result)}`)
    return result
  }

  async replaceTitleTagsByObjId(
    brandId: BrandEntity['brandId'],
    objId: string,
    title: string,
    tags: string[],
  ): Promise<Success> {
    if (title === undefined) { title = '' }
    if (tags === undefined) { tags = [] }
    // this.logger.log(`replaceTitleTagsByObjId - title -> ${JSON.stringify(title)}`)
    // this.logger.log(`replaceTitleTagsByObjId - tags -> ${tags}`)

    return await this.db.conn.one(
      `with guideline as (
        SELECT sobj.value as value, sobj.key as key
        FROM draft_guidelines, jsonb_each(draft_guideline_obj) sobj
        where draft_guideline_id IN (
          SELECT draft_guideline_id
          FROM brands
          WHERE brand_id = $1
        ) and deleted_at is null
      ),
      obj as (
        select index-1 as idx, guideline.key as key
        from guideline,jsonb_array_elements(guideline.value)
        with ordinality arr(i, index)
        where i->>'_id' = $2
      ),
      item_path as (
        select (
          '{'||obj.key||','||obj.idx||',title}'
        )::text[] as title,
        (
          '{'||obj.key||','||obj.idx||',tags}'
        )::text[] as tags
        from obj
      )
      update draft_guidelines
      set draft_guideline_obj = jsonb_set(
        jsonb_set(
          draft_guideline_obj,
          item_path.title, $3::jsonb
        ),
          item_path.tags, to_jsonb( $4::text[] )
      )
      from item_path
      where draft_guideline_id IN (
        SELECT draft_guideline_id
        FROM brands
        WHERE brand_id = $1
      ) returning true as success;`,
      [brandId, objId, JSON.stringify(title), tags],
    )
  }

  async removeObjByObjId(
    brandId: BrandEntity['brandId'],
    objId: string,
  ): Promise<Success> {
    return await this.db.conn.one(
      `with guideline as (
        SELECT sobj.value as value, sobj.key as key
        FROM draft_guidelines, jsonb_each(draft_guideline_obj) sobj
        where draft_guideline_id IN (
          SELECT draft_guideline_id
          FROM brands
          WHERE brand_id = $1
        ) and deleted_at is null
      ),
      obj as (
        select index-1 as idx, guideline.key as key
        from guideline,jsonb_array_elements(guideline.value)
        with ordinality arr(i, index)
        where i->>'_id' = $2
      )
      update draft_guidelines
      set draft_guideline_obj = draft_guideline_obj #- ('{'||obj.key||','||obj.idx||'}')::text[]
      from obj
      where draft_guideline_id IN (
        SELECT draft_guideline_id
        FROM brands
        WHERE brand_id = $1
      ) returning true as success;`,
      [brandId, objId],
    )
  }

    async buildFromScratch(
      brandName: BrandEntity['brandName'],
      websiteUrl: BrandEntity['websiteUrl'],
      brandId: BrandEntity['brandId'],
    ): Promise<ScratchResponse> {

      const data = {
        meta: [],
        logos: [],
        typography: [],
        colors: [],
      }

      const domainSlug = websiteUrl.replace('http:\/\/', '').replace(/\./g, '-')

      const guidelineId = await this.db.conn.one(
        `with draft_save as (
          insert into draft_guidelines (
            brand_id,
            draft_guideline_obj
          ) select
              $1::uuid,
              $2::jsonb
          returning draft_guideline_id
        ),
        brand_update as (
          update brands
            set draft_guideline_id = draft_save.draft_guideline_id,
              brand_name = $3,
              domain_slug = $5,
              website_url = $4
            from draft_save
            where brand_id = $1
          returning draft_save.draft_guideline_id
        ) select draft_guideline_id from brand_update;`,
        [brandId, data, brandName, websiteUrl, domainSlug],
      )

      return keysToCamel({ ...guidelineId })
    }

  async updateSelectedCoverMode(
    brandId: BrandEntity['brandId'],
    coverArtSlug: DraftGuidelinesEntity['coverArtSlug'],
  ): Promise<Success> {
    return await this.db.conn.one(
      `update draft_guidelines
        set cover_art_slug = $2
      where draft_guideline_id IN (
        SELECT draft_guideline_id
        FROM brands
        WHERE brand_id = $1
      ) and deleted_at is null
      returning true as success;`,
      [brandId, coverArtSlug],
    )
  }
}
