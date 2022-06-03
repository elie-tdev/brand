import { Module } from '@nestjs/common'
import { TenantResolver } from './tenant.resolver'
import { TenantService } from './tenant.service'
import { AuthService } from '@module/auth/auth.service'
import { AuthModule } from '@module/auth/auth.module'

@Module({
  imports: [AuthModule],
  providers: [TenantService, TenantResolver, AuthService],
})
export class TenantModule {}
