import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'
import { AuthService } from './auth.service'
import { ValidateUserAuthResponse } from './auth.interface'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  private readonly logger = new Logger(AuthGuard.name)
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context)
    // this.logger.log('AuthGuard context -> ' + ctx.getContext())
    return this.authService
      .validateUserAuth(ctx.getContext().req.headers.authorization)
      .then(async ({ isValidAuth, firebaseUid }: ValidateUserAuthResponse) => {
        if (isValidAuth && ctx.getContext().user === undefined) {
          // this.logger.log(
          //   'AuthGuard - isValidAuth -> ' + JSON.stringify(isValidAuth),
          // )
          // this.logger.log('AuthGuard - firebaseUid -> ' + firebaseUid)
          const userCtx = await this.userService.getUserContextByFirebaseUid(
            firebaseUid,
          )
          ctx.getContext().user = userCtx
          // this.logger.log(
          //   'AuthGuard - ctx.getContext().user -> ' +
          //     JSON.stringify(ctx.getContext().user),
          // )
          return isValidAuth
        } else {
          // this.logger.log(
          //   'must already be user context' +
          //     JSON.stringify(ctx.getContext().user),
          // )

          return isValidAuth
        }
      })
  }
}
