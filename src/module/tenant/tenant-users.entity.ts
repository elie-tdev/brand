import { DatabaseEntity } from '../database/database.entity'

export class TenantUsersEntity extends DatabaseEntity {
  tenantId: TenantUsersDatabaseFields['tenant_id']
  userId: TenantUsersDatabaseFields['user_id']
  userTenantRoleSlug: TenantUsersDatabaseFields['user_tenant_role_slug']
  inviteHash: TenantUsersDatabaseFields['invite_hash']
  inviteStatus: TenantUsersDatabaseFields['invite_status']
}

export interface TenantUsersDatabaseFields {
  tenant_id: string
  user_id: string
  user_tenant_role_slug: string
  invite_hash: string
  invite_status: string
}
