import { Injectable, Logger } from '@nestjs/common'
import { DatabaseService } from '@module/database/database.service'
import { SignUpInput, UserCtx } from 'typings/graphql.schema'
import { SubscriptionService } from '@module/subscription/subscription.service'
import { AutoCollectionsEnum } from '@module/subscription/subscription.interface'
import { keysToCamel } from '@common/util/keysToCamel'

@Injectable()
export class SignupService {
  constructor(
    private readonly db: DatabaseService,
    private readonly subscriptionService: SubscriptionService,
  ) {}
  private readonly logger = new Logger(SignupService.name)

  async createSignup(values: SignUpInput): Promise<UserCtx> {
    const {
      firebaseUid,
      name,
      email,
      policiesAgreed,
      websiteUrl,
      hadGuidelines,
    } = values

    // this.logger.log(
    //   'createSignup values -> ' + JSON.stringify(values),
    // )

    // Handle isAgency if null
    let { isAgency } = values
    isAgency = isAgency !== true ? false : isAgency

    const subscriptionPlanSlug = !isAgency
      ? 'basic-monthly-19-usd'
      : 'agency-basic-annual-999-usd'
    const tenantRoleSlug = isAgency ? 'agent' : 'owner'
    const userTenantRoleSlug = 'admin'
    const {
      chargebeeSubscriptionId,
      chargebeeCustomerId,
      subscriptionPeriodEnds,
    } = await this.subscriptionService.createSubscription({
      plan_id: subscriptionPlanSlug,
      auto_collection: AutoCollectionsEnum.OFF,
      customer: {
        email,
      },
    })
    // this.logger.log('chargebeeSubscriptionID -> ' + chargebeeSubscriptionId)
    // this.logger.log('chargebeeCustomerID -> ' + chargebeeCustomerId)
    // this.logger.log('subscriptionPeriodEnds -> ' + subscriptionPeriodEnds)

    const userCtx = await this.db.conn
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
            $<websiteUrl>,
            $<hadGuidelines>
          ) returning brand_id
        ), new_tenant as (
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
              subscription_period_ends,
              subscription_plan_slug
            ) select
                new_tenant.tenant_id,
                new_brand.brand_id,
                $<tenantRoleSlug>,
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
      ) select new_tenant.tenant_id, new_brand.brand_id, new_user.user_id from new_tenant, new_brand, new_user`,
        {
          firebaseUid,
          name,
          email,
          policiesAgreed,
          websiteUrl,
          hadGuidelines,
          isAgency,
          chargebeeCustomerId,
          chargebeeSubscriptionId,
          subscriptionPeriodEnds,
          subscriptionPlanSlug,
          userTenantRoleSlug,
          tenantRoleSlug,
        },
      )
      .catch(e => this.logger.error('createSignup error -> ', e))

    return keysToCamel(userCtx)
  }
}
