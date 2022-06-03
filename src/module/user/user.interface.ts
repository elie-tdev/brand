import { UsersDatabaseFields } from './user.entity'
import { TenantBrandsDatabaseFields } from '../tenant/tenant-brands.entity'
import {
  TenantBrandRoleSlugs,
  UserTenantRoleSlugs,
} from 'typings/graphql.schema'

export interface UserRequestContext {
  name: UsersDatabaseFields['name']
  email: UsersDatabaseFields['email']
  userId: UsersDatabaseFields['user_id']
  tenantId: TenantBrandsDatabaseFields['tenant_id']
  userTenantRoleSlug: UserTenantRoleSlugs
  brands: UserBrands[]
}

interface UserBrands {
  brandId: TenantBrandsDatabaseFields['brand_id']
  chargebeeSubscriptionId: TenantBrandsDatabaseFields['chargebee_subscription_id']
  subscriptionPeriodEnds: TenantBrandsDatabaseFields['subscription_period_ends']
  tenantBrandRoleSlug: TenantBrandRoleSlugs
}
