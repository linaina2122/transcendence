/* eslint-disable prettier/prettier */
import { PrismaService } from "src/prisma/prisma.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ChatRoom, Member, MutedUsers } from "@prisma/client";
import { RoomDto } from "./dto/room-conv.dto";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RoomMessageDto } from "./dto/room-message.dto";
import { CreateMessageDto } from "./dto/create-message.dto";
// import * as bcrypt from 'bcrypt';
import { SharedService } from "../shared/shared.service";
import { EventEmitter2 } from "@nestjs/event-emitter";


@Injectable()
export class RoomsService {
    constructor(
        private prisma: PrismaService,
        private eventEmitter: EventEmitter2 
        ) {}


    async createRoom(createRoomDto: CreateRoomDto){
        try {
            return await this.prisma.chatRoom.create({
                data: {
                    image: createRoomDto.image,
                    isProtected: createRoomDto.isProtected,
                    roomName: createRoomDto.roomName,
                    roomType: createRoomDto.roomType,
                    password: createRoomDto.password,
                    owner: {
                        connect: { id: createRoomDto.ownerID }, // Connect the room to the owner
                    },
                },

            });
        } catch (error) {
            console.error('Error creating room:', error);
            throw new Error('Failed to create room');
        }
    }

    async addUserToRoom(roomId: string, userId: string, isProtected: boolean) {
        const existingMember = await this.prisma.member.findFirst({
            where: {
                userId,
                chatRoomId: roomId,
            },
        });

        if (!existingMember) {
            await this.prisma.member.create({
                data: {
                    userId,
                    chatRoomId: roomId,
                    status: isProtected
                },
            });
        }
        return;
    }

    async addUserAsAdmin(roomId: string, userId: string) {
        try {
            const adminEntry = await this.prisma.admins.create({
                data: {
                    userId: userId,
                    roomId: roomId,
                },
            });
            return adminEntry;
        } catch (error) {
            throw new Error(`Failed to add user as admin: ${error.message}`);
        }
    }

    async findRoomById(roomId: string) {
        const room = await this.prisma.chatRoom.findUnique({
            where: {
                id: roomId
            }
        });
        return room;
    }

    async updateRoomPassword(roomId: string, newPassword: string): Promise<boolean> {
        try {
            // hash password
            const nPass = newPassword;
            const updatedRoom = await this.prisma.chatRoom.update({
                where: { id: roomId },
                data: { password: nPass },
            });
    
            if (updatedRoom) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error updating room password:', error);
            return false;
        }
    }

    async updateRoom(roomId: string, updatedFields: Partial<ChatRoom>) {
        try {
            const updatedRoom = await this.prisma.chatRoom.update({
                where: { id: roomId },
                data: updatedFields,
            });
            return updatedRoom;
        } catch (error) {
            throw new Error(`Error updating room: ${error}`);
        }
    }

    // async getRoomsForUser(userId: string): Promise<RoomDto[]> {
    //     const userRooms = await this.prisma.member.findMany({
    //         where: {
    //             userId: userId,
    //         },
    //         include: {
    //             chatRoom: true,
    //         },
    //     });
    //     const rooms: RoomDto[] = userRooms.map((userRoom) => {
    //         return {
    //             id: userRoom.chatRoom.id,
    //             roomName: userRoom.chatRoom.roomName,
    //             roomType: userRoom.chatRoom.roomType,
    //             image: userRoom.chatRoom.image,
    //         };
    //     });
    
    //     return rooms;
    // }

    // correct code
    // async getRoomsForUser(userId: string): Promise<any[]> {
    //     const userRooms = await this.prisma.member.findMany({
    //         where: {
    //             userId: userId,
    //         },
    //         include: {
    //             chatRoom: {
    //                 include: {
    //                     members: {
    //                         select: {
    //                             userId: true,
    //                             user: {
    //                                 select: {
    //                                     username: true,
    //                                     avatarUrl: true,
    //                                 },
    //                             },
    //                         },
    //                         where: {
    //                             status: true
    //                         }
    //                     },
    //                     messages: {
    //                         select: {
    //                             createdAt: true,
    //                             message: true,
    //                         },
    //                         orderBy: {
    //                             createdAt: 'desc',
    //                         },
    //                         take: 1,
    //                     },
    //                 },
    //             },
    //         },
    //     });
    
    //     const rooms: RoomDto[] = userRooms.map((userRoom) => {
    //         const chatRoom = userRoom.chatRoom;
    //         const membersCount = chatRoom.members.length;
    
    //         // Get up to 4 member avatars
    //         const memberAvatars = chatRoom.members.slice(0, 4).map((member) => member.user.avatarUrl);
    
    //         return {
    //             id: chatRoom.id,
    //             roomName: chatRoom.roomName,
    //             members: membersCount,
    //             group: {
    //                 name: chatRoom.roomName,
    //                 images: memberAvatars,
    //                 lastMessage: chatRoom.messages.length > 0 ? chatRoom.messages[0].message : null,
    //             },
    //         };
    //     });
    
    //     // console.log(rooms);
    //     return rooms;
    // }

    async getRoomsForUser(userId: string): Promise<any[]> {
        const userRooms = await this.prisma.member.findMany({
            where: {
                userId: userId,
            },
            include: {
                chatRoom: {
                    include: {
                        members: {
                            select: {
                                userId: true,
                                user: {
                                    select: {
                                        username: true,
                                        avatarUrl: true,
                                    },
                                },
                            },
                            where: {
                                status: true,
                            },
                        },
                        banedUsers: {
                            select: {
                                userId: true,
                            },
                            where: {
                                userId: userId,
                            },
                        },
                        messages: {
                            select: {
                                createdAt: true,
                                message: true,
                            },
                            orderBy: {
                                createdAt: 'desc',
                            },
                            take: 1,
                        },
                    },
                },
            },
        });

        // console.log('usersroom', userRooms);
    
        const rooms: RoomDto[] = userRooms
            .filter((userRoom) => userRoom.chatRoom.banedUsers.length === 0 && userRoom.status === true) // Exclude rooms where user is banned
            .map((userRoom) => {
                const chatRoom = userRoom.chatRoom;
                const membersCount = chatRoom.members.length;
    
                // Get up to 4 member avatars
                const memberAvatars = chatRoom.members.slice(0, 4).map((member) => member.user.avatarUrl);
    
                return {
                    id: chatRoom.id,
                    roomName: chatRoom.roomName,
                    members: membersCount,
                    group: {
                        name: chatRoom.roomName,
                        images: memberAvatars,
                        lastMessage: chatRoom.messages.length > 0 ? chatRoom.messages[0].message : null,
                    },
                };
            });
    
        return rooms;
    }
    



    async getAllRoomsForUser(userId: string): Promise<any> {
        const userRooms = await this.prisma.member.findMany({
            where: {
                userId: userId,
                status: true
            },
            include: {
                chatRoom: {
                    include: {
                        members: {
                            select: {
                                userId: true,
                                user: {
                                    select: {
                                        username: true,
                                        avatarUrl: true,
                                    },
                                },
                            },
                            where: {
                                status: true
                            }
                        },
                        messages: {
                            select: {
                                createdAt: true,
                                message: true,
                            },
                            orderBy: {
                                createdAt: 'desc',
                            },
                            take: 1,
                        },
                    },
                },
            },
        });
    
        const rooms: any = userRooms.map((userRoom) => {
            const chatRoom = userRoom.chatRoom;
            const membersCount = chatRoom.members.length;
    
            // Get up to 4 member avatars
            const memberAvatars = chatRoom.members.slice(0, 4).map((member) => member.user.avatarUrl);
    
            return {
                id: chatRoom.id,
                name: chatRoom.roomName,
                members: membersCount,
                images: memberAvatars,
            };
        });
    
        // console.log(rooms);
        return {
            groups: rooms
        };
    }
    
    async getMessagesInRoom(roomId: string, userId: string): Promise<any> {
        const room = await this.prisma.chatRoom.findUnique({
            where: {
                id: roomId,
            },
            include: {
                members: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                avatarUrl: true,
                                Status: true,
                            },
                        },
                    },
                    where: {
                        status: true
                    }
                },
                messages: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                username: true,
                                avatarUrl: true,
                                Status: true,
                            },
                        },
                    },
                },
            },
        });
    
        if (!room) {
            throw new Error('Room not found');
        }
    
        const isBanned = await this.prisma.banedUsers.findFirst({
            where: {
                roomId: roomId,
                userId: userId
            }
        });


        const members = room.members.map((member) => member.user);
    
        // If the number of members is more than 4, get the first 4 images, otherwise, get all images
        const images =
            members.length > 4 ? members.slice(0, 4).map((member) => member.avatarUrl) : members.map((member) => member.avatarUrl);
    
        const conversationInfos = {
            type: 'group',
            name: room.roomName,
            members: members.length,
            id: room.id,
            images: images,
        };
    
        const formattedMessages: any[] = room.messages.map((message) => {
            const isSender = message.sender.id === userId;
            const sender = message.sender;
    
            return {
                userType: isSender ? 'sender' : 'receiver',
                username: sender.username,
                otherUsername: members.find((member) => member.id !== sender.id)?.username,
                timestamp: message.createdAt,
                message: message.message,
                image: sender.avatarUrl,
            };
        });
    
        return {
            conversationInfos: conversationInfos,
            chatMessages: formattedMessages,
            isMuted: this.isUserMutedInRoom(userId, roomId),
            isBanned: !!isBanned,
        };
    }

    private isUserMutedInRoom(userId: string, roomId: string): boolean {
        const roomMutes = SharedService.mutedUsers.get(userId);
        if (roomMutes && roomMutes.has(roomId)) {
            return true;
        }
        return false;
    }
    

    // async getMessagesForRoom(roomId: string): Promise<RoomMessageDto[]> {
    //     const roomMessages = await this.prisma.roomMessage.findMany({
    //         where: {
    //             roomId: roomId,
    //         },
    //         include: {
    //             sender: {
    //                 select: {
    //                     id: true,
    //                     username: true,
    //                     avatarUrl: true,
    //                 },
    //             },
    //             room: {
    //                 select: {
    //                     id: true,
    //                     roomName: true,
    //                 },
    //             },
    //         },
    //         orderBy: {
    //             createdAt: 'asc',
    //         },
    //     });
    
    //     const formattedMessages: RoomMessageDto[] = roomMessages.map((message) => {
    //         return {
    //             roomId: message.roomId,
    //             createdAt: message.createdAt,
    //             message: message.message,
    //             sender: {
    //                 id: message.sender.id,
    //                 username: message.sender.username,
    //             },
    //             room: {
    //                 id: message.room.id,
    //                 roomName: message.room.roomName,
    //             },
    //         };
    //     });
    
    //     return formattedMessages;
    // }

    
    

    async banUserInRoom(adminId: string, roomId: string, bannedId: string): Promise<boolean> {
        try {
            const room = await this.prisma.chatRoom.findUnique({
                where: { id: roomId },
            });
    
            if (!room) {
                throw new Error('Room does not exist.');
            }
    
            if (room.ownerID === bannedId) {
                throw new Error('Cannot ban the owner of the room.');
            }
    
            const isMember = await this.prisma.member.findFirst({
                where: {
                    userId: bannedId,
                    chatRoomId: roomId,
                },
            });
    
            if (!isMember) {
                throw new Error('User is not a member of this room.');
            }
    
            const isAdmin = await this.prisma.admins.findFirst({
                where: {
                    userId: adminId,
                    roomId: roomId,
                },
            });
    
            if (!isAdmin) {
                throw new Error('You are not an admin in this room.');
            }
    
            await this.prisma.banedUsers.create({
                data: {
                    userId: bannedId,
                    roomId: roomId,
                },
            });
        } catch (error) {
            return false;
        }
        return true;
    }

    async isRoomOwner(userId: string, roomId: string): Promise<boolean> {
        const room = await this.prisma.chatRoom.findUnique({
            where: { id: roomId },
            include: { owner: true },
        });
    
        return room?.owner.id === userId;
    }

    async addAdminToRoom(ownerId: string, roomId: string, adminId: string): Promise<void> {
        try {
            const isOwner = await this.isRoomOwner(ownerId, roomId);
            if (isOwner) {
                await this.prisma.admins.create({
                    data: {
                        userId: adminId,
                        roomId: roomId,
                    },
                });
            } else {
                throw new Error('You are not the owner of this room.');
            }
            } catch (error) {
                console.log('??????');
            }
        }
    
        async getBanedUsers(roomId: string) {
            return await this.prisma.banedUsers.findMany({
                where: {
                    roomId: roomId,
                },
            });
        }

        async getAllMembersOfRoom(roomId: string): Promise<Member[]> {
            return this.prisma.member.findMany({
                where: {
                    chatRoomId: roomId,
                },
            });
        }

        async checkMutedUser(senderId: string, roomId: string): Promise<MutedUsers | null> {
            const mutedUser = await this.prisma.mutedUsers.findFirst({
                where: {
                    userId: senderId,
                    roomId: roomId,
                },
            });
    
            return mutedUser;
        }

        async isUserBanned(senderId: string, roomId: string) {
            const bannedUsers = await this.prisma.banedUsers.findMany({
                where: {
                    roomId: roomId,
                    userId: senderId,
                },
            });
        
            return bannedUsers.length > 0;
        }

        async createMessage(createMessageDto: CreateMessageDto) {
            return this.prisma.roomMessage.create({
                data: {
                    message: createMessageDto.message,
                    senderId: createMessageDto.senderId,
                    roomId: createMessageDto.receiverId,
                }
            });
        }

        async kickUserfromRoom(adminId: string, roomId: string, userId: string): Promise<boolean> {
            try {
                const room = await this.prisma.chatRoom.findUnique({
                    where: { id: roomId },
                });
        
                if (!room) {
                    throw new Error('Room does not exist.');
                }
        
                if (room.ownerID === userId) {
                    throw new Error('Cannot kick the owner of the room.');
                }
        
                const isMember = await this.prisma.member.findFirst({
                    where: {
                        userId: userId,
                        chatRoomId: roomId,
                    },
                });
        
                if (!isMember) {
                    throw new Error('User is not a member of this room.');
                }
        
                const isAdmin = await this.prisma.admins.findFirst({
                    where: {
                        userId: adminId,
                        roomId: roomId,
                    },
                });
        
                if (!isAdmin) {
                    throw new Error('You are not an admin in this room.');
                }
        
                await this.prisma.member.deleteMany({
                    where: {
                        userId: userId,
                        chatRoomId: roomId,
                    },
                });

                const wasAdmin = await this.prisma.admins.findFirst({
                    where: {
                        userId: userId,
                        roomId: roomId,
                    },
                });

                if (wasAdmin) {
                    await this.prisma.admins.delete({
                        where: {
                            userId_roomId: {
                                userId: userId,
                                roomId: roomId,
                            },
                        },
                    });
                }
            } catch (error) {
                return false;
            }
            return true;
        }

        async isUserAdmin(userId: string, roomId: string): Promise<boolean> {
            const isAdmin = await this.prisma.admins.findFirst({
                where: {
                    userId,
                    roomId,
                },
            });
        
            return !!isAdmin;
        }

        async removeUserFromRoom(userId: string, roomId: string): Promise<void> {
            await this.prisma.member.deleteMany({
                where: {
                    userId,
                    chatRoomId: roomId,
                },
            });
        }

        async assignNewOwner(userId: string, roomId: string): Promise<void> {
            const oldOwner = await this.prisma.chatRoom.findUnique({
                where: { id: roomId },
                select: { ownerID: true },
            });
        
            // const newOwner = await this.prisma.member.findFirst({
            //     where: {
            //         chatRoomId: roomId,
            //         userId: { not: oldOwner?.ownerID },
            //     },
            //     orderBy: {
            //         createdAt: 'asc',
            //     },
            // });

            const newOwner = await this.prisma.admins.findFirst({
                where: {
                    roomId: roomId,
                    userId: { not: oldOwner?.ownerID },
                },
                orderBy: {
                    createdAt: 'asc',
                },
            });
            if (oldOwner && oldOwner.ownerID) {
                if (newOwner) {
                    await this.prisma.chatRoom.update({
                        where: { id: roomId },
                        data: {
                            ownerID: newOwner.userId,
                        },
                    });
                    return;
                }

                const newOwnerMember = await this.prisma.member.findFirst({
                    where: {
                        chatRoomId: roomId,
                        userId: { not: oldOwner?.ownerID },
                        status: true
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                });

                    if (newOwnerMember && newOwnerMember.userId) {
                        if (newOwnerMember) {
                            await this.prisma.chatRoom.update({
                                where: { id: roomId },
                                data: {
                                    ownerID: newOwnerMember.userId,
                                },
                            });
                        }
                        const isAdmin = await this.prisma.admins.findFirst({
                            where: {
                                userId: newOwnerMember.userId,
                                roomId,
                            },
                        });
                
                        if (!isAdmin) {
                            await this.prisma.admins.create({
                                data: {
                                    userId: newOwnerMember.userId,
                                    roomId,
                                },
                            });
                        }
                }
            }
        }
        

        async removeUserFromAdmins(userId: string, roomId: string): Promise<void> {
            await this.prisma.admins.deleteMany({
                where: {
                    userId,
                    roomId,
                },
            });
        }

        async getRoomMembersCount(roomId: string): Promise<number> {
            const count = await this.prisma.member.count({
                where: { chatRoomId: roomId, status: true },
            });
            return count;
        }

        async deleteRoom(roomId: string): Promise<void> {
            await this.prisma.roomMessage.deleteMany({
                where: { roomId: roomId },
            });
            await this.prisma.member.deleteMany({
                where: { chatRoomId: roomId },
            });
            await this.prisma.chatRoom.delete({
                where: { id: roomId },
            });
        }

        async removeUserFromBannedUsers(userId: string, roomId: string): Promise<void> {
            await this.prisma.banedUsers.deleteMany({
                where: {
                    userId,
                    roomId,
                },
            });
        }

        async removeUserFromMutedUsers(userId: string, roomId: string): Promise<void> {
            await this.prisma.mutedUsers.deleteMany({
                where: {
                    userId,
                    roomId,
                },
            });
        }

        async getRoomMembers(roomId: string): Promise<any> {
            const room = await this.prisma.chatRoom.findUnique({
                where: {
                    id: roomId,
                },
                include: {
                    owner: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            avatarUrl: true,
                        },
                    },
                    AdminUsers: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                avatarUrl: true,
                            },
                        },
                    },
                    },
                    members: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                avatarUrl: true,
                            },
                        },
                    },
                    },
                },
                });
            
                if (!room) {
                    return { message: 'Room not found' };
                }
            
                const members = {
                    Owner: [],
                    Admin: [],
                    Member: [],
                };
            
                if (room.owner) {
                    members.Owner.push({
                        id: room.owner.id,
                        username: room.owner.username,
                        email: room.owner.email,
                        avatarUrl: room.owner.avatarUrl,
                    });
                }
            
                room.AdminUsers.forEach((admin) => {
                if (room.owner?.id !== admin.user.id) {
                        members.Admin.push({
                        id: admin.user.id,
                        username: admin.user.username,
                        email: admin.user.email,
                        avatarUrl: admin.user.avatarUrl,
                    });
                }
                });
            
                room.members.forEach((member) => {
                    const isAdmin = room.AdminUsers.some(
                        (admin) => admin.user.id === member.user.id
                    );
                    if (!isAdmin) {
                        members.Member.push({
                        id: member.user.id,
                        username: member.user.username,
                        email: member.user.email,
                        avatarUrl: member.user.avatarUrl,
                        });
                    }
                });
            
                return members;
            }
            
        async  getUserRoleInRoom(userId: string, roomId: string): Promise<string | boolean> {
            const room = await this.prisma.chatRoom.findUnique({
                where: { id: roomId },
                include: {
                    owner: true,
                    members: {
                        where: { userId: userId },
                    },
                    AdminUsers: {
                        where: { userId: userId },
                    },
                },
            });
        
            if (!room) {
                return false;
            }
        
            if (room.ownerID === userId) {
                return 'Owner';
            }
        
            if (room.AdminUsers.length > 0) {
                return 'Admin';
            }
        
            if (room.members.length > 0) {
                return 'Member';
            }
        
            return false;
        }
        
        

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // async  getRoomInfo(roomId: string, userId: string): Promise<any> {
            //     const room = await this.prisma.chatRoom.findUnique({
            //     where: { id: roomId },
            //     include: {
            //         owner: {
            //         select: {
            //             username: true,
            //             Status: true,
            //             avatarUrl: true,
            //         },
            //         },
            //         AdminUsers: {
            //         select: {
            //             user: {
            //             select: {
            //                 username: true,
            //                 Status: true,
            //                 avatarUrl: true,
            //             },
            //             },
            //         },
            //         },
            //         members: {
            //         select: {
            //             user: {
            //             select: {
            //                 id: true,
            //                 username: true,
            //                 Status: true,
            //                 avatarUrl: true,
            //             },
            //             },
            //         },
            //         },
            //         banedUsers: {
            //         select: {
            //             user: {
            //             select: {
            //                 username: true,
            //                 Status: true,
            //                 avatarUrl: true,
            //             },
            //             },
            //         },
            //         },
            //     },
            //     });
            
            //     if (!room) {
            //     return null; // Room not found
            //     }
            
            //     // Check if the user making the request is a member of the room
            //     const isMember = room.members.some((member) => member.user.id === userId);
            
            //     if (!isMember) {
            //     return null; // User is not a member of the room
            //     }
            
            //     const mapUser = (user): any => ({
            //     name: user.username,
            //     status: user.Status,
            //     images: [user.avatarUrl],
            //     });
            
            //     const roomInfo: any = {
            //     name: room.roomName,
            //     type: room.roomType,
            //     owner: [mapUser(room.owner)],
            //     admins: room.AdminUsers.map((admin) => mapUser(admin.user)),
            //     members: room.members.map((member) => mapUser(member.user)),
            //     members_requests: [],
            //     banned_members: room.banedUsers.map((banned) => mapUser(banned.user)),
            //     };
            
            //     return roomInfo;
            // }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            // async  getRoomInfo(roomId: string, userId: string): Promise<any> {
            //         const room = await this.prisma.chatRoom.findUnique({
            //         where: { id: roomId },
            //         include: {
            //             owner: {
            //             select: {
            //                 id: true,
            //                 username: true,
            //                 Status: false,
            //                 avatarUrl: true,
            //             },
            //             },
            //             AdminUsers: {
            //             select: {
            //                 user: {
            //                 select: {
            //                     id: true,
            //                     username: true,
            //                     Status: false,
            //                     avatarUrl: true,
            //                 },
            //                 },
            //             },
            //             },
            //             members: {
            //             select: {
            //                 user: {
            //                 select: {
            //                     id: true,
            //                     username: true,
            //                     Status: false,
            //                     avatarUrl: true,
            //                 },
            //                 },
            //             },
            //             },
            //             banedUsers: {
            //             select: {
            //                 user: {
            //                 select: {
            //                     username: true,
            //                     Status: false,  // TODO: will be checked
            //                     avatarUrl: true,
            //                 },
            //                 },
            //             },
            //             },
            //         },
            //         });
                
            //         if (!room) {
            //         return null;
            //         }
                
            //         const mapUser = (user): any => ({
            //             id: user.id,
            //             name: user.username,
            //             status: user.Status,
            //             images: [user.avatarUrl],
            //         });
                
            //         const ownerInfo = mapUser(room.owner);
            //         const adminsIds = room.AdminUsers.map((admin) => admin.user.id);
            //         const roomInfo: any = {
            //         name: room.roomName,
            //         type: room.roomType,
            //         owner: [ownerInfo],
            //         admins: room.AdminUsers
            //             .filter((admin) => admin.user.id !== room.owner.id) // Exclude owner from admins
            //             .map((admin) => mapUser(admin.user)),
            //         members_requests: [],
            //         members: room.members
            //             .filter((member) => member.user.id !== room.owner.id && !adminsIds.includes(member.user.id)) // Exclude owner from members
            //             .map((member) => mapUser(member.user)),
            //         banned_members: room.banedUsers.map((banned) => mapUser(banned.user)),
            //         };
                
            //         return roomInfo;
            //     }


            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            async getRoomInfo(roomId: string, userId: string): Promise<any> {
                const findRoom = await this.prisma.chatRoom.findUnique({
                    where: {
                        id: roomId
                    }
                });
                if (!findRoom) {
                    throw new NotFoundException('room not found');
                }
                const room = await this.prisma.chatRoom.findUnique({
                    where: { id: roomId },
                    include: {
                        owner: {
                            select: {
                                id: true,
                                username: true,
                                Status: false,
                                avatarUrl: true,
                            },
                        },
                        AdminUsers: {
                            select: {
                                user: {
                                    select: {
                                        id: true,
                                        username: true,
                                        Status: false,
                                        avatarUrl: true,
                                    },
                                },
                            },
                        },
                        members: {
                            select: {
                                userId: true,
                                status: true,
                                user: {
                                    select: {
                                        username: true,
                                        Status: false, // TODO: will be checked
                                        avatarUrl: true,
                                    },
                                },
                            },
                        },
                        // members_requests: true,
                        banedUsers: {
                            select: {
                                userId: true,
                                user: {
                                    select: {
                                        username: true,
                                        Status: false, // TODO: will be checked
                                        avatarUrl: true,
                                    },
                                },
                            },
                        },
                    },
                });
            
                if (!room) {
                    return null;
                }

                

                const mutedIds: string[] = [];

                // eslint-disable-next-line prefer-const
                for (let [userId, roomMap] of SharedService.mutedUsers.entries()) {
                    if (roomMap.has(roomId)) {
                        mutedIds.push(userId);
                    }
                }


            
                const mapUser = (user): any => ({
                    id: user.id,
                    name: user.username,
                    status: user.Status,
                    images: [user.avatarUrl],
                });

                const mapUser2 = (user): any => ({
                    id: user.userId,
                    name: user.user.username,
                    status: user?.Status || '',
                    images: [user.user.avatarUrl],
                });
            
                const ownerInfo = mapUser(room.owner);
                const adminsIds = room.AdminUsers.map((admin) => admin.user.id);
                const bannedIds = room.banedUsers.map((user) => user.userId);

                const friends = await this.prisma.friendship.findMany({
                    where: {
                        OR: [
                            {userOne: userId},
                            {userTwo: userId}
                        ]
                    }
                });

                const friendResults = friends.map((friendship) => {
                    const friendUser = friendship.userOne === userId
                        ? friendship.userTwo
                        : friendship.userOne;
            
                    return friendUser
                });

                // console.log()
            
                // const members = room.members.filter((member) => member.status === true);
                const members = room.members.filter((member) => !mutedIds.includes(member.userId));
                const members_requests = room.members.filter((request) => request.status === false);
                // const blocked = await this.getBlockedUserIds(userId)
                const roomInfo: any = {
                    name: room.roomName,
                    type: room.roomType,
                    owner: [ownerInfo],
                    admins: room.AdminUsers
                        .filter((admin) => admin.user.id !== room.owner.id ) // Exclude owner from admins

                        .map((admin) => mapUser(admin.user)),
                    members_requests: members_requests.map((request) => mapUser2(request)),
                    members: members
                        .filter((member) => member.userId !== room.owner.id && member.status === true && !adminsIds.includes(member.userId) && !bannedIds.includes(member.userId)) // Exclude owner from members
                        .map((member) => mapUser2(member)),
                    banned_members: room.banedUsers.map((banned) => mapUser2(banned)),
                    muted_members: room.members.filter((member) => mutedIds.includes(member.userId)).map((member) => mapUser2(member)),
                    friends_list: friendResults
                };
                console.log(roomInfo);
                return roomInfo;
            }
            
            
            async removeRoom(roomId: string, userId: string): Promise<any[]> {
                const room = await this.prisma.chatRoom.findUnique({
                where: { 
                    id: roomId,
                    ownerID: userId
                },
                include: {
                    members: true,
                    AdminUsers: {
                    select: {
                        userId: true,
                    },
                    },
                    banedUsers: {
                    select: {
                        userId: true,
                    },
                    },
                },
                });

                const memberIds = room.members.map((member) => member.userId);
            
                if (!room) {
                    throw new NotFoundException('Room not found');
                }
            try {
                await this.prisma.roomMessage.deleteMany({
                    where: {
                        roomId: roomId,
                    },
                });
                // Delete room members
                await this.prisma.member.deleteMany({
                    where: {
                        chatRoomId: roomId,
                    },
                });
            
                // Delete room admins
                await this.prisma.admins.deleteMany({
                    where: {
                        roomId: roomId,
                    },
                });
            
                // Delete room banned members
                await this.prisma.banedUsers.deleteMany({
                    where: {
                        roomId: roomId,
                    },
                });
            
                // Delete the room itself
                await this.prisma.chatRoom.delete({
                    where: {
                        id: roomId,
                    },
                });

                return memberIds
            } catch(error) {
                throw new BadRequestException('Failed to remove room');
            }
        }
            
            
            

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            // async getRoomInfo(roomId: string): Promise<any> {
            //     const room = await this.prisma.chatRoom.findUnique({
            //         where: { id: roomId },
            //         include: {
            //             owner: {
            //             select: {
            //                 id: true,
            //                 username: true,
            //                 Status: true,
            //                 avatarUrl: true,
            //             },
            //             },
            //             AdminUsers: {
            //             select: {
            //                 user: {
            //                 select: {
            //                     id: true,
            //                     username: true,
            //                     Status: true,
            //                     avatarUrl: true,
            //                 },
            //                 },
            //             },
            //             },
            //             members: {
            //             select: {
            //                 user: {
            //                 select: {
            //                     id: true,
            //                     username: true,
            //                     Status: true,
            //                     avatarUrl: true,
            //                 },
            //                 },
            //             },
            //             },
            //             banedUsers: {
            //             select: {
            //                 user: {
            //                 select: {
            //                     username: true,
            //                     Status: true,
            //                     avatarUrl: true,
            //                 },
            //                 },
            //             },
            //             },
            //         },
            //         });
                
            //         if (!room) {
            //         return null; // Room not found
            //         }
                
            //         const mapUser = (user): any => ({
            //         id: user.id,
            //         name: user.username,
            //         status: user.Status,
            //         images: [user.avatarUrl],
            //         });
                
            //         const ownerInfo = mapUser(room.owner);
            //         const adminsIds = room.AdminUsers.map((admin) => admin.user.id);
            //         room.AdminUsers.map((admin) => { mapUser(admin.user)});
            //         const roomInfo: any = {
            //         name: room.roomName,
            //         type: room.roomType,
            //         owner: [ownerInfo],
            //         admins: room.AdminUsers.filter(admin => admin.user.id !== ownerInfo.id ),
            //         members_requests: [],
            //         members: room.members
            //             .filter((member) => member.user.id !== room.owner.id && !adminsIds.includes(member.user.id)) // Exclude owner and admins from members
            //             .map((member) => mapUser(member.user)),
            //         banned_members: room.banedUsers.map((banned) => mapUser(banned.user)),
            //         };
                
            //         return roomInfo;
            //     }
                
                

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        async kickUserfromRoomHTTP(adminId: string, roomId: string, userId: string): Promise<any> {
                let eventName = 'removeMember';
                const room = await this.prisma.chatRoom.findUnique({
                    where: { id: roomId },
                });
        
                if (!room) {
                    throw new NotFoundException('Room does not exist.');
                }
        
                if (room.ownerID === userId) {
                    console.log('111111111111');
                    throw new BadRequestException('Cannot kick the owner of the room.');
                }
                
                const isMember = await this.prisma.member.findFirst({
                    where: {
                        userId: userId,
                        chatRoomId: roomId,
                    },
                });
                
                if (!isMember) {
                    console.log('22222222222');
                    throw new BadRequestException('User is not a member of this room.');
                }
                        
                await this.prisma.member.deleteMany({
                    where: {
                        userId: userId,
                        chatRoomId: roomId,
                    },
                });

                const wasAdmin = await this.prisma.admins.findFirst({
                    where: {
                        userId: userId,
                        roomId: roomId,
                    },
                });

                if (wasAdmin) {
                    eventName = 'removeAdmin';
                    await this.prisma.admins.deleteMany({
                        where: {
                                userId: userId,
                                roomId: roomId,
                        },
                    });
                }

                await this.prisma.banedUsers.deleteMany({
                    where: {
                        userId: userId,
                        roomId: roomId
                    },
                });
                return eventName;
        }


        async banUserInRoomHTTP(adminId: string, roomId: string, bannedId: string): Promise<any> {
                const room = await this.prisma.chatRoom.findUnique({
                    where: { id: roomId },
                });
        
                if (!room) {
                    throw new NotFoundException('Room does not exist.');
                }
        
                if (room.ownerID === bannedId) {
                    throw new BadRequestException('Cannot ban the owner of the room.');
                }
        
                const isMember = await this.prisma.member.findFirst({
                    where: {
                        userId: bannedId,
                        chatRoomId: roomId,
                    },
                });
        
                if (!isMember) {
                    throw new BadRequestException('User is not a member of this room.');
                }
        
                const isAdmin = await this.prisma.admins.findFirst({
                    where: {
                        userId: adminId,
                        roomId: roomId,
                    },
                });
        
                if (!isAdmin) {
                    throw new BadRequestException('You are not an admin in this room.');
                }

                const isBanned = await this.prisma.banedUsers.findFirst({
                    where: {
                        roomId: roomId,
                        userId: bannedId
                    }
                });

                if (isBanned) {
                    throw new BadRequestException('this user already banned.');
                }
        
                await this.prisma.banedUsers.create({
                    data: {
                        userId: bannedId,
                        roomId: roomId,
                    },
                });
        }


        async unbanUserInRoomHTTP(adminId: string, roomId: string, bannedId: string): Promise<string> {
            let role: string = 'member';
            const room = await this.prisma.chatRoom.findUnique({
                where: { id: roomId },
            });
    
            if (!room) {
                throw new NotFoundException('Room does not exist.');
            }
    
            const isMember = await this.prisma.member.findFirst({
                where: {
                    userId: bannedId,
                    chatRoomId: roomId,
                },
            });
    
            if (!isMember) {
                throw new BadRequestException('User is not a member of this room.');
            }

            const isBanned = await this.prisma.banedUsers.findFirst({
                where: {
                    userId: bannedId,
                    roomId: roomId,
                },
            });
    
            if (!isBanned) {
                throw new BadRequestException('User is not banned in this room.');
            }
    
            const isAdmin = await this.prisma.admins.findFirst({
                where: {
                    userId: adminId,
                    roomId: roomId,
                },
            });
    
            if (!isAdmin) {
                throw new BadRequestException('You are not an admin in this room.');
            }

            const isMemberAdmin = await this.prisma.admins.findFirst({
                where: {
                    userId: bannedId,
                    roomId: roomId,
                },
            });

            if (isMemberAdmin) {
                role = 'admin'
            }
    
            await this.prisma.banedUsers.deleteMany({
                where: {
                    userId: bannedId,
                    roomId: roomId,
                },
            });
            return role;
    }


        async addAdminToRoomHTTP(ownerId: string, roomId: string, adminId: string): Promise<void> {

            const isAdmin = await this.isUserAdmin(ownerId, roomId);

            if (!isAdmin) {
                throw new BadRequestException('This user is not an admin in this room');
            }

            const isBanned = await this.prisma.banedUsers.findFirst({
                where: {
                    userId: adminId,
                    roomId: roomId
                }
            });

            console.log(isBanned)
            if (isBanned) {
                throw new BadRequestException('User is Banned in this room');
            }

            const existingAdmin = await this.prisma.admins.findFirst({
                where: {
                    userId: adminId,
                    roomId: roomId,
                },
            });
        
            if (existingAdmin) {
                throw new BadRequestException('User is already an admin in this room');
            }        

            const isMember = await this.prisma.member.findFirst({
                where: {
                    userId: adminId,
                    chatRoomId: roomId,
                },
            });
        
            if (!isMember) {
                throw new BadRequestException('User is not a member of this room');
            }

            await this.prisma.admins.create({
                data: {
                    userId: adminId,
                    roomId: roomId,
                },
            });
        }

        async unsetAdminFromRoomHTTP(ownerId: string, roomId: string, unsetadminId: string): Promise<void> {

            const isAdmin = await this.isUserAdmin(ownerId, roomId);

            if (!isAdmin) {
                console.log('This user is not an admin in this room')
                throw new BadRequestException('This user is not an admin in this room');
            }

            const isBanned = await this.prisma.banedUsers.findFirst({
                where: {
                    userId: unsetadminId,
                    roomId: roomId
                }
            });

            if (isBanned) {
                console.log('User is Banned in this room')
                throw new BadRequestException('User is Banned in this room');
            }

            const existingAdmin = await this.prisma.admins.findFirst({
                where: {
                    userId: unsetadminId,
                    roomId: roomId,
                },
            });
        
            if (!existingAdmin) {
                console.log('User is not an admin in this room')
                throw new BadRequestException('User is not an admin in this room');
            }        

            const isMember = await this.prisma.member.findFirst({
                where: {
                    userId: unsetadminId,
                    chatRoomId: roomId,
                },
            });
        
            if (!isMember) {
                console.log('User is not a member of this room')
                throw new BadRequestException('User is not a member of this room');
            }

            await this.prisma.admins.deleteMany({
                where: {
                    userId: unsetadminId, 
                    roomId: roomId
                }
            });
        }
        async leaveRoomHTTP(data: { userId: string, roomId: string }): Promise<void> {
            const { userId, roomId } = data;
            const isAMember = await this.prisma.member.findFirst({
                where: {
                    AND: [
                        {chatRoomId: roomId}, {userId: userId}, {status: true}
                    ]
                }
            });
            if (!isAMember) {
                throw new BadRequestException('This user is not a member in this room.');
            }
            const isOwner = await this.isRoomOwner(userId, roomId);
            const isAdmin = await this.isUserAdmin(userId, roomId);
            
            await this.removeUserFromRoom(userId, roomId);
    
            if (isOwner) {
                await this.assignNewOwner(userId, roomId);
            }
            
            if (isAdmin) {
                await this.removeUserFromAdmins(userId, roomId);
            }
    
            await this.removeUserFromBannedUsers(userId, roomId);
            await this.removeUserFromMutedUsers(userId, roomId);
    
            const remainingMembers = await this.getRoomMembersCount(roomId);
    
            if (remainingMembers === 0) {
                await this.deleteRoom(roomId);
            }
        }

        async getAllPublicRooms(): Promise<any[]> {
            const publicRooms = await this.prisma.chatRoom.findMany({
                where: {
                    roomType: 'Public',
                },
                select: {
                    roomName: true,
                    ownerID: true,
                    isProtected: true,
                    roomType: true,
                    image: true,
                },
            });
        
            return publicRooms;
        }

        async joinRoomHTTP(newMember: { userId: string, roomId: string, password: string }) {
                const room = await this.findRoomById(newMember.roomId);
                if (!room) {
                    throw new NotFoundException('Room not found');
                }
                // if (room.roomType !== 'public') {
                //     throw new BadRequestException('This room is Private.');
                // }
                const memberCount = await this.prisma.member.count({
                    where: {
                        userId: newMember.userId,
                        chatRoomId: newMember.roomId,
                    },
                });
                if (memberCount > 0){
                    throw new BadRequestException('User is already a member of this room');
                }
                if (room.isProtected === false){
                    await this.addUserToRoom(newMember.roomId, newMember.userId, !(room.roomType === 'private'));
                } else {
                    const isPasswordMatch = await this.compareRoomPassword(room, newMember.password);
                    if (isPasswordMatch) {
                        await this.addUserToRoom(newMember.roomId, newMember.userId, true);
                    } else {
                        throw new BadRequestException('Incorrect room password');
                    }
                }

                let userImages: string[] = [];

                const userData = await this.prisma.user.findUnique({
                    where: {
                        id: newMember.userId,
                    },
                    select: {
                        username: true,
                        avatarUrl: true,
                    },
                });
    
                if (userData) {

                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    userImages = [userData.avatarUrl];
                }

                return room;
        }

        async compareRoomPassword(room: ChatRoom, enteredPassword: string): Promise<any> {
            try {

                // return await bcrypt.compare(enteredPassword, room.password || '');
            } catch (error) {
                throw new InternalServerErrorException('Error comparing room password');
            }
        }

        async hashPassword(password: string): Promise<any> {
            // const hashedPassword = await bcrypt.hash(password, 10);
            // return hashedPassword;
        }

        async createRoomHTTP (createRoom: CreateRoomDto) {
            let newRoom;
            if (createRoom.isProtected){
                const hashedPassword = await this.hashPassword(createRoom.password);;
				newRoom = await this.createRoom({...createRoom, password:hashedPassword});
            } else {
                newRoom = await this.createRoom({...createRoom});
                // if (createRoom.users && createRoom.users.length > 0) {
                //     for (const userId of createRoom.users) {
                //         await this.addUserToRoom(newRoom.id, userId);
                //     }
                // }
            }
            await this.addUserToRoom(newRoom.id, createRoom.ownerID, true);
            await this.addUserAsAdmin(newRoom.id, createRoom.ownerID);
            return newRoom;
        }


        async updateRoomHTTP(roomId: string, userId: string, updateRoom: { roomName: string, password: string, roomType: string, admins: string[] }): Promise<any> {
            let room: any;
            
            const isAMember = await this.prisma.member.findFirst({
                where: {
                    AND: [
                        {chatRoomId: roomId}, {userId: userId}, {status: true}
                    ]
                }
            });


            if (!isAMember) {
                throw new BadRequestException('This user is not a member in this room.');
            }

            const isAAdmin = await this.prisma.admins.findFirst({
                where: {
                    AND: [
                        {roomId: roomId}, {userId: userId}
                    ]
                }
            });

            if (!isAAdmin) {
                throw new BadRequestException('This user is not a admin in this room.');
            }

            // const existingAdmins = await this.prisma.admins.findMany({
            //     where: {
            //     roomId: roomId,
            //     },
            //     select: {
            //     userId: true,
            //     },
            // });
            // const newAdmins = updateRoom.admins.filter(admin => !existingAdmins.some(existingAdmin => existingAdmin.userId === admin));
                
            if (updateRoom.roomType === 'protected') {
                const hashedPassword = await this.hashPassword(updateRoom.password);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                room = await this.prisma.chatRoom.update({
                    where: { id: roomId },
                    data: {
                    roomName: updateRoom.roomName,
                    roomType: updateRoom.roomType,
                    isProtected: true,
                    password: hashedPassword,
                    },
                });
            
                // const newAdmins = updateRoom.admins.filter(admin => !existingAdmins.some(existingAdmin => existingAdmin.userId === admin));
                } else {
                    await this.prisma.chatRoom.update({
                        where: { id: roomId },
                        data: {
                            roomName: updateRoom.roomName,
                            roomType: updateRoom.roomType,
                            isProtected: false,
                            password: '',
                        },
                    });
                    
            
                // Remove existing admins not included in the updated list
                // await this.prisma.admins.deleteMany({
                //     where: {
                //     roomId: roomId,
                //     userId: {
                //         notIn: updateRoom.admins,
                //     },
                //     },
                // });
                }

                // await this.prisma.admins.createMany({
                //     data: newAdmins.map(admin => ({
                //         userId: admin,
                //         roomId: roomId,
                //     })),
                // });
            
                // delete room.password;
                // return room;
                return this.getRoomInfo(roomId, undefined);
            }
            



        private async muteUser(userId: string, roomId: string, duration: number): Promise<void> {
            if (!SharedService.mutedUsers.has(userId)) {
                SharedService.mutedUsers.set(userId, new Map());
            }
    
            const userRooms = SharedService.mutedUsers.get(userId);
            const userUnmuteTimers = userRooms.get(roomId);
    
            if (userUnmuteTimers) {
                clearTimeout(userUnmuteTimers);
            }
    
            const unmuteTimer = setTimeout(() => {
                this.unmuteUser(userId, roomId);
            }, duration * 60 * 1000);
    
            userRooms.set(roomId, unmuteTimer);
        }
    
        private async unmuteUser(userId: string, roomId: string): Promise<void> {
            const userRooms = SharedService.mutedUsers.get(userId);
            if (userRooms && userRooms.has(roomId)) {
                clearTimeout(userRooms.get(roomId));
                userRooms.delete(roomId);
                this.eventEmitter.emit('unMuteMember', {userId: userId, roomId: roomId});
            }
        }
    
        async handleMuteUser( adminId: string ,data: { userId: string, roomId: string, duration : number }): Promise<any> {
            // eslint-disable-next-line prefer-const
            let { userId, roomId, duration } = data;
            const isAAdmin = await this.prisma.admins.findFirst({
                where: {
                    roomId: data.roomId,
                    userId: adminId
                }
            });
            if (!isAAdmin){
                throw new BadRequestException('This user in not an admin in this room');
            }
            const isMember = await this.prisma.member.findFirst({
                where: {
                    userId: userId,
                    chatRoomId: roomId
                }
            });
            if (!isMember){
                throw new BadRequestException('This user in not a member in this room');
            }

            const isBanned = await this.prisma.banedUsers.findFirst({
                where: {
                    userId: userId,
                    roomId: roomId
                }
            });

            if (isBanned) {
                throw new BadRequestException('This user banned in this room.');
            }
            const isAdmin = await this.prisma.admins.findFirst({
                where: {
                    userId,
                    roomId,
                },
            });
            duration = 1;
            this.muteUser(userId, roomId, duration);
            return isAdmin;
        }

        async getRoomData(roomId: string): Promise<any> {
            // Fetch room information including members and messages
            const room = await this.prisma.chatRoom.findUnique({
                where: { id: roomId },
                include: {
                    members: {
                        include: {
                            user: {
                                select: {
                                    avatarUrl: true,
                                }
                            }
                        }
                    },
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1, // Get the latest message
                    }
                }
            });
        
            return {
                roomName: room.roomName,
                members: room.members,
                messages: room.messages,
            };
            }


            async  getUserInfo(userId: string): Promise<any> {
            // Get user data
            const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                Status: true,
                username: true,
                avatarUrl: true,
            },
            });
        
            if (!user) {
                return null; // User not found
            }
        
            // Map user data to desired format
            const userInfo: any = {
                id: user.id,
                status: user.Status,
                name: user.username,
                avatarUrl: user.avatarUrl,
            };
        
            return userInfo;
        }

        async getImageOfUser(userId: string) : Promise<any> {
            const prismaUser = await this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    avatarUrl: true,
                },
            });
            return prismaUser;
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

        async searchUsersByUsername(query: string): Promise<any[]> {
            return this.prisma.user.findMany({
                where: {
                    username: {
                    contains: query,
                    },
                },
            });
        }

        async getImagesOfRoom(roomId: string) {
            const groups = await this.prisma.chatRoom.findUnique({
                where: {
                    id: roomId
                },
                include: {
                    members: {
                        include: {
                            user: true,
                        },
                    },
                },
                });
                return groups.members?.slice(0, 4).map((member) => member.user.avatarUrl)
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
            console.log(groupResults);
            return groupResults;
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

        async AcceptRequestRoomHTTP(adminId: string, roomId: string, userId: string ) {
            const isAdmin = await this.isUserAdmin(adminId, roomId);
            if (!isAdmin) {
                throw new BadRequestException('This user is not admin in this room');
            }

            const isAMember = await this.prisma.member.findFirst({
                where: {
                    AND: [
                        {chatRoomId: roomId}, {userId: userId}, {status: true}
                    ]
                }
            });

            if (isAMember) {
                throw new BadRequestException('This user is already member in this room.');
            }
            await this.prisma.member.update({
                where: {
                    userId_chatRoomId: {
                        userId: userId,
                        chatRoomId: roomId,
                    },
                },
                data: {
                    status: true,
                },
            });
        }

        async declineRequestRoomHTTP(adminId: string, roomId: string, userId: string ) {
            const isAdmin = await this.isUserAdmin(adminId, roomId);
            if (!isAdmin) {
                throw new BadRequestException('This user is not admin in this room');
            }

            const isAMember = await this.prisma.member.findFirst({
                where: {
                    AND: [
                        {chatRoomId: roomId}, {userId: userId}, {status: true}
                    ]
                }
            });

            if (isAMember) {
                throw new BadRequestException('This user is already member in this room.');
            }
            await this.prisma.member.delete({
                where: {
                    userId_chatRoomId: {
                        userId: userId,
                        chatRoomId: roomId,
                    },
                }
            });
        }

        async getInfosOfRoom(roomId: string) {
            return this.prisma.chatRoom.findUnique({
                where :{
                    id: roomId
                }
            })
        }
}