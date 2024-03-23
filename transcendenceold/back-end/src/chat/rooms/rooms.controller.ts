/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Delete, UseGuards} from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { RoomDto } from "./dto/room-conv.dto";
import { RoomMessageDto } from "./dto/room-message.dto";
// import { error } from "console";
// import { RolesGuard } from "./guards/roles.guard";
// import { Role } from "./guards/role.enum";
// import { Roles } from "./guards/roles";
import { CreateRoomDto } from "./dto/create-room.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AccessGuard, LoginGuard } from "src/auth/guard";
import { GetUser } from "src/decorators";

@UseGuards(AccessGuard, LoginGuard)
@Controller('room')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService,
        private eventEmitter: EventEmitter2) {}

    @Get('search/')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getSearchResults1(@Param('que') que: string, @GetUser('id') userId: string): Promise<any> {
        try {
            return "";
        } catch (error) {
            return "";
        }
    }

    @Get('search/:que')
    async getSearchResults(@Param('que') que: string, @GetUser('id') userId: string): Promise<any> {
        try {
            return this.roomsService.getSearchResults(que, userId);
        } catch (error) {
            return {users: [], groups:[]};
        }
    }

    // userId for test
    @Get('all/conv/')
    async getRoomsForUser(@GetUser('id') userId: string): Promise<RoomDto[]> {
        return this.roomsService.getRoomsForUser(userId);
    }

    @Get('all/')
    async getAllRoomsForUser(@GetUser('id') userId: string): Promise<RoomDto[]> {
        console.log('all rooms')
        return this.roomsService.getAllRoomsForUser(userId);
    }

    @Get('/:roomId')
    async getRoomInfo(@GetUser('id') userId: string, @Param('roomId') roomId: string): Promise<RoomDto[]> {
        try {
            console.log('get info of a room.')
            const res = await this.roomsService.getRoomInfo(roomId, userId);
            console.log(res);
            return res;
        } catch (error) {
            throw error
        }
    }

    // @UseGuards(RolesGuard)
    // @Roles(Role.Admin, Role.Owner)
    @Post('/:roomId/kick')
    async kickMember(@GetUser('id') userId: string ,@Body() room1: { adminId: string; roomId: string; userId: string })
    {
        console.log('fucking kick')
        try {
            const infoUser = await this.roomsService.getUserInfo(room1.userId);
            const eventName = await this.roomsService.kickUserfromRoomHTTP(room1.adminId, room1.roomId, room1.userId);
            // this.eventEmitter.emit('kickMember', {roomId: room1.roomId, userId: room1.userId});
            this.eventEmitter.emit('roomUpdate', {roomId: room1.roomId, userId: room1.userId, eventName: 'leaveRoom', adminId: room1.adminId});
            return {...infoUser, role: (eventName === 'removeMember' ? 'members' : 'admins')};
        } catch (error) {
            return error.response;
        }
    }

    // @UseGuards(RolesGuard)
    // @Roles(Role.Admin, Role.Owner)
    @Post('/:roomId/accept')
    async acceptRequest(@GetUser('id') userId: string ,@Body() room1: { adminId: string; roomId: string; userTwo: string })
    {
        try {
            const infoUser = await this.roomsService.getUserInfo(room1.userTwo);
            await this.roomsService.AcceptRequestRoomHTTP(room1.adminId, room1.roomId, room1.userTwo);
            const images = await this.roomsService.getImagesOfRoom(room1?.roomId);
            const newRoom = await this.roomsService.getInfosOfRoom(room1?.roomId);
            this.eventEmitter.emit('addRoom', {newRoom, ownerID: room1.userTwo, images});
            return {
                id: infoUser.id,
                images: [infoUser.avatarUrl],
                name: infoUser.name,
            }
        } catch (error) {
            return error.response;
        }
    }

    // @UseGuards(RolesGuard)
    // @Roles(Role.Admin, Role.Owner)
    @Post('/:roomId/decline')
    async declineRequest(@GetUser('id') userId: string ,@Body() room1: { adminId: string; roomId: string; userTwo: string })
    {
        console.log('accept request')
        try {
            const infoUser = await this.roomsService.getUserInfo(room1.userTwo);
            await this.roomsService.declineRequestRoomHTTP(room1.adminId, room1.roomId, room1.userTwo);
            return {
                id: infoUser.id,
                images: [infoUser.avatarUrl],
                name: infoUser.name,
            }
        } catch (error) {
            return error.response;
        }
    }

    // @UseGuards(RolesGuard)
    // @Roles(Role.Owner)
    @Delete(':roomId/delete')
    async removeRoom(@GetUser('id') userId: string,@Body() room: { roomId: string }): Promise<any> {
        try{
            const membersIds = await this.roomsService.removeRoom(room.roomId, userId);
            this.eventEmitter.emit('deleteRoom', room.roomId, membersIds);
            return {statusCode: undefined}
        } catch (error) {
            return {statusCode: 400};
        }
    }

    // @UseGuards(RolesGuard)
    // @Roles(Role.Owner, Role.Admin, Role.Member)
    @Post('/:roomId/leaveROOM')
    async leaveRoom(@Body() data: { userId: string, roomId: string }): Promise<any> {
        try {
            await this.roomsService.leaveRoomHTTP(data);
            this.eventEmitter.emit('roomUpdate', {
                roomId: data.roomId, 
                userId: data.userId, 
                eventName: 'leaveRoom', 
                adminId: undefined
            });
            return {statusCode: undefined};
        } catch (error) {
            return error.response;
        }
    }

    // @UseGuards(RolesGuard)
    // @Roles(Role.Owner)
    @Post('/:roomId/updateRoom')
    async updateRoom(
        @Param('roomId') roomId: string, 
        @GetUser('id') userId: string,
        @Body() updateRoom: {roomName: string, password: string, roomType: string, admins: string[]}) {
        try {
            console.log('updare updare updare updare')
            return await this.roomsService.updateRoomHTTP(roomId, userId, updateRoom);
        } catch (error) {
            return error.response;
        }
	}

    @Get('messages/:roomId')
    async getMessagesForRoom(
        @Param('roomId') roomId: string, @GetUser('id')userId
    ): Promise<RoomMessageDto[]> {
        const response = await this.roomsService.getMessagesInRoom(roomId, userId);
        console.log(response);
        return response;
    }

    @Get('/:roomId/members')
    async getRoomMembers(@GetUser('id') userId: string, @Param('roomId') roomId: string): Promise<any> {
        return this.roomsService.getRoomMembers(roomId);
    }

    // @UseGuards(RolesGuard)
    // @Roles(Role.Admin, Role.Owner)
    @Post('/:roomId/ban')
    async banMember(@Body() room1: { adminId: string; roomId: string; bannedId: string })
    {
        try {
            const infoUser = await this.roomsService.getUserInfo(room1.bannedId);
            console.log(infoUser)
            await  this.roomsService.banUserInRoomHTTP(room1.adminId, room1.roomId, room1.bannedId);
            this.eventEmitter.emit('roomUpdate', {
                roomId: room1.roomId, 
                userId: room1.bannedId, 
                eventName: 'leaveRoom', 
                adminId: undefined
            });
            return {
                id: infoUser.id,
                images: [infoUser.avatarUrl],
                name: infoUser.name
            };
        } catch (error) {
            return error.response;
        }
    }


    // @UseGuards(RolesGuard)
    // @Roles(Role.Admin, Role.Owner)
    @Post('/:roomId/unban')
    async unbanMember(@Body() room1: { adminId: string; roomId: string; unbannedId: string })
    {
        try {
            const infoUser = await this.roomsService.getUserInfo(room1.unbannedId);
            const role = await  this.roomsService.unbanUserInRoomHTTP(room1.adminId, room1.roomId, room1.unbannedId);
            const images = await this.roomsService.getImagesOfRoom(room1?.roomId);
            const newRoom = await this.roomsService.getInfosOfRoom(room1?.roomId);
            this.eventEmitter.emit('addRoom', {newRoom, ownerID: room1.unbannedId, images});
            return {
                id: infoUser.id,
                images: [infoUser.avatarUrl],
                name: infoUser.name,
                role
            };
        } catch (error) {
            return error.response;
        }
    }

    // @UseGuards(RolesGuard)
    // @Roles(Role.Owner)
    @Post('/:roomId/setAdmin')
	async setAdminToRoom(@Body() room: { adminId: string; roomId: string; newAdmin: string }) {
        try {
            console.log('============================== set admin ================================');
            const infoUser = await this.roomsService.getUserInfo(room.newAdmin);
            await this.roomsService.addAdminToRoomHTTP(room.adminId, room.roomId, room.newAdmin);
            return {
                id: infoUser.id,
                images: [infoUser.avatarUrl],
                name: infoUser.name
            };
        } catch (error) {
            return error.response;
        }
    }

    @Post('/:roomId/unsetAdmin')
	async unSetAdminToRoom(@Body() room: { adminId: string; roomId: string; unsetAdmin: string }) {
        try {
            console.log('============================== unset admin ================================');
            console.log(room.unsetAdmin);
            const infoUser = await this.roomsService.getUserInfo(room.unsetAdmin);
            await this.roomsService.unsetAdminFromRoomHTTP(room.adminId, room.roomId, room.unsetAdmin);
            return {
                id: infoUser.id,
                images: [infoUser.avatarUrl],
                name: infoUser.name
            };
        } catch (error) {
            return error.response;
        }
    }

    

    @Get('/getAllPublicRooms')
    async getAllPublicRooms(): Promise<any> {
        try {
            return this.roomsService.getAllPublicRooms();
        } catch (error) {
            throw error;
        }
    }

    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @Post('/joinRoom')
    async joinRoom(@Body() data: { userId: string, roomId: string, password: string }): Promise<any> {
        try {
            console.log('Handle join Room');
            const newRoom = await this.roomsService.joinRoomHTTP(data);
            const images = await this.roomsService.getImagesOfRoom(newRoom?.id);
            if (newRoom.roomType !== 'private'){
                this.eventEmitter.emit('addRoom', {newRoom, ownerID: data.userId, images});
            }
            return newRoom
        } catch (error) {
            return error.response
        }
    }

    
    

    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Post('/createRoom')
    async createRoom(@Body() createRoomDto: CreateRoomDto) {
        try {
            console.log(createRoomDto)
            const newRoom = await this.roomsService.createRoomHTTP(createRoomDto);
            const images = await this.roomsService.getImagesOfRoom(newRoom?.id);
            this.eventEmitter.emit('addRoom', {newRoom, ownerID: createRoomDto.ownerID, images});
            return {statusCode: undefined};
        } catch (error) {
            return error.response;
        }
	}

	// @UseGuards(RolesGuard)
	// @Roles(Role.Owner, Role.Admin)
	@Post('/:roomId/mute')
	async muteUser(@GetUser('id') userId: string, @Body() data: { userId: string, roomId: string, duration : number }) {
        console.log('this line for muted user');            
        try {
            const infoUser = await this.roomsService.getUserInfo(data.userId);
            const role = await this.roomsService.handleMuteUser(userId, data) ? 'admins' : 'members';
            this.eventEmitter.emit('muteMember', {roomId: data.roomId, userMuted: data.userId});
            return {
                id: infoUser.id,
                images: [infoUser.avatarUrl],
                name: infoUser.name,
                role
            };
        } catch (error) {
            return error.response;
        }
	}
}