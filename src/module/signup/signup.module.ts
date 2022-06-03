import { Module } from '@nestjs/common'
import { SignupService } from './signup.service'
import { SignupResolver } from './signup.resolver'
import { BrandService } from '@module/brand/brand.service'
import { TenantService } from '@module/tenant/tenant.service'
import { UserService } from '@module/user/user.service'
import { BrandModule } from '@module/brand/brand.module'
import { TenantModule } from '@module/tenant/tenant.module'
import { UserModule } from '@module/user/user.module'
import { SubscriptionModule } from '../subscription/subscription.module'
import { SubscriptionService } from '../subscription/subscription.service'

@Module({
  imports: [BrandModule, TenantModule, UserModule, SubscriptionModule],
  providers: [
    SignupService,
    SignupResolver,
    BrandService,
    TenantService,
    UserService,
    SubscriptionService,
  ],
})
export class SignupModule {}
