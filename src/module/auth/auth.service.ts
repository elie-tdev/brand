import { Injectable, Logger, HttpService } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import * as firebase from 'firebase'
import { auth } from './firebase.init'
import { parseAuthHeader } from '@common/util/parseAuthHeader'
import { ConfigService } from '@module/config/config.service'
import { ValidateUserAuthResponse } from './auth.interface'

@Injectable()
export class AuthService {
  constructor(
    public readonly httpService: HttpService,
    public readonly config: ConfigService,
  ) {}
  private readonly logger = new Logger(AuthService.name)

  async validateUserAuth(
    authHeader: string,
  ): Promise<ValidateUserAuthResponse> {
    const headerToken = await parseAuthHeader(authHeader)
    return await this.verifyJwtToken(headerToken.value)
  }

  async verifyJwtToken(token: string): Promise<ValidateUserAuthResponse> {
    let response: ValidateUserAuthResponse = { isValidAuth: false }
    if (
      process.env.NODE_ENV === 'test' ||
      (process.env.NODE_ENV === 'development' && token === 'test')
    ) {
      return { isValidAuth: true }
    }
    const projectId = await this.config.get('FIREBASE_PROJECT_ID')
    const decodedToken = jwt.decode(token, { complete: true })

    // tslint:disable-next-line: no-string-literal
    await this.getSigningKey(decodedToken['header'].kid).then(key => {
      jwt.verify(
        token,
        key,
        {
          audience: projectId,
          issuer: `https://securetoken.google.com/${projectId}`,
        },
        (err, decoded) => {
          if (!decoded || err) {
            this.logger.error(err)
            response = { isValidAuth: false }
          } else {
            // Everything is good return true
            response = {
              isValidAuth: true,
              // tslint:disable-next-line: no-string-literal
              firebaseUid: decodedToken['payload'].user_id,
            }
          }
        },
      )
    })
    // this.logger.log('verifyJwtToken - response -> ', JSON.stringify(response))
    return await response
  }

  async getSigningKey(kid: string): Promise<string> {
    const url =
      'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
    return await this.httpService
      .get(url)
      .toPromise()
      .then(res => {
        return res.data[kid]
      })
      .catch(e => this.logger.error(e))
  }

  async signInUserAuth(email: string, password: string): Promise<string> {
    return auth
      .signInWithEmailAndPassword(email, password)
      .then(async (user: firebase.auth.UserCredential) => {
        const token = await auth.currentUser.getIdToken(true)
        return token
      })
  }

  async signOutUserAuth(): Promise<void> {
    auth.signOut()
  }

  async createUserAuth(email: string, password: string): Promise<string> {
    return await auth
      .createUserWithEmailAndPassword(email, password)
      .then(async _ => {
        return await auth.currentUser.getIdToken(true)
      })
  }

  async passwordReset(email: string): Promise<void> {
    auth.sendPasswordResetEmail(email).catch(err => {
      this.logger.error(`passwordReset -> ${err}`)
    })
  }

  // needs to be tested to get the currentUser
  async updatePassword(password: string) {
    if (auth.currentUser) {
      await auth.currentUser.updatePassword(password)
    }
  }
}
