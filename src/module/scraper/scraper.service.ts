import { Injectable, HttpService } from '@nestjs/common';
import { ScraperEntity } from './scraper.entity'
import { BrandEntity } from '@module/brand/brand.entity'
import { DatabaseService } from '../database/database.service'
import { keysToCamel } from '@common/util/keysToCamel'

@Injectable()
export class ScraperService {
  constructor(
    private readonly httpService: HttpService,
    private readonly db: DatabaseService
  ) {}

  async scrapeByBrandId(brandId: BrandEntity['brandId']): Promise<ScraperEntity[]> {
    return await this.db.conn
      .any(
        'SELECT * FROM scapes WHERE brand_id = $1',
        [brandId]
      )
      .then((scrapes: ScraperEntity[]) => {
        return keysToCamel(scrapes)
      })
  }

  async scrapeThisUrl(
    websiteUrl: BrandEntity['websiteUrl'],
    brandId: BrandEntity['brandId'],
  ): Promise<ScraperEntity> {

  let scrapedObj = await this.httpService.get(process.env.SCRAPER_URL
      + websiteUrl
      + '&brandID='
      + brandId
    )
   .toPromise()
   .then(res => res.data)
   .catch(err => err.message)

  return await this.db.conn.one(
   `insert into scrapes (
       brand_id,
       scraped_obj
     ) values (
      $1,
      $2
     ) returning scrape_id`,
     [brandId, scrapedObj]
   )
  }
}
