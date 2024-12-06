import BABYLON from '../core/BabylonWrapper.js';

class PlayerCamera {
    constructor(scene, target, canvas) {
        this.scene = scene;
        this.canvas = canvas;
        this.camera = new BABYLON.ArcRotateCamera(
            "camera",
            BABYLON.Tools.ToRadians(180),
            BABYLON.Tools.ToRadians(75),
            10,
            target || new BABYLON.Vector3(0, 0, 0),
            scene
        );

        this.setup();
    }

    setup() {
        this.camera.attachControl(this.canvas, true);
        this.camera.lowerRadiusLimit = 5;
        this.camera.upperRadiusLimit = 20;
        
        // Prevent camera from going below ground level
        this.camera.upperBetaLimit = Math.PI / 2.1;
        
        // Make camera movement smoother
        this.camera.inertia = 0.7;
        this.camera.angularSensibilityX = 500;
        this.camera.angularSensibilityY = 500;
    }

    updateTarget(target) {
        this.camera.target = target;
    }
}

export default PlayerCamera;
