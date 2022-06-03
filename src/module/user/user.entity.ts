import { DatabaseEntity } from '@module/database/database.entity'

export class UserEntity extends DatabaseEntity {
  userId: UsersDatabaseFields['user_id']
  firebaseUid: UsersDatabaseFields['firebase_uid']
  name: UsersDatabaseFields['name']
  email: UsersDatabaseFields['email']
  avatar: UsersDatabaseFields['avatar']
  policiesAgreed: UsersDatabaseFields['policies_agreed']
}

export interface UsersDatabaseFields {
  user_id: string
  firebase_uid: string
  name: string
  email: string
  avatar: string | null
  policies_agreed: boolean
}
