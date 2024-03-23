/* eslint-disable prettier/prettier */
export class ConversationDto {
    user: {
        id: string;
        email: string;
        username: string;
        avatarUrl: string;
    };
    unreadCount: number;
}
