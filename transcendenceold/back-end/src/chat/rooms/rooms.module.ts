/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';

@Module({
    exports: [RoomsService],
    controllers: [RoomsController],
    providers: [
        RoomsService,
    ],
})
export class RoomsModule {}