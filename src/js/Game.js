import { SceneManager } from "./SceneManager.js";
import { Player } from "./Player.js";
import { Environment } from "./Environment.js";
import { Fragment } from "./Fragment.js";
import { UIManager } from "./UIManager.js";

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(this.canvas, true);

        // Initialize components
        this.sceneManager = new SceneManager(this.engine);
        this.player = new Player(this.sceneManager.scene, this.canvas);
        this.environment = new Environment(this.sceneManager.scene);
        this.uiManager = new UIManager(this.sceneManager.scene);
        this.fragments = [];

        // Add initial fragment for demo
        this.addFragment(new BABYLON.Vector3(2, 1, -5));

        // Start the game loop
        this.run();
    }

    addFragment(position) {
        const fragment = new Fragment(this.sceneManager.scene, position);
        this.fragments.push(fragment);
        fragment.onCollect(() => {
            this.uiManager.incrementFragmentCount();
        });
    }

    run() {
        this.engine.runRenderLoop(() => {
            this.sceneManager.scene.render();
        });

        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }
}

// Entry point
const game = new Game("renderCanvas");
