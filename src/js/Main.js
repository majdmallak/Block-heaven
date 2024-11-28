import * as BABYLON from '../node_modules/babylonjs/babylon.js';
import { World } from './World';

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

// Create a scene
const scene = new BABYLON.Scene(engine);

// Add a camera and a light
const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 20, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);

const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

// Add a basic ground
const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);

// Render loop
engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});
