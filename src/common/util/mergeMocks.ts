import { merge } from 'lodash'
import { UserMocks } from '../../module/user/user.mocks'
import { AuthMocks } from '@module/auth/auth.mocks'
import { BrandMocks } from '../../module/brand/brand.mocks'
import { TenantMocks } from '../../module/tenant/tenant.mocks'

export const mocks = merge(UserMocks, AuthMocks, BrandMocks, TenantMocks)
