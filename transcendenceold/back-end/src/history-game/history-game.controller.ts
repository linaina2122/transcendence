import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AccessStrategy, RefreshStrategy } from 'src/auth/strategy';
import { HistoryGameService } from './history-game.service';
import { HistoryGameType } from './dto';

@UseGuards(RefreshStrategy, AccessStrategy)
@Controller('history-game')
export class HistoryGameController {

    constructor (private historyGameService: HistoryGameService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post('/createhistory')
    async createHistoryGame(@Body() hGame: HistoryGameType) {
        return await this.historyGameService.createHistoryGame(hGame);
    }

    @HttpCode(HttpStatus.OK)
    @Get('/winnedgame/:userId')
    async numberGameWinned(@Param('userId') userId: string) {
        return await this.historyGameService.numberGameWinned(userId);
    }

    @HttpCode(HttpStatus.OK)
    @Get('/losedgame/:userId')
    async numberGameLosed(@Param('userId') userId: string) {
        return await this.historyGameService.numberGameLosed(userId);
    }
    
    @HttpCode(HttpStatus.OK)
    @Get('/games/:userId')
    async getGamesByIdUser(@Param('userId') userId: string) {
        return await this.historyGameService.getGamesByIdUser(userId);
    }

    @HttpCode(HttpStatus.OK)
    @Get('/leaderbord')
    async leaderboard() {
        return await this.historyGameService.leaderboard();
    }
    
}
