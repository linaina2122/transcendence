import { Ball, globalVar, right_player, left_player } from "./objects";

export function endGame(){
   if(left_player.score == 3 || right_player.score == 3)
       return true;
}
function checkCollision(){
    if ((Ball.positionY - Ball.radius) * -1 > (globalVar.Height / 2) - 5)
        Ball.velocityY *= -1;
    else if ((Ball.positionY + Ball.radius)  > (globalVar.Height / 2) - 5)
        Ball.velocityY *= -1;
    else if (Ball.positionX < right_player.positionX - 25 ){
        console.log("score is :", left_player.score);
        left_player.score += 1;
            resetBall();
    }
    else if (Ball.positionX > left_player.positionX  + globalVar.PuddleWight / 2 ){
        right_player.score += 1;
        console.log("score is :", right_player.score);
            resetBall();
    }
}
function resetBall(){
    Ball.positionX = 0;
    Ball.positionY = 0;
    Ball.velocityX = 10;
    Ball.velocityY = 10;
}
 function rightPlayer(){
    if(Ball.positionX > 0) {
        if ((Ball.positionX + (Ball.radius))  >= (left_player.positionX - globalVar.PuddleWight / 2) &&
            ((Ball.positionY <= (left_player.positionY + globalVar.PuddleHeight / 2))
            && (Ball.positionY >= left_player.positionY - (globalVar.PuddleHeight / 2)))){
                Ball.velocityX += Ball.speed;
                Ball.velocityY += Ball.speed;
                if (Ball.velocityX > 0)
                    Ball.velocityX *= -1 ;
        }
        else if ((Ball.positionX + Ball.radius > (left_player.positionX - globalVar.PuddleWight / 2)  &&  
        (Ball.positionY - Ball.radius) <= left_player.positionY + globalVar.PuddleHeight / 2) &&
        (Ball.positionY >= left_player.positionY)){
            if (Ball.velocityY < 0) 
                Ball.velocityY *= -1;
            if (Ball.velocityX > 0)
                Ball.velocityX *= -1;
        }
        else if (((Ball.positionX + Ball.radius > (left_player.positionX - globalVar.PuddleWight / 2) &&  
        (Ball.positionY + Ball.radius) >= left_player.positionY - globalVar.PuddleHeight / 2)) &&
        (Ball.positionY <= left_player.positionY)){
            if (Ball.velocityY > 0)
                Ball.velocityY *= -1;
            if (Ball.velocityX > 0)
                Ball.velocityX *= -1;
        }
    }
}
function leftPlayer(){
    if(Ball.positionX < 0) {
        if (((Ball.positionX - (Ball.radius))  <= (right_player.positionX + globalVar.PuddleWight / 2) &&
        (Ball.positionY <= (right_player.positionY + globalVar.PuddleHeight / 2))) &&
        (Ball.positionY >= right_player.positionY - (globalVar.PuddleHeight / 2))){
            Ball.velocityX += Ball.speed;
            Ball.velocityY += Ball.speed; 
            if (Ball.velocityX < 0)
                Ball.velocityX *= -1 ;
        }
        else if ((Ball.positionX - Ball.radius < (right_player.positionX + globalVar.PuddleWight / 2)) &&  
        (Ball.positionY - Ball.radius) <= right_player.positionY + globalVar.PuddleHeight / 2 &&
        (Ball.positionY >= right_player.positionY)){
            if (Ball.velocityY < 0)
                Ball.velocityY *= -1;
            if (Ball.velocityX < 0)
                Ball.velocityX *= -1;
        }
        else if ((Ball.positionX - Ball.radius < (right_player.positionX + globalVar.PuddleWight / 2) &&  
        (Ball.positionY + Ball.radius) >= right_player.positionY - globalVar.PuddleHeight / 2) &&
        (Ball.positionY <= right_player.positionY)){
            if (Ball.velocityY > 0)
                Ball.velocityY *= -1;
            if (Ball.velocityX < 0)
                Ball.velocityX *= -1;
        }
    }
}
export function ball_animation(){
    Ball.positionX += Ball.velocityX;
    Ball.positionY += Ball.velocityY;
    checkCollision();
    rightPlayer();
    leftPlayer();
}
