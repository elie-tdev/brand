import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { Logger, UseGuards } from '@nestjs/common'
import {
  TitleTags,
  Success,
  FromScratchResponsePayload
} from 'typings/graphql.schema'
import { GuidelineService } from './guideline.service';
import { BrandEntity } from '@module/brand/brand.entity';
import { DraftGuidelinesEntity } from './guideline.entity';

@Resolver('Guideline')
export class GuidelineResolver {
  constructor(
    private readonly guidelineService: GuidelineService,
  ) { }
  private readonly logger = new Logger(GuidelineResolver.name)

  @Query()
  async getTitleTags(
    @Args('brandId') brandId: BrandEntity['brandId'],
    @Args('_id') objId: string,
  ): Promise<TitleTags> {
    const titleTags = await this.guidelineService.getTitleTagsByObjId(brandId, objId)
    // this.logger.log(JSON.stringify(titleTags))
    if (titleTags.tags === null || undefined) { titleTags.tags = [] }
    return titleTags
  }

  @Mutation()
  async replaceTitleTags(
    @Args('brandId') brandId: BrandEntity['brandId'],
    @Args('_id') objId: string,
    @Args('title') title: string,
    @Args('tags') tags: string[],
  ): Promise<Success> {
    return await this.guidelineService.replaceTitleTagsByObjId(brandId, objId, title, tags)
  }

  @Mutation()
  async removeObjByObjId(
    @Args('brandId') brandId: BrandEntity['brandId'],
    @Args('_id') objId: string,
  ): Promise<Success> {
    return await this.guidelineService.removeObjByObjId(brandId, objId)
  }

  @Mutation()
  async buildFromScratch(
    @Args('brandName') brandName: BrandEntity['brandName'],
    @Args('websiteUrl') websiteUrl: BrandEntity['websiteUrl'],
    @Args('brandId') brandId: BrandEntity['brandId'],
  ): Promise<FromScratchResponsePayload> {
    const { draftGuidelineId } = await this.guidelineService.buildFromScratch(brandName, websiteUrl, brandId)
    return { draftGuidelineId }
  }

  @Mutation()
  async updateSelectedCoverMode(
    @Args('brandId') brandId: BrandEntity['brandId'],
    @Args('coverArtSlug') coverArtSlug: DraftGuidelinesEntity['coverArtSlug'],
  ): Promise<Success> {
    return await this.guidelineService.updateSelectedCoverMode(brandId, coverArtSlug)
  }
}
