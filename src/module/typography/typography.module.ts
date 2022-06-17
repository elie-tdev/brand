import { Module } from '@nestjs/common';
import { TypographyService } from './typography.service';
import { TypographyResolver } from './typography.resolver';

@Module({
  providers: [TypographyService, TypographyResolver],
})
export class TypographyModule { }
