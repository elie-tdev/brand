import { DatabaseEntity } from '../database/database.entity'

export class UserTenantRolesEntity extends DatabaseEntity {
  userTenantRoleSlug: UserTenantRolesDatabaseFields['user_tenant_role_slug']
  displayName: UserTenantRolesDatabaseFields['display_name']
}

export interface UserTenantRolesDatabaseFields {
  user_tenant_role_slug: string
  display_name: string
}
