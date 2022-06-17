import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { Logger, UseGuards, Inject } from '@nestjs/common'
import { UserService } from './user.service'
import { AuthGuard } from '../auth/auth.guard'
import { User, UserInput, UserClientCtx } from 'typings/graphql.schema'
import { SubscriptionGuard } from '@module/subscription/subscription.guard'
import { UserRequestContext } from './user.interface'
import { CONTEXT } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-errors';

@Resolver('User')
export class UserResolver {
  constructor(
    @Inject(CONTEXT) private readonly context,
    private readonly userService: UserService,
  ) { }
  private readonly logger = new Logger(UserResolver.name)

  @Query()
  @UseGuards(AuthGuard, SubscriptionGuard)
  async userList(): Promise<User[]> {
    return await this.userService.allUsers().then(users => {
      // this.logger.log('userList -> users[0] -> ' + JSON.stringify(users))
      return users
    })
  }

  @Mutation()
  async createUser(@Args('values') user: UserInput): Promise<User['userId']> {
    return this.userService.createUser(user).then(userId => {
      // this.logger.log('createUser -> userId -> ' + JSON.stringify(userId))
      return userId
    })
  }

  @Query()
  @UseGuards(AuthGuard)
  async userClientCtx(): Promise<UserClientCtx> {
    const { firebaseUid } = this.context.user
    return await this.userService
      .getUserContextByFirebaseUid(firebaseUid)
      .then((userCtx: UserRequestContext) => {
        this.logger.log(
          'userClientCtx -> userCtx -> ' + JSON.stringify(userCtx),
        )
        return userCtx
      }).catch(err => {
        throw new ApolloError('User Context failed', 'LOGOUT', err)
      })
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async updateUsersNameEmail(
    @Args('name') name: User['name'],
    @Args('email') email: User['email'],
  ): Promise<User['name']> {
    const { userId } = this.context.user
    return await this.userService.updateUsersNameEmail(userId, name, email)
  }
}
