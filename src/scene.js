import { Scene, Vector3, ArcRotateCamera, HemisphericLight, Color3, HavokPlugin, PhysicsAggregate, PhysicsShapeType, HighlightLayer } from "@babylonjs/core";
import { Platform } from "./meshes/platform";
import { InputManager } from "./input/inputManager";
import { createBall } from "./meshes/ball";
import HavokPhysics from "@babylonjs/havok";
import { pawn } from "./meshes/pawn";
import { ImmunityLevel } from "./constants/immunityLevels";
import { HealthState } from "./constants/healthStates";
import { initUIListeners, UISTATE } from "./uiState";
import { executeTurn } from "./turnLogic";
import { pawnArrayState } from "./constants/pawnArrayState";

export async function createScene(engine, canvas, audioManager){

    const scene = new Scene(engine);

    const camera = new ArcRotateCamera(
        "camera",
        0,
        Math.PI / 4,
        30,
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

    const highlightLayer = new HighlightLayer("highlightLayer", scene);

    // const testPawn = new pawn(scene, ImmunityLevel.IMMUNOCOMPROMISED, new Vector3(0,0,0), highlightLayer);

    initUIListeners(scene, highlightLayer);
    
    let lastTurnTime = 0;

    // where to get pawnArray?
    scene.onBeforeRenderObservable.add(() => {

        if (UISTATE.PAUSE || pawnArrayState.PAWN_ARRAY === null) return;
       
        const now = performance.now();
        const timeDelay = 5000 / UISTATE.SPEED;

        if (now - lastTurnTime > timeDelay){
            executeTurn(pawnArrayState.PAWN_ARRAY);
            lastTurnTime = now;
        }
    });

    return scene;
}

