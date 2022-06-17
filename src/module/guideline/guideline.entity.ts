import { DatabaseEntity } from '@module/database/database.entity';
import { BrandDatabaseFields } from '../brand/brand.entity';
import { ScraperDatabaseFields } from '@module/scraper/scraper.entity';
import { JSONObject } from 'typings/jsonObject';
import { CoverArtDatabaseFields } from '../cover-art/cover-art.entity';

export class GuidelineEntity extends DatabaseEntity { }

export interface TitleTagsPayload {
  _id: string
  title: string
  tags?: string[]
}

export interface DraftGuidelinesEntity extends DatabaseEntity {
  draftGuidelineId: DraftGuidelinesDatabaseFields['draft_guideline_id']
  brandId: DraftGuidelinesDatabaseFields['brand_id']
  scrapeId: DraftGuidelinesDatabaseFields['scrape_id']
  draftGuidelineObj: DraftGuidelinesDatabaseFields['draft_guideline_obj']
  coverArtSlug: DraftGuidelinesDatabaseFields['cover_art_slug']
}

export interface DraftGuidelinesDatabaseFields {
  draft_guideline_id: string
  brand_id: BrandDatabaseFields['brand_id']
  scrape_id: ScraperDatabaseFields['scrape_id']
  draft_guideline_obj: JSONObject
  cover_art_slug: CoverArtDatabaseFields['cover_art_slug']
}

export interface PublishedGuidelinesEntity extends DatabaseEntity {
  publishedGuidelineId: PublishedGuidelinesDatabaseFields['draft_guideline_id']
  brandId: PublishedGuidelinesDatabaseFields['brand_id']
  scrapeId: PublishedGuidelinesDatabaseFields['scrape_id']
  draftGuidelineId: PublishedGuidelinesDatabaseFields['draft_guideline_id']
  publishedGuidelineObj: PublishedGuidelinesDatabaseFields['published_guideline_obj']
  isPublic: PublishedGuidelinesDatabaseFields['is_public']
  coverArtSlug: PublishedGuidelinesDatabaseFields['cover_art_slug']
}

export interface PublishedGuidelinesDatabaseFields {
  published_guideline_id: string
  brand_id: BrandDatabaseFields['brand_id']
  scrape_id: ScraperDatabaseFields['scrape_id']
  draft_guideline_id: DraftGuidelinesDatabaseFields['draft_guideline_id']
  published_guideline_obj: JSONObject
  is_public: boolean
  cover_art_slug: CoverArtDatabaseFields['cover_art_slug']
}

export interface ScratchResponse {
  draftGuidelineId: DraftGuidelinesEntity['draftGuidelineId']
}
