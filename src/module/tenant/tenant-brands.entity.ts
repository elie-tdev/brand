import { DatabaseEntity } from '../database/database.entity'

export class TenantBrandsEntity extends DatabaseEntity {
  tenantId: TenantBrandsDatabaseFields['tenant_id']
  brandId: TenantBrandsDatabaseFields['brand_id']
  tenantBrandRoleSlug: TenantBrandsDatabaseFields['tenant_brand_role_slug']
  subscriptionPlanSlug: TenantBrandsDatabaseFields['subscription_plan_slug']
  subscriptionPeriodEnds: TenantBrandsDatabaseFields['subscription_period_ends']
  chargebeeSubscriptionId: TenantBrandsDatabaseFields['chargebee_subscription_id']
  chargebeeCustomerId: TenantBrandsDatabaseFields['chargebee_customer_id']
}

export interface TenantBrandsDatabaseFields {
  tenant_id: string
  brand_id: string
  tenant_brand_role_slug: string
  subscription_plan_slug: string
  subscription_period_ends: number
  chargebee_subscription_id: string
  chargebee_customer_id: string
}
