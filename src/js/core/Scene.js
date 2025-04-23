import BABYLON from './BabylonWrapper.js';

class GameScene {
    constructor(engine) {
        this.scene = new BABYLON.Scene(engine);
        this.scene.gravity = new BABYLON.Vector3(0, -0.981, 0); // Using standard gravity
        this.scene.collisionsEnabled = true;

        // --- Dreamland Atmosphere Setup ---
        // 1. Set Clear Color (Background) - A soft purple/pink
        this.scene.clearColor = new BABYLON.Color4(0.8, 0.6, 0.9, 1.0); // RGBA

        // 2. Add Fog - Pinkish/Purple Fog
        this.scene.fogEnabled = false; // Disable fog
        // this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP; // Exponential fog looks dreamy
        // this.scene.fogColor = new BABYLON.Color3(0.9, 0.7, 0.95); // Fog color
        // this.scene.fogDensity = 0.0015; // Adjust density for desired effect (lower = less dense)

        // 3. Setup Lighting (Adjusted for Dreamland)
        this.setupLight();

        // Optional: Add a Skybox later if needed for more detail
        // this.setupSkybox(); 
    }

    setupLight() {
        this.light = new BABYLON.HemisphericLight(
            "dreamLight", // Renamed light
            new BABYLON.Vector3(0.5, 1, 0.5), // Direction slightly angled
            this.scene
        );

        // --- Adjust Light Colors for Dreamland Theme ---
        // Sky color (diffuse) - Light pink/lavender
        this.light.diffuse = new BABYLON.Color3(1, 0.85, 0.95);
        // Ground color (ambient reflection) - Deeper purple/blue
        this.light.groundColor = new BABYLON.Color3(0.4, 0.3, 0.6);
        
        this.light.intensity = 0.9; // Adjust intensity as needed
    }

    loadWorld() {
        return new Promise((resolve) => {
            BABYLON.SceneLoader.ImportMesh(
                "",
                "assets/worlds/",
                "WORLD.glb", // Ensure this is the correct filename
                this.scene,
                (meshes) => {
                    console.log("World loaded successfully");

                    // Store room meshes
                    const rooms = {
                        North: { ground: null, walls: [] },
                        South: { ground: null, walls: [] },
                        East: { ground: null, walls: [] },
                        West: { ground: null, walls: [] }
                    };

                    // Create a black material (used for initial state)
                    const blackMaterial = new BABYLON.StandardMaterial("blackMaterial", this.scene);
                    blackMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                    blackMaterial.specularColor = new BABYLON.Color3(0, 0, 0); // Remove shininess

                    meshes.forEach(mesh => {
                        if (mesh instanceof BABYLON.Mesh) {
                            mesh.checkCollisions = true; // Ensure collisions are enabled

                            // Apply initial black material to walls and grounds based on naming convention
                            if (mesh.name.startsWith("north-wall") || mesh.name === "northGround") {
                                mesh.material = blackMaterial;
                                if (mesh.name === "northGround") rooms.North.ground = mesh;
                                else rooms.North.walls.push(mesh);
                                console.log(`Assigned black material to ${mesh.name}`); 
                            } else if (mesh.name.startsWith("south-wall") || mesh.name === "southGround") { // Corrected check
                                mesh.material = blackMaterial;
                                if (mesh.name === "southGround") rooms.South.ground = mesh;
                                else rooms.South.walls.push(mesh);
                                console.log(`Assigned black material to ${mesh.name}`); 
                            } else if (mesh.name.startsWith("east-wall") || mesh.name === "eastGround") { // Corrected check
                                mesh.material = blackMaterial;
                                if (mesh.name === "eastGround") rooms.East.ground = mesh;
                                else rooms.East.walls.push(mesh);
                                console.log(`Assigned black material to ${mesh.name}`); 
                            } else if (mesh.name.startsWith("west-wall") || mesh.name === "westGround") { // Corrected check
                                mesh.material = blackMaterial;
                                if (mesh.name === "westGround") rooms.West.ground = mesh;
                                else rooms.West.walls.push(mesh);
                                console.log(`Assigned black material to ${mesh.name}`); 
                            }

                            // Apply black material to the main ground initially
                            if (mesh.name === "Cube.020") { // Ensure this name is correct for the main ground
                                console.log(`Applying initial black material to: ${mesh.name}`);
                                mesh.material = blackMaterial; 
                            }
                        }
                    });

                    // Store the room information for later use
                    this.rooms = rooms;
                    resolve();
                },
                null,
                (scene, message, exception) => {
                    console.error("Error loading world:", message, exception);
                    resolve(); // Resolve even in case of error to avoid blocking the game
                }
            );
        });
    }
}

export default GameScene;
