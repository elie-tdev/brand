import { Module } from '@nestjs/common'
import { SubscriptionPlanService } from './subscription-plan.service'
import { SubscriptionPlanResolver } from './subscription-plan.resolver'
import { SubscriptionPlanEntity } from './subscription-plan.entity'
import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/auth.service'

@Module({
  imports: [AuthModule],
  providers: [SubscriptionPlanService, SubscriptionPlanResolver, AuthService],
})
export class SubscriptionPlanModule {}
