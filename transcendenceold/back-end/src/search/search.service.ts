/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
// import { FriendshipDto } from "./dto/friendship.dto";


@Injectable()
export class SearchService{
    constructor(private readonly prisma: PrismaService){}
    async searchUsersByUsername(query: string): Promise<any[]> {
        return this.prisma.user.findMany({
            where: {
                username: {
                contains: query,
                },
            },
        });
    }

    async searchChatRoomsByRoomName(query: string): Promise<any[]> {
        const groups = await this.prisma.chatRoom.findMany({
        where: {
            roomName: {
                contains: query,
            },
        },
        include: {
            members: {
                include: {
                    user: true,
                },
                where: {
                    status: true
                }
            },
        },
        });
        
    
        const groupResults = groups.map((group) => ({
        id: group.id,   
        members: group.members?.length || 0,
        name: group.roomName,
        images: group.members?.slice(0, 4).map((member) => member.user.avatarUrl) || [], // Assuming avatarUrl is a field in your User model
        }));
    // console.log(groupResults);
    return groupResults;
}

async getBlockedUserIds(userId: string): Promise<string[]> {
    const blockingUsers = await this.prisma.blockedUsers.findMany({
        where: {
            blockedId: userId,
        },
        select: {
            blockingId: true,
        },
    });

    const blockingUserIds = blockingUsers.map((blockingUser) => blockingUser.blockingId);

    const blockedUsers = await this.prisma.blockedUsers.findMany({
        where: {
            blockingId: userId,
        },
        select: {
            blockedId: true,
        },
    });

    const blockedUserIds = blockedUsers.map((blockedUser) => blockedUser.blockedId);

    return [...blockingUserIds, ...blockedUserIds];
}


    async getSearchResults(query: string, userId: string): Promise<any> {
        const users = await this.searchUsersByUsername(query);
        const groups = await this.searchChatRoomsByRoomName(query);

        const blockedUserIds = await this.getBlockedUserIds(userId);

        const filteredUsers = users.filter((user) => !blockedUserIds.includes(user.id));

    
        const userResults = filteredUsers.map((user) => ({
            id:     user.id,
            name:   user.username,
            status: user.Status,
            images: [user.avatarUrl],
        }));
    
        return {
            users: userResults,
            groups: groups,
        };
    }
}