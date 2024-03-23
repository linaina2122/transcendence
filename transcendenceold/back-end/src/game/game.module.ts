/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { socketGateway } from "./socketGatway";




@Module({
    controllers: [GameController],
    providers:[GameService, socketGateway],
    exports: [GameService]
})
export class GameModule{}