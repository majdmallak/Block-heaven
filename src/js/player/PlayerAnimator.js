import BABYLON from '../core/BabylonWrapper.js';

class PlayerAnimator {
    constructor(scene, skeleton) {
        this.scene = scene;
        this.skeleton = skeleton;
        this.animations = {};
        this.currentAnimation = null;

        this.initializeAnimations();
    }

    initializeAnimations() {
        // Assuming animation group names match the provided list
        this.animations['idle'] = this.scene.getAnimationGroupByName('idle');
        this.animations['walking'] = this.scene.getAnimationGroupByName('walking');
        this.animations['walking_back'] = this.scene.getAnimationGroupByName('walking_back');
        this.animations['left_strafe_walking'] = this.scene.getAnimationGroupByName('left_strafe_walking');
        this.animations['right_strafe_walking'] = this.scene.getAnimationGroupByName('right_strafe_walking');
        this.animations['jump'] = this.scene.getAnimationGroupByName('jump'); // Keep for later
        // Add others if needed, e.g., t_pose
        this.animations['t_pose'] = this.scene.getAnimationGroupByName('t_pose');

        // Stop all animations initially
        this.scene.animationGroups.forEach(group => group.stop());

        // Start with idle animation
        this.setAnimation('idle');
    }

    setAnimation(name) {
        const newAnimation = this.animations[name];

        if (!newAnimation) {
            console.warn(`Animation "${name}" not found.`);
            // Fallback to idle if requested animation doesn't exist
            if (this.currentAnimation !== this.animations['idle']) {
                if (this.currentAnimation) {
                    this.currentAnimation.stop();
                }
                this.currentAnimation = this.animations['idle'];
                if (this.currentAnimation) {
                    this.currentAnimation.start(true, 1.0, this.currentAnimation.from, this.currentAnimation.to, false);
                }
            }
            return;
        }

        if (this.currentAnimation === newAnimation) {
            // Animation is already playing
            return;
        }

        // Stop the current animation
        if (this.currentAnimation) {
            this.currentAnimation.stop();
        }

        // Start the new animation
        this.currentAnimation = newAnimation;
        // Ensure the animation loops (true parameter)
        this.currentAnimation.start(true, 1.0, this.currentAnimation.from, this.currentAnimation.to, false);
    }
}

export default PlayerAnimator;
