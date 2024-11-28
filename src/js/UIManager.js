export class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.fragmentCount = 0;

        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.fragmentCounter = new BABYLON.GUI.TextBlock();
        this.fragmentCounter.text = "Fragments Collected: 0";
        this.fragmentCounter.color = "white";
        this.fragmentCounter.fontSize = 24;
        advancedTexture.addControl(this.fragmentCounter);
    }

    incrementFragmentCount() {
        this.fragmentCount += 1;
        this.fragmentCounter.text = `Fragments Collected: ${this.fragmentCount}`;
    }
}
