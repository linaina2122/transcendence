/* eslint-disable prettier/prettier */

import { BadRequestException, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { FriendService } from "./friend.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AccessGuard, LoginGuard } from "src/auth/guard";
import { GetUser } from "src/decorators";



@UseGuards(AccessGuard, LoginGuard)
@Controller('friend')
export class FriendController{
    constructor(private readonly friendService: FriendService,
        private eventEmitter: EventEmitter2) {}

    @Get('numberoffriends/:userId')
    async getNumberOfFriends(@Param('userId') userId: string) {
        try {
            const number = await this.friendService.getNumberOfFriends(userId)
            return {number: number}
        } catch (error) {
            return error.response;
        }
    }

    // :userId for test
    @Get('all')
    async getAllFriends(@GetUser('id') userId: string) {
        return await this.friendService.getAllFriends(userId);
    }

    @Get("isfriend/:friendId")
    async getIsFriend(@GetUser("id") userId: string, @Param("friendId") friendId: string): Promise<{ relationShip: string }> {
        return this.friendService.getIsFriend(userId, friendId)
    }

    // :userId for test
    @Post('add/:friendId')
    async addFriend(@GetUser('id') userId: string, @Param('friendId') friendId: string) {
        try {
            console.log('add friend...');
            await this.friendService.addFriend(userId, friendId);
            this.eventEmitter.emit('addFriend', {userId, friendId});
            return {statusCode: 200};
        } catch (error) {
            console.log('errrrrrrrrrrror');
            return {statusCode: 400};
        }
    }

    // :userId for test
    @Post('block/:friendId')
    async blockFriend(@GetUser('id') userId: string, @Param('friendId') friendId: string) {
        try {
            console.log('block block')
            await this.friendService.blockFriend(userId, friendId);
            this.eventEmitter.emit('blockFriend', {userId, friendId});
            return {statusCode: undefined}
        } catch (error) {
            return error.response;
        }
    }



























    // :userId for test
    @Post('unblock/:friendId')
    async unblockFriend(@GetUser('id') userId: string, @Param('friendId') friendId: string) {
        try {
            const unblocked = await this.friendService.unblockFriend(userId, friendId);
            if (unblocked) {
                return { message: 'User unblocked successfully.' };
            } else {
                return { error: 'Failed to unblock the user.' };
            }
        } catch (error) {
                return { error: 'Failed to unblock the user.' };
        }
    }

    // :userId for test
    @Get('blocked/')
    async getBlockedFriends(@GetUser('id') userId: string) {
        return await this.friendService.getBlockedFriends(userId);
        
    }
}