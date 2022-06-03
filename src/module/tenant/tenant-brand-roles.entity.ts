import { DatabaseEntity } from '../database/database.entity'

export class TenantBrandRolesEntity extends DatabaseEntity {
  tenantBrandRoleSlug: TenantBrandRolesDatabaseFields['tenant_brand_role_slug']
  displayName: TenantBrandRolesDatabaseFields['display_name']
}

export interface TenantBrandRolesDatabaseFields {
  tenant_brand_role_slug: string
  display_name: string
}
