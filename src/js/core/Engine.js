import BABYLON from './BabylonWrapper.js';

class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(this.canvas, true);
        
        // Set the hardware scaling level to 1 to render at full resolution
        this.engine.setHardwareScalingLevel(1);

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
