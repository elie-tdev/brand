import * as c from 'casual'

export const TenantMocks = {
  Tenant: () => ({
    TenantID: c.uuid,
    subscriptionPlanSlug: c.populate_one_of(['trial']),
    isAgency: c.boolean,
    subscriptionPeriodEnds: c.date('YYYY-MM-DD'),
    chargebeeSubscriptionID: c.uuid,
    chargebeeCustomerID: c.uuid,
    adminReviewStatus: c.populate_one_of(['pending', 'approved', 'rejected']),
    createdAt: c.date('YYYY-MM-DD'),
    updatedAt: c.date('YYYY-MM-DD'),
  }),
}
