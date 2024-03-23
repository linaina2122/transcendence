import { Game } from "./Game";
import { globalVar, roomSetting, Id , ResultGame, requestGame } from "./object";
import { Server } from "socket.io";
import { HistoryGameType } from '../history-game/dto'


export class Ball {
    game: Game;
    positionX = 0;
    positionY = 0;
    radius = 25;
    segment = 100;
    velocityX = 10;
    velocityY = 10;
    speed = 0.5;

    constructor(game: Game) {
        this.game = game;
    }
    checkCollision(io: Server) {
        if ((this.positionY - this.radius) * -1 > (globalVar.Height / 2) - 5)
            this.velocityY *= -1;
        else if ((this.positionY + this.radius) > (globalVar.Height / 2) - 5)
            this.velocityY *= -1;
        else if (this.positionX < this.game.rPlayer.positionX - 25) {
            console.log("score is :", this.game.lPlayer.score);
            this.game.lPlayer.score += 1;
            io.to(this.game.roomName).emit("Lplayer_score");
            this.resetBall();
        }
        else if (this.positionX > this.game.lPlayer.positionX + globalVar.PuddleWight / 2) {
            this.game.rPlayer.score += 1;
            io.to(this.game.roomName).emit("Rplayer_score");
            console.log("score is :", this.game.rPlayer.score);
            this.resetBall();
        }
    }

    resetBall() {
        this.game.Ball.positionX = 0;
        this.game.Ball.positionY = 0;
        this.velocityX = 10;
        this.velocityY = 10;
    }

    rightPlayer() {
        if (this.positionX > 0) {
            if ((this.positionX + (this.radius)) >= (this.game.lPlayer.positionX - globalVar.PuddleWight / 2) &&
                ((this.positionY <= (this.game.lPlayer.positionY + globalVar.PuddleHeight / 2))
                    && (this.positionY >= this.game.lPlayer.positionY - (globalVar.PuddleHeight / 2)))) {
                this.velocityX += this.speed;
                this.velocityY += this.speed;
                if (this.velocityX > 0)
                    this.velocityX *= -1;
            }
            else if ((this.positionX + this.radius > (this.game.lPlayer.positionX - globalVar.PuddleWight / 2) &&
                (this.positionY - this.radius) <= this.game.lPlayer.positionY + globalVar.PuddleHeight / 2) &&
                (this.positionY >= this.game.lPlayer.positionY)) {
                if (this.velocityY < 0)
                    this.velocityY *= -1;
                if (this.velocityX > 0)
                    this.velocityX *= -1;
            }
            else if (((this.positionX + this.radius > (this.game.lPlayer.positionX - globalVar.PuddleWight / 2) &&
                (this.positionY + this.radius) >= this.game.lPlayer.positionY - globalVar.PuddleHeight / 2)) &&
                (this.positionY <= this.game.lPlayer.positionY)) {
                if (this.velocityY > 0)
                    this.velocityY *= -1;
                if (this.velocityX > 0)
                    this.velocityX *= -1;
            }
        }
    }

    leftPlayer() {
        if (this.positionX < 0) {
            if (((this.positionX - (this.radius)) <= (this.game.rPlayer.positionX + globalVar.PuddleWight / 2) &&
                (this.positionY <= (this.game.rPlayer.positionY + globalVar.PuddleHeight / 2))) &&
                (this.positionY >= this.game.rPlayer.positionY - (globalVar.PuddleHeight / 2))) {
                this.velocityX += this.speed;
                this.velocityY += this.speed;
                if (this.velocityX < 0)
                    this.velocityX *= -1;
            }
            else if ((this.positionX - this.radius < (this.game.rPlayer.positionX + globalVar.PuddleWight / 2)) &&
                (this.positionY - this.radius) <= this.game.rPlayer.positionY + globalVar.PuddleHeight / 2 &&
                (this.positionY >= this.game.rPlayer.positionY)) {
                if (this.velocityY < 0)
                    this.velocityY *= -1;
                if (this.velocityX < 0)
                    this.velocityX *= -1;
            }
            else if ((this.positionX - this.radius < (this.game.rPlayer.positionX + globalVar.PuddleWight / 2) &&
                (this.positionY + this.radius) >= this.game.rPlayer.positionY - globalVar.PuddleHeight / 2) &&
                (this.positionY <= this.game.rPlayer.positionY)) {
                if (this.velocityY > 0)
                    this.velocityY *= -1;
                if (this.velocityX < 0)
                    this.velocityX *= -1;
            }
        }
    }
    checkDeconnection(io: Server, roomName: any) {
        if (this.game.lPlayer.score != 3 && this.game.rPlayer.score != 3) {
            for (const room of (roomSetting.Rooms.keys())) {
                if (room == roomName)
                    return (false);
            }
            for (const room of (requestGame.room.keys())) {
                if (room == roomName)
                    return (false);
            }
            console.log("player disconnected");
            if (this.game.lPlayer.id == roomSetting.loser) {
                this.game.lPlayer.score = 0;
                this.game.rPlayer.score = 3;
                io.to(this.game.roomName).emit("Lplayer_score");
                io.to(this.game.roomName).emit("Rplayer_score");
            }
            else {

                this.game.lPlayer.score = 3;
                this.game.rPlayer.score = 0;
                io.to(this.game.roomName).emit("Rplayer_score");
                io.to(this.game.roomName).emit("Lplayer_score");
            }
            this.clearMap(this.game.roomName)
            return (true);
        }
    }
    WinnerLoser(){
        Id.forEach((value, key) =>{
            if(value == this.game.lPlayer.socket)
                this.game.lPlayer.PlayerId = key;
            if(value == this.game.rPlayer.socket)
                this.game.rPlayer.PlayerId = key;
        })
        if(this.game.lPlayer.score > this.game.rPlayer.score){
            ResultGame.WinnerId = this.game.lPlayer.PlayerId;
            ResultGame.LoserId = this.game.rPlayer.PlayerId;
            ResultGame.ScoreWinner = this.game.lPlayer.score;
            ResultGame.ScoreLoser = this.game.rPlayer.score;
        }
        else{
            ResultGame.WinnerId = this.game.rPlayer.PlayerId;
            ResultGame.LoserId = this.game.lPlayer.PlayerId;
            ResultGame.ScoreWinner = this.game.rPlayer.score;
            ResultGame.ScoreLoser = this.game.lPlayer.score;
        }
    }
    FWinnerLoser(){
            requestGame.mapId.forEach((value, key) =>{
                if(value == this.game.lPlayer.socket)
                    this.game.lPlayer.PlayerId = key;
                if(value == this.game.rPlayer.socket)
                    this.game.rPlayer.PlayerId = key;
            })
            if(this.game.lPlayer.score > this.game.rPlayer.score){
                ResultGame.WinnerId = this.game.lPlayer.PlayerId;
                ResultGame.LoserId = this.game.rPlayer.PlayerId;
                ResultGame.ScoreWinner = this.game.lPlayer.score;
                ResultGame.ScoreLoser = this.game.rPlayer.score;
            }
            else{
                ResultGame.WinnerId = this.game.rPlayer.PlayerId;
                ResultGame.LoserId = this.game.lPlayer.PlayerId;
                ResultGame.ScoreWinner = this.game.rPlayer.score;
                ResultGame.ScoreLoser = this.game.lPlayer.score;
            }
    }
    updatePosition(io: Server) {
        this.positionX += this.velocityX;
        this.positionY += this.velocityY;
        this.checkCollision(io);
        this.leftPlayer();
        this.rightPlayer();
    }
    clearMap(roomName: string) {
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

    start(io: Server) {
        let interval = setInterval(() => {
            this.updatePosition(io)
            this.game.lPlayer.pushToOther();
            this.game.rPlayer.pushToOther();
            io.to(this.game.roomName).emit("startGame2", this.positionX, this.positionY);
            if (this.game.lPlayer.score == 3 || this.game.rPlayer.score == 3
                || (this.checkDeconnection(io, this.game.roomName) == true)) {
                clearInterval(interval);
                console.log("game is finished ");
                const resultGame: HistoryGameType = new HistoryGameType()

                resultGame.winnerId = ResultGame.WinnerId;
                resultGame.loserId = ResultGame.LoserId;
                resultGame.scoreLoser = ResultGame.ScoreLoser;
                resultGame.scoreWinner = ResultGame.ScoreWinner;
                resultGame.startTimeGame = new Date(Date.now())
                console.log(resultGame);
                
                if(this.game.roomName == "friendRoom")
                    this.FWinnerLoser();
                else
                    this.WinnerLoser();
                
                io.to(this.game.roomName).emit("GameResult", ResultGame, true); // resultGame emitted here try to catch it in front
                this.clearMap(this.game.roomName)
                io.sockets.adapter.rooms.delete(this.game.roomName);
                roomSetting.Rooms.delete(this.game.roomName);
                delete (this.game)
            }
        }, 1000 / 30)
    }
};