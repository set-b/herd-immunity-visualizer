import { Engine } from "@babylonjs/core/Engines/engine.js";
import { createScene } from "./scene";

const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);
const scene = await createScene(engine, canvas);

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());