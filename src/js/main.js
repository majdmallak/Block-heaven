
import { VoxelWorld } from './world.js';

// Set up the canvas and engine
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Create the voxel world
const voxelWorld = new VoxelWorld(engine);
const scene = voxelWorld.getScene();

// Run the render loop
engine.runRenderLoop(() => {
    scene.render();
});

// Resize the engine when the window resizes
window.addEventListener("resize", () => {
    engine.resize();
});
