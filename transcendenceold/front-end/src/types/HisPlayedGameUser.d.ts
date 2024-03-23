
export interface Player {
    id: string;
    username: string;
    score: number;
}

export interface HistoryGameReturnedType {
    player1: Player;
    player2: Player;
    timestamp: string;
}