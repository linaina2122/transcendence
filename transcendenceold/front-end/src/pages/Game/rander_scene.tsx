import * as THREE from 'three'
import { setup, right_player, left_player, Ball, fromBack, globalVar} from './objects';
import { rander_ball, puddles } from './create_objects';
import { useEffect, useRef } from 'react';
import { Player } from './Game';
import { useNavigate } from 'react-router-dom';
import { useConnectedUser } from '../../context/ConnectedContext';

// import testImage from '../img/test.jpeg'

function ball_animation() {
    Ball.positionX = fromBack.posX;
    Ball.positionY = fromBack.posY
}

function rander(ball: any, L_puddle: any, R_puddle: any) {
    L_puddle.position.set(left_player.positionX, left_player.positionY, 0);
    R_puddle.position.set(right_player.positionX, right_player.positionY, 0);
    ball.position.set(Ball.positionX, Ball.positionY, 0);
    // const textureloader = new THREE.TextureLoader();
    // setup.scene.background = textureloader.load(testImage);
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

export function InitSetup() {
    const ref = useRef(null);
    let isRight = false;
    let isLeft = false;
    const navigate = useNavigate();
    const { connectedUser, setConnectedUser } = useConnectedUser();
    useEffect(() => {
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
        Player.on("Puddle2", (data: any) => {
            isRight = data;
            Player.on("left", (data: number) => {
                left_player.positionY = data;
            })
        })
        Player.on("Puddle1", (data: any) => {
            isLeft = data;
            Player.on("right", (data: number) => {
                right_player.positionY = data;
            })
        })
        const handleKeyDown = (event : any) => {
            if (isRight) {
                if (event.keyCode === 38) {
                    if (right_player.positionY > setup.Height - ((setup.Height / 2) + globalVar.PuddleHeight / 2))
                        right_player.positionY += 0;
                    else
                        right_player.positionY += (right_player.velocity + right_player.speed);
                } else if (event.keyCode === 40) {
                    if (right_player.positionY < -1 * (setup.Height - ((setup.Height / 2) + globalVar.PuddleHeight / 2)))
                        right_player.positionY += 0;
                    else
                        right_player.positionY -= (right_player.velocity + right_player.speed);
                }
                Player.emit("rPlayer", {
                    y: right_player.positionY
                });
            }
        
            if (isLeft) {
                if (event.keyCode === 38) {
                    if (left_player.positionY > setup.Height - ((setup.Height / 2) + globalVar.PuddleHeight / 2))
                        left_player.positionY += 0;
                    else
                        left_player.positionY += (left_player.velocity + right_player.speed);
                } else if (event.keyCode === 40) {
                    if (left_player.positionY < -1 * (setup.Height - ((setup.Height / 2) + globalVar.PuddleHeight / 2)))
                        left_player.positionY += 0;
                    else
                        left_player.positionY -= (left_player.velocity + right_player.speed);
                }
                Player.emit("lPlayer", {
                    y: left_player.positionY
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        Player.on("GameResult", (Data : any, data : boolean) =>{
            console.log(Data)
            if(data)
                setup.renderer.setAnimationLoop(null);
            let myScore = connectedUser?.id === Data.WinnerId ? Data.ScoreWinner : Data.ScoreLoser;
            let otherScore = myScore === Data.ScoreWinner ? Data.ScoreLoser : Data.ScoreWinner;
            let otherId = connectedUser?.id === Data.WinnerId ? Data.LoserId : Data.WinnerId;
            navigate(`/play/results/${otherId}/${otherScore}&${myScore}`);
        })
        setup.renderer.setAnimationLoop(() => {
            rander(ball, L_puddle, R_puddle);
            
            //stop randering when game is finished

        });


            return () => {
                Player.off("Puddle2");
                Player.off("Puddle1");
                setup.renderer.setAnimationLoop(null); 
                window.removeEventListener('keydown', handleKeyDown);
                document.body.removeChild(setup.renderer.domElement);
                setup.scene.remove(cub);
                setup.scene.remove(L_puddle);
                setup.scene.remove(R_puddle);
                setup.scene.remove(ball);
        };
    }, [])
    return (
        <div ref={ref}></div>

    );
};
