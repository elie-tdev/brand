import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import * as chargebee from 'chargebee'
import { InitChargebee } from './chargebee.config'
import { TenantBrandsEntity } from '@module/tenant/tenant-brands.entity'
import {
  ChargebeeSubscriptionInput,
  CreateSubscriptionResponse,
  AutoCollectionsEnum,
} from './subscription.interface'
import { TenantEntity } from '@module/tenant/tenant.entity'
import { UserEntity } from '@module/user/user.entity'

@Injectable()
export class SubscriptionService implements OnModuleInit {
  private readonly logger = new Logger(SubscriptionService.name)

  onModuleInit() {
    InitChargebee()
  }

  async initialSubscription(
    email: UserEntity['email'],
    isAgency: TenantEntity['isAgency'],
  ): Promise<CreateSubscriptionResponse> {
    const subscriptionPlanSlug = !isAgency
      ? 'basic-monthly-19-usd'
      : 'agency-basic-annual-999-usd'

    const { subscription } = await chargebee.subscription
      .create({
        plan_id: subscriptionPlanSlug,
        auto_collection: AutoCollectionsEnum.OFF,
        customer: {
          email,
        },
      })
      .request(error => {
        if (error) {
          // handle error
          this.logger.error(JSON.stringify(error))
        }
      })

    return {
      chargebeeSubscriptionId: subscription.id,
      chargebeeCustomerId: subscription.customer_id,
      subscriptionPeriodEnds: subscription.trial_end * 1000,
      subscriptionPlanSlug,
    }
  }

  async createSubscription(
    values: ChargebeeSubscriptionInput,
  ): Promise<CreateSubscriptionResponse> {
    const { subscription } = await chargebee.subscription
      .create({ ...values })
      .request(error => {
        if (error) {
          // handle error
          this.logger.error(JSON.stringify(error))
        }
      })

    return {
      chargebeeSubscriptionId: subscription.id,
      chargebeeCustomerId: subscription.customer_id,
      subscriptionPeriodEnds: subscription.trial_end * 1000,
    }
  }

  async validateSubscription(
    chargebeeSubscriptionID: TenantBrandsEntity['chargebeeSubscriptionId'],
  ): Promise<boolean> {
    // TODO: look at the subscription end date in the db
    const { subscription } = await chargebee.subscription
      .retrieve(chargebeeSubscriptionID)
      .request(error => {
        if (error) {
          this.logger.error(JSON.stringify(error))
        }
      })
    switch (subscription.status) {
      case 'in_trial': {
        return subscription.trial_end >= new Date().getTime() ? true : false
      }
      case 'active': {
        return subscription.current_term_end >= new Date().getTime()
          ? true
          : false
      }
      default: {
        return false
      }
    }
  }

  async updateSubscription(values: ChargebeeSubscriptionInput): Promise<void> {
    chargebee.subscription.update({ ...values }).request((error, result) => {
      // TODO: add current user passed chargebeeSubscriptionId to ChargebeeSubscriptionInput.
      // This input will be posted in the payment form and user context in the client, which is not set correct yet
      // save result for updated subscriptions info to database.
      if (error) {
        //handle error
        this.logger.error(JSON.stringify(error))
      } else {
        this.logger.log(JSON.stringify(result))
        // var subscription = result.subscription
        // var customer = result.customer
        // var card = result.card
        // var invoice = result.invoice
        // var unbilled_charges = result.unbilled_charges
      }
    })
  }

  updateSubscriptionPeriodEnds(
    brandId: TenantBrandsEntity['brandId'],
    subscriptionPeriodEnds: TenantBrandsEntity['subscriptionPeriodEnds'],
  ) {
    return
  }
}
