import { Module } from '@nestjs/common';
import { TowFactorAuthController } from './tow-factor-auth.controller';
import { TowFactorAuthService } from './tow-factor-auth.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [TowFactorAuthController],
  providers: [TowFactorAuthService, UserService],
})
export class TowFactorAuthModule {}
