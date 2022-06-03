import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { SubscriptionService } from './subscription.service'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly subscriptionService: SubscriptionService) {}
  private readonly logger = new Logger(SubscriptionGuard.name)
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context)
    this.logger.log(
      'SubscriptionGuard ctx.getContext().user -> ' +
        JSON.stringify(ctx.getContext().user),
    )
    // TODO: pass the current users active tenant subscriptionID from ctx
    // return this.subscriptionService.validateSubscription('id')
    return true
  }
}
