import { createScene } from "./scene";
import { Engine, DeviceSourceManager } from "@babylonjs/core";
import { AudioManager } from "./audio/audioManager";

const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);

const audioManager = await AudioManager.create();

const scene = await createScene(engine, canvas, audioManager);

const deviceSourceManager = new DeviceSourceManager(scene.getEngine);

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());