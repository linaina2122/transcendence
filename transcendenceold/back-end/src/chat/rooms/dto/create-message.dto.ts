/* eslint-disable prettier/prettier */
export class CreateMessageDto {
    senderId: string;
    senderName: string;
    receiverId: string;
    message: string;
    isRoom: boolean;
    roomId?: string;
}