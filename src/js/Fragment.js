export class Fragment {
    constructor(scene, position) {
        this.scene = scene;
        this.mesh = BABYLON.MeshBuilder.CreateSphere("fragment", { diameter: 1 }, scene);
        this.mesh.position = position;

        const glowMaterial = new BABYLON.StandardMaterial("glow", scene);
        glowMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);
        this.mesh.material = glowMaterial;
    }

    onCollect(callback) {
        this.mesh.actionManager = new BABYLON.ActionManager(this.scene);
        this.mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
                callback();
                this.mesh.dispose();
            })
        );
    }
}
