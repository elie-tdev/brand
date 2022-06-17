import { Module } from '@nestjs/common';
import { CoverArtResolver } from './cover-art.resolver';
import { CoverArtService } from './cover-art.service';

@Module({
  providers: [CoverArtResolver, CoverArtService]
})
export class CoverArtModule {}
