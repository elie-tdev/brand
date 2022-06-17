import { DatabaseEntity } from '@module/database/database.entity'
import { LogoObject } from '@module/logo/logo.entity';
import { JSONObject } from 'typings/jsonObject';
import { DraftGuidelinesEntity } from '@module/guideline/guideline.entity';

export class ScraperEntity extends DatabaseEntity {
  scrapeId: ScraperDatabaseFields['scrape_id']
  brandId: ScraperDatabaseFields['brand_id']
  scrapedObj: ScraperDatabaseFields['scraped_obj']
}

export interface ScraperDatabaseFields {
  scrape_id: string
  brand_id: string
  scraped_obj: JSONObject
}

export interface ScrapeResponse {
  draftGuidelineId: DraftGuidelinesEntity['draftGuidelineId']
  logo: LogoObject
}
