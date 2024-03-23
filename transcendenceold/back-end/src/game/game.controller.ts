/* eslint-disable prettier/prettier */

import { BadRequestException, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { GameService } from "./game.service";
import { AccessGuard, LoginGuard } from "src/auth/guard";
import { GetUser } from "src/decorators";



@UseGuards(AccessGuard, LoginGuard)
@Controller('game')
export class GameController{
    constructor(private readonly gameService: GameService,
        private eventEmitter: EventEmitter2) {}

    @Post('playwith/:userId')
    async sendRequstGame(@Param('userId') userId: string, @GetUser('id') id: string) {
        try {
            const user = await this.gameService.getUserName(id);
            this.eventEmitter.emit('sendRequestGame', {userId, username: user?.username, id: id});
            return {statusCode: 200};
        } catch (error) {
            return error.response;
        }
    }

}