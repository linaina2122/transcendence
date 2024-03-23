
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { roomSetting, Id, requestGame} from "./object";
import { Game } from "./Game";
import { checkRequest, forGame , createRoom} from "./requestGame";
import { checkDectonnectin, leaveGame, checkId, checkSocket } from "./checkId";
import { joinRoom } from "./gameManage";

@WebSocketGateway({ cors: '*' })
export class socketGateway {
    @WebSocketServer()
    server: Server;
    constructor() {
        console.log("constructer called");
    }

    handleConnection(client: Socket) {
        console.log("user connected", client.id)
    }
    handleDisconnect(client: Socket) {
        console.log("user disconnected :", client.id)
        checkDectonnectin(this.server, client)

    }
    @SubscribeMessage('onJoinGame')
    onJoinGame(client: Socket, messsage : {userId: string}) {
        console.log("user ID", messsage.userId )
        if(!(checkId(messsage.userId, client)))
            joinRoom(this.server, client)
    }
    @SubscribeMessage('OneVSone')
    OneVSone(client: Socket){
        OneGame(this.server, client);
    }

    @SubscribeMessage('acceptRequest')
    onAccpetRequest(client: Socket, messsage : {userId: string, otherUser : string}) {
        console.log('in acceptRequest:', messsage.userId, messsage.otherUser)
        requestGame.mapId.set(messsage.userId, client.id);
        forGame(messsage.otherUser, client, messsage.userId);
        createRoom(this.server);
    }

    @SubscribeMessage('declineRequest')
    onDeclineRequest(client: Socket, messsage : {userId: string, otherUser : string}) {
        //kkkkkkkkkkk
    }

    @SubscribeMessage('PlayFriend')
    onRequest(client: Socket, messsage : {userId: string}) {
        requestGame.mapId.set(messsage.userId, client.id);
        checkRequest(messsage.userId, client);
    }
}

function OneGame(io : Server, socket:Socket){
    console.log('csOne');
    io.to(socket.id).emit("vsOne", true);
}
