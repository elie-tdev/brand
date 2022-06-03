import { Injectable, Logger } from '@nestjs/common'
import { BrandEntity, BrandDatabaseFields } from './brand.entity'
import { DatabaseService } from '../database/database.service'
import { keysToCamel } from '../../common/util/keysToCamel'

@Injectable()
export class BrandService {
  constructor(private readonly db: DatabaseService) {}
  private readonly logger = new Logger(BrandService.name)

  async createBrand(
    websiteUrl: BrandEntity['websiteUrl'],
    hadGuidelines: BrandEntity['hadGuidelines'],
  ): Promise<BrandEntity['brandId']> {
    return await this.db.conn
      .one(
        `insert into brands (
            website_url,
            had_guidelines
          ) values (
            $1,
            $2
          ) returning brand_id`,
        [websiteUrl, hadGuidelines],
      )
      .then(({ brand_id }: BrandDatabaseFields) => {
        // this.logger.log('createBrand -> brand_id -> ' + JSON.stringify(brand_id))
        return keysToCamel(brand_id)
      })
  }
}
