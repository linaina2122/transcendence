import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AccessStrategy, RefreshStrategy } from 'src/auth/strategy';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    AccessStrategy,
    RefreshStrategy,
  ],
  exports: [UserService],
})
export class UserModule {}
