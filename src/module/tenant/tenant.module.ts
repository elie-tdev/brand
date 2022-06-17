import { Module } from '@nestjs/common'
import { TenantResolver } from './tenant.resolver'
import { TenantService } from './tenant.service'

@Module({
  providers: [TenantService, TenantResolver],
})
export class TenantModule { }
