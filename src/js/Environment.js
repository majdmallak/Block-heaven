export class Environment {
    constructor(scene) {
        this.scene = scene;

        // Create a ground
        const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
        const groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
        // groundMaterial.diffuseTexture = new BABYLON.
        ground.material = groundMaterial;
        

        // Add a skybox
        const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMat", scene);
        skyboxMaterial.backFaceCulling = false;
        // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
        //     "textures/skybox/skybox", // Place skybox textures in this folder
        //     scene
        // );
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
    }
}
