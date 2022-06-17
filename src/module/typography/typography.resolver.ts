import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { Logger, UseGuards } from '@nestjs/common'
import {
  TypographyPayload,
  TypographySourcePayload,
  Success,

} from 'typings/graphql.schema'
import { BrandEntity } from '@module/brand/brand.entity'
import { TypographyService } from './typography.service';

@Resolver('Typography')
export class TypographyResolver {
  constructor(
    private readonly typographyService: TypographyService,
  ) { }
  private readonly logger = new Logger(TypographyResolver.name)

  @Query()
  async typographyByBrandId(
    @Args('brandId') brandId: BrandEntity['brandId']
  ): Promise<TypographyPayload[]> {
    return await this.typographyService.typographyByBrandId(brandId).then(({ typography }) => {
      // this.logger.log(`typographyByBrandId - typographies -> ${JSON.stringify(typography)}`)
      return typography
    })
  }

  @Query()
  async findFont(
    @Args('brandId') brandId: BrandEntity['brandId'],
    @Args('fontFamily') fontFamily: TypographyPayload['fontFamily'],
    @Args('_id') objId: string,
  ) {
    return await this.typographyService.findFont(brandId, objId, fontFamily)
  }

  @Query()
  async fetchTypographySource(
    @Args('brandId') brandId: BrandEntity['brandId'],
    @Args('_id') objId: string,
  ): Promise<TypographySourcePayload> {
    return this.typographyService.fetchTypographySource(brandId, objId).then(previewObj => {
      return previewObj
    })
  }

  @Mutation()
  async replaceTypographyObj(
    @Args('brandId') brandId: BrandEntity['brandId'],
    @Args('_id') objId: string,
    @Args('typographyObj') typographyObj: TypographyPayload,
  ): Promise<Success> {
    return await this.typographyService.replaceTypographyObj(brandId, objId, typographyObj)
  }

  @Mutation()
  async addTypography(
    @Args('brandId') brandId: BrandEntity['brandId'],
    @Args('typographyObj') typographyObj: TypographyPayload,
  ): Promise<Success> {
    return await this.typographyService.addTypography(brandId, typographyObj)
  }
}
