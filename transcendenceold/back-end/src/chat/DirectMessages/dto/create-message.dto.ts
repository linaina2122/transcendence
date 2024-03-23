/* eslint-disable prettier/prettier */
export class CreateMessageDto {
    senderId: string;
    senderImage: string;
    senderName: string;
    receiverId: string;
    readed: boolean;
    message: string;
    isRoom: boolean;
    roomId?: string;
}