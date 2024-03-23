/* eslint-disable prettier/prettier */
export class DirectMessageDto {
    id: string;
    createdAt: Date;
    message: string;
    sender: {
        id: string;
        username: string;
        avatarUrl: string;
    };
    receiver: {
        id: string;
        username: string;
    };
}