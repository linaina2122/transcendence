import { Socket, Server } from "socket.io";
import { roomSetting } from "./object";
import { checkSocket } from "./checkId";
import { Game } from "./Game";

export function joinRoom(io: Server, socket: Socket) {
    const roomName = "room" + roomSetting.num;
    const roomInfo = io.sockets.adapter.rooms;
    let game : Game;
    QueueWaiting(socket)
    if (roomSetting.queue.length == 2) {
        const Id: Set<string> = new Set(roomSetting.queue)
        roomInfo.set(roomName, Id)
        roomSetting.Rooms.set(roomName, roomSetting.queue)
        io.to(roomName).emit("StartGame", true)
        console.log("players ready to play in ", roomName)
        game = new Game(io, roomSetting.queue, roomName);
        io.to(roomSetting.queue[0]).emit("Puddle1", true);
        io.to(roomSetting.queue[1]).emit("Puddle2", true);
        roomSetting.Game.set(roomName, game);
        roomSetting.queue = []
        roomSetting.num += 1
        startGame(io, game);
    }
};

function QueueWaiting( socket: Socket) {
    if (roomSetting.queue.includes(socket.id)){
        console.log("this player already exists in waiting room")
        return ;
    }
     if (checkSocket(socket))
        console.log("player already exists in other room")
    else {
        if (roomSetting.queue.length < 3) {
            roomSetting.queue.push(socket.id)
            console.log("id ", socket.id, "is waiting")
        }
    }
}

export function startGame(io: Server, game: Game) {
    game.Ball.start(io)
}