import BABYLON from './BabylonWrapper.js';

class GameScene {
    constructor(engine) {
        this.scene = new BABYLON.Scene(engine);
        this.scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
        this.scene.collisionsEnabled = true;
        
        this.setupLight();
    }

    setupLight() {
        this.light = new BABYLON.HemisphericLight(
            "light",
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
    }

    loadWorld() {
        BABYLON.SceneLoader.ImportMesh(
            "",
            "assets/worlds/",
            "WORLD.glb",
            this.scene,
            (meshes) => {
                console.log("World loaded successfully");
            }
        );
    }
}

export default GameScene;
