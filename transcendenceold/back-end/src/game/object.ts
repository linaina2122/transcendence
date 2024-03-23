import { Socket } from "socket.io";
import { Game } from "./Game";
export let roomSetting = {
    num: 1,
    Rooms: new Map<string, string[]>(),
    Id: [],
    queue: [],
    room : new Map<string, string>(),
    Game : new Map<string, Game>(),
    loser : '',
    winner : ''
};

export let ResultGame = {
    WinnerId : '',
    LoserId : '',
    ScoreWinner : 0,
    ScoreLoser : 0
};
export let requestGame = {
    queue : [],
    room : new Map<string, Game>(),
    mapId : new Map<string, string>([["key", "value"], ["key", "value"]])
};

export let Id = new Map<string, string>();

export const globalVar = {
    Width: 1600,
    Height: 600,
    PuddleHeight : 200,
    PuddleWight : 50
};
 