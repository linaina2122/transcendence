/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { ConversationDto } from "./dto/conversation.dto";
import { DirectMessageDto } from "./dto/direct-message.dto";
import { CreateMessageDto } from "./dto/create-message.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AccessGuard, LoginGuard } from "src/auth/guard";
import { GetUser } from "src/decorators";

@UseGuards(AccessGuard, LoginGuard)
@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService,
        private eventEmitter: EventEmitter2
        ) {}


    // userId for test
    @Get('conversation/me')
    async getConversation(
        @GetUser('id') userId: string,
    ): Promise<ConversationDto[]> {
        const conversation = await this.messagesService.getConversation(userId);
        console.log(conversation);
        return conversation;
    }

    // user1Id for test
    @Get('conversation/:user2Id')
    async getMessagesBetweenUsers(
        @GetUser('id') user1Id: string,
        @Param('user2Id') user2Id: string,
    ): Promise<DirectMessageDto[]> {
        return this.messagesService.getMessagesBetweenUsers(user1Id, user2Id);
    }
}