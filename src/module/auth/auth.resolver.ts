import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { Logger } from '@nestjs/common'

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthResolver.name)

  @Mutation()
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return await this.authService
      .signInUserAuth(email, password)
      .then(token => {
        return { token }
      })
  }

  @Mutation()
  async signup(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return await this.authService
      .createUserAuth(email, password)
      .then(token => {
        return { token }
      })
  }
}
