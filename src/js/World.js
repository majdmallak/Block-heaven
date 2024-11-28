import * as BABYLON from 'babylonjs';

export class World {
    constructor(engine) {
        this.scene = new BABYLON.Scene(engine);

        // Caméra et Lumière
        this.camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 20, BABYLON.Vector3.Zero(), this.scene);
        this.camera.attachControl(engine.getRenderingCanvas(), true);

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), this.scene);

        // Grille de cubes (sol voxel)
        const size = 10;
        const boxSize = 1;
        const boxMaterial = new BABYLON.StandardMaterial("boxMat", this.scene);
        boxMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.7, 0.3);

        for (let x = -size; x <= size; x++) {
            for (let z = -size; z <= size; z++) {
                const box = BABYLON.MeshBuilder.CreateBox("box", { size: boxSize }, this.scene);
                box.material = boxMaterial;
                box.position = new BABYLON.Vector3(x, -0.5, z);
            }
        }
    }

    getScene() {
        return this.scene;
    }
}