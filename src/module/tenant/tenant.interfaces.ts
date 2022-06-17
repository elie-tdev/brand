import { TenantEntity } from './tenant.entity'
import { BrandEntity } from '../brand/brand.entity'
import { UserEntity } from '@module/user/user.entity'
import { UserTenantRolesEntity } from '../user/user-tenant-roles.entity'
import { TenantBrandsEntity } from './tenant-brands.entity';

export interface CreateTenantInput {
  isAgency: TenantEntity['isAgency']
  brandId: BrandEntity['brandId']
  userId: UserEntity['userId']
  chargebeeSubscriptionId: TenantBrandsEntity['chargebeeSubscriptionId']
  chargebeeCustomerId: TenantBrandsEntity['chargebeeSubscriptionId']
  subscriptionPeriodEnds: TenantBrandsEntity['subscriptionPeriodEnds']
}

export interface TenantBrandsInput {
  tenantId: TenantEntity['tenantId']
  brandId: BrandEntity['brandId']
  isAgency: TenantEntity['isAgency']
}

export interface TenantUsersInput {
  tenantId: TenantEntity['tenantId']
  userId: UserEntity['userId']
  userTenantRoleSlug: UserTenantRolesEntity['userTenantRoleSlug']
}
