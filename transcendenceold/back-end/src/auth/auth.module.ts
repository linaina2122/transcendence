import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RefreshStrategy, AccessStrategy, FortyTwoStrategy } from './strategy';
import { UserService } from 'src/user/user.service';
import { PassportModule } from '@nestjs/passport';

@Global()
@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({ session: false })
  ],
  providers: [
    AuthService,
    AccessStrategy,
    RefreshStrategy,
    FortyTwoStrategy,
    UserService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
