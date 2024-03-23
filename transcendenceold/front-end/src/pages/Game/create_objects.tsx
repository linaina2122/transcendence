import * as THREE from 'three';

import { setup, Ball, } from './objects';

export function rander_ball(){
    const circle = new THREE.CircleGeometry(Ball.radius, Ball.segment);
    const material = new THREE.MeshBasicMaterial({color : 0x000000,  side: THREE.DoubleSide});
    const ball = new THREE.Mesh(circle, material);
    ball.position.set(Ball.positionX,Ball.positionY,0);
    setup.scene.add(ball);
    return (ball);
};

export function puddles(player: any) {
    const rectangle = new THREE.BoxGeometry(player.width, player.height);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    const puddle = new THREE.Mesh(rectangle, material);
    puddle.position.set(player.positionX, player.positionY, 0);
    setup.scene.add(puddle);
    return (puddle)
};