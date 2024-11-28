export class SceneManager {
    constructor(engine) {
        this.scene = new BABYLON.Scene(engine);

        // Add a hemispheric light
        const light = new BABYLON.HemisphericLight("hemisphericLight", new BABYLON.Vector3(1, 1, 0), this.scene);
        light.intensity = 0.7;

        // Add a directional light with shadows
        const directionalLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -2, -1), this.scene);
        directionalLight.position = new BABYLON.Vector3(20, 50, 20);
        const shadowGenerator = new BABYLON.ShadowGenerator(1024, directionalLight);
        shadowGenerator.useExponentialShadowMap = true;

        // Apply shadows to the player
        this.shadowGenerator = shadowGenerator;
    }
    addPostProcessingEffects() {
        const pipeline = new BABYLON.DefaultRenderingPipeline(
            "defaultPipeline",
            true,
            this.scene,
            [this.scene.activeCamera]
        );
        pipeline.bloomEnabled = true;
        pipeline.bloomThreshold = 0.8;
        pipeline.bloomIntensity = 0.6;
        pipeline.bloomKernel = 64;
    }
    // addAmbientSound() {
    //     const music = new BABYLON.Sound("ambientMusic", "sounds/ambient.mp3", this.scene, null, {
    //         loop: true,
    //         autoplay: true,
    //     });
    // }
    
}
