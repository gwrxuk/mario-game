/**
 * Spline Manager
 * Handles integration of Spline 3D scenes into the game
 */

class SplineManager {
    constructor() {
        this.splineApp = null;
        this.container = document.getElementById('spline-container');
        this.canvas = document.getElementById('spline-canvas');
        this.isLoaded = false;
        this.isVisible = false;
        this.currentScene = null;
        
        // Bind methods
        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
        
        // Setup close button
        const closeBtn = document.getElementById('btn-close-spline');
        if (closeBtn) {
            closeBtn.addEventListener('click', this.hide);
        }
        
        // Setup keyboard shortcut (ESC to close)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }
    
    /**
     * Load a Spline scene
     * @param {string} sceneUrl - URL to the Spline scene (.splinecode or exported URL)
     * @param {object} options - Configuration options
     */
    async loadScene(sceneUrl, options = {}) {
        try {
            console.log('Loading Spline scene:', sceneUrl);
            
            const {
                autoStart = true,
                showOnLoad = false,
                background = 'transparent',
                position = 'overlay' // 'overlay', 'background', 'fullscreen'
            } = options;
            
            // Check if Spline runtime is available
            if (typeof window.Application === 'undefined') {
                console.error('Spline runtime not loaded');
                return false;
            }
            
            // Clean up existing scene
            if (this.splineApp) {
                this.cleanup();
            }
            
            // Set container style based on position
            this.setContainerStyle(position, background);
            
            // Create new Spline application
            this.splineApp = new window.Application(this.canvas);
            await this.splineApp.load(sceneUrl);
            
            this.isLoaded = true;
            this.currentScene = sceneUrl;
            
            console.log('Spline scene loaded successfully');
            
            if (showOnLoad) {
                this.show();
            }
            
            if (autoStart) {
                this.start();
            }
            
            return true;
        } catch (error) {
            console.error('Failed to load Spline scene:', error);
            return false;
        }
    }
    
    /**
     * Set container styling based on position mode
     */
    setContainerStyle(position, background) {
        this.container.style.background = background;
        
        switch (position) {
            case 'background':
                this.container.style.zIndex = '0';
                this.container.style.pointerEvents = 'none';
                break;
            case 'fullscreen':
                this.container.style.zIndex = '9999';
                this.container.style.width = '100vw';
                this.container.style.height = '100vh';
                break;
            case 'overlay':
            default:
                this.container.style.zIndex = '1000';
                break;
        }
    }
    
    /**
     * Show the Spline viewer
     */
    show() {
        if (!this.isLoaded) {
            console.warn('No Spline scene loaded');
            return;
        }
        
        this.container.classList.remove('hidden');
        this.isVisible = true;
        
        // Resume animation if paused
        if (this.splineApp) {
            this.start();
        }
        
        console.log('Spline viewer shown');
    }
    
    /**
     * Hide the Spline viewer
     */
    hide() {
        this.container.classList.add('hidden');
        this.isVisible = false;
        
        // Optionally pause animation when hidden to save resources
        if (this.splineApp) {
            this.pause();
        }
        
        console.log('Spline viewer hidden');
    }
    
    /**
     * Toggle visibility
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    /**
     * Start/resume Spline animation
     */
    start() {
        if (this.splineApp && this.splineApp.play) {
            this.splineApp.play();
        }
    }
    
    /**
     * Pause Spline animation
     */
    pause() {
        if (this.splineApp && this.splineApp.pause) {
            this.splineApp.pause();
        }
    }
    
    /**
     * Interact with Spline scene objects
     * @param {string} objectName - Name of the object in Spline
     * @param {string} action - Action to perform (e.g., 'emitEvent', 'setVariable')
     * @param {any} value - Value to set/pass
     */
    interact(objectName, action, value) {
        if (!this.splineApp) {
            console.warn('No Spline scene loaded');
            return;
        }
        
        try {
            const object = this.splineApp.findObjectByName(objectName);
            
            if (!object) {
                console.warn(`Object "${objectName}" not found in Spline scene`);
                return;
            }
            
            switch (action) {
                case 'emitEvent':
                    this.splineApp.emitEvent('mouseDown', objectName);
                    break;
                case 'setVariable':
                    this.splineApp.setVariable(objectName, value);
                    break;
                default:
                    console.warn(`Unknown action: ${action}`);
            }
        } catch (error) {
            console.error('Failed to interact with Spline object:', error);
        }
    }
    
    /**
     * Get Spline object by name
     * @param {string} name - Object name
     * @returns {object|null} Spline object
     */
    getObject(name) {
        if (!this.splineApp) return null;
        
        try {
            return this.splineApp.findObjectByName(name);
        } catch (error) {
            console.error('Failed to get Spline object:', error);
            return null;
        }
    }
    
    /**
     * Set camera position
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     */
    setCameraPosition(x, y, z) {
        if (!this.splineApp) return;
        
        try {
            const camera = this.splineApp.camera;
            if (camera) {
                camera.position.set(x, y, z);
            }
        } catch (error) {
            console.error('Failed to set camera position:', error);
        }
    }
    
    /**
     * Clean up and dispose of Spline resources
     */
    cleanup() {
        if (this.splineApp) {
            try {
                // Dispose of Spline app resources
                if (this.splineApp.dispose) {
                    this.splineApp.dispose();
                }
                
                // Clear canvas
                const ctx = this.canvas.getContext('webgl') || this.canvas.getContext('webgl2');
                if (ctx) {
                    const loseContext = ctx.getExtension('WEBGL_lose_context');
                    if (loseContext) {
                        loseContext.loseContext();
                    }
                }
                
                this.splineApp = null;
                this.isLoaded = false;
                this.currentScene = null;
                
                console.log('Spline resources cleaned up');
            } catch (error) {
                console.error('Failed to cleanup Spline resources:', error);
            }
        }
    }
    
    /**
     * Destroy the Spline manager
     */
    destroy() {
        this.cleanup();
        
        // Remove event listeners
        const closeBtn = document.getElementById('btn-close-spline');
        if (closeBtn) {
            closeBtn.removeEventListener('click', this.hide);
        }
    }
}

// Example usage and configuration
const SPLINE_SCENES = {
    // Add your Spline scene URLs here
    // Example: 'mario': 'https://prod.spline.design/YOUR-SCENE-ID/scene.splinecode'
    
    // Demo scenes (replace with your own)
    'background': null, // Set to your background scene URL
    'menu': null,       // Set to your menu scene URL
    'victory': null,    // Set to your victory scene URL
    'gameover': null    // Set to your game over scene URL
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SplineManager, SPLINE_SCENES };
}

