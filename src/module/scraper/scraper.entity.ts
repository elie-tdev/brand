import { DatabaseEntity } from '@module/database/database.entity'

export class ScraperEntity extends DatabaseEntity {
  scraperId: ScraperDatabaseFields['scrape_id']
  brandId: ScraperDatabaseFields['brand_id']
  scrapedObj: ScraperDatabaseFields['scraped_obj']
}

export interface ScraperDatabaseFields {
  scraperId: string
  brandId: string
  scrapedObj: jsonb
}
