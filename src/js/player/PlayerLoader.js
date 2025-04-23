import BABYLON from '../core/BabylonWrapper.js';

class PlayerLoader {
    constructor(scene) {
        this.scene = scene;
        this.character = null;
    }

    async loadCharacter() {
        const result = await BABYLON.SceneLoader.ImportMeshAsync(
          "", 
          "assets/characters/", 
          "manequin.glb", 
          this.scene
        );
      
        // find the actual root transform node (usually meshes[0] is an empty container)
        const root = result.meshes.find(m => m.getChildren().length > 0) || result.meshes[0];
      
        this.character = root;
        this.skeleton  = result.skeletons[0];
      
        // make sure we’re using Euler rotation (not quaternion) so setting .rotation works
        root.rotationQuaternion = null;
      
        // collision / ellipsoid setup
        root.checkCollisions      = true;
        // Increase ellipsoid radius slightly more
        root.ellipsoid            = new BABYLON.Vector3(0.8, 1, 0.8); // Increased X and Z radius
        root.ellipsoidOffset      = new BABYLON.Vector3(0, 1, 0); // Keep offset the same for now
      
        // position & scale
        root.position = BABYLON.Vector3.Zero();
        root.scaling  = new BABYLON.Vector3(1, 1, 1);
      
        return {
          mesh:     root,
          skeleton: this.skeleton
        };
      }
      
    setupCharacter() {
        // This setup is already done in loadCharacter after finding the root mesh.
        // Keeping it might cause issues if this.character isn't the root mesh.
        // Consider removing this method.
    }
}

export default PlayerLoader;
