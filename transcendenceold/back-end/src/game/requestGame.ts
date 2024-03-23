import { Socket, Server} from "socket.io";
import { requestGame, Id} from "./object";
import { Game } from "./Game";
import { startGame } from "./gameManage";
export function checkRequest(userId : string , socket : Socket){
    for (const value of Id.values()) {
        if (socket.id == value){
            console.log("You are already queue for a match");
            return;
        }
    }
    requestGame.queue.push(socket.id);
    console.log("id ", requestGame.queue[0], " is waiting for accepting the request");
}

export function forGame(otherUser : string, socket : Socket, userId : string){
    for (const value of Id.values()) {
        if (socket.id == (value)) {
            console.log("You are already queued for a match");
            return;
        }
    }
    for (const [key, value] of requestGame.mapId) {
        if(key == otherUser)
            continue;
        else if (requestGame.queue.length < 2)
            requestGame.queue.push(socket.id);
    }

}
export  function createRoom(io : Server){
    const roomName = "friendRoom"; 
    const roomInfo = io.sockets.adapter.rooms;
    let game : Game;
    const Id: Set<string> = new Set(requestGame.queue);
    roomInfo.set(roomName, Id);
    io.to(roomName).emit("StartGame", true);
    console.log("you are ready to play in ", roomName);
    game = new Game(io, requestGame.queue, roomName);
    console.log('queue:', requestGame.queue);
    io.to(requestGame.queue[0]).emit("Puddle1", true);
    io.to(requestGame.queue[1]).emit("Puddle2", true);
    requestGame.room.set(roomName, game);
    requestGame.queue = [];
    startGame(io, game);
 };
