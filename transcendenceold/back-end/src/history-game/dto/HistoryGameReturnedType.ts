
export type Player = {
    id: string;
    username: string;
    score: number;
}

export class HistoryGameReturnedType {
    player1: Player;
    player2: Player;
    timestamp: Date;
}