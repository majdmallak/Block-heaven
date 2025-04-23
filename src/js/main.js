import GameEngine from './core/Engine.js';
import GameScene from './core/Scene.js';
import PlayerLoader from './player/PlayerLoader.js';
import PlayerAnimator from './player/PlayerAnimator.js';
import PlayerCamera from './camera/PlayerCamera.js';
import InputManager from './input/InputManager.js';
import BABYLON from './core/BabylonWrapper.js'; 
// Ensure GUI is available (loaded in index.html or imported)
// import * as GUI from '@babylonjs/gui'; 

// Initialize the engine
const engine = new GameEngine('renderCanvas');

// Create the game scene
let gameScene = new GameScene(engine.engine);
let scene = gameScene.scene;

// Input Manager
const inputManager = new InputManager(scene);

// Player loader
const playerLoader = new PlayerLoader(scene);

// --- Global Game State Variables ---
let correctAnswerCount = 0;
const totalRiddles = 4;
let scoreTextControl = null; // For the 2D GUI TextBlock showing the score
let playAgainButtonControl = null; // For the 2D GUI Button
let scorePlane = null; // 3D Plane for score background
let playAgainPlane = null; // 3D Plane for play again button background
// --- End Global Game State Variables ---

// Riddle data stored for each room
const riddles = {
    North: { question: "Je suis à toi, mais tout le monde l'utilise. Qui suis-je ?", answer: "ton nom" },
    South: { question: "Qu'est-ce qui a un lit mais ne dort jamais ?", answer: "une rivière" },
    East:  { question: "Qu'est-ce qui est toujours devant toi, mais qu'on ne peut jamais voir ?", answer: "l'avenir" },
    West:  { question: "Qu'est-ce qui monte et qui descend sans bouger ?", answer: "un escalier" }
};

// Track solved riddles
const solvedRiddles = { North: false, South: false, East: false, West: false };

// Function to reset the game
function resetGame() {
    solvedRiddles.North = false;
    solvedRiddles.South = false;
    solvedRiddles.East = false;
    solvedRiddles.West = false;
    correctAnswerCount = 0;

    if (window.player) {
        window.player.position = BABYLON.Vector3.Zero();
    }

    changeRoomTextures("North", true);
    changeRoomTextures("South", true);
    changeRoomTextures("East", true);
    changeRoomTextures("West", true);
    resetMainGroundTexture();

    // Reset Score Display and Hide Play Again Button
    if (scoreTextControl) {
        scoreTextControl.text = `Correct Answers: 0/${totalRiddles}`;
    }
    if (playAgainPlane) { // Hide the plane containing the button
        playAgainPlane.isVisible = false;
    }
}

// Function to reset the main ground texture
function resetMainGroundTexture() {
    const mainGround = scene.getMeshByName("Cube.020");
    if (mainGround) {
        let blackMaterial = scene.getMaterialByName("blackMaterial");
        if (!blackMaterial) {
            blackMaterial = new BABYLON.StandardMaterial("blackMaterial", scene);
            blackMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
            blackMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        }
        mainGround.material = blackMaterial;
    }
}

// Function to change the textures of the walls and ground
function changeRoomTextures(room, forceBlack = false) {
    let materialToApply;
    if (forceBlack) {
        let blackMaterial = scene.getMaterialByName("blackMaterial");
        if (!blackMaterial) {
            blackMaterial = new BABYLON.StandardMaterial("blackMaterial", scene);
            blackMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
            blackMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        }
        materialToApply = blackMaterial;
    } else {
        let color;
        switch (room) {
            case "North": color = new BABYLON.Color3(1, 0, 0); break;
            case "South": color = new BABYLON.Color3(0, 1, 0); break;
            case "East": color = new BABYLON.Color3(1, 0.75, 0.8); break;
            case "West": color = new BABYLON.Color3(0, 0, 1); break;
            default: color = new BABYLON.Color3(1, 1, 1);
        }
        const newMaterial = new BABYLON.StandardMaterial(room + "Material", scene);
        newMaterial.diffuseColor = color;
        newMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        materialToApply = newMaterial;
    }

    const roomMeshes = gameScene.rooms[room];
    if (roomMeshes) {
        if (roomMeshes.ground) roomMeshes.ground.material = materialToApply;
        roomMeshes.walls.forEach(wall => wall.material = materialToApply);
    } else {
        console.warn(`Could not find roomMeshes for room: ${room}`);
    }
}

// Function to change the texture of Cube.020 to the dreamy texture
function changeMainGroundTexture() {
    const mainGround = scene.getMeshByName("Cube.020"); 
    if (mainGround) {
        console.log("Applying dreamy texture to Cube.020");
        const floorTexture = new BABYLON.CloudProceduralTexture("dreamFloorTexture", 512, scene);
        floorTexture.skyColor = new BABYLON.Color4(0.8, 0.6, 0.9, 1.0);
        floorTexture.cloudColor = new BABYLON.Color4(1, 0.85, 0.95, 1.0);
        floorTexture.uScale = 5; floorTexture.vScale = 5;
        floorTexture.anisotropicFilteringLevel = 4;
        const floorMaterial = new BABYLON.StandardMaterial("dreamFloorMat", scene);
        floorMaterial.diffuseTexture = floorTexture;
        floorMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        mainGround.material = floorMaterial;
        console.log("Changed texture of Cube.020 to dreamy texture");
    } else {
        console.warn("Main ground mesh 'Cube.020' not found for dreamy texture.");
    }
}

// Main game logic
async function initGame() {

    // --- Create Score Display GUI ---
    scorePlane = BABYLON.MeshBuilder.CreatePlane("scorePlane", {width: 4, height: 1}, scene);
    scorePlane.position = new BABYLON.Vector3(0, 2.5, 6); // Position near spawn
    scorePlane.rotation.y = Math.PI; // Rotate the plane 180 degrees
    scorePlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL; // Always face camera

    const scoreTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(scorePlane);

    scoreTextControl = new BABYLON.GUI.TextBlock("scoreText", `Correct Answers: 0/${totalRiddles}`);
    scoreTextControl.color = "red"; 
    scoreTextControl.fontSize = 85; 
    scoreTextControl.background = "white";
    scoreTextControl.paddingTop = "10px";
    scoreTextControl.paddingBottom = "10px";
    scoreTexture.addControl(scoreTextControl);
    // --- End Score Display GUI ---

    // --- Create Play Again Button GUI (Initially Hidden) ---
    playAgainPlane = BABYLON.MeshBuilder.CreatePlane("playAgainPlane", {width: 3, height: 1}, scene);
    playAgainPlane.position = new BABYLON.Vector3(0, 1.2, 6); // Position below score
    playAgainPlane.rotation.y = Math.PI; // Rotate the plane 180 degrees
    playAgainPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    playAgainPlane.isVisible = false; // Start hidden

    const playAgainTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(playAgainPlane);

    playAgainButtonControl = BABYLON.GUI.Button.CreateSimpleButton("playAgainButton", "Play Again");
    playAgainButtonControl.width = 1; 
    playAgainButtonControl.height = "80px"; 
    playAgainButtonControl.color = "black";
    playAgainButtonControl.fontSize = 50;
    playAgainButtonControl.background = "white";
    playAgainButtonControl.cornerRadius = 10;
    playAgainButtonControl.onPointerClickObservable.add(() => {
        console.log("Play Again button clicked - Returning to home page.");
        document.getElementById("renderCanvas").style.display = "none";
        playAgainPlane.isVisible = false; 
        document.getElementById("homePage").style.display = "flex"; 
    });
    playAgainTexture.addControl(playAgainButtonControl);
    // --- End Play Again Button GUI ---


    // Load the player character
    const { mesh: character, skeleton } = await playerLoader.loadCharacter();
    window.player = character;

    // Initialize animations
    const playerAnimator = new PlayerAnimator(scene, skeleton);

    // Initialize camera
    const playerCamera = new PlayerCamera(scene, character, engine.canvas);
    scene.activeCamera = playerCamera.camera;

    // --- Player State (Movement Logic) ---
    scene.onBeforeRenderObservable.add(() => {
        const moveSpeed = 0.1;
        const rotateSpeed = 0.02;
        let moving = false;
        let rotating = false; 
        let animationToPlay = 'idle'; 

        const forwardPressed = inputManager.isKeyPressed('w');
        const backwardPressed = inputManager.isKeyPressed('s');
        const leftPressed = inputManager.isKeyPressed('a'); 
        const rightPressed = inputManager.isKeyPressed('d'); 

        let moveDirection = new BABYLON.Vector3(0, 0, 0);

        if (leftPressed) { character.rotation.y -= rotateSpeed; rotating = true; }
        if (rightPressed) { character.rotation.y += rotateSpeed; rotating = true; }

        const forward = new BABYLON.Vector3( Math.sin(character.rotation.y), 0, Math.cos(character.rotation.y) );

        if (forwardPressed) { moveDirection.addInPlace(forward); animationToPlay = 'walking'; moving = true; } 
        else if (backwardPressed) { moveDirection.subtractInPlace(forward); animationToPlay = 'walking_back'; moving = true; }

        if (moving) { moveDirection.normalize().scaleInPlace(moveSpeed); }
        character.moveWithCollisions(moveDirection);

        if (rotating && !moving) animationToPlay = 'idle';
        if (!moving && !rotating) animationToPlay = 'idle';
        playerAnimator.setAnimation(animationToPlay); 
    });

    // Add event listener for the "Restart Game" button (Top Menu)
    const restartBtn = document.getElementById("restartBtn");
    if (restartBtn) {
        restartBtn.addEventListener("click", () => {
            console.log("Restarting game (Top Menu)...");
            document.getElementById("renderCanvas").style.display = "none";
            if (playAgainPlane) playAgainPlane.isVisible = false; // Hide button plane
            document.getElementById("homePage").style.display = "flex";
        });
    }

    // Add event listener for the "Unstuck" button
    const unstuckBtn = document.getElementById("unstuckBtn");
    if (unstuckBtn) {
        unstuckBtn.addEventListener("click", () => {
            if (window.player) {
                window.player.position = BABYLON.Vector3.Zero();
                console.log("Player position reset via Unstuck button");
            }
        });
    }

    // Create riddle cubes
    function createRiddleCube(side, position) {
        const cube = BABYLON.MeshBuilder.CreateBox(side + "Cube", { size: 3 }, scene);
        cube.position = new BABYLON.Vector3(position.x, 1.5, position.y);
        cube.metadata = { room: side };
        const mat = new BABYLON.StandardMaterial(side + "Mat", scene);
        switch (side) {
            case "North": mat.diffuseColor = new BABYLON.Color3(1, 0, 0); break;
            case "South": mat.diffuseColor = new BABYLON.Color3(0, 1, 0); break;
            case "East": mat.diffuseColor = new BABYLON.Color3(1, 0.75, 0.8); break;
            case "West": mat.diffuseColor = new BABYLON.Color3(0, 0, 1); break;
            default: mat.diffuseColor = new BABYLON.Color3(1, 1, 1);
        }
        mat.specularColor = new BABYLON.Color3(0, 0, 0);
        cube.material = mat;
        return cube;
    }

    const northCube = createRiddleCube("North", { x: -0.9, y: -78 });
    const southCube = createRiddleCube("South", { x: -0.5, y: 85 });
    const eastCube  = createRiddleCube("East",  { x: -84, y: 1.5 });
    const westCube  = createRiddleCube("West",  { x: 68, y: -0.2 });

    let riddlePopup;

    // Function to show the riddle popup for a given room
    function showRiddlePopup(room) {
        if (solvedRiddles[room]) {
            console.log(`Riddle for ${room} already solved.`);
            // Optionally briefly show score or do nothing
            return; 
        }
        if (riddlePopup) return; 

        riddlePopup = true;

        const popup = document.getElementById("riddlePopup");
        const questionText = document.getElementById("riddleQuestion");
        const answerInput = document.getElementById("riddleAnswer");
        const submitButton = document.getElementById("submitAnswer");
        const feedbackText = document.getElementById("feedbackText");
        const closeButton = document.getElementById("closePopup");

        questionText.textContent = riddles[room].question;
        answerInput.value = "";
        feedbackText.textContent = "";
        popup.style.display = "block";

        const submitHandler = () => {
            const userAnswer = answerInput.value.trim().toLowerCase();
            const correctAnswer = riddles[room].answer.toLowerCase();
            
            if (userAnswer === correctAnswer) {
                feedbackText.textContent = "Correct!";
                feedbackText.style.color = "green";
                if (!solvedRiddles[room]) { // Only increment if not already solved
                    solvedRiddles[room] = true;
                    correctAnswerCount++;
                    changeRoomTextures(room); 
                }
            } else {
                feedbackText.textContent = "Faux, réessayez.";
                feedbackText.style.color = "red";
                // No game over state here, just update score display
            }

            // Update Score Display
            if (scoreTextControl) {
                scoreTextControl.text = `Correct Answers: ${correctAnswerCount}/${totalRiddles}`;
            }

            // Check for Win Condition
            if (correctAnswerCount === totalRiddles) {
                changeMainGroundTexture(); // Change main ground on win
                if (playAgainPlane) {
                    playAgainPlane.isVisible = true; // Show "Play Again" button
                }
            }

            // Close the popup after a short delay
            setTimeout(() => {
                popup.style.display = "none";
                riddlePopup = null; 
            }, 1000); 

            // Remove listener after use
            submitButton.removeEventListener('click', submitHandler);
            closeButton.removeEventListener('click', closeHandler);
        };

        const closeHandler = () => {
            popup.style.display = "none";
            riddlePopup = null;
            submitButton.removeEventListener('click', submitHandler);
            closeButton.removeEventListener('click', closeHandler);
        };

        submitButton.addEventListener('click', submitHandler);
        closeButton.addEventListener('click', closeHandler);
    }

    // Interaction logic (Pointer pick and 'E' key)
    scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK) {
            const pickedMesh = pointerInfo.pickInfo.pickedMesh;
            if (pickedMesh && pickedMesh.metadata && pickedMesh.metadata.room) {
                showRiddlePopup(pickedMesh.metadata.room);
            }
        }
    });

    scene.onBeforeRenderObservable.add(() => {
        const interactionDistance = 5;
        const cubes = [northCube, southCube, eastCube, westCube];
        cubes.forEach(cube => {
            if (window.player && BABYLON.Vector3.Distance(window.player.position, cube.position) < interactionDistance) {
                if (inputManager.isKeyPressed('e')) {
                    showRiddlePopup(cube.metadata.room);
                }
            }
        });
    });

    // Start the render loop
    engine.startRenderLoop(scene);
}

// Function to start the game
async function startGame() {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("loadingScreen").style.display = "flex";
    document.getElementById("renderCanvas").style.display = "none";

    await gameScene.loadWorld(); 
    resetGame(); // Reset state BEFORE initializing GUI etc.
    await initGame(); // Initialize game (creates GUI elements)

    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("renderCanvas").style.display = "block";
    engine.engine.resize(); 
}

// Add event listener for the "Play Game" button
document.getElementById("playGameBtn").addEventListener("click", startGame);

// Remove or comment out listeners for old HTML overlay buttons if they are removed
// const htmlRestartGameBtn = document.getElementById("restartGameBtn"); 
// if (htmlRestartGameBtn) { ... }
// const htmlTryAgainBtn = document.getElementById("tryAgainBtn"); 
// if (htmlTryAgainBtn) { ... }
