import BABYLON from '../core/BabylonWrapper.js';

class PlayerCamera {
    constructor(scene, targetMesh, canvas) { // Changed target to targetMesh for clarity
        this.scene = scene;
        this.canvas = canvas; // Canvas might not be needed for FollowCamera controls
        this.camera = new BABYLON.FollowCamera(
            "playerFollowCamera",
            new BABYLON.Vector3(0, 10, -10), // Initial position relative to target
            scene,
            targetMesh // The mesh to follow
        );

        this.setup(targetMesh);
    }

    setup(targetMesh) {
        // The goal distance of camera from target
        this.camera.radius = 13; // Distance from the target
        // The goal height of camera above local origin (centre) of target
        this.camera.heightOffset = 4; // Height above the target's pivot
        // The goal rotation of camera around local origin (centre) of target in x y plane
        this.camera.rotationOffset = 180; // Rotation around the target (180 = directly behind if 0 was front)
        // Reduce acceleration and max speed for smoother/slower follow
        this.camera.cameraAcceleration = 0.02; // Slower acceleration
        this.camera.maxCameraSpeed = 5; // Lower max speed
        // Attach camera controls if needed, but FollowCamera usually doesn't use canvas input directly
        // this.camera.attachControl(this.canvas, true); // Usually not needed for FollowCamera

        // Set the locked target
        this.camera.lockedTarget = targetMesh; // Make sure the camera follows this mesh

        // Enable collisions and gravity for the camera
        this.camera.checkCollisions = true;
        this.camera.applyGravity = true;
        this.camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

        // Set near and far clipping planes
        this.camera.minZ = 0.1;  // Near clipping plane
        this.camera.maxZ = 1000; // Increase far clipping plane

        // Adjust field of view (vertical angle in radians)
        this.camera.fov = 0.8; // Adjust as needed

        // Prevent camera from going below ground level - FollowCamera doesn't have upperBetaLimit
        // We might need other ways to handle this if it becomes an issue.

        // FollowCamera doesn't use these ArcRotateCamera properties:
        // this.camera.lowerRadiusLimit = 5;
        // this.camera.upperRadiusLimit = 20;
        // this.camera.upperBetaLimit = Math.PI / 2.1;
        // this.camera.inertia = 0.7;
        // this.camera.angularSensibilityX = 500;
        // this.camera.angularSensibilityY = 500;
    }
}

export default PlayerCamera;