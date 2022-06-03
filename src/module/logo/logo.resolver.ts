import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { Logger, UseGuards } from '@nestjs/common'
import { LogoService } from './logo.service'
import { AuthGuard } from '../auth/auth.guard'
import { LogoData } from 'typings/graphql.schema'
import { LogoEntity } from './logo.entity'
import { BrandEntity } from '@module/brand/brand.entity'
import { SubscriptionGuard } from '@module/subscription/subscription.guard'

@Resolver('Logo')
export class LogoResolver {
  constructor(private readonly logoService: LogoService) {}
  private readonly logger = new Logger(LogoResolver.name)

  @Query()
  @UseGuards(AuthGuard, SubscriptionGuard)
  async logoList(): Promise<LogoData[]> {
    return await this.logoService.allLogos().then(logos => {
      return logos
    })
  }

  @Mutation()
  async scrapeLogo(
    @Args('logoUrl') logoUrl: LogoEntity['logoUrl'],
    @Args('brandId') brandId: BrandEntity['brandId']
  ): Promise<LogoData['logoUrl']> {
    return this.logoService.scrapeLogo(logoUrl, brandId).then(url => {
      return url
    })
  }

  @Mutation()
  async encodeLogo(
    @Args('imageFile') imageFile: string,
    @Args('brandId') brandId: BrandEntity['brandId']
  ): Promise<LogoData['logoUrl']> {
    return this.logoService.encodeLogo(imageFile, brandId).then(url => {
      return url
    })
  }
}
