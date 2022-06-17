import { Module } from '@nestjs/common';
import { PublishGuidelinesResolver } from './publish-guidelines.resolver';
import { PublishGuidelinesService } from './publish-guidelines.service';

@Module({
  providers: [PublishGuidelinesResolver, PublishGuidelinesService]
})
export class PublishGuidelinesModule {}
