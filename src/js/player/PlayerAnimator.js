import BABYLON from '../core/BabylonWrapper.js';

class PlayerAnimator {
    constructor(scene, skeleton) {
        this.scene = scene; // Scène
        this.skeleton = skeleton; // Squelette du joueur
        this.animations = {}; // Stockage des animations
        this.currentAnimation = null; // Animation en cours

        this.initializeAnimations(); // Initialise les animations
    }

    initializeAnimations() {
        // Associe les groupes d'animations
        this.animations['idle'] = this.scene.getAnimationGroupByName('idle');
        this.animations['walking'] = this.scene.getAnimationGroupByName('walking');
        this.animations['walking_back'] = this.scene.getAnimationGroupByName('walking_back');
        this.animations['left_strafe_walking'] = this.scene.getAnimationGroupByName('left_strafe_walking');
        this.animations['right_strafe_walking'] = this.scene.getAnimationGroupByName('right_strafe_walking');
        this.animations['jump'] = this.scene.getAnimationGroupByName('jump');
        this.animations['t_pose'] = this.scene.getAnimationGroupByName('t_pose');

        // Stoppe toutes les animations au début
        this.scene.animationGroups.forEach(group => group.stop());

        // Démarre en idle
        this.setAnimation('idle');
    }

    setAnimation(name) {
        // Change l'animation en cours
        const newAnimation = this.animations[name];

        if (!newAnimation) {
            console.warn(`Animation "${name}" not found.`);
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

        if (this.currentAnimation === newAnimation) return; // Ne rien faire si déjà en cours

        if (this.currentAnimation) {
            this.currentAnimation.stop();
        }

        this.currentAnimation = newAnimation;
        this.currentAnimation.start(true, 1.0, this.currentAnimation.from, this.currentAnimation.to, false);
    }
}

export default PlayerAnimator;
