import { Color3, MeshBuilder, StandardMaterial } from "@babylonjs/core";

export function createBall(scene) {
    const ball = new MeshBuilder.CreateSphere("ball", {size: 1}, scene);
    const ballMaterial = new StandardMaterial("ballMaterial", scene);
    ballMaterial.diffuseColor = Color3.Gray();
    ball.material = ballMaterial;

    return ball;
}