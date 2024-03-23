import { Socket, Server } from "socket.io";
import { roomSetting, Id } from "./object";
import { Game } from "./Game";

export function checkDectonnectin(io: Server, Socket: Socket) {
    const roomInfo = io.sockets.adapter.rooms;
    let RoomName : string;
    for (const [roomName, room] of roomInfo.entries()) {
        if (room.has(Socket.id)) {
            RoomName = roomName;
            Socket.leave(roomName);
            console.log(Socket.id, "leaved ", roomName);
            roomSetting.loser = Socket.id;
            const socketId = Array.from(room);
            for (const socket of socketId) {
                const s = io.sockets.sockets.get(socket);
                if (s) {
                    console.log(s.id, "left ", roomName);
                    roomSetting.winner = s.id;
                    s.leave(roomName);
                }
            }
        }
    }
    clearMap(RoomName);
    leaveGame(RoomName);
}
function clearMap(roomName: string) {
    if(roomSetting.Rooms.has(roomName)){
        for (let socket of roomSetting.Rooms.values()){
            let tmp = socket;
            Id.forEach((value, key) => {
                if(tmp.includes(value)){
                    Id.delete(key);
                }
            });
        }
    }
}
export function leaveGame(roomName){
    for(const room of(roomSetting.Rooms.keys())){
        if(room  == roomName){
            roomSetting.Game.delete(room);
            roomSetting.Rooms.delete(room);
        }
    }
}

export function checkId(cltId : string, client : Socket){
    if(Id.has(cltId))
    {
        console.log("id already exists :", cltId)
        return(1);
    }
    else
        Id.set(cltId, client.id);
    return(0);
}

export function checkSocket(socket: Socket) {
    for (let tmp of roomSetting.Rooms.values()) {
        if (tmp.includes(socket.id))
        return (true)
}
return (false)
}