import { DatabaseEntity } from '../database/database.entity'

export class SubscriptionPlanEntity extends DatabaseEntity {
  subscriptionPlanSlug: SubscriptionPlanDatabaseFields['subscription_plan_slug']
  displayName: SubscriptionPlanDatabaseFields['display_name']
  features: SubscriptionPlanDatabaseFields['features']
}

export interface SubscriptionPlanDatabaseFields {
  subscription_plan_slug: string
  display_name: string
  features: string[]
}
