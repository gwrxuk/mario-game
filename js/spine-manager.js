/**
 * Spine Animation Manager
 * Handles Spine skeletal animations using pixi-spine plugin
 */

class SpineManager {
    constructor(app) {
        this.app = app;
        this.animations = new Map();
        this.loadedSkeletons = new Map();
        this.isInitialized = false;
        
        this.init();
    }
    
    /**
     * Initialize Spine manager
     */
    init() {
        // Check if pixi-spine is loaded
        if (typeof PIXI.spine === 'undefined') {
            console.error('pixi-spine plugin not loaded. Please include pixi-spine library.');
            return false;
        }
        
        this.isInitialized = true;
        console.log('Spine Manager initialized');
        return true;
    }
    
    /**
     * Load a Spine skeleton
     * @param {string} name - Identifier for this skeleton
     * @param {string} jsonPath - Path to .json skeleton file
     * @param {string} atlasPath - Path to .atlas file (optional if using single json)
     * @returns {Promise<boolean>} Success status
     */
    async loadSkeleton(name, jsonPath, atlasPath = null) {
        if (!this.isInitialized) {
            console.error('Spine Manager not initialized');
            return false;
        }
        
        try {
            console.log(`Loading Spine skeleton: ${name}`);
            
            // Load skeleton data
            // pixi-spine supports loading from a single .json or .skel file
            // For PixiJS v7 + pixi-spine v4, we use PIXI.Assets
            let skeletonData;
            
            if (atlasPath) {
                // Load with separate atlas
                skeletonData = await PIXI.Assets.load({
                    alias: name,
                    src: jsonPath,
                    data: {
                        spineAtlas: atlasPath
                    }
                });
            } else {
                // Load single file
                skeletonData = await PIXI.Assets.load(jsonPath);
            }
            
            this.loadedSkeletons.set(name, {
                jsonPath,
                atlasPath,
                data: skeletonData
            });
            
            console.log(`Spine skeleton "${name}" loaded successfully`);
            return true;
        } catch (error) {
            console.error(`Failed to load Spine skeleton "${name}":`, error);
            return false;
        }
    }
    
    /**
     * Create a Spine animation instance
     * @param {string} skeletonName - Name of loaded skeleton
     * @param {object} options - Configuration options
     * @returns {PIXI.spine.Spine|null} Spine instance
     */
    createAnimation(skeletonName, options = {}) {
        if (!this.loadedSkeletons.has(skeletonName)) {
            console.error(`Skeleton "${skeletonName}" not loaded`);
            return null;
        }
        
        try {
            const {
                x = 0,
                y = 0,
                scale = 1,
                autoPlay = true,
                loop = true,
                animationName = null,
                speed = 1,
                skin = 'default'
            } = options;
            
            const skeletonData = this.loadedSkeletons.get(skeletonName).data;
            
            // Create Spine instance
            const spine = new PIXI.spine.Spine(skeletonData);
            
            // Set position
            spine.x = x;
            spine.y = y;
            
            // Set scale
            spine.scale.set(scale);
            
            // Set skin if available
            if (spine.skeleton.data.skins.length > 0) {
                const skinData = spine.skeleton.data.findSkin(skin);
                if (skinData) {
                    spine.skeleton.setSkin(skinData);
                    spine.skeleton.setSlotsToSetupPose();
                }
            }
            
            // Set animation speed
            spine.state.timeScale = speed;
            
            // Play animation if specified
            if (animationName) {
                spine.state.setAnimation(0, animationName, loop);
            } else if (autoPlay && spine.skeleton.data.animations.length > 0) {
                // Play first animation by default
                const firstAnim = spine.skeleton.data.animations[0].name;
                spine.state.setAnimation(0, firstAnim, loop);
            }
            
            // Generate unique ID
            const id = `${skeletonName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // Store reference
            this.animations.set(id, {
                spine,
                skeletonName,
                id
            });
            
            console.log(`Created Spine animation "${id}" from skeleton "${skeletonName}"`);
            
            return spine;
        } catch (error) {
            console.error(`Failed to create Spine animation:`, error);
            return null;
        }
    }
    
    /**
     * Play animation on a Spine instance
     * @param {PIXI.spine.Spine} spine - Spine instance
     * @param {string} animationName - Animation name
     * @param {boolean} loop - Loop animation
     * @param {number} track - Animation track (default 0)
     */
    playAnimation(spine, animationName, loop = true, track = 0) {
        if (!spine || !spine.state) {
            console.error('Invalid Spine instance');
            return;
        }
        
        try {
            spine.state.setAnimation(track, animationName, loop);
            console.log(`Playing animation "${animationName}" on track ${track}`);
        } catch (error) {
            console.error(`Failed to play animation "${animationName}":`, error);
        }
    }
    
    /**
     * Add animation to queue
     * @param {PIXI.spine.Spine} spine - Spine instance
     * @param {string} animationName - Animation name
     * @param {boolean} loop - Loop animation
     * @param {number} delay - Delay in seconds
     * @param {number} track - Animation track (default 0)
     */
    addAnimation(spine, animationName, loop = false, delay = 0, track = 0) {
        if (!spine || !spine.state) {
            console.error('Invalid Spine instance');
            return;
        }
        
        try {
            spine.state.addAnimation(track, animationName, loop, delay);
            console.log(`Queued animation "${animationName}" on track ${track}`);
        } catch (error) {
            console.error(`Failed to queue animation "${animationName}":`, error);
        }
    }
    
    /**
     * Set animation speed
     * @param {PIXI.spine.Spine} spine - Spine instance
     * @param {number} speed - Speed multiplier
     */
    setSpeed(spine, speed) {
        if (!spine || !spine.state) {
            console.error('Invalid Spine instance');
            return;
        }
        
        spine.state.timeScale = speed;
    }
    
    /**
     * Pause animation
     * @param {PIXI.spine.Spine} spine - Spine instance
     */
    pause(spine) {
        this.setSpeed(spine, 0);
    }
    
    /**
     * Resume animation
     * @param {PIXI.spine.Spine} spine - Spine instance
     * @param {number} speed - Speed multiplier (default 1)
     */
    resume(spine, speed = 1) {
        this.setSpeed(spine, speed);
    }
    
    /**
     * Set skin
     * @param {PIXI.spine.Spine} spine - Spine instance
     * @param {string} skinName - Skin name
     */
    setSkin(spine, skinName) {
        if (!spine || !spine.skeleton) {
            console.error('Invalid Spine instance');
            return;
        }
        
        try {
            const skin = spine.skeleton.data.findSkin(skinName);
            if (skin) {
                spine.skeleton.setSkin(skin);
                spine.skeleton.setSlotsToSetupPose();
                console.log(`Set skin to "${skinName}"`);
            } else {
                console.warn(`Skin "${skinName}" not found`);
            }
        } catch (error) {
            console.error(`Failed to set skin "${skinName}":`, error);
        }
    }
    
    /**
     * Get list of available animations
     * @param {PIXI.spine.Spine} spine - Spine instance
     * @returns {Array<string>} Animation names
     */
    getAnimations(spine) {
        if (!spine || !spine.skeleton) {
            return [];
        }
        
        return spine.skeleton.data.animations.map(anim => anim.name);
    }
    
    /**
     * Get list of available skins
     * @param {PIXI.spine.Spine} spine - Spine instance
     * @returns {Array<string>} Skin names
     */
    getSkins(spine) {
        if (!spine || !spine.skeleton) {
            return [];
        }
        
        return spine.skeleton.data.skins.map(skin => skin.name);
    }
    
    /**
     * Add event listener to animation
     * @param {PIXI.spine.Spine} spine - Spine instance
     * @param {string} eventType - Event type (start, interrupt, end, complete, dispose, event)
     * @param {Function} callback - Event callback
     */
    addEventListener(spine, eventType, callback) {
        if (!spine || !spine.state) {
            console.error('Invalid Spine instance');
            return;
        }
        
        spine.state.addListener({
            [eventType]: callback
        });
    }
    
    /**
     * Set mix (blend) time between animations
     * @param {PIXI.spine.Spine} spine - Spine instance
     * @param {string} fromAnimation - From animation name
     * @param {string} toAnimation - To animation name
     * @param {number} duration - Blend duration in seconds
     */
    setMix(spine, fromAnimation, toAnimation, duration) {
        if (!spine || !spine.stateData) {
            console.error('Invalid Spine instance');
            return;
        }
        
        spine.stateData.setMix(fromAnimation, toAnimation, duration);
    }
    
    /**
     * Get current animation name
     * @param {PIXI.spine.Spine} spine - Spine instance
     * @param {number} track - Track number (default 0)
     * @returns {string|null} Animation name
     */
    getCurrentAnimation(spine, track = 0) {
        if (!spine || !spine.state) {
            return null;
        }
        
        const trackEntry = spine.state.getCurrent(track);
        return trackEntry ? trackEntry.animation.name : null;
    }
    
    /**
     * Remove animation from scene
     * @param {PIXI.spine.Spine} spine - Spine instance
     */
    removeAnimation(spine) {
        if (!spine) return;
        
        // Remove from parent container if attached
        if (spine.parent) {
            spine.parent.removeChild(spine);
        }
        
        // Find and remove from our tracking
        for (const [id, data] of this.animations.entries()) {
            if (data.spine === spine) {
                this.animations.delete(id);
                break;
            }
        }
        
        // Destroy spine instance
        spine.destroy();
    }
    
    /**
     * Clean up all animations
     */
    cleanup() {
        // Destroy all animation instances
        for (const [id, data] of this.animations.entries()) {
            if (data.spine) {
                data.spine.destroy();
            }
        }
        
        this.animations.clear();
        console.log('Spine animations cleaned up');
    }
    
    /**
     * Unload skeleton data
     * @param {string} name - Skeleton name
     */
    unloadSkeleton(name) {
        if (this.loadedSkeletons.has(name)) {
            this.loadedSkeletons.delete(name);
            console.log(`Skeleton "${name}" unloaded`);
        }
    }
    
    /**
     * Destroy the Spine manager
     */
    destroy() {
        this.cleanup();
        this.loadedSkeletons.clear();
        this.isInitialized = false;
        console.log('Spine Manager destroyed');
    }
}

// Example usage and helper functions
const SPINE_HELPERS = {
    /**
     * Create a simple character animation
     */
    createCharacter: function(spineManager, skeletonName, x, y) {
        return spineManager.createAnimation(skeletonName, {
            x,
            y,
            scale: 0.5,
            autoPlay: true,
            loop: true,
            animationName: 'idle',
            speed: 1
        });
    },
    
    /**
     * Create an effect animation
     */
    createEffect: function(spineManager, skeletonName, x, y) {
        return spineManager.createAnimation(skeletonName, {
            x,
            y,
            scale: 1,
            autoPlay: true,
            loop: false,
            speed: 1.5
        });
    },
    
    /**
     * Setup common animation state machine
     */
    setupStateMachine: function(spine, spineManager) {
        // Example state transitions
        const states = {
            idle: 'walk',
            walk: 'run',
            run: 'jump',
            jump: 'fall',
            fall: 'idle'
        };
        
        // Set mix times for smooth transitions
        Object.keys(states).forEach(from => {
            const to = states[from];
            spineManager.setMix(spine, from, to, 0.2);
        });
        
        return states;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SpineManager, SPINE_HELPERS };
}

