import { TenantBrandsEntity } from '@module/tenant/tenant-brands.entity'

export interface Subscription { }

export interface ChargebeeSubscriptionInput {
  plan_id: string
  auto_collection: AutoCollectionsEnum
  trial_end?: number
  billing_address?: ChargebeeBillingAddress
  customer: ChargebeeCustomer
  card?: ChargebeeCard
}

export enum AutoCollectionsEnum {
  ON = 'on',
  OFF = 'off',
}

interface ChargebeeBillingAddress {
  first_name: string
  last_name: string
  line1: string
  city: string
  state: string
  zip: string
  country: string
}

interface ChargebeeCustomer {
  first_name?: string
  last_name?: string
  email: string
}

interface ChargebeeCard {
  number: string
  cvv: string
  expiry_year: number
  expiry_month: number
}

export interface CreateSubscriptionResponse {
  chargebeeSubscriptionId: TenantBrandsEntity['chargebeeSubscriptionId']
  chargebeeCustomerId: TenantBrandsEntity['chargebeeCustomerId']
  subscriptionPeriodEnds: TenantBrandsEntity['subscriptionPeriodEnds']
  subscriptionPlanSlug?: TenantBrandsEntity['subscriptionPlanSlug']
}
