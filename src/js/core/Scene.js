import BABYLON from './BabylonWrapper.js';

class GameScene {
    constructor(engine) {
        // Crée la scène principale
        this.scene = new BABYLON.Scene(engine);
        
        // Applique la gravité
        this.scene.gravity = new BABYLON.Vector3(0, -0.981, 0);
        
        // Active les collisions
        this.scene.collisionsEnabled = true;

        // --- Configuration de l'atmosphère de Dreamland ---
        this.scene.clearColor = new BABYLON.Color4(0.8, 0.6, 0.9, 1.0); // Couleur de fond (rose/violet)

        // Brouillard désactivé
        this.scene.fogEnabled = false;

        // Configure la lumière
        this.setupLight();
    }

    setupLight() {
        // Crée une lumière hémisphérique
        this.light = new BABYLON.HemisphericLight(
            "dreamLight",
            new BABYLON.Vector3(0.5, 1, 0.5), // Direction de la lumière
            this.scene
        );

        // Couleurs adaptées au thème Dreamland
        this.light.diffuse = new BABYLON.Color3(1, 0.85, 0.95); // Lumière du ciel
        this.light.groundColor = new BABYLON.Color3(0.4, 0.3, 0.6); // Reflet du sol
        this.light.intensity = 0.9; // Intensité de la lumière
    }

    loadWorld() {
        // Charge le modèle 3D du monde
        return new Promise((resolve) => {
            BABYLON.SceneLoader.ImportMesh(
                "",
                "assets/worlds/",
                "WORLD.glb",
                this.scene,
                (meshes) => {
                    console.log("World loaded successfully");

                    // Structure pour stocker les chambres
                    const rooms = {
                        North: { ground: null, walls: [] },
                        South: { ground: null, walls: [] },
                        East: { ground: null, walls: [] },
                        West: { ground: null, walls: [] }
                    };

                    // Crée un matériau noir de base
                    const blackMaterial = new BABYLON.StandardMaterial("blackMaterial", this.scene);
                    blackMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                    blackMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

                    // Assigne le matériau noir aux murs et sols
                    meshes.forEach(mesh => {
                        if (mesh instanceof BABYLON.Mesh) {
                            mesh.checkCollisions = true;

                            if (mesh.name.startsWith("north-wall") || mesh.name === "northGround") {
                                mesh.material = blackMaterial;
                                if (mesh.name === "northGround") rooms.North.ground = mesh;
                                else rooms.North.walls.push(mesh);
                                console.log(`Assigned black material to ${mesh.name}`); 
                            } else if (mesh.name.startsWith("south-wall") || mesh.name === "southGround") {
                                mesh.material = blackMaterial;
                                if (mesh.name === "southGround") rooms.South.ground = mesh;
                                else rooms.South.walls.push(mesh);
                                console.log(`Assigned black material to ${mesh.name}`); 
                            } else if (mesh.name.startsWith("east-wall") || mesh.name === "eastGround") {
                                mesh.material = blackMaterial;
                                if (mesh.name === "eastGround") rooms.East.ground = mesh;
                                else rooms.East.walls.push(mesh);
                                console.log(`Assigned black material to ${mesh.name}`); 
                            } else if (mesh.name.startsWith("west-wall") || mesh.name === "westGround") {
                                mesh.material = blackMaterial;
                                if (mesh.name === "westGround") rooms.West.ground = mesh;
                                else rooms.West.walls.push(mesh);
                                console.log(`Assigned black material to ${mesh.name}`); 
                            }

                            // Applique le matériau noir au sol principal
                            if (mesh.name === "Cube.020") {
                                console.log(`Applying initial black material to: ${mesh.name}`);
                                mesh.material = blackMaterial; 
                            }
                        }
                    });

                    // Sauvegarde la structure des chambres
                    this.rooms = rooms;
                    resolve();
                },
                null,
                (scene, message, exception) => {
                    console.error("Error loading world:", message, exception);
                    resolve(); // Même en cas d'erreur, continuer
                }
            );
        });
    }
}

export default GameScene;
