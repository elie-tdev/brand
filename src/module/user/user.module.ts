import { Module } from '@nestjs/common'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'
import { SubscriptionModule } from '@module/subscription/subscription.module'
import { SubscriptionService } from '@module/subscription/subscription.service'

@Module({
  imports: [SubscriptionModule],
  providers: [UserResolver, UserService, SubscriptionService],
})
export class UserModule {}
