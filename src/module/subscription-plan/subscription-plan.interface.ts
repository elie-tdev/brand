import { SubscriptionPlanEntity } from './subscription-plan.entity'
export interface SubscriptionPlan {}

export interface SubscriptionPlanInput {
  subscriptionPlanSlug: SubscriptionPlanEntity['subscriptionPlanSlug']

  displayName: SubscriptionPlanEntity['displayName']

  features: SubscriptionPlanEntity['features']
}
