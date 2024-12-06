import BABYLON from '../core/BabylonWrapper.js';

class PlayerLoader {
    constructor(scene) {
        this.scene = scene;
        this.character = null;
    }

    async loadCharacter() {
        return new Promise((resolve) => {
            BABYLON.SceneLoader.ImportMeshAsync(
                "",
                "assets/characters/",
                "manequin.glb",
                this.scene
            ).then((result) => {
                this.character = result.meshes[0];
                this.setupCharacter();
                resolve({
                    mesh: this.character,
                    skeleton: result.skeletons[0]
                });
            });
        });
    }

    setupCharacter() {
        this.character.scaling = new BABYLON.Vector3(1, 1, 1);
        this.character.position = new BABYLON.Vector3(0, 0, 0);
        this.character.checkCollisions = true;
        this.character.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
        this.character.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0);
    }
}

export default PlayerLoader;
