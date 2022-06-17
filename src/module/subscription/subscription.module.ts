import { Module, Global } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionResolver } from './subscription.resolver';

@Global()
@Module({
  providers: [SubscriptionService, SubscriptionResolver],
  exports: [SubscriptionService]
})
export class SubscriptionModule { }
