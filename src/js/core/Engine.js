import BABYLON from './BabylonWrapper.js';

class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(this.canvas, true);
        
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }

    startRenderLoop(scene) {
        this.engine.runRenderLoop(() => {
            scene.render();
        });
    }
}

export default GameEngine;
