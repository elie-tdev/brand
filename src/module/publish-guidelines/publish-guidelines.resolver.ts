import { Resolver, Query, Args, Mutation, CONTEXT } from '@nestjs/graphql'
import { AuthGuard } from '../auth/auth.guard'
import { Logger, UseGuards, Inject } from '@nestjs/common'
import { BrandEntity } from '@module/brand/brand.entity'
import { SubscriptionGuard } from '@module/subscription/subscription.guard'
import {
  TypographyPayload,
  LogoPayload,
  ColorPayload,
  PublishedGuidelineData,
  Success,
  DraftGuidelinePayload,
} from 'typings/graphql.schema'
import { PublishGuidelinesService } from './publish-guidelines.service'

@Resolver('PublishGuidelines')
export class PublishGuidelinesResolver {
  constructor(
    @Inject(CONTEXT) private readonly context,
    private readonly publishGuidelinesService: PublishGuidelinesService,
  ) { }
  private readonly logger = new Logger(PublishGuidelinesResolver.name)

  @Query()
  @UseGuards(AuthGuard)
  viewDraftGuideline(): Promise<PublishedGuidelineData> {
    const { tenantId } = this.context.user
    return this.publishGuidelinesService.viewDraftGuideline(tenantId)
  }

  @Query()
  @UseGuards(AuthGuard, SubscriptionGuard)
  guidelinesByBrandId(
    @Args('brandId') brandId: BrandEntity['brandId'],
    @Args('isPublic') isPublic: boolean,
  ): Promise<PublishedGuidelineData> {
    return this.publishGuidelinesService.guidelinesByBrandId(brandId, isPublic)
  }

  @Query()
  getGuidelinePublicStatus(
    @Args('websiteUrl') websiteUrl: BrandEntity['websiteUrl'],
  ): Promise<PublishedGuidelineData> {
    return this.publishGuidelinesService.getGuidelinePublicStatus(websiteUrl)
  }

  @Query()
  getGuidelinePublicStatusByDomainSlug(
    @Args('domainSlug') domainSlug: BrandEntity['domainSlug'],
  ): Promise<PublishedGuidelineData> {
    return this.publishGuidelinesService.getGuidelinePublicStatus(domainSlug)
  }

  @Query()
  @UseGuards(AuthGuard, SubscriptionGuard)
  draftGuidelinesByBrandId(
    @Args('brandId') brandId: BrandEntity['brandId']
  ): Promise<PublishedGuidelineData> {
    return this.publishGuidelinesService.draftGuidelinesByBrandId(brandId)
  }

  @Query()
  @UseGuards(AuthGuard, SubscriptionGuard)
  guidelineByGuidelineId(
    @Args('guidelineId') guidelineId: PublishedGuidelineData['guidelineId']
  ): Promise<PublishedGuidelineData> {
    return this.publishGuidelinesService.guidelineByGuidelineId(guidelineId)
  }

  @Query()
  @UseGuards(AuthGuard, SubscriptionGuard)
  draftGuidelineByGuidelineId(
    @Args('guidelineId') guidelineId: PublishedGuidelineData['guidelineId']
  ): Promise<PublishedGuidelineData> {
    return this.publishGuidelinesService.draftGuidelineByGuidelineId(guidelineId)
  }

  @Query()
  // @UseGuards(AuthGuard, SubscriptionGuard)
  async guidelineByWebsiteUrl(
    @Args('websiteUrl') websiteUrl: BrandEntity['websiteUrl'],
  ): Promise<PublishedGuidelineData> {
    const resp = await this.publishGuidelinesService.guidelineByWebsiteUrl(websiteUrl)
    // this.logger.log(`guidelineByWebsiteUrl - resp -> ${JSON.stringify(resp)}`)
    return resp
  }

  @Query()
  // @UseGuards(AuthGuard, SubscriptionGuard)
  async guidelineByDomainSlug(
    @Args('domainSlug') domainSlug: BrandEntity['domainSlug'],
  ): Promise<PublishedGuidelineData> {
    const resp = await this.publishGuidelinesService.guidelineByDomainSlug(domainSlug)
    return resp
  }

  @Query()
  @UseGuards(AuthGuard, SubscriptionGuard)
  async draftGuidelineByWebsiteUrl(
    @Args('websiteUrl') websiteUrl: BrandEntity['websiteUrl'],
  ): Promise<DraftGuidelinePayload> {
    const resp = await this.publishGuidelinesService.draftGuidelineByWebsiteUrl(websiteUrl)
    // this.logger.log(`draftGuidelineByWebsiteUrl -> ${JSON.stringify(resp)}`)
    return resp
  }

  @Query()
  @UseGuards(AuthGuard, SubscriptionGuard)
  async draftGuidelineByDomainSlug(
    @Args('domainSlug') domainSlug: BrandEntity['domainSlug'],
  ): Promise<DraftGuidelinePayload> {
    const resp = await this.publishGuidelinesService.draftGuidelineByDomainSlug(domainSlug)
    return resp
  }

  @Query()
  @UseGuards(AuthGuard, SubscriptionGuard)
  getGuidelineLastUpdateDate(
    @Args('guidelineId') guidelineId: PublishedGuidelineData['guidelineId']
  ): Promise<PublishedGuidelineData['updatedAt']> {
    return this.publishGuidelinesService.getGuidelineLastUpdateDate(guidelineId)
  }

  @Query()
  @UseGuards(AuthGuard, SubscriptionGuard)
  getDraftGuidelineLastUpdateDate(
    @Args('guidelineId') guidelineId: PublishedGuidelineData['guidelineId']
  ): Promise<PublishedGuidelineData['updatedAt']> {
    return this.publishGuidelinesService.getDraftGuidelineLastUpdateDate(guidelineId)
  }

  @Query()
  @UseGuards(AuthGuard, SubscriptionGuard)
  getTypographyByGuidelineId(
    @Args('guidelineId') guidelineId: PublishedGuidelineData['guidelineId']
  ): Promise<TypographyPayload[]> {
    return this.publishGuidelinesService.getTypographyByGuidelineId(guidelineId)
  }

  @Query()
  @UseGuards(AuthGuard, SubscriptionGuard)
  getDraftTypographyByGuidelineId(
    @Args('guidelineId') guidelineId: PublishedGuidelineData['guidelineId']
  ): Promise<TypographyPayload[]> {
    return this.publishGuidelinesService.getDraftTypographyByGuidelineId(guidelineId)
  }

  @Query()
  @UseGuards(AuthGuard, SubscriptionGuard)
  getLogosByGuidelineId(
    @Args('guidelineId') guidelineId: PublishedGuidelineData['guidelineId']
  ): Promise<LogoPayload[]> {
    return this.publishGuidelinesService.getLogosByGuidelineId(guidelineId)
  }

  @Query()
  @UseGuards(AuthGuard, SubscriptionGuard)
  getDraftLogosByGuidelineId(
    @Args('guidelineId') guidelineId: PublishedGuidelineData['guidelineId']
  ): Promise<LogoPayload[]> {
    return this.publishGuidelinesService.getDraftLogosByGuidelineId(guidelineId)
  }

  @Query()
  @UseGuards(AuthGuard, SubscriptionGuard)
  getColorsByGuidelineId(
    @Args('guidelineId') guidelineId: PublishedGuidelineData['guidelineId']
  ): Promise<ColorPayload[]> {
    return this.publishGuidelinesService.getColorsByGuidelineId(guidelineId)
  }

  @Query()
  @UseGuards(AuthGuard, SubscriptionGuard)
  getDraftColorsByGuidelineId(
    @Args('guidelineId') guidelineId: PublishedGuidelineData['guidelineId']
  ): Promise<ColorPayload[]> {
    return this.publishGuidelinesService.getDraftColorsByGuidelineId(guidelineId)
  }

  @Mutation()
  @UseGuards(AuthGuard, SubscriptionGuard)
  saveGuideline(
    @Args('brandId') brandId: BrandEntity['brandId']
  ): Promise<PublishedGuidelineData> {
    return this.publishGuidelinesService.saveGuideline(brandId)
  }

  @Mutation()
  @UseGuards(AuthGuard, SubscriptionGuard)
  publishGuideline(
    @Args('brandId') brandId: BrandEntity['brandId']
  ): Promise<Success> {
    return this.publishGuidelinesService.publishGuideline(brandId)
  }

  @Mutation()
  @UseGuards(AuthGuard, SubscriptionGuard)
  deleteGuideline(
    @Args('guidelineId') guidelineId: PublishedGuidelineData['guidelineId']
  ): Promise<Success> {
    return this.publishGuidelinesService.deleteGuideline(guidelineId)
  }

  @Mutation()
  @UseGuards(AuthGuard, SubscriptionGuard)
  deleteDraftGuideline(
    @Args('guidelineId') guidelineId: PublishedGuidelineData['guidelineId']
  ): Promise<Success> {
    return this.publishGuidelinesService.deleteDraftGuideline(guidelineId)
  }

  @Mutation()
  @UseGuards(AuthGuard, SubscriptionGuard)
  changeGuidelinePublicState(
    @Args('guidelineId') guidelineId: PublishedGuidelineData['guidelineId'],
    @Args('isPublic') isPublic: boolean,
  ): Promise<Success> {
    return this.publishGuidelinesService.changeGuidelinePublicState(guidelineId, isPublic)
  }
}
