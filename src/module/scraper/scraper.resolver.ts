import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { Logger, UseGuards } from '@nestjs/common'
import { ScraperService } from './scraper.service'
import { ScrapedData } from 'typings/graphql.schema'
import { BrandEntity } from '@module/brand/brand.entity'
import { ScraperEntity } from '@module/scraper/scraper.entity'

@Resolver('Scraper')
export class ScraperResolver {
  constructor(private readonly scraperService: ScraperService) {}
  private readonly logger = new Logger(ScraperResolver.name)

  @Query()
  async scrapeByBrandId(
    @Args('brandId') brandId: BrandEntity['brandId']
  ): Promise<ScrapedData[]> {
    return await this.scraperService.scrapeByBrandId(brandId).then(scrapes => {
      return scrapes
    })
  }

  @Mutation()
  async scrapeThisUrl(
    @Args('websiteUrl') websiteUrl: string,
    @Args('brandId') brandID: BrandEntity['brandId']
  ): Promise<ScrapedData['scraperId']> {
    return this.scraperService.scrapeThisUrl(websiteUrl, brandID).then(scraperId => {
      return scraperId
    })
  }
}
