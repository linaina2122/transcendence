/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ConversationDto } from "./dto/conversation.dto";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User } from "@prisma/client";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DirectMessageDto } from "./dto/direct-message.dto";

@Injectable()
export class MessagesService {
    constructor (private prisma: PrismaService) {}

    async createMessage(createMessageDto: CreateMessageDto) {
        return this.prisma.directMessage.create({
            data: {
                message: createMessageDto.message,
                senderId: createMessageDto.senderId,
                receiverId: createMessageDto.receiverId,
                readed: false
            }
        });
    }

    async isBlocked(blockingId: string, blockedId: string): Promise<boolean> {
        const isBlocked = await this.prisma.blockedUsers.findFirst({
            where: {
                OR: [
                    { blockingId, blockedId },
                    { blockingId: blockedId, blockedId: blockingId },
                ],
            },
        });    
        return !!isBlocked;
    }

    // async getConversation(userId: string): Promise<ConversationDto[]> {
    //     const conversation = await this.prisma.directMessage.findMany({
    //         where: {
    //             OR: [
    //                 { senderId: userId },
    //                 { receiverId: userId },
    //             ],
    //         },
    //         include: {
    //             sender: true,
    //             receiver: true,
    //         },
    //         orderBy: {
    //             createdAt: 'desc'
    //         },
    //     });

    //     const usersMap = new Map<string, User>();
    //     const unreadMessagesCountMap = new Map<string, number>();

    //     conversation.forEach((message) => {
    //         const senderId = message.senderId;
    //         const receiverId = message.receiverId;

    //         if (senderId !== userId && !usersMap.has(senderId)) {
    //             usersMap.set(senderId, message.sender);
    //         } else if (receiverId !== userId && !usersMap.has(receiverId)) {
    //             usersMap.set(receiverId, message.receiver);
    //         }

    //         if (receiverId === userId && !message.readed) {
    //             const count = unreadMessagesCountMap.get(senderId) || 0;
    //             unreadMessagesCountMap.set(senderId, count + 1);
    //         }
    //     });

    //     const uniqueUsersConversation: ConversationDto[] = Array.from(usersMap.values()).map((user) => {
    //         const unreadCount = unreadMessagesCountMap.get(user.id) || 0;
    //         return {
    //             user: {
    //                 email: user.email,
    //                 username: user.username,
    //                 avatarUrl: user.avatarUrl,
    //                 id: user.id
    //             },
    //             unreadCount,
    //         };
    //     });

    //     return uniqueUsersConversation;
    // }

    // async getConversation(userId: string): Promise<any[]> {
    //     const conversation = await this.prisma.directMessage.findMany({
    //         where: {
    //             OR: [
    //                 { senderId: userId },
    //                 { receiverId: userId },
    //             ],
    //         },
    //         include: {
    //             sender: true,
    //             receiver: true,
    //         },
    //         orderBy: {
    //             createdAt: 'desc',
    //         },
    //     });

    //     // console.log(conversation);
    
    //     const usersMap = new Map<string, User>();
    //     const lastMessagesMap = new Map<string, any>();
    //     const unreadMessagesCountMap = new Map<string, number>();
    
    //     // Fetch status for each user in the conversation
    //     const usersIds = Array.from(new Set(conversation.flatMap(message => [message.senderId, message.receiverId])));
    //     const users = await this.prisma.user.findMany({
    //         where: {
    //             id: {
    //                 in: usersIds,
    //             },
    //         },
    //         select: {
    //             id: true,
    //             Status: true,
    //             createdAt: true,
    //             updatedAt: true,
    //             username: true,
    //             email: true,
    //             verifiedEmail: true,
    //             password: true,
    //             avatarUrl: true,
    //             twoFactor: true,
    //         },
    //     });
    
    //     users.forEach(user => usersMap.set(user.id, user));
    
    //     conversation.forEach((message) => {
    //         const senderId = message.senderId;
    //         const receiverId = message.receiverId;
    
    //         if (senderId !== userId && !usersMap.has(senderId)) {
    //             usersMap.set(senderId, message.sender);
    //         } else if (receiverId !== userId && !usersMap.has(receiverId)) {
    //             usersMap.set(receiverId, message.receiver);
    //         }
    
    //         if (receiverId === userId && !message.readed) {
    //             const count = unreadMessagesCountMap.get(senderId) || 0;
    //             unreadMessagesCountMap.set(senderId, count + 1);
    //         }
    
    //         // Store the last message for each user
    //         // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    //         if (!lastMessagesMap.has(senderId) || message.createdAt > lastMessagesMap.get(senderId)?.createdAt!) {
    //             lastMessagesMap.set(senderId, message);
    //         }
    
    //         if (!lastMessagesMap.has(receiverId) || message.createdAt > lastMessagesMap.get(receiverId)?.createdAt) {
    //             lastMessagesMap.set(receiverId, message);
    //         }
    //     });
    
    //     const uniqueUsersConversation: any[] = Array.from(usersMap.values()).map((user) => {
    //         const unreadCount = unreadMessagesCountMap.get(user.id) || 0;
    //         const lastMessage = lastMessagesMap.get(user.id);
    
    //         return {
    //             user: {
    //                 email: user.email,
    //                 username: user.username,
    //                 avatarUrl: user.avatarUrl,
    //                 id: user.id,
    //                 status: user.Status, // Include the status here
    //             },
    //             unreadCount,
    //             lastMessage: lastMessage
    //                 ? {
    //                     id: lastMessage.id,
    //                     createdAt: lastMessage.createdAt,
    //                     message: lastMessage.message,
    //                 }
    //                 : null,
    //         };
    //     });
    
    //     return uniqueUsersConversation;
    // }
    

    // [OK]

    // async getConversation(userId: string): Promise<ConversationDto[]> {
    //     const conversation = await this.prisma.directMessage.findMany({
    //         where: {
    //             OR: [
    //                 { senderId: userId },
    //                 { receiverId: userId },
    //             ],
    //         },
    //         include: {
    //             sender: true,
    //             receiver: true,
    //         },
    //         orderBy: {
    //             createdAt: 'desc',
    //         },
    //     });
    
    //     const usersMap = new Map<string, User>();
    //     // const lastMessagesMap = new Map<string, DirectMessage>();
    //     const lastMessagesMap = new Map<string, any>();
    //     const unreadMessagesCountMap = new Map<string, number>();
    
    //     conversation.forEach((message) => {
    //         const senderId = message.senderId;
    //         const receiverId = message.receiverId;
    
    //         if (senderId !== userId && !usersMap.has(senderId)) {
    //             usersMap.set(senderId, message.sender);
    //         } else if (receiverId !== userId && !usersMap.has(receiverId)) {
    //             usersMap.set(receiverId, message.receiver);
    //         }
    
    //         if (receiverId === userId && !message.readed) {
    //             const count = unreadMessagesCountMap.get(senderId) || 0;
    //             unreadMessagesCountMap.set(senderId, count + 1);
    //         }
    
    //         // Store the last message for each user
    //         // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    //         if (!lastMessagesMap.has(senderId) || message.createdAt > lastMessagesMap.get(senderId)?.createdAt!) {
    //             lastMessagesMap.set(senderId, message);
    //         }
    
    //         // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    //         if (!lastMessagesMap.has(receiverId) || message.createdAt > lastMessagesMap.get(receiverId)?.createdAt!) {
    //             lastMessagesMap.set(receiverId, message);
    //         }
    //     });
    
    //     const uniqueUsersConversation: ConversationDto[] = Array.from(usersMap.values()).map((user) => {
    //         const unreadCount = unreadMessagesCountMap.get(user.id) || 0;
    //         const lastMessage = lastMessagesMap.get(user.id);
    
    //         return {
    //             user: {
    //                 email: user.email,
    //                 username: user.username,
    //                 avatarUrl: user.avatarUrl,
    //                 id: user.id,
    //                 status: user.Status,
    //             },
    //             unreadCount,
    //             lastMessage: lastMessage
    //                 ? {
    //                         id: lastMessage.id,
    //                         createdAt: lastMessage.createdAt,
    //                         message: lastMessage.message,
    //                 }
    //                 : null,
    //         };
    //     });
    
    //     return uniqueUsersConversation;
    // }

//     async getConversation(userId: string): Promise<ConversationDto[]> {
//         // Find friends of the user
//         const friends = await this.prisma.friendship.findMany({
//             where: {
//                 OR: [
//                     { userOne: userId },
//                     { userTwo: userId },
//                 ],
//             },
//             select: {
//                 userOne: true,
//                 userTwo: true,
//             },
//         });
    
//         const friendIds = friends.map(friendship => friendship.userOne === userId ? friendship.userTwo : friendship.userOne);
    
//         // Include the user in the list of friends
//         friendIds.push(userId);
    
//         // Find users (including the user and friends) and their corresponding unread message counts
//         const usersAndUnreadCounts = await this.prisma.user.findMany({
//             where: {
//                 id: {
//                     in: friendIds,
//                 },
//             },
//             include: {
//                 _count: {
//                     select: { receivedMessages: { where: { readed: false } } },
//                 },
//             },
//         });
    
//         const unreadMessagesCountMap = new Map<string, number>();
//         usersAndUnreadCounts.forEach((user) => {
//             // Extract unread message count from the _count field
//             const unreadCount = user._count?.receivedMessages ?? 0;
//             unreadMessagesCountMap.set(user.id, unreadCount);
//         });
    
//         // Find the last message for each user
//         // Find the last message for each user
//         // Fetch all messages
//         const allMessages = await this.prisma.directMessage.findMany({
//             where: {
//                 OR: [
//                     { senderId: { in: friendIds } },
//                     { receiverId: userId },
//                 ],
//             },
//             orderBy: { createdAt: 'desc' },
//         });

//         // Find the last message for each user
//         const lastMessagesMap = new Map<string, any>();
//         allMessages.forEach((message) => {
//             const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
            
//             if (!lastMessagesMap.has(otherUserId)) {
//                 lastMessagesMap.set(otherUserId, message);
//             }
//         });

// // Now lastMessagesMap contains the last message for each user


    
//         const uniqueUsersConversation: ConversationDto[] = usersAndUnreadCounts.map((user) => {
//             const unreadCount = unreadMessagesCountMap.get(user.id) || 0;
//             const lastMessage = lastMessagesMap.get(user.id);
    
//             return {
//                 user: {
//                     email: user.email,
//                     username: user.username,
//                     avatarUrl: user.avatarUrl,
//                     id: user.id,
//                     status: user.Status,
//                 },
//                 unreadCount,
//                 lastMessage: lastMessage
//                     ? {
//                         id: lastMessage.id,
//                         createdAt: lastMessage.createdAt,
//                         message: lastMessage.message,
//                     }
//                     : null,
//             };
//         });
    
//         return uniqueUsersConversation;
//     }


// async getConversation(userId: string): Promise<ConversationDto[]> {
//     // Get all friends of the user
//     const friendships = await this.prisma.friendship.findMany({
//         where: {
//             OR: [
//                 { userOne: userId },
//                 { userTwo: userId },
//             ],
//         },
//     });

//     const friendIds = friendships
//         .flatMap(friendship => [friendship.userOne, friendship.userTwo])
//         .filter(friendId => friendId !== userId); // Exclude the user from friends

//     // Get the conversation between the user and his friends
//     const conversation = await this.prisma.directMessage.findMany({
//         where: {
//             OR: friendIds.map(friendId => ({
//                 OR: [
//                     { senderId: userId, receiverId: friendId },
//                     { senderId: friendId, receiverId: userId },
//                 ],
//             })),
//         },
//         include: {
//             sender: true,
//             receiver: true,
//         },
//         orderBy: {
//             createdAt: 'desc',
//         },
//     });

//     const usersMap = new Map<string, User>();
//     const lastMessagesMap = new Map<string, any>();
//     const unreadMessagesCountMap = new Map<string, number>();

//     conversation.forEach((message) => {
//         const senderId = message.senderId;
//         const receiverId = message.receiverId;

//         if (senderId !== userId && !usersMap.has(senderId)) {
//             usersMap.set(senderId, message.sender);
//         } else if (receiverId !== userId && !usersMap.has(receiverId)) {
//             usersMap.set(receiverId, message.receiver);
//         }

//         if (receiverId === userId && !message.readed) {
//             const count = unreadMessagesCountMap.get(senderId) || 0;
//             unreadMessagesCountMap.set(senderId, count + 1);
//         }

//         // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
//         if (!lastMessagesMap.has(senderId) || message.createdAt > lastMessagesMap.get(senderId)?.createdAt!) {
//             lastMessagesMap.set(senderId, message);
//         }

//         // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
//         if (!lastMessagesMap.has(receiverId) || message.createdAt > lastMessagesMap.get(receiverId)?.createdAt!) {
//             lastMessagesMap.set(receiverId, message);
//         }
//     });

//     const uniqueUsersConversation: ConversationDto[] = Array.from(usersMap.values()).map((user) => {
//         const unreadCount = unreadMessagesCountMap.get(user.id) || 0;
//         const lastMessage = lastMessagesMap.get(user.id);

//         return {
//             user: {
//                 email: user.email,
//                 username: user.username,
//                 avatarUrl: user.avatarUrl,
//                 id: user.id,
//                 status: user.Status,
//             },
//             unreadCount,
//             lastMessage: lastMessage
//                 ? {
//                         id: lastMessage.id,
//                         createdAt: lastMessage.createdAt,
//                         message: lastMessage.message,
//                 }
//                 : null,
//         };
//     });

//     return uniqueUsersConversation;
// }

async getConversation(userId: string): Promise<ConversationDto[]> {
    const friends = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { userOne: userId },
          { userTwo: userId },
        ],
      },
    });
  
    const conversations: ConversationDto[] = await Promise.all(
      friends.map(async (friendship) => {
        const otherUserId = friendship.userOne === userId ? friendship.userTwo : friendship.userOne;
        const otherUser = await this.prisma.user.findUnique({
          where: { id: otherUserId },
          select: {
            id: true,
            email: true,
            username: true,
            avatarUrl: true,
            Status: true,
          },
        });
  
        if (!otherUser) {
          throw new Error(`User with id ${otherUserId} not found`);
        }
  
        const conversation = await this.prisma.directMessage.findMany({
          where: {
            OR: [
              { senderId: userId, receiverId: otherUserId },
              { senderId: otherUserId, receiverId: userId },
            ],
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            sender: true,
            receiver: true,
          },
        });
  
        const unreadCount = conversation.filter((message) => message.receiverId === userId && !message.readed).length;
  
        const lastMessage = conversation.length > 0 ? {
          id: conversation[0].id,
          createdAt: conversation[0].createdAt,
          message: conversation[0].message,
        } : null;
  
        return {
          user: {
            id: otherUser.id,
            email: otherUser.email,
            username: otherUser.username,
            avatarUrl: otherUser.avatarUrl,
            status: otherUser.Status,
          },
          unreadCount,
          lastMessage,
        };
      })
    );
  
    return conversations;
  }
  
  
  
  


    
    
    

    // async getConversation(userId: string): Promise<ConversationDto[]> {
    //     const conversation = await this.prisma.directMessage.findMany({
    //         where: {
    //             OR: [
    //                 { senderId: userId },
    //                 { receiverId: userId },
    //             ],
    //         },
    //         include: {
    //             sender: true,
    //             receiver: true,
    //         },
    //         orderBy: {
    //             createdAt: 'desc',
    //         },
    //     });
    
    //     const usersMap = new Map<string, User>();
    //     const unreadMessagesCountMap = new Map<string, number>();
    
    //     const uniqueUsersConversation: ConversationDto[] = conversation.map((message) => {
    //         const senderId = message.senderId;
    //         const receiverId = message.receiverId;
    
    //         if (senderId !== userId && !usersMap.has(senderId)) {
    //             usersMap.set(senderId, message.sender);
    //         } else if (receiverId !== userId && !usersMap.has(receiverId)) {
    //             usersMap.set(receiverId, message.receiver);
    //         }
    
    //         if (receiverId === userId && !message.readed) {
    //             const count = unreadMessagesCountMap.get(senderId) || 0;
    //             unreadMessagesCountMap.set(senderId, count + 1);
    //         }
    
    //         const lastMessageSender = message.sender;
    //         const lastMessageReceiver = message.receiver;
    
    //         const lastMessage = message; // DirectMessage itself is the last message
    //         const lastMessageContent = lastMessage?.message || '';
    
    //         return {
    //             user: {
    //                 email: lastMessageSender?.email || lastMessageReceiver?.email || '',
    //                 username: lastMessageSender?.username || lastMessageReceiver?.username || '',
    //                 avatarUrl: lastMessageSender?.avatarUrl || lastMessageReceiver?.avatarUrl || '',
    //                 id: lastMessageSender?.id || lastMessageReceiver?.id || '',
    //             },
    //             unreadCount: unreadMessagesCountMap.get(senderId) || 0,
    //             lastMessage: lastMessageContent,
    //         };
    //     });
    
    //     return uniqueUsersConversation;
    // }
    
    

    // async getMessagesBetweenUsers(user1Id: string, user2Id: string): Promise<DirectMessageDto[]> {
    //     const messages = await this.prisma.directMessage.findMany({
    //         where: {
    //             OR: [
    //                 { AND: [{ senderId: user1Id }, { receiverId: user2Id }] },
    //                 { AND: [{ senderId: user2Id }, { receiverId: user1Id }] },
    //             ],
    //         },
    //         orderBy: {
    //             createdAt: 'asc',
    //         },
    //         include: {
    //             sender: {
    //                 select: {
    //                     id: true,
    //                     username: true,
    //                     avatarUrl: true,
    //                 },
    //             },
    //             receiver: {
    //                 select: {
    //                     id: true,
    //                     username: true,
    //                 },
    //             },
    //         },
    //     });
    
    //     const user2ToUser1Messages = messages.filter(
    //         (message) => message.senderId === user2Id && message.receiverId === user1Id
    //     );

    //     if (user2ToUser1Messages.length > 0) {
    //         const updatedMessages = user2ToUser1Messages.map((message) => ({
    //             ...message,
    //             readed: true,
    //         }));

    //         await this.prisma.directMessage.updateMany({
    //             where: {
    //                 id: {
    //                     in: updatedMessages.map((msg) => msg.id),
    //                 },
    //             },
    //             data: {
    //                 readed: true,
    //             },
    //         });
    //     }
    
    //     const formattedMessages: DirectMessageDto[] = messages.map((message) => {
    //         return {
    //             id: message.id,
    //             createdAt: message.createdAt,
    //             message: message.message,
    //             sender: {
    //                 id: message.sender.id,
    //                 username: message.sender.username,
    //                 avatarUrl: message.sender.avatarUrl,
    //             },
    //             receiver: {
    //                 id: message.receiver.id,
    //                 username: message.receiver.username,
    //             },
    //         };
    //     });
    
    //     return formattedMessages;
    // }

    // async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<DirectMessageDto[]> {
    //     const messages = await this.prisma.directMessage.findMany({
    //         where: {
    //             OR: [
    //                 { AND: [{ senderId: userId1 }, { receiverId: userId2 }] },
    //                 { AND: [{ senderId: userId2 }, { receiverId: userId1 }] },
    //             ],
    //         },
    //         orderBy: {
    //             createdAt: 'asc',
    //         },
    //         include: {
    //             sender: {
    //                 select: {
    //                     id: true,
    //                     username: true,
    //                     avatarUrl: true,
    //                 },
    //             },
    //             receiver: {
    //                 select: {
    //                     id: true,
    //                     username: true,
    //                     avatarUrl: true,
    //                 },
    //             },
    //         },
    //     });
    
    //     const formattedMessages: any[] = messages.map((message) => {
    //         const isSender = message.senderId === userId1;
    //         const user = isSender ? message.sender : message.receiver;
    
    //         return {
    //             userType: isSender ? 'sender' : 'receiver',
    //             username: message.sender.username, // Use sender's username
    //             timestamp: message.createdAt,
    //             message: message.message,
    //             image: user.avatarUrl,
    //         };
    //     });
    
    //     return formattedMessages;
    // }


    // async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<DirectMessageDto[]> {
    //     const messages = await this.prisma.directMessage.findMany({
    //         where: {
    //             OR: [
    //                 { AND: [{ senderId: userId1 }, { receiverId: userId2 }] },
    //                 { AND: [{ senderId: userId2 }, { receiverId: userId1 }] },
    //             ],
    //         },
    //         orderBy: {
    //             createdAt: 'asc',
    //         },
    //         include: {
    //             sender: {
    //                 select: {
    //                     id: true,
    //                     username: true,
    //                     avatarUrl: true,
    //                     Status: true, // Include status for sender
    //                 },
    //             },
    //             receiver: {
    //                 select: {
    //                     id: true,
    //                     username: true,
    //                     avatarUrl: true,
    //                     Status: true, // Include status for receiver
    //                 },
    //             },
    //         },
    //     });
    
    //     const formattedMessages: any[] = messages.map((message) => {
    //         const isSender = message.senderId === userId1;
    //         const user = isSender ? message.sender : message.receiver;
    //         const otherUser = isSender ? message.receiver : message.sender;
    
    //         return {
    //             userType: isSender ? 'sender' : 'receiver',
    //             username: user.username,
    //             timestamp: message.createdAt,
    //             message: message.message,
    //             image: user.avatarUrl,
    //             status: otherUser.Status, // Include the status of the other user
    //         };
    //     });
    
    //     return formattedMessages;
    // }


    // async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<DirectMessageDto[]> {
    //     const messages = await this.prisma.directMessage.findMany({
    //         where: {
    //             OR: [
    //                 { AND: [{ senderId: userId1 }, { receiverId: userId2 }] },
    //                 { AND: [{ senderId: userId2 }, { receiverId: userId1 }] },
    //             ],
    //         },
    //         orderBy: {
    //             createdAt: 'asc',
    //         },
    //         include: {
    //             sender: {
    //                 select: {
    //                     id: true,
    //                     username: true,
    //                     avatarUrl: true,
    //                     Status: true, // Include status for sender
    //                 },
    //             },
    //             receiver: {
    //                 select: {
    //                     id: true,
    //                     avatarUrl: true,
    //                     Status: true, // Include status for receiver
    //                 },
    //             },
    //         },
    //     });
    
    //     const formattedMessages: any[] = messages.map((message) => {
    //         const isSender = message.senderId === userId1;
    //         const user = isSender ? message.sender : message.receiver;
    //         const otherUser = isSender ? message.receiver : message.sender;
    
    //         return {
    //             userType: isSender ? 'sender' : 'receiver',
    //             username: message.sender.username, // Corrected to use sender's username
    //             timestamp: message.createdAt,
    //             message: message.message,
    //             image: user.avatarUrl,
    //             status: otherUser.Status, // Include the status of the other user
    //         };
    //     });
    
    //     return formattedMessages;
    // }
    
    
    // async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<DirectMessageDto[]> {
    //     const messages = await this.prisma.directMessage.findMany({
    //         where: {
    //             OR: [
    //                 { AND: [{ senderId: userId1 }, { receiverId: userId2 }] },
    //                 { AND: [{ senderId: userId2 }, { receiverId: userId1 }] },
    //             ],
    //         },
    //         orderBy: {
    //             createdAt: 'asc',
    //         },
    //         include: {
    //             sender: {
    //                 select: {
    //                     id: true,
    //                     username: true,
    //                     avatarUrl: true,
    //                     Status: true, // Include status for sender
    //                 },
    //             },
    //             receiver: {
    //                 select: {
    //                     id: true,
    //                     username: true,
    //                     avatarUrl: true,
    //                     Status: true, // Include status for receiver
    //                 },
    //             },
    //         },
    //     });
    
    //     const user2 = await this.prisma.user.findUnique({
    //         where: {
    //             id: userId2,
    //         },
    //         select: {
    //             id: true,
    //             username: true,
    //             avatarUrl: true,
    //             Status: true,
    //         },
    //     });
    
    //     const formattedMessages: any[] = messages.map((message) => {
    //         const isSender = message.senderId === userId1;
    //         const user = isSender ? message.sender : message.receiver;
    //         const otherUser = isSender ? message.receiver : message.sender;
    
    //         return {
    //             userType: isSender ? 'sender' : 'receiver',
    //             username: message.sender.username, // Corrected to use sender's username
    //             otherUsername: user2.username, // Include username of userId2
    //             timestamp: message.createdAt,
    //             message: message.message,
    //             image: user.avatarUrl,
    //             status: otherUser.Status, // Include the status of the other user
    //         };
    //     });
    
    //     return formattedMessages;
    // }

    async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<any> {
        const messages = await this.prisma.directMessage.findMany({
            where: {
                OR: [
                    { AND: [{ senderId: userId1 }, { receiverId: userId2 }] },
                    { AND: [{ senderId: userId2 }, { receiverId: userId1 }] },
                ],
            },
            orderBy: {
                createdAt: 'asc',
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                        Status: true, // Include status for sender
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                        Status: true, // Include status for receiver
                    },
                },
            },
        });
    
        const [user2, user1] = await Promise.all([
            this.prisma.user.findUnique({
                where: {
                    id: userId2,
                },
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                    Status: true,
                },
            }),
            this.prisma.user.findUnique({
                where: {
                    id: userId1,
                },
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                    Status: true,
                },
            }),
        ]);
    
        const formattedMessages: any[] = messages.map((message) => {
            const isSender = message.senderId === userId1;
            const user = isSender ? user1 : user2;
            const otherUser = isSender ? user2 : user1;
    
            return {
                userType: isSender ? 'sender' : 'receiver',
                username: user.username,
                otherUsername: otherUser.username,
                timestamp: message.createdAt,
                message: message.message,
                image: user.avatarUrl,
                otherImage: otherUser.avatarUrl, // Include avatar image of other user
                status: otherUser.Status.toString().toLowerCase(),
            };
        });

        const haha = {
            conversationInfos: {
                    type: 'person',
                    username: user2.username,
                    status :user2.Status,
                    id:user2.id,
                    images: [user2.avatarUrl]
            },
            chatMessages: formattedMessages
        }
    
        return haha;
    }
    
    
    async getImageByUserId(userId: string): Promise<string | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                avatarUrl: true,
            },
        });
    
        if (user) {
            return user.avatarUrl || null;
        } else {
            return null; // Handle the case where the user with the given ID is not found
        }
    }    
    
}