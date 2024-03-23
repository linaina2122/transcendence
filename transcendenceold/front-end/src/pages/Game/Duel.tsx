import * as THREE from 'three'
import { setup, right_player, left_player, Ball, globalVar} from './objects';
import { rander_ball, puddles } from './create_objects';
import { useEffect, useRef, useState } from 'react';
import { ball_animation, endGame } from './BallAlgoDuel';
import { useNavigate } from 'react-router-dom';

function Players(){
    window.addEventListener('keydown',(event)=>{
        if (event.keyCode == 38) {
            
            if (right_player.positionY > setup.Height - ((setup.Height / 2) + globalVar.PuddleHeight / 2))
                right_player.positionY += 0;
            else
                right_player.positionY += (right_player.velocity + right_player.speed);
    }
        else if (event.keyCode === 40) {
            if (right_player.positionY < -1 * (setup.Height - ((setup.Height / 2) + globalVar.PuddleHeight / 2)))
                right_player.positionY += 0 ;
            else
                right_player.positionY -= (right_player.velocity + right_player.speed);
        }
        if (event.keyCode === 87) {
            if (left_player.positionY > setup.Height - ((setup.Height / 2) + globalVar.PuddleHeight / 2))
                left_player.positionY += 0 ;
            else
                left_player.positionY += (left_player.velocity + right_player.speed);
        }
        else if (event.keyCode === 83) {
            if (left_player.positionY < -1 * (setup.Height - ((setup.Height / 2) + globalVar.PuddleHeight / 2)))
                left_player.positionY += 0 ;
            else
                left_player.positionY -= (left_player.velocity + right_player.speed);
        }
    });
}

 function rander(ball: any, L_puddle: any, R_puddle: any) {
    L_puddle.position.set(left_player.positionX, left_player.positionY, 0);
    R_puddle.position.set(right_player.positionX, right_player.positionY, 0);
    ball.position.set(Ball.positionX, Ball.positionY, 0);
    ball_animation();
    setup.renderer.render(setup.scene, setup.camera);
   
    window.addEventListener('resize', () => {
        setup.renderer.domElement.style.width = window.innerWidth + 'px';
        setup.renderer.domElement.style.height = window.innerHeight + 'px';
        setup.camera.aspect = setup.renderer.domElement.clientWidth / setup.renderer.domElement.clientHeight;
        setup.renderer.setSize(setup.renderer.domElement.clientWidth, setup.renderer.domElement.clientHeight);
        setup.camera.updateProjectionMatrix();
    });
}

 export function Duel() {
    right_player.score = 0;
    left_player.score = 0;
    const ref = useRef(null);
    const [end, isEnded] = useState(false);
    const navigate = useNavigate();
    useEffect(()=>{
        setup.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(setup.renderer.domElement);
        setup.scene.add(setup.camera);
        const plan = new THREE.PlaneGeometry(setup.Width, setup.Height);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const cub = new THREE.Mesh(plan, material);
        cub.position.set(0, 0, 0);
        setup.scene.add(cub);
        const ball = rander_ball();
        const R_puddle = puddles(right_player);
        const L_puddle = puddles(left_player);
        Players();
        setup.renderer.setAnimationLoop(() => {
            rander(ball, L_puddle, R_puddle);
            if (endGame() == true)
            {
                isEnded(true);
                setup.renderer.setAnimationLoop(null); 
                navigate(`/play/results/guest/${right_player.score}&${left_player.score}`);
            }
        });
       return () => {
        document.body.removeChild(setup.renderer.domElement);
        setup.scene.remove(cub);
        setup.scene.remove(L_puddle);
        setup.scene.remove(R_puddle);
        setup.scene.remove(ball);
    };
},[end])
return (
    <>
    <div ref={ref}></div>
    </>
  );
};

