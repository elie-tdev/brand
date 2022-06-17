import { Injectable, Logger } from '@nestjs/common'
import { ApolloError } from 'apollo-server-errors'
import { DatabaseService } from '@module/database/database.service'
import { SignUpInput } from 'typings/graphql.schema'
import { SubscriptionService } from '@module/subscription/subscription.service'
import { keysToCamel } from '@common/util/keysToCamel'
import { BrandEntity } from '@module/brand/brand.entity'

@Injectable()
export class SignupService {
  constructor(
    private readonly db: DatabaseService,
    private readonly subscriptionService: SubscriptionService,
  ) { }
  private readonly logger = new Logger(SignupService.name)

  async createSignup(values: SignUpInput): Promise<BrandEntity['brandId']> {
    const { firebaseUid, name, email, policiesAgreed } = values

    // this.logger.log('createSignup values -> ' + JSON.stringify(values))

    // Handle Agency stuff if null
    let { isAgency, agencyName } = values
    isAgency = isAgency !== true ? false : isAgency
    agencyName = agencyName === undefined ? null : agencyName
    // this.logger.log('createSignUp agencyName -> ' + agencyName)

    const tenantRoleSlug = isAgency ? 'agent' : 'owner'
    const userTenantRoleSlug = 'admin'
    const {
      chargebeeSubscriptionId,
      chargebeeCustomerId,
      subscriptionPeriodEnds,
      subscriptionPlanSlug,
    } = await this.subscriptionService.initialSubscription(email, isAgency)
    // this.logger.log('chargebeeSubscriptionID -> ' + chargebeeSubscriptionId)
    // this.logger.log('chargebeeCustomerID -> ' + chargebeeCustomerId)
    // this.logger.log('subscriptionPeriodEnds -> ' + subscriptionPeriodEnds)

    const brandId = await this.db.conn
      .one(
        `with new_user as (
          insert into users (
            firebase_uid,
            name,
            email,
            policies_agreed
          ) values (
            $<firebaseUid>,
            $<name>,
            $<email>,
            $<policiesAgreed>
          ) returning user_id
        ), new_brand as (
            insert into brands (
              website_url,
              had_guidelines
            ) values (
              null,
              null
            ) returning brand_id
          ), new_tenant as (
          insert into tenants (
            is_agency,
            agency_name
          ) values (
            $<isAgency>,
            $<agencyName>
          ) returning tenant_id
        ), new_tenant_brand as (
            insert into tenant_brands (
              tenant_id,
              brand_id,
              tenant_brand_role_slug,
              chargebee_customer_id,
              chargebee_subscription_id,
              subscription_period_ends,
              subscription_plan_slug
            ) select
                new_tenant.tenant_id,
                new_brand.brand_id,
                $<tenantRoleSlug>,
                $<chargebeeCustomerId>,
                $<chargebeeSubscriptionId>,
                $<subscriptionPeriodEnds>,
                $<subscriptionPlanSlug>
              from new_tenant, new_brand
        ), new_tenant_user as (
            insert into tenant_users (
              tenant_id,
              user_id,
              user_tenant_role_slug
            ) select
                new_tenant.tenant_id,
                new_user.user_id,
                $<userTenantRoleSlug>
            from new_tenant, new_user
            returning tenant_id
      ) select new_brand.brand_id from new_brand`,
        {
          firebaseUid,
          name,
          email,
          policiesAgreed,
          isAgency,
          agencyName,
          chargebeeCustomerId,
          chargebeeSubscriptionId,
          subscriptionPeriodEnds,
          subscriptionPlanSlug,
          userTenantRoleSlug,
          tenantRoleSlug,
        },
      )
      .catch(err => {
        throw new ApolloError('signUpServer failed', 'SIGNUP_FAILED', err)
      })

    return keysToCamel(brandId)
  }
}
