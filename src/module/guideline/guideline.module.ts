import { Module } from '@nestjs/common';
import { GuidelineService } from './guideline.service';
import { GuidelineResolver } from './guideline.resolver';

@Module({
  providers: [GuidelineService, GuidelineResolver]
})
export class GuidelineModule {}
