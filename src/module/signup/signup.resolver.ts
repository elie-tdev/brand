import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { Logger } from '@nestjs/common'
import { SignUpInput, Brand } from 'typings/graphql.schema'
import { SignupService } from './signup.service'

@Resolver('Signup')
export class SignupResolver {
  constructor(private readonly signUpService: SignupService) {}
  private readonly logger = new Logger(SignupResolver.name)

  @Mutation()
  async signUpServer(
    @Args('values') values: SignUpInput,
  ): Promise<Brand['brandId']> {
    return await this.signUpService.createSignup(values)
  }
}
