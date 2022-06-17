import { join } from 'path'
import { Request } from 'express'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { GraphQLDate, GraphQLTime } from 'graphql-iso-date'
import { LoggerModule } from './module/logger/logger.module'
import { UserModule } from './module/user/user.module'
import { AuthModule } from './module/auth/auth.module'
import { ConfigModule } from './module/config/config.module'
import { TenantModule } from './module/tenant/tenant.module'
import { BrandModule } from './module/brand/brand.module'
import { SubscriptionPlanModule } from './module/subscription-plan/subscription-plan.module'
import { SignupModule } from './module/signup/signup.module'
import { SubscriptionModule } from './module/subscription/subscription.module'
import { DatabaseModule } from './module/database/database.module'
import { ScraperModule } from './module/scraper/scraper.module'
import { LogoModule } from './module/logo/logo.module'
import { TypographyModule } from './module/typography/typography.module';
import { reportError } from '@common/util/reportError'
import { GuidelineModule } from './module/guideline/guideline.module';
import { ColorModule } from './module/color/color.module';
import { PublishGuidelinesModule } from './module/publish-guidelines/publish-guidelines.module';
import { CoverArtModule } from './module/cover-art/cover-art.module';

import 'reflect-metadata'
import * as depthLimit from 'graphql-depth-limit'
import * as GraphQLUUID from 'graphql-type-uuid'
import * as GraphQLJSON from 'graphql-type-json'
import {
  DateTime,
  NonPositiveInt,
  PositiveInt,
  NonNegativeInt,
  NegativeInt,
  NonPositiveFloat,
  PositiveFloat,
  NonNegativeFloat,
  NegativeFloat,
  EmailAddress,
  URL,
  PhoneNumber,
  PostalCode,
  OKGScalarDefinitions,
} from '@okgrow/graphql-scalars'

// console.log('Mocks enabled: ', process.env.ENABLE_MOCKS);
// const mocks =
//   process.env.ENABLE_MOCKS === 'true'
//     ? // tslint:disable-next-line:no-var-requires
// require('./common/util/mergeMocks').mocks
//     : false;
// console.log('Tracing enabled: ', process.env.ENABLE_TRACING);
// const tracing = process.env.ENABLE_TRACING === 'true' ? true : false;

@Module({
  imports: [
    GraphQLModule.forRoot({
      context: ({ req }: { req: Request }) => ({
        req,
      }),
      typePaths: ['./**/*.graphql'],
      typeDefs: [...OKGScalarDefinitions],
      resolvers: {
        JWT: String,
        UUID: GraphQLUUID,
        JSON: GraphQLJSON,
        Date: GraphQLDate,
        Time: GraphQLTime,
        DateTime,
        NonPositiveInt,
        PositiveInt,
        NonNegativeInt,
        NegativeInt,
        NonPositiveFloat,
        PositiveFloat,
        NonNegativeFloat,
        NegativeFloat,
        EmailAddress,
        URL,
        PhoneNumber,
        PostalCode,
      },
      installSubscriptionHandlers: true,
      subscriptions: {
        path: '/subscriptions',
      },
      validationRules: [depthLimit(10)],
      definitions: {
        path: join(process.cwd(), 'src/typings/graphql.schema.ts'),
        outputAs: 'class',
      },
      mocks: false, // require('./common/util/mergeMocks').mocks,
      tracing: true,
      formatError(err) {
        reportError(err)
        return {
          message: err.message,
          code: err.extensions.code,
          locations: err.locations,
          path: err.path,
        }
      },
    }),
    AuthModule,
    LoggerModule,
    ConfigModule,
    UserModule,
    TenantModule,
    BrandModule,
    SubscriptionPlanModule,
    SignupModule,
    SubscriptionModule,
    DatabaseModule,
    ScraperModule,
    LogoModule,
    TypographyModule,
    GuidelineModule,
    ColorModule,
    PublishGuidelinesModule,
    CoverArtModule,
  ],
  providers: [],
})
export class AppModule { }
