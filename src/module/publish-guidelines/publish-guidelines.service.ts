import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service'
import { BrandEntity } from '@module/brand/brand.entity'
import { TenantBrandsEntity } from '@module/tenant/tenant-brands.entity'
import {
  TypographyPayload,
  LogoPayload,
  ColorPayload,
  Success,
  PublishedGuidelineData,
  DraftGuidelinePayload,
} from 'typings/graphql.schema'

@Injectable()
export class PublishGuidelinesService {
  constructor(
    private readonly db: DatabaseService,
  ) { }
  private readonly logger = new Logger(PublishGuidelinesService.name)

  viewDraftGuideline(
    tenantId: TenantBrandsEntity['tenantId']
  ): Promise<PublishedGuidelineData> {
    return this.db.conn
      .one(
        `with brandId as (
          select
            brand_id as value
          from tenant_brands
          where tenant_id = $1::uuid
        ),
        domainSlug as (
          select
            domain_slug as value
          from brands,brandId
          where brand_id = brandId.value::uuid
        )
        select
          draft_guideline_id as "guidelineId",
          draft_guideline_obj as "guidelineObj",
          domainSlug.value as "domainSlug",
          cover_art_slug as "coverArtSlug"
        from draft_guidelines,brandId,domainSlug
        where brand_id = brandId.value;`,
        [tenantId]
      )
  }



  // gets all public or private published guidelines of the brandId
  guidelinesByBrandId(
    brandId: BrandEntity['brandId'],
    isPublic: PublishedGuidelineData['isPublic'],
  ): Promise<PublishedGuidelineData> {
    return this.db.conn
      .one(
        `select
          published_guideline_id as "guidelineId",
          published_guideline_obj as "guidelineObj",
          cover_art_slug as "coverArtSlug"
        from published_guidelines
        where brand_id = $1 and is_public = $2 and deleted_at is null;`,
        [brandId, isPublic],
      )
  }
  // TODO: update the rest of the selects throughout published_guideline reads

  // gets the public status by searching the website url
  getGuidelinePublicStatus(
    websiteUrl: BrandEntity['websiteUrl'],
  ): Promise<PublishedGuidelineData> {
    return this.db.conn
      .one(
        `with brandId as (
          select
            brand_id as value
            from brands
            where website_url = $1
        )
        select
          is_public
        from published_guidelines,brandId
        where brand_id = brandId.value and deleted_at is null;`,
        [websiteUrl],
      )
  }

  // gets the public status by searching the domainSlug
  getGuidelinePublicStatusByDomainSlug(
    domainSlug: BrandEntity['domainSlug'],
  ): Promise<PublishedGuidelineData> {
    return this.db.conn
      .one(
        `with brandId as (
          select
            brand_id as value
            from brands
            where domain_slug = $1::text
        )
        select
          is_public
        from published_guidelines,brandId
        where brand_id = brandId.value and deleted_at is null;`,
        [domainSlug],
      )
  }

  // gets all draft guidelines of the brandId
  draftGuidelinesByBrandId(
    brandId: BrandEntity['brandId'],
  ): Promise<PublishedGuidelineData> {
    return this.db.conn
      .one(
        `select
          draft_guideline_id as "guidelineId",
          draft_guideline_obj as "guidelineObj",
          cover_art_slug as "coverArtSlug"
        from draft_guidelines
        where brand_id = $1 and deleted_at is null;`,
        [brandId],
      )
  }

  // gets a single published guideline based on the publishedGuidelineId
  guidelineByGuidelineId(
    guidelineId: PublishedGuidelineData['guidelineId'],
  ): Promise<PublishedGuidelineData> {
    return this.db.conn
      .one(
        `select
          published_guideline_id as "guidelineId",
          brand_id as "brandId",
          published_guideline_obj as "guidelineObj",
          cover_art_slug as "coverArtSlug"
        from published_guidelines
        where published_guideline_id = $1 and deleted_at is null;`,
        [guidelineId],
      )
  }

  // gets a single draft guideline based on the publishedGuidelineId
  draftGuidelineByGuidelineId(
    guidelineId: PublishedGuidelineData['guidelineId'],
  ): Promise<PublishedGuidelineData> {
    return this.db.conn
      .one(
        `select
          draft_guideline_id as "guidelineId",
          brand_id as "brandId",
          draft_guideline_obj as "guidelineObj",
          cover_art_slug as "coverArtSlug"
        from draft_guidelines
        where draft_guideline_id = $1 and deleted_at is null;;`,
        [guidelineId],
      )
  }

  // gets a single published guideline based on the websiteUrl
  guidelineByWebsiteUrl(
    websiteUrl: BrandEntity['websiteUrl'],
  ): Promise<PublishedGuidelineData> {
    return this.db.conn
      .oneOrNone(
        `select
          published_guideline_id as "guidelineId",
          brand_id as "brandId",
          published_guideline_obj as "guidelineObj",
          cover_art_slug as "coverArtSlug",
          is_public as "isPublic",
          updated_at as "updatedAt"
        from published_guidelines
        where brand_id in (
          select brand_id
          from brands
          where website_url like $1
        ) and deleted_at is null;`,
        [`${websiteUrl}%`],
      )
  }

  // gets a single published guideline based on the domainSlug
  guidelineByDomainSlug(
    domainSlug: BrandEntity['domainSlug'],
  ): Promise<PublishedGuidelineData> {
    return this.db.conn
      .oneOrNone(
        `select
          published_guideline_id as "guidelineId",
          brand_id as "brandId",
          published_guideline_obj as "guidelineObj",
          cover_art_slug as "coverArtSlug",
          is_public as "isPublic",
          updated_at as "updatedAt"
        from published_guidelines
        where brand_id in (
          select brand_id
          from brands
          where domain_slug = $1
        ) and deleted_at is null;`,
        [domainSlug],
      )
  }

  // gets a single draft guideline based on the websiteUrl
  async draftGuidelineByWebsiteUrl(
    websiteUrl: BrandEntity['websiteUrl'],
  ): Promise<DraftGuidelinePayload> {
    return await this.db.conn
      .one(
        `select
          draft_guideline_obj as "guidelineObj",
          cover_art_slug as "coverArtSlug"
        from draft_guidelines
        where draft_guideline_id in (
          select draft_guideline_id
          from brands
          where website_url like $1
        ) and deleted_at is null;`,
        [`${websiteUrl}%`],
      )
  }

  // gets a single draft guideline based on the domainSlug
  async draftGuidelineByDomainSlug(
    domainSlug: BrandEntity['domainSlug'],
  ): Promise<DraftGuidelinePayload> {
    return await this.db.conn
      .one(
        `select
          draft_guideline_obj as "guidelineObj",
          cover_art_slug as "coverArtSlug"
        from draft_guidelines
        where draft_guideline_id in (
          select draft_guideline_id
          from brands
          where domain_slug = $1
        ) and deleted_at is null;`,
        [domainSlug],
      )
  }

  // gets date of the last published guideline update
  getGuidelineLastUpdateDate(
    guidelineId: PublishedGuidelineData['guidelineId'],
  ): Promise<PublishedGuidelineData['updatedAt']> {
    return this.db.conn
      .one(
        `select
          updated_at as last_updated
        from published_guidelines
        where published_guideline_id = $1 and deleted_at is null;`,
        [guidelineId],
      )
  }

  // gets date of the last draft guideline update
  getDraftGuidelineLastUpdateDate(
    guidelineId: PublishedGuidelineData['guidelineId'],
  ): Promise<PublishedGuidelineData['updatedAt']> {
    return this.db.conn
      .one(
        `select
          updated_at as last_updated
        from draft_guidelines
        where draft_guideline_id = $1 and deleted_at is null;`,
        [guidelineId],
      )
  }

  // gets the published typographies
  getTypographyByGuidelineId(
    guidelineId: PublishedGuidelineData['guidelineId'],
  ): Promise<TypographyPayload[]> {
    return this.db.conn
      .one(
        `select
          published_guideline_obj->'typography' as typography
        from published_guidelines
        where published_guideline_id = $1 and deleted_at is null;`,
        [guidelineId],
      )
  }

  // gets the draft typographies
  getDraftTypographyByGuidelineId(
    guidelineId: PublishedGuidelineData['guidelineId'],
  ): Promise<TypographyPayload[]> {
    return this.db.conn
      .one(
        `select
          draft_guideline_obj->'typography' as typography
        from draft_guidelines
        where draft_guideline_id = $1 and deleted_at is null;`,
        [guidelineId],
      )
  }

  // gets the published logos
  getLogosByGuidelineId(
    guidelineId: PublishedGuidelineData['guidelineId'],
  ): Promise<LogoPayload[]> {
    return this.db.conn
      .one(
        `select
          published_guideline_obj->'logos' as logos
        from published_guidelines
        where published_guideline_id = $1 and deleted_at is null;`,
        [guidelineId],
      )
  }

  // gets the draft logos
  getDraftLogosByGuidelineId(
    guidelineId: PublishedGuidelineData['guidelineId'],
  ): Promise<LogoPayload[]> {
    return this.db.conn
      .one(
        `select
          draft_guideline_obj->'logos' as logos
        from draft_guidelines
        where draft_guideline_id = $1 and deleted_at is null;`,
        [guidelineId],
      )
  }

  // gets the published colors
  getColorsByGuidelineId(
    guidelineId: PublishedGuidelineData['guidelineId'],
  ): Promise<ColorPayload[]> {
    return this.db.conn
      .one(
        `select
          published_guideline_obj->'colors' as colors
        from published_guidelines
        where published_guideline_id = $1 and deleted_at is null;`,
        [guidelineId],
      )
  }

  // gets the draft colors
  getDraftColorsByGuidelineId(
    guidelineId: PublishedGuidelineData['guidelineId'],
  ): Promise<ColorPayload[]> {
    return this.db.conn
      .one(
        `select
          draft_guideline_obj->'colors' as colors
        from draft_guidelines
        where published_guideline_id = $1 and deleted_at is null;`,
        [guidelineId],
      )
  }

  // updates the deleted_at value from the published_guidelines table
  deleteGuideline(
    guidelineId: PublishedGuidelineData['guidelineId'],
  ): Promise<Success> {
    return this.db.conn.one(
      `update published_guidelines
        set deleted_at = now()
      where published_guideline_id = $1
      returning true as success;`,
      [guidelineId],
    )
  }

  // updates the deleted_at value from the draft_guidelines table
  deleteDraftGuideline(
    guidelineId: PublishedGuidelineData['guidelineId'],
  ): Promise<Success> {
    return this.db.conn.one(
      `update draft_guidelines
        set deleted_at = now()
      where draft_guideline_id = $1
      returning true as success;`,
      [guidelineId],
    )
  }

  // saves the scraped obj from the scrapes table to the draft_guidelines table
  saveGuideline(
    brandId: BrandEntity['brandId'],
  ): Promise<PublishedGuidelineData> {
    return this.db.conn.one(
      `with draft as (
        select scrape_id as scrapeId,
          brand_id as brandId,
          scraped_obj as value
        from scrapes where brand_id=$1
      )
      insert into draft_guidelines (
        brand_id,
        scrape_id,
        draft_guideline_obj
      )
      select draft.brandId,
        draft.scrapeId,
        draft.value
      from draft;`
      [brandId],
    )
  }

  // saves the draft guideline into the published guidelines table
  publishGuideline(
    brandId: PublishedGuidelineData['brandId'],
  ): Promise<Success> {
    return this.db.conn.one(
      `with draft as (
        select draft_guideline_id as guidelineId,
          brand_id as brandId,
          draft_guideline_obj as obj,
          case
            when cover_art_slug is null then 'cover1'
            else cover_art_slug
          end
        from draft_guidelines
        WHERE draft_guideline_id IN (
          SELECT draft_guideline_id
          FROM brands
          WHERE brand_id = $1
        )
      )
      insert into published_guidelines (
        brand_id,
        draft_guideline_id,
        published_guideline_obj,
        cover_art_slug
      )
      select draft.brandId::uuid,
        draft.guidelineId::uuid,
        draft.obj::jsonb,
        draft.cover_art_slug::text
      from draft
      ON CONFLICT ON CONSTRAINT published_guidelines_brand_id_unique DO
      UPDATE
        SET (
          draft_guideline_id,
          published_guideline_obj,
          cover_art_slug
        ) = (
          EXCLUDED.draft_guideline_id,
          EXCLUDED.published_guideline_obj,
          EXCLUDED.cover_art_slug
        )
      returning true as success;`,
      [brandId],
    )
  }

  // changes the public flag for the guideline in the published guidelines table
  changeGuidelinePublicState(
    guidelineId: PublishedGuidelineData['guidelineId'],
    isPublic: PublishedGuidelineData['isPublic'],
  ): Promise<Success> {
    return this.db.conn.one(
      `update published_guidelines
        set is_public = $2
      where published_guideline_id = $1 and deleted_at is null
      returning true as success;`,
      [guidelineId, isPublic],
    )
  }
}
