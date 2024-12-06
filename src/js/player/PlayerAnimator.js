import BABYLON from '../core/BabylonWrapper.js';

class PlayerAnimator {
    constructor(scene, skeleton) {
        this.scene = scene;
        this.skeleton = skeleton;
        this.animations = {};
        this.currentAnimation = null;
        this.setupAnimations();
    }

    setupAnimations() {
        // Get all available animations and log them
        const animationGroups = this.scene.animationGroups;
        console.log("Available animation groups:", animationGroups);
    
        // Store animations with exact names
        this.animations = {
            idle: animationGroups.find(group => group.name === 'idle'),
            walking: animationGroups.find(group => group.name === 'walking')
        };

        // Stop all animations initially
        animationGroups.forEach(group => {
            group.stop();
            group.loopAnimation = true; // Make sure animations loop
        });
    }

    setAnimation(animationName) {
        if (!this.animations[animationName]) {
            console.warn(`Animation ${animationName} not found`);
            return;
        }

        // If same animation is already playing, don't restart it
        if (this.currentAnimation === this.animations[animationName]) {
            return;
        }

        // Stop current animation if any
        if (this.currentAnimation) {
            this.currentAnimation.stop();
        }

        // Start the new animation
        this.animations[animationName].start(true, 1.0, 
            this.animations[animationName].from, 
            this.animations[animationName].to, 
            false);
        
        this.currentAnimation = this.animations[animationName];
    }
}

export default PlayerAnimator;
