import BABYLON from '../core/BabylonWrapper.js';

class PlayerLoader {
    constructor(scene) {
        this.scene = scene; // Scène
        this.character = null; // Personnage chargé
    }

    async loadCharacter() {
        // Charge le modèle du personnage
        const result = await BABYLON.SceneLoader.ImportMeshAsync(
          "", 
          "assets/characters/", 
          "manequin.glb", 
          this.scene
        );

        const root = result.meshes.find(m => m.getChildren().length > 0) || result.meshes[0];
      
        this.character = root;
        this.skeleton  = result.skeletons[0];
      
        root.rotationQuaternion = null; // Utilise rotation classique
        root.checkCollisions = true;
        root.ellipsoid = new BABYLON.Vector3(0.8, 1, 0.8);
        root.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0);
        root.position = BABYLON.Vector3.Zero();
        root.scaling = new BABYLON.Vector3(1, 1, 1);

        return {
          mesh: root,
          skeleton: this.skeleton
        };
    }

    setupCharacter() {
        // (Vide - tout est fait dans loadCharacter)
    }
}

export default PlayerLoader;
