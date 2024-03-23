import { Module } from '@nestjs/common';
import { HistoryGameService } from './history-game.service';
import { HistoryGameController } from './history-game.controller';

@Module({
  providers: [HistoryGameService],
  controllers: [HistoryGameController]
})
export class HistoryGameModule {}
