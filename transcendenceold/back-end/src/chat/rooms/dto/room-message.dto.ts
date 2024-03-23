/* eslint-disable prettier/prettier */
export class RoomMessageDto {
    roomId: string;
    createdAt: Date;
    message: string;
    sender: {
        id: string;
        username: string;
    };
    room: {
        id: string;
        roomName: string;
    };
}
