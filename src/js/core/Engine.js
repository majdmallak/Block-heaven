import BABYLON from './BabylonWrapper.js';

class GameEngine {
    constructor(canvasId) {
        // Récupère le canvas HTML par son ID
        this.canvas = document.getElementById(canvasId);

        // Crée le moteur Babylon.js avec le canvas
        this.engine = new BABYLON.Engine(this.canvas, true);
        
        // Définit le niveau de scaling pour avoir la résolution native
        this.engine.setHardwareScalingLevel(1);

        // Redimensionne automatiquement le moteur quand la fenêtre change de taille
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }

    startRenderLoop(scene) {
        // Lance la boucle de rendu pour afficher la scène
        this.engine.runRenderLoop(() => {
            scene.render();
        });
    }
}

export default GameEngine;
