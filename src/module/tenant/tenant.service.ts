import { Injectable, Logger } from '@nestjs/common'
import { DatabaseService } from '@module/database/database.service'
import { TenantBrandRolesEntity } from './tenant-brand-roles.entity'
import {
  TenantInput,
  TenantBrandsInput,
  TenantUsersInput,
} from './tenant.interfaces'

@Injectable()
export class TenantService {
  constructor(private readonly db: DatabaseService) {}
  private readonly logger = new Logger(TenantService.name)

  async createTenant(values: TenantInput): Promise<void> {
    const {
      isAgency,
      brandId,
      userId,
      chargebeeCustomerId,
      chargebeeSubscriptionId,
      subscriptionPeriodEnds,
    } = values
    const tenantRoleSlug = isAgency ? 'agent' : 'owner'
    const userTenantRoleSlug = 'admin'
    const resp = await this.db.conn
      .one(
        `with new_tenant as (
          insert into tenants (
            is_agency,
            chargebee_customer_id
          ) values (
            $<isAgency>,
            $<chargebeeCustomerId>
          ) returning tenant_id
        ), new_tenant_brand as (
            insert into tenant_brands (
              tenant_id,
              brand_id,
              tenant_brand_role_slug,
              chargebee_subscription_id,
              subscription_period_ends
            ) select
                new_tenant.tenant_id,
                $<brandId>,
                $<tenantRoleSlug>,
                $<chargebeeSubscriptionId>,
                $<subscriptionPeriodEnds>
              from new_tenant
        ), new_tenant_user as (
            insert into tenant_users (
              tenant_id,
              user_id,
              user_tenant_role_slug
            ) select
                new_tenant.tenant_id,
                $<userId>,
                $<userTenantRoleSlug>
            from new_tenant
            returning tenant_id
      ) select tenant_id from new_tenant`,
        {
          isAgency,
          brandId,
          userId,
          chargebeeCustomerId,
          chargebeeSubscriptionId,
          subscriptionPeriodEnds,
          userTenantRoleSlug,
          tenantRoleSlug,
        },
      )
      .catch(e => this.logger.error('createTenant error -> ', e))
    this.logger.log('createTenant -> resp -> ', JSON.stringify(resp))
  }

  async addTenantBrand(values: TenantBrandsInput): Promise<void> {
    const { isAgency, brandId, tenantId } = values
    const tenantRoleSlug = isAgency ? 'agent' : 'owner'
    // this.logger.log('addTenantBrand values -> ' + values)
    return await this.db.conn.none(
      `insert into tenant_brands (
          tenant_id,
          brand_id,
          tenant_brand_role_slug
        ) values (
          $1,
          $2,
          $3
        )`,
      [tenantId, brandId, tenantRoleSlug],
    )
  }

  async addTenantUser(values: TenantUsersInput): Promise<void> {
    const { tenantId, userId, userTenantRoleSlug } = values
    // this.logger.log('addTenantUser -> ' + JSON.stringify(values))
    return await this.db.conn.none(
      `insert into tenant_users (
          tenant_id,
          user_id,
          user_tenant_role_slug
        ) values (
          $1,
          $2,
          $3
        )`,
      [tenantId, userId, userTenantRoleSlug],
    )
  }

  async createTenantBrandRole(
    tenantBrandRoleSlug: TenantBrandRolesEntity['tenantBrandRoleSlug'],
    displayName: TenantBrandRolesEntity['displayName'],
  ): Promise<void> {
    return this.db.conn.none(
      `insert into tenant_brand_roles (
        tenant_brand_role_slug,
        display_name
      ) values (
        $1,
        $2
      )`,
      [tenantBrandRoleSlug, displayName],
    )
  }
}
