/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { MessagesService } from "./DirectMessages/messages.service";
import { MessagesModule } from "./DirectMessages/messages.module";
import { RoomsModule } from "./rooms/rooms.module";
import { RoomsService } from "./rooms/rooms.service";
import { EventEmitterModule } from '@nestjs/event-emitter';


@Module({
    imports: [ 
        MessagesModule, 
        RoomsModule,
        EventEmitterModule.forRoot()
    ],
    providers: [ChatService, ChatGateway, MessagesService, RoomsService],
})
export class ChatModule {}