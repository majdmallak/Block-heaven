class InputManager {
    constructor(scene) {
        this.inputMap = {}; // Stocke les touches appuyées
        this.setupInputs(scene); // Initialise les entrées
    }

    setupInputs(scene) {
        // Crée un ActionManager pour détecter les entrées clavier
        scene.actionManager = new BABYLON.ActionManager(scene);
        
        // Quand une touche est pressée
        scene.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnKeyDownTrigger,
                (evt) => {
                    this.inputMap[evt.sourceEvent.key.toLowerCase()] = true;
                }
            )
        );

        // Quand une touche est relâchée
        scene.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnKeyUpTrigger,
                (evt) => {
                    this.inputMap[evt.sourceEvent.key.toLowerCase()] = false;
                }
            )
        );
    }

    isKeyPressed(key) {
        // Vérifie si une touche est enfoncée
        return this.inputMap[key.toLowerCase()] || false;
    }

    getMovementInput() {
        // Retourne les mouvements du joueur selon les touches
        return {
            forward: this.isKeyPressed('z') || this.isKeyPressed('w'), // Avancer
            backward: this.isKeyPressed('s'), // Reculer
            left: this.isKeyPressed('q') || this.isKeyPressed('a'),    // Aller à gauche
            right: this.isKeyPressed('d'), // Aller à droite
            jump: this.isKeyPressed(' ') // Sauter (espace)
        };
    }
}

export default InputManager;
