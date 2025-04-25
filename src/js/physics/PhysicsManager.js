import BABYLON from '../core/BabylonWrapper.js';

class PhysicsManager {
    constructor(scene) {
        this.scene = scene; // Scène du jeu
    }

    enablePhysics() {
        // Active la physique dans la scène
        this.scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
    }

    addPhysicsImpostor(mesh, impostorType, options) {
        // Ajoute un imposteur physique au mesh
        if (mesh && mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)) {
            mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, impostorType, options, this.scene);
        } else {
            console.warn("Cannot create physics impostor for mesh without vertices or null mesh:", mesh);
        }
    }

    addPhysicsImpostorToHierarchy(mesh, impostorType, options) {
        // Applique la physique au mesh et à tous ses enfants
        if (mesh.getChildMeshes().length > 0) {
            mesh.getChildMeshes().forEach(child => {
                this.addPhysicsImpostor(child, impostorType, options);
            });
        }
        this.addPhysicsImpostor(mesh, impostorType, options);
    }
}

export default PhysicsManager;
