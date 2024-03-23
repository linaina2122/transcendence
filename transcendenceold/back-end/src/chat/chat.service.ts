/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { SharedService } from "./shared/shared.service";



@Injectable()
export class ChatService {
    async addUserSocket(userId: string, socketId: string){
        SharedService.AllSockets.push(socketId);
        const openedSocketsOfUser = SharedService.UsersSockets.get(userId);
        if (openedSocketsOfUser)
            SharedService.UsersSockets.set(userId, [ ...openedSocketsOfUser, socketId ]);
        else
            SharedService.UsersSockets.set(userId, [socketId]);
        // console.log(SharedService.UsersSockets.get(userId));
    }

    async removeUserSocket(userId: string, socketId: string) {
        SharedService.AllSockets = SharedService.AllSockets.filter((socket) => socket != socketId,);
        SharedService.UsersSockets.set(
            userId,
            SharedService.UsersSockets.get(userId)?.filter((socket) => socket != socketId,),
        );
    }
    
}