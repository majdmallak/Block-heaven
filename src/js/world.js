export class VoxelWorld {
    constructor(engine) {
        // Create the Babylon.js scene
        this.scene = new BABYLON.Scene(engine);

        // Add a camera
        this.camera = new BABYLON.ArcRotateCamera(
            "Camera",
            Math.PI / 2,
            Math.PI / 4,
            20,
            new BABYLON.Vector3(0, 0, 0),
            this.scene
        );
        this.camera.attachControl(engine.getRenderingCanvas(), true);

        // Add a light
        const light = new BABYLON.HemisphericLight(
            "HemiLight",
            new BABYLON.Vector3(1, 1, 0),
            this.scene
        );
        const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, this.scene);
        ground.material = new BABYLON.StandardMaterial("GroundMaterial", this.scene);
        ground.material.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6); // Grey ground
        // Create the voxel grid
        this.createVoxelGrid();
    }

    createVoxelGrid() {
        const size = 10; // Grid size (10x10)
        const cubeSize = 1; // Size of each voxel (cube)
        const material = new BABYLON.StandardMaterial("CubeMaterial", this.scene);
        material.diffuseColor = new BABYLON.Color3(0.4, 0.7, 0.2); // Green color
    
        for (let x = 0; x < size; x++) {
            for (let z = 0; z < size; z++) {
                const cube = BABYLON.MeshBuilder.CreateBox(
                    `cube_${x}_${z}`,
                    { size: cubeSize },
                    this.scene
                );
                cube.material = material;
    
                // Randomize the height of the cube
                cube.scaling.y = Math.random() * 2 + 0.5; // Height between 0.5 and 2.5
                cube.position = new BABYLON.Vector3(
                    x - size / 2, // Center the grid
                    (cube.scaling.y - 1) / 2, // Adjust position for height
                    z - size / 2
                );
            }
        }
    }
    

    getScene() {
        return this.scene;
    }
}
