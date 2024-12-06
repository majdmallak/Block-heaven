import GameEngine from './core/Engine.js';
import GameScene from './core/Scene.js';
import PlayerLoader from './player/PlayerLoader.js';
import PlayerAnimator from './player/PlayerAnimator.js';
import PlayerCamera from './camera/PlayerCamera.js';
import InputManager from './input/InputManager.js';

// Initialize the engine
const engine = new GameEngine('renderCanvas');

// Create the game scene
const gameScene = new GameScene(engine.engine);
const scene = gameScene.scene;

// Input Manager
const inputManager = new InputManager(scene);

// Player loader
const playerLoader = new PlayerLoader(scene);

// Main game logic
async function initGame() {
    // Load the world first
    gameScene.loadWorld();

    // Load the player character
    const { mesh: character, skeleton } = await playerLoader.loadCharacter();

    // Initialize animations
    const playerAnimator = new PlayerAnimator(scene, skeleton);

    // Initialize camera
    const playerCamera = new PlayerCamera(scene, character, engine.canvas);

    // Game loop
    scene.onBeforeRenderObservable.add(() => {
        const moveSpeed = 0.2;
        let moving = false;
    
        // Movement input
        if (inputManager.isKeyPressed('w')) {
            character.moveWithCollisions(new BABYLON.Vector3(0, 0, -moveSpeed));
            moving = true;
        }
        if (inputManager.isKeyPressed('s')) {
            character.moveWithCollisions(new BABYLON.Vector3(0, 0, moveSpeed));
            moving = true;
        }
        if (inputManager.isKeyPressed('a')) {
            character.rotation.y -= 0.05;
            moving = true;
        }
        if (inputManager.isKeyPressed('d')) {
            character.rotation.y += 0.05;
            moving = true;
        }
    
        // Set animation based on movement state
        playerAnimator.setAnimation(moving ? 'walking' : 'idle');
    
        // Camera follows the player
        playerCamera.updateTarget(character.position);
    });

    // Start the render loop
    engine.startRenderLoop(scene);
}

// Initialize the game
initGame();
