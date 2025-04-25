import GameEngine from './core/Engine.js';
import GameScene from './core/Scene.js';
import PlayerLoader from './player/PlayerLoader.js';
import PlayerAnimator from './player/PlayerAnimator.js';
import PlayerCamera from './camera/PlayerCamera.js';
import InputManager from './input/InputManager.js';
import BABYLON from './core/BabylonWrapper.js';
// S’assurer que la GUI BabylonJS est disponible (chargée dans index.html ou importée)
// import * as GUI from '@babylonjs/gui';

// Initialisation du moteur de rendu
const engine = new GameEngine('renderCanvas');

// Création de la scène de jeu
let gameScene = new GameScene(engine.engine);
let scene = gameScene.scene;

// Configuration du gestionnaire d’entrées utilisateur
const inputManager = new InputManager(scene);

// Chargement du personnage joueur
const playerLoader = new PlayerLoader(scene);

// --- Variables d’état global du jeu ---
let correctAnswerCount = 0;      // Nombre de réponses correctes
const totalRiddles = 4;          // Nombre total d’énigmes
let scoreTextControl = null;     // Texte 2D du score
let playAgainPlane = null;       // Plan 3D du bouton « Rejouer »
// --- Fin des variables d’état ---

// Données des énigmes par pièce
const riddles = {
    North: { question: "Je suis à toi, mais tout le monde l'utilise. Qui suis-je ?", answer: "ton nom" },
    South: { question: "Qu'est-ce qui a un lit mais ne dort jamais ?", answer: "une rivière" },
    East:  { question: "Qu'est-ce qui est toujours devant toi, mais qu'on ne peut jamais voir ?", answer: "l'avenir" },
    West:  { question: "Qu'est-ce qui monte et qui descend sans bouger ?", answer: "un escalier" }
};

// Suivi des énigmes déjà résolues
const solvedRiddles = { North: false, South: false, East: false, West: false };

// Réinitialisation complète de la partie
function resetGame() {
    // Remise à zéro du suivi des énigmes
    for (const dir in solvedRiddles) {
        solvedRiddles[dir] = false;
    }
    correctAnswerCount = 0;

    // Recentrer le joueur au point de départ
    if (window.player) {
        window.player.position = BABYLON.Vector3.Zero();
    }

    // Remise à noir des textures des quatre pièces
    ['North','South','East','West'].forEach(dir => changeRoomTextures(dir, true));
    resetMainGroundTexture();

    // Mettre à jour l’affichage du score
    if (scoreTextControl) {
        scoreTextControl.text = `Correct Answers: 0/${totalRiddles}`;
    }
    // Masquer le bouton « Rejouer »
    if (playAgainPlane) {
        playAgainPlane.isVisible = false;
    }
}

// Réinitialise la texture du sol principal en noir
function resetMainGroundTexture() {
    const mainGround = scene.getMeshByName("Cube.020");
    if (!mainGround) return;
    let blackMat = scene.getMaterialByName("blackMaterial");
    if (!blackMat) {
        blackMat = new BABYLON.StandardMaterial("blackMaterial", scene);
        blackMat.diffuseColor = new BABYLON.Color3(0,0,0);
        blackMat.specularColor = new BABYLON.Color3(0,0,0);
    }
    mainGround.material = blackMat;
}

// Applique une couleur ou noir aux murs et au sol d’une pièce
function changeRoomTextures(room, forceBlack = false) {
    let mat;
    if (forceBlack) {
        mat = scene.getMaterialByName("blackMaterial") || (() => {
            const m = new BABYLON.StandardMaterial("blackMaterial", scene);
            m.diffuseColor = new BABYLON.Color3(0,0,0);
            m.specularColor = new BABYLON.Color3(0,0,0);
            return m;
        })();
    } else {
        // Choix de la couleur selon la direction
        const colors = {
            North: new BABYLON.Color3(1,0,0),
            South: new BABYLON.Color3(0,1,0),
            East:  new BABYLON.Color3(1,0.75,0.8),
            West:  new BABYLON.Color3(0,0,1)
        };
        mat = new BABYLON.StandardMaterial(room + "Mat", scene);
        mat.diffuseColor = colors[room] || new BABYLON.Color3(1,1,1);
        mat.specularColor = new BABYLON.Color3(0,0,0);
    }
    const meshes = gameScene.rooms[room];
    if (meshes) {
        meshes.ground.material = mat;
        meshes.walls.forEach(w => w.material = mat);
    } else {
        console.warn(`Pas de géométrie trouvée pour la pièce : ${room}`);
    }
}

// Applique une texture procédurale « rêveuse » au sol principal (victoire)
function changeMainGroundTexture() {
    const mainGround = scene.getMeshByName("Cube.020");
    if (!mainGround) {
        console.warn("Mesh 'Cube.020' introuvable.");
        return;
    }
    const procTex = new BABYLON.CloudProceduralTexture("dreamFloorTexture", 512, scene);
    procTex.skyColor = new BABYLON.Color4(0.8,0.6,0.9,1);
    procTex.cloudColor = new BABYLON.Color4(1,0.85,0.95,1);
    procTex.uScale = procTex.vScale = 5;
    procTex.anisotropicFilteringLevel = 4;
    const mat = new BABYLON.StandardMaterial("dreamFloorMat", scene);
    mat.diffuseTexture = procTex;
    mat.specularColor = new BABYLON.Color3(0,0,0);
    mainGround.material = mat;
}

// Initialisation principale du jeu (GUI, personnage, logique)
async function initGame() {
        // Chargement et animation du personnage
    const { mesh: character, skeleton } = await playerLoader.loadCharacter();
    window.player = character;
    const playerAnimator = new PlayerAnimator(scene, skeleton);

    // Configuration de la caméra joueur
    const playerCamera = new PlayerCamera(scene, character, engine.canvas);
    scene.activeCamera = playerCamera.camera;

    // --- Boucle de déplacement et animation ---
    scene.onBeforeRenderObservable.add(() => {
        const moveSpeed = 0.1, rotSpeed = 0.02;
        let moving = false, rotating = false;
        let anim = 'idle';
        if (inputManager.isKeyPressed('a')) { character.rotation.y -= rotSpeed; rotating = true; }
        if (inputManager.isKeyPressed('d')) { character.rotation.y += rotSpeed; rotating = true; }
        const forward = new BABYLON.Vector3(Math.sin(character.rotation.y),0,Math.cos(character.rotation.y));
        let dir = new BABYLON.Vector3(0,0,0);
        if (inputManager.isKeyPressed('w')) { dir.addInPlace(forward); anim = 'walking'; moving = true; }
        else if (inputManager.isKeyPressed('s')) { dir.subtractInPlace(forward); anim = 'walking_back'; moving = true; }
        if (moving) dir.normalize().scaleInPlace(moveSpeed);
        character.moveWithCollisions(dir);
        if (!moving && !rotating) anim = 'idle';
        playerAnimator.setAnimation(anim);
    });

    // Création des cubes d’énigmes
    function createRiddleCube(side, pos) {
        const cube = BABYLON.MeshBuilder.CreateBox(side+"Cube",{size:3},scene);
        cube.position = new BABYLON.Vector3(pos.x,1.5,pos.y);
        cube.metadata = { room: side };
        const mat = new BABYLON.StandardMaterial(side+"Mat",scene);
        const cols = { North:[1,0,0], South:[0,1,0], East:[1,0.75,0.8], West:[0,0,1] };
        mat.diffuseColor = new BABYLON.Color3(...(cols[side]||[1,1,1]));
        mat.specularColor = new BABYLON.Color3(0,0,0);
        cube.material = mat;
        return cube;
    }
    const cubes = [
        createRiddleCube("North",{x:-0.9,y:-78}),
        createRiddleCube("South",{x:-0.5,y:85}),
        createRiddleCube("East", {x:-84,y:1.5}),
        createRiddleCube("West", {x:68,y:-0.2}),
    ];

    // Gestion des popups d’énigmes
    let riddlePopup = false;
    function showRiddlePopup(room) {
        if (solvedRiddles[room] || riddlePopup) return;
        riddlePopup = true;
        const popup = document.getElementById("riddlePopup");
        document.getElementById("riddleQuestion").textContent = riddles[room].question;
        const answerInput = document.getElementById("riddleAnswer");
        const feedback = document.getElementById("feedbackText");
        answerInput.value = "";
        feedback.textContent = "";
        popup.style.display = "block";

        const onSubmit = () => {
            const ans = answerInput.value.trim().toLowerCase();
            if (ans === riddles[room].answer) {
                feedback.textContent = "Correct !";
                feedback.style.color = "green";
                solvedRiddles[room] = true;
                correctAnswerCount++;
                changeRoomTextures(room);
            } else {
                feedback.textContent = "Faux, réessayez.";
                feedback.style.color = "red";
            }
            scoreTextControl.text = `Correct Answers: ${correctAnswerCount}/${totalRiddles}`;
            if (correctAnswerCount === totalRiddles) {
                changeMainGroundTexture();
                playAgainPlane.isVisible = true;
            }
            setTimeout(() => {
                popup.style.display = "none";
                riddlePopup = false;
            }, 1000);
            document.getElementById("submitAnswer").removeEventListener('click', onSubmit);
        };

        document.getElementById("submitAnswer").addEventListener('click', onSubmit);
        document.getElementById("closePopup").addEventListener('click', () => {
            popup.style.display = "none";
            riddlePopup = false;
            document.getElementById("submitAnswer").removeEventListener('click', onSubmit);
        });
    }

    // Interaction souris et touche E pour déclencher l’énigme
    scene.onPointerObservable.add(pi => {
        if (pi.type === BABYLON.PointerEventTypes.POINTERPICK && pi.pickInfo.pickedMesh?.metadata?.room) {
            showRiddlePopup(pi.pickInfo.pickedMesh.metadata.room);
        }
    });
    scene.onBeforeRenderObservable.add(() => {
        cubes.forEach(c => {
            if (window.player && BABYLON.Vector3.Distance(window.player.position, c.position) < 5
                && inputManager.isKeyPressed('e')) {
                showRiddlePopup(c.metadata.room);
            }
        });
    });

    // Lancement de la boucle de rendu
    engine.startRenderLoop(scene);
}

// Démarrage du jeu depuis la page d’accueil
async function startGame() {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("loadingScreen").style.display = "flex";
    document.getElementById("renderCanvas").style.display = "none";

    await gameScene.loadWorld();
    resetGame();
    await initGame();

    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("renderCanvas").style.display = "block";
    engine.engine.resize();
}

// Événement clic sur le bouton « Play Game »
document.getElementById("playGameBtn").addEventListener("click", startGame);
