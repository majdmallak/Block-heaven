export class Player {
    constructor(scene, canvas) {
        this.scene = scene;
        this.canvas = canvas;

        // Create a simple sphere as the player
        this.mesh = BABYLON.MeshBuilder.CreateSphere("player", { diameter: 1 }, scene);
        this.mesh.position.y = 1;

        // Input handling
        this.inputMap = {};
        this.initControls();
    }

    initControls() {
        this.scene.actionManager = new BABYLON.ActionManager(this.scene);

        this.scene.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
                this.inputMap[evt.sourceEvent.key.toLowerCase()] = true;
            })
        );
        this.scene.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => {
                this.inputMap[evt.sourceEvent.key.toLowerCase()] = false;
            })
        );

        this.scene.onBeforeRenderObservable.add(() => {
            this.updateMovement();
        });
    }

    updateMovement() {
        if (this.inputMap["w"]) this.mesh.position.z -= 0.1;
        if (this.inputMap["s"]) this.mesh.position.z += 0.1;
        if (this.inputMap["a"]) this.mesh.position.x -= 0.1;
        if (this.inputMap["d"]) this.mesh.position.x += 0.1;
    }
}
