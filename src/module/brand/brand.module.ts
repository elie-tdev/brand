import { Module } from '@nestjs/common'
import { BrandService } from './brand.service'
import { BrandResolver } from './brand.resolver'
import { AuthService } from '@module/auth/auth.service'
import { AuthModule } from '@module/auth/auth.module'

@Module({
  imports: [AuthModule],
  providers: [BrandService, BrandResolver, AuthService],
})
export class BrandModule {}
