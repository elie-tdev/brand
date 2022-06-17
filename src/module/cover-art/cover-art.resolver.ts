import { Resolver, Query } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { CoverArtService } from './cover-art.service'
import { CoverArt } from 'typings/graphql.schema';
import { keysToCamel } from '../../common/util/keysToCamel';

@Resolver('CoverArt')
export class CoverArtResolver {
  constructor(
    private readonly coverArtService: CoverArtService,
  ) { }
  private readonly logger = new Logger(CoverArtResolver.name)

  @Query()
  async listCoverArt(): Promise<CoverArt[]> {
    const results = await this.coverArtService.listCoverArt()
    return keysToCamel(results)
  }

}
