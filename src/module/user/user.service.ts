import { Injectable, Logger } from '@nestjs/common'
import { UserEntity, UsersDatabaseFields } from './user.entity'
import { UserInput } from '../../typings/graphql.schema'
import { DatabaseService } from '../database/database.service'
import { keysToCamel } from '../../common/util/keysToCamel'
import { UserTenantRolesEntity } from './user-tenant-roles.entity'
import { UserRequestContext } from './user.interface'

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}
  private readonly logger = new Logger(UserService.name)

  async createUser(user: UserInput): Promise<UserEntity['userId']> {
    // this.logger.log('createUser - user -> ' + JSON.stringify(user))
    return await this.db.conn
      .one(
        `insert into users (
        firebase_uid,
        name,
        email,
        policies_agreed
      ) values (
        $1,
        $2,
        $3,
        $4
      ) returning user_id`,
        [user.firebaseUid, user.name, user.email, user.policiesAgreed],
      )
      .then(({ user_id }: UsersDatabaseFields) => {
        // this.logger.log('createUser -> user_id -> ' + JSON.stringify(user_id))
        return keysToCamel(user_id)
      })
  }

  async findUserById(userId: UserEntity['userId']) {
    return await this.db.conn
      .oneOrNone('SELECT * FROM users WHERE user_id = $1', +userId)
      .then((user: UserEntity) => {
        return keysToCamel(user)
      })
  }

  async findUserByEmail(email: UserEntity['email']): Promise<UserEntity> {
    return await this.db.conn
      .oneOrNone('SELECT * FROM users WHERE email = $1', email)
      .then((user: UserEntity) => {
        return keysToCamel(user)
      })
  }

  async allUsers(): Promise<UserEntity[]> {
    return await this.db.conn
      .any('SELECT * FROM users')
      .then((users: UserEntity[]) => {
        return keysToCamel(users)
      })
  }

  async totalUsers(): Promise<number> {
    return await this.db.conn.one(
      'SELECT count(*) FROM users',
      [],
      (a: { count: number }) => +a.count,
    )
  }

  async createUserTenantRole(
    userTenantRoleSlug: UserTenantRolesEntity['userTenantRoleSlug'],
    displayName: UserTenantRolesEntity['displayName'],
  ): Promise<null> {
    return this.db.conn.none(
      `insert into user_tenant_roles (
        user_tenant_role_slug,
        display_name
      ) values ($1, $2)`,
      [userTenantRoleSlug, displayName],
    )
  }

  async getUserContextByFirebaseUid(
    firebaseUid: UserEntity['firebaseUid'],
  ): Promise<UserRequestContext> {
    return await this.db.conn
      .one(
        `select
          users.user_id,
          users.name,
          tenant_users.tenant_id,
          tenant_users.user_tenant_role_slug,
          array_to_json (
            array_agg (
              json_build_object (
                'brand_id',
                tenant_brands.brand_id,
                'subscription_period_ends',
                tenant_brands.subscription_period_ends,
                'tenant_brand_role_slug',
                tenant_brands.tenant_brand_role_slug
              )
            )
          ) as brands
        from
          users
          join tenant_users on users.user_id = tenant_users.user_id
          join tenant_brands on tenant_users.tenant_id = tenant_brands.tenant_id
        where
          users.firebase_uid = $1
        group by
          users.user_id,
          tenant_users.tenant_id,
          tenant_users.user_tenant_role_slug`,
        firebaseUid,
      )
      .then((userCtx: UserRequestContext) => {
        this.logger.log(
          'getUserContextByFirebaseUid => userCtx -> ' +
            JSON.stringify(userCtx),
        )
        return keysToCamel(userCtx)
      })
  }

  async updateUsersNameEmail(
    userId: UserEntity['userId'],
    name: UserEntity['name'],
    email: UserEntity['email'],
  ): Promise<UserEntity['name']> {
    this.logger.log('User Service -> ' + userId + name + email)
    return await this.db.conn
      .one(
        `update users set name = $2, email = $3 where user_id = $1 returning name`,
        [userId, name, email],
      )
      .then(resp => {
        this.logger.log('User Service -> resp -> ' + JSON.stringify(resp))
        return resp
      })
  }
}

// return await this.db.conn
//   .one(
//   `select
//     users.user_id,
//     users.name,
//     tenant_users.tenant_id,
//     tenant_users.user_tenant_role_slug,
//     tenant_brands.brand_id
//   from
//     users
//     join tenant_users on users.user_id = tenant_users.user_id
//     join tenant_brands on tenant_users.tenant_id = tenant_brands.tenant_id
//   where
//     users.firebase_uid = $1
//   group by
//     users.user_id,
//     tenant_users.tenant_id,
//     tenant_brands.brand_id,
//     tenant_users.user_tenant_role_slug`,
//   firebaseUid,
// )
