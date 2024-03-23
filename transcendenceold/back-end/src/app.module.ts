import { JwtService } from '@nestjs/jwt';
import { MiddlewareConsumer, Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TowFactorAuthModule } from './tow-factor-auth/tow-factor-auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EncryptionModule } from './encryption/encryption.module';
import { HistoryGameModule } from './history-game/history-game.module';
import { FriendModule } from './friend/friend.module';
import { ChatModule } from './chat/chat.module';
import { SearchModule } from './search/search.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    TowFactorAuthModule,
    EncryptionModule,
    HistoryGameModule,
    FriendModule,
    ChatModule,
    SearchModule,
    GameModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private appService: AppService) { }

  onApplicationBootstrap() {
    this.appService.init_server();
  }
}
