import BABYLON from '../core/BabylonWrapper.js';

class PlayerCamera {
    constructor(scene, targetMesh, canvas) { 
        // Stocke la scène et le canvas
        this.scene = scene;
        this.canvas = canvas; 

        // Crée une caméra qui suit le joueur
        this.camera = new BABYLON.FollowCamera(
            "playerFollowCamera",
            new BABYLON.Vector3(0, 10, -10), // Position initiale de la caméra
            scene,
            targetMesh // Cible que la caméra suit
        );

        this.setup(targetMesh); // Appelle la fonction de configuration
    }

    setup(targetMesh) {
        // Distance entre la caméra et le joueur
        this.camera.radius = 13; 
        
        // Hauteur de la caméra par rapport au joueur
        this.camera.heightOffset = 4; 
        
        // Rotation pour placer la caméra derrière le joueur
        this.camera.rotationOffset = 180; 
        
        // Réglages pour un suivi lent et fluide
        this.camera.cameraAcceleration = 0.02; 
        this.camera.maxCameraSpeed = 5; 

        // Verrouille la caméra sur le joueur
        this.camera.lockedTarget = targetMesh; 

        // Active les collisions et la gravité pour la caméra
        this.camera.checkCollisions = true;
        this.camera.applyGravity = true;
        this.camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

        // Définir les limites de vue (proche et loin)
        this.camera.minZ = 0.1;  
        this.camera.maxZ = 1000; 

        // Définir l'angle de vue (champ de vision vertical)
        this.camera.fov = 0.8; 

        // Note : Pas besoin des propriétés ArcRotateCamera ici
    }
}

export default PlayerCamera;
