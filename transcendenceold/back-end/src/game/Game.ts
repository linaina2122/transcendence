import { Ball } from "./Ball";
import { Server } from "socket.io";
import { HistoryGameService } from '../history-game/history-game.service'

import { globalVar, roomSetting } from "./object"

export class Game {
    private server: Server
    roomName: string;
    lPlayer: any;
    rPlayer: any;
    Ball: any;

    constructor(io: Server, client: any[], roomName: string) {
        this.server = io;
        this.roomName = roomName;
        this.Ball = new Ball(this);
        this.lPlayer = new left_player(io, client[0], client[1]);
        this.rPlayer = new right_player(io, client[1], client[0]);
    }
}

class right_player {
    server: any;
    socket: any;

    height = 200;
    width = 50;
    positionX = ((globalVar.Width / -2) + 25);
    positionY = 0;
    velocity = 25;
    score = 0;
    PlayerId = '';

    constructor(server: Server, myId: any, otherId: any) {
        this.server = server;
        this.socket = otherId;
        let rPlayer = (data: { y: number }) => {
            this.positionY = data.y;
        }
        let listen = server.sockets.sockets.get(myId);
        listen.on("rPlayer", rPlayer);
    }

    pushToOther() {
        this.server.to(this.socket).emit("right", this.positionY);
    }
};

class left_player {
    server: any;
    socket: any;

    height = 200;
    width = 50;
    positionX = ((globalVar.Width / + 2) - 25);
    positionY = 0;
    velocity = 25;
    score = 0;
    PlayerId = '';

    constructor(server: Server, myId: any, otherId: any) {
        this.server = server;
        this.socket = otherId;
        let lPlayer = (data: { y: number }) => {
            this.positionY = data.y;
        }
        let listen = server.sockets.sockets.get(myId);
        listen.on("lPlayer", lPlayer);
    }
    pushToOther() {
        this.server.to(this.socket).emit("left", this.positionY);
    }
}
