import { Scene, Vector3, ArcRotateCamera, HemisphericLight, Color3, HavokPlugin, PhysicsAggregate, PhysicsShapeType } from "@babylonjs/core";
import { Platform } from "./meshes/platform";
import { InputManager } from "./input/inputManager";
import { createBall } from "./meshes/ball";
import HavokPhysics from "@babylonjs/havok";
import { pawn } from "./meshes/pawn";
import { ImmunityLevel } from "./immunityLevels";

export async function createScene(engine, canvas, audioManager){

    const scene = new Scene(engine);

    // const havokInstance = await HavokPhysics({
    //     locateFile: (file) => {
    //         if (file.endsWith('.wasm')) {
    //             return '/HavokPhysics.wasm';
    //         }
    //         return file;
    //     }
    // });    
    // const havokPlugin = new HavokPlugin(true, havokInstance);
    // scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin);

    const camera = new ArcRotateCamera(
        "camera",
        0,
        0,
        15,
        new Vector3(0,0,0),
        scene
    );

    // commented out to prevent users from interacting with camera
    camera.attachControl(canvas, true);

    const light = new HemisphericLight(
        "light",
        new Vector3(0,1,0),
        scene
    );

    light.intensity = 1;
    light.specular = new Color3(0.3,0.3,0.3);

    // const platform = new Platform( // need to include rotation limits
    //     "platform", // name
    //     10, // width
    //     10, // height
    //     scene, 
    //     Math.PI / 6, // rotationalLimitAlpha
    //     Math.PI / 6 // rotationalLimitBeta
    // );
    // console.log(platform.position);

    // const ball = createBall(scene);
    // const ballAggregate = new PhysicsAggregate(
    //     ball,
    //     PhysicsShapeType.SPHERE,
    //     { mass:1, restitution: 0.2, friction: 0.5},
    //     scene
    // )
    // ball.position.y = 0.6;

    // let hasPlayedFallSound = false;

    // const inputManager = new InputManager(engine, canvas);

    const testPawn = new pawn(scene, ImmunityLevel.NORMAL, new Vector3(0,0,0));
    // console.log(testPawn);

    scene.onBeforeRenderObservable.add(function() {

        // const deltaTime = engine.getDeltaTime() / 1000;
        // // inputManager.updateGamepad();
        // platform.update(inputManager, deltaTime);

        // if (ball.position.y < -5 && hasPlayedFallSound === false){
        //     audioManager.play("fallSound");
        //     hasPlayedFallSound = true;
        // }
    });

    return scene;
}

