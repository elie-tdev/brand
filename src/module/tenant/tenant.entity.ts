import { DatabaseEntity } from '@module/database/database.entity'

export class TenantEntity extends DatabaseEntity {
  tenantId: TenantDatabaseFields['tenant_id']
  isAgency: TenantDatabaseFields['is_agency']
  adminReviewStatus: TenantDatabaseFields['admin_review_status']
}

export interface TenantDatabaseFields {
  tenant_id: string
  is_agency: boolean
  admin_review_status: string
}
