import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { Logger, UseGuards } from '@nestjs/common'
import { ScraperService } from './scraper.service'
import {
  ScrapedData,
  ScrapeResponsePayload,
} from 'typings/graphql.schema'
import { BrandEntity } from '@module/brand/brand.entity'
import { LogoService } from '@module/logo/logo.service';

@Resolver('Scraper')
export class ScraperResolver {
  constructor(
    private readonly scraperService: ScraperService,
    private readonly logoService: LogoService,
  ) { }
  private readonly logger = new Logger(ScraperResolver.name)

  @Query()
  async scrapesByBrandId(
    @Args('brandId') brandId: BrandEntity['brandId']
  ): Promise<ScrapedData[]> {
    return await this.scraperService.scrapesByBrandId(brandId).then(scrapes => {
      return scrapes
    })
  }

  @Mutation()
  async scrapeThisUrl(
    @Args('brandName') brandName: BrandEntity['brandName'],
    @Args('websiteUrl') websiteUrl: BrandEntity['websiteUrl'],
    @Args('brandId') brandId: BrandEntity['brandId'],
  ): Promise<ScrapeResponsePayload> {
    const { draftGuidelineId, logo } = await this.scraperService.scrapeThisUrl(brandName, websiteUrl, brandId)
    return { draftGuidelineId, logo }
  }
//
//   @Mutation()
//   async buildLogoOnlyDraftGuideline(
//     @Args('brandName') brandName: BrandEntity['brandName'],
//     @Args('websiteUrl') websiteUrl: BrandEntity['websiteUrl'],
//     @Args('brandId') brandId: BrandEntity['brandId'],
//   ): Promise<ScrapeResponsePayload> {
//     const { draftGuidelineId, logo } = await this.scraperService.buildLogoOnlyDraftGuideline(brandName, websiteUrl, brandId)
//     return { draftGuidelineId, logo }
//   }
}
