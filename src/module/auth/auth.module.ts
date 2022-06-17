import { Module, HttpModule, Global } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { UserModule } from '@module/user/user.module';
import { UserService } from '@module/user/user.service';

@Global()
@Module({
  imports: [HttpModule, UserModule],
  providers: [AuthService, AuthResolver, UserService],
  exports: [AuthService, UserService],
})
export class AuthModule { }
