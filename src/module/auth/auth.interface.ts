import { UserEntity } from '../user/user.entity'
export interface Auth {}

export interface ValidateUserAuthResponse {
  isValidAuth: boolean
  firebaseUid?: UserEntity['firebaseUid']
}
