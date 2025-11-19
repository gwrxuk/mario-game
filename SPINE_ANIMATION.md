# Spine Animation Integration Guide

This guide explains how to integrate Spine 2D skeletal animations into your Super Mario game using pixi-spine.

## 🎯 Overview

The game now supports **Spine 2D animations**, allowing you to add smooth, professional skeletal animations to your game characters and effects. Spine is an industry-standard 2D animation tool used in many professional games.

### What is Spine?

Spine is a 2D skeletal animation software that allows you to:
- Create smooth character animations with bones and meshes
- Use animation blending and mixing
- Attach items dynamically to bones
- Create complex IK (Inverse Kinematics) setups
- Export lightweight animation data

## 📦 What's Included

### Files Added

1. **`js/spine-manager.js`** - Core Spine animation manager
2. **pixi-spine Plugin** - Added to `index.html`
3. **Configuration** - Spine settings in `js/config.js`

### Features

- ✅ **Easy animation loading** - Load Spine skeletons with one function
- ✅ **Multiple animation tracks** - Play multiple animations simultaneously
- ✅ **Animation blending** - Smooth transitions between animations
- ✅ **Skin support** - Change character appearance
- ✅ **Event system** - React to animation events
- ✅ **Performance optimized** - Hardware-accelerated rendering
- ✅ **Full control** - Speed, looping, mixing, and more

## 🚀 Quick Start

### Step 1: Export from Spine

1. Create your animation in [Spine](http://esotericsoftware.com/)
2. Export your skeleton:
   - **JSON** format (.json)
   - **Atlas** file (.atlas)
   - **Texture** images (.png)
3. Place files in your project (e.g., `assets/spine/mario/`)

### Step 2: Add to Configuration

Edit `js/config.js`:

```javascript
SPINE: {
    ENABLED: true,
    SKELETONS: {
        'mario': {
            json: 'assets/spine/mario/mario.json',
            atlas: 'assets/spine/mario/mario.atlas'
        },
        'goomba': {
            json: 'assets/spine/goomba/goomba.json',
            atlas: 'assets/spine/goomba/goomba.atlas'
        }
    }
}
```

### Step 3: Load and Create Animation

```javascript
// In your game initialization
const spineManager = new SpineManager(app);

// Load skeleton
await spineManager.loadSkeleton('mario', 
    CONFIG.SPINE.SKELETONS.mario.json,
    CONFIG.SPINE.SKELETONS.mario.atlas
);

// Create animation instance
const marioSpine = spineManager.createAnimation('mario', {
    x: 100,
    y: 200,
    scale: 0.5,
    animationName: 'idle',
    loop: true,
    speed: 1
});

// Add to stage
app.stage.addChild(marioSpine);
```

## 📚 API Reference

### SpineManager Class

#### Constructor

```javascript
const spineManager = new SpineManager(app);
```

**Parameters:**
- `app` (PIXI.Application) - PixiJS application instance

#### Methods

##### `loadSkeleton(name, jsonPath, atlasPath)`

Load a Spine skeleton.

**Parameters:**
- `name` (string) - Unique identifier for this skeleton
- `jsonPath` (string) - Path to .json skeleton file
- `atlasPath` (string) - Path to .atlas file (optional)

**Returns:** `Promise<boolean>` - Success status

**Example:**
```javascript
await spineManager.loadSkeleton('hero', 
    'assets/spine/hero/hero.json',
    'assets/spine/hero/hero.atlas'
);
```

##### `createAnimation(skeletonName, options)`

Create an animation instance from a loaded skeleton.

**Parameters:**
- `skeletonName` (string) - Name of loaded skeleton
- `options` (object) - Configuration:
  - `x` (number) - X position (default: 0)
  - `y` (number) - Y position (default: 0)
  - `scale` (number) - Scale factor (default: 1)
  - `autoPlay` (boolean) - Auto-play animation (default: true)
  - `loop` (boolean) - Loop animation (default: true)
  - `animationName` (string) - Animation to play (default: null)
  - `speed` (number) - Animation speed multiplier (default: 1)
  - `skin` (string) - Skin name (default: 'default')

**Returns:** `PIXI.spine.Spine` - Spine instance

**Example:**
```javascript
const spine = spineManager.createAnimation('hero', {
    x: 400,
    y: 300,
    scale: 0.5,
    animationName: 'walk',
    loop: true,
    speed: 1.5
});
```

##### `playAnimation(spine, animationName, loop, track)`

Play an animation.

**Parameters:**
- `spine` (PIXI.spine.Spine) - Spine instance
- `animationName` (string) - Animation name
- `loop` (boolean) - Loop animation (default: true)
- `track` (number) - Animation track (default: 0)

**Example:**
```javascript
spineManager.playAnimation(marioSpine, 'jump', false);
```

##### `addAnimation(spine, animationName, loop, delay, track)`

Queue an animation to play after the current one.

**Parameters:**
- `spine` (PIXI.spine.Spine) - Spine instance
- `animationName` (string) - Animation name
- `loop` (boolean) - Loop animation (default: false)
- `delay` (number) - Delay in seconds (default: 0)
- `track` (number) - Animation track (default: 0)

**Example:**
```javascript
spineManager.playAnimation(marioSpine, 'jump', false);
spineManager.addAnimation(marioSpine, 'fall', false, 0);
spineManager.addAnimation(marioSpine, 'land', false, 0);
```

##### `setSpeed(spine, speed)`

Set animation speed.

**Example:**
```javascript
spineManager.setSpeed(marioSpine, 2.0); // 2x speed
```

##### `pause(spine)`

Pause animation.

```javascript
spineManager.pause(marioSpine);
```

##### `resume(spine, speed)`

Resume animation.

```javascript
spineManager.resume(marioSpine, 1.0);
```

##### `setSkin(spine, skinName)`

Change character skin.

**Example:**
```javascript
spineManager.setSkin(marioSpine, 'fire-mario');
```

##### `setMix(spine, fromAnimation, toAnimation, duration)`

Set blend time between animations.

**Example:**
```javascript
spineManager.setMix(marioSpine, 'walk', 'run', 0.2);
```

##### `getAnimations(spine)`

Get list of available animations.

**Returns:** `Array<string>` - Animation names

```javascript
const animations = spineManager.getAnimations(marioSpine);
console.log(animations); // ['idle', 'walk', 'run', 'jump']
```

##### `getSkins(spine)`

Get list of available skins.

**Returns:** `Array<string>` - Skin names

```javascript
const skins = spineManager.getSkins(marioSpine);
console.log(skins); // ['default', 'fire-mario', 'cape-mario']
```

##### `getCurrentAnimation(spine, track)`

Get currently playing animation name.

**Returns:** `string|null` - Animation name

```javascript
const current = spineManager.getCurrentAnimation(marioSpine);
console.log(current); // 'walk'
```

##### `addEventListener(spine, eventType, callback)`

Add event listener.

**Event Types:**
- `start` - Animation started
- `interrupt` - Animation interrupted
- `end` - Animation ended
- `complete` - Animation completed (including all loops)
- `dispose` - Animation disposed
- `event` - Custom animation event

**Example:**
```javascript
spineManager.addEventListener(marioSpine, 'complete', (entry) => {
    console.log('Animation completed:', entry.animation.name);
});
```

##### `removeAnimation(spine)`

Remove and destroy animation.

```javascript
spineManager.removeAnimation(marioSpine);
```

##### `cleanup()`

Clean up all animations.

```javascript
spineManager.cleanup();
```

##### `destroy()`

Destroy the Spine manager.

```javascript
spineManager.destroy();
```

## 🎮 Usage Examples

### Example 1: Animated Player Character

Replace the procedural player sprite with Spine animation:

```javascript
class Player extends Entity {
    constructor(x, y, spineManager) {
        super(x, y, CONFIG.PLAYER.WIDTH, CONFIG.PLAYER.HEIGHT);
        
        // Create Spine animation
        this.spine = spineManager.createAnimation('mario', {
            x: 0,
            y: 0,
            scale: 0.5,
            animationName: CONFIG.SPINE.ANIMATIONS.IDLE,
            loop: true
        });
        
        // Add to sprite container
        this.sprite.addChild(this.spine);
        
        // Remove procedural graphics
        this.graphics = null;
        
        this.spineManager = spineManager;
        this.currentState = 'idle';
    }
    
    update(delta) {
        super.update(delta);
        
        // Update animation based on state
        const newState = this.getAnimationState();
        if (newState !== this.currentState) {
            this.currentState = newState;
            this.spineManager.playAnimation(
                this.spine, 
                CONFIG.SPINE.ANIMATIONS[newState.toUpperCase()],
                true
            );
        }
        
        // Flip sprite based on direction
        if (this.velocity.x !== 0) {
            this.spine.scale.x = Math.abs(this.spine.scale.x) * 
                (this.velocity.x > 0 ? 1 : -1);
        }
    }
    
    getAnimationState() {
        if (!this.grounded) {
            return this.velocity.y < 0 ? 'jump' : 'fall';
        }
        if (Math.abs(this.velocity.x) > 5) {
            return 'run';
        }
        if (Math.abs(this.velocity.x) > 0) {
            return 'walk';
        }
        return 'idle';
    }
}
```

### Example 2: Animated Enemy

```javascript
class SpineEnemy extends Enemy {
    constructor(x, y, spineManager) {
        super(x, y);
        
        this.spine = spineManager.createAnimation('goomba', {
            x: 0,
            y: 0,
            scale: 0.4,
            animationName: 'walk',
            loop: true
        });
        
        this.sprite.addChild(this.spine);
        this.spineManager = spineManager;
    }
    
    die() {
        // Play death animation
        this.spineManager.playAnimation(this.spine, 'death', false);
        
        // Remove after animation completes
        this.spineManager.addEventListener(this.spine, 'complete', () => {
            this.dead = true;
        });
    }
}
```

### Example 3: Coin Effect

```javascript
function createCoinEffect(x, y, spineManager, worldContainer) {
    const effect = spineManager.createAnimation('coin-effect', {
        x: x,
        y: y,
        scale: 0.8,
        animationName: 'collect',
        loop: false,
        speed: 1.5
    });
    
    worldContainer.addChild(effect);
    
    // Remove after animation completes
    spineManager.addEventListener(effect, 'complete', () => {
        spineManager.removeAnimation(effect);
    });
}
```

### Example 4: Power-Up Transformation

```javascript
function powerUp(playerSpine, spineManager) {
    // Play transformation animation
    spineManager.playAnimation(playerSpine, 'transform', false);
    
    // Queue return to idle
    spineManager.addAnimation(playerSpine, 'idle', true, 0);
    
    // Change skin after delay
    setTimeout(() => {
        spineManager.setSkin(playerSpine, 'super-mario');
    }, 500);
}
```

### Example 5: Animation State Machine

```javascript
class AnimationController {
    constructor(spine, spineManager) {
        this.spine = spine;
        this.manager = spineManager;
        this.currentState = 'idle';
        
        // Setup smooth transitions
        const transitions = {
            'idle': ['walk', 'jump'],
            'walk': ['idle', 'run', 'jump'],
            'run': ['walk', 'jump'],
            'jump': ['fall'],
            'fall': ['land'],
            'land': ['idle']
        };
        
        // Set mix times
        Object.keys(transitions).forEach(from => {
            transitions[from].forEach(to => {
                this.manager.setMix(this.spine, from, to, 0.2);
            });
        });
    }
    
    setState(newState) {
        if (newState !== this.currentState) {
            this.manager.playAnimation(this.spine, newState, true);
            this.currentState = newState;
        }
    }
}
```

## 🎨 Best Practices

### File Organization

Organize your Spine assets:

```
assets/
└── spine/
    ├── mario/
    │   ├── mario.json
    │   ├── mario.atlas
    │   └── mario.png
    ├── goomba/
    │   ├── goomba.json
    │   ├── goomba.atlas
    │   └── goomba.png
    └── effects/
        ├── coin-collect.json
        ├── coin-collect.atlas
        └── coin-collect.png
```

### Performance Tips

1. **Reuse Skeletons** - Load once, create multiple instances
```javascript
// Load once
await spineManager.loadSkeleton('enemy', ...);

// Create multiple instances
const enemy1 = spineManager.createAnimation('enemy', {x: 100, y: 200});
const enemy2 = spineManager.createAnimation('enemy', {x: 200, y: 200});
```

2. **Use Atlases** - Always use texture atlases for better performance

3. **Optimize Skeleton** - Keep bone count reasonable

4. **Clean Up** - Remove unused animations
```javascript
spineManager.removeAnimation(oldSpine);
```

### Animation Design

1. **Standard Names** - Use consistent animation names
   - idle, walk, run, jump, fall, attack, hurt, death

2. **Loop Settings** - Set appropriate loops
   - Idle, walk, run → loop: true
   - Jump, attack, death → loop: false

3. **Smooth Transitions** - Set mix times for blending
```javascript
spineManager.setMix(spine, 'walk', 'run', 0.2);
```

4. **Events** - Use Spine events for game logic
```javascript
// In Spine: Add event "footstep" at frame 10
spineManager.addEventListener(spine, 'event', (entry, event) => {
    if (event.data.name === 'footstep') {
        playFootstepSound();
    }
});
```

## 🔧 Troubleshooting

### Animation Not Loading

**Problem:** Skeleton fails to load.

**Solutions:**
1. Check file paths are correct
2. Ensure .json, .atlas, and .png files are all present
3. Check browser console for errors
4. Verify Spine export version matches pixi-spine version

```javascript
// Add error handling
const loaded = await spineManager.loadSkeleton('mario', jsonPath, atlasPath);
if (!loaded) {
    console.error('Failed to load skeleton');
    // Use fallback sprite
}
```

### Animation Not Playing

**Problem:** Animation doesn't play or appears frozen.

**Solutions:**
1. Check animation name is correct
```javascript
const animations = spineManager.getAnimations(spine);
console.log('Available:', animations);
```

2. Verify animation speed
```javascript
spineManager.setSpeed(spine, 1.0);
```

3. Check if paused
```javascript
spineManager.resume(spine);
```

### Performance Issues

**Problem:** Game lags with many Spine animations.

**Solutions:**
1. Reduce number of active animations
2. Use simpler skeletons (fewer bones)
3. Optimize texture sizes
4. Remove off-screen animations
```javascript
if (!isOnScreen(spine)) {
    spineManager.removeAnimation(spine);
}
```

### Texture Issues

**Problem:** Textures appear distorted or missing.

**Solutions:**
1. Check atlas file matches texture
2. Ensure textures are in same directory as atlas
3. Use power-of-2 texture sizes for best compatibility
4. Check texture format (PNG recommended)

## 📱 Mobile Optimization

### Touch Events

Spine animations work seamlessly with touch:

```javascript
spine.interactive = true;
spine.on('pointerdown', () => {
    spineManager.playAnimation(spine, 'interact', false);
});
```

### Performance

On mobile devices:
1. Keep skeleton complexity low
2. Use smaller texture sizes
3. Limit simultaneous animations
4. Test on target devices

## 🌟 Advanced Features

### Multiple Animation Tracks

Play multiple animations simultaneously:

```javascript
// Track 0: Body animation
spineManager.playAnimation(spine, 'run', true, 0);

// Track 1: Upper body (shooting)
spineManager.playAnimation(spine, 'shoot', false, 1);
```

### Dynamic Attachments

Attach items to bones:

```javascript
// Get bone
const hand = spine.skeleton.findBone('hand');

// Create item sprite
const sword = new PIXI.Sprite(swordTexture);

// Update position each frame
app.ticker.add(() => {
    sword.x = hand.worldX;
    sword.y = hand.worldY;
    sword.rotation = hand.worldRotation;
});
```

### Custom Events

React to animation events:

```javascript
spineManager.addEventListener(spine, 'event', (entry, event) => {
    switch(event.data.name) {
        case 'footstep':
            playSound('step');
            break;
        case 'attack-hit':
            dealDamage();
            break;
    }
});
```

## 📖 Resources

- [Spine Official Site](http://esotericsoftware.com/)
- [Spine Documentation](http://esotericsoftware.com/spine-user-guide)
- [pixi-spine GitHub](https://github.com/pixijs/spine)
- [PixiJS Examples](https://pixijs.io/examples/#/spine/spineboy.js)

## 🎓 Getting Started with Spine

If you don't have Spine animations yet:

1. **Free Alternatives:**
   - [DragonBones](http://dragonbones.com/) - Free alternative
   - [Spine Trial](http://esotericsoftware.com/spine-purchase) - 30-day trial

2. **Pre-made Assets:**
   - [Spine Examples](http://esotericsoftware.com/spine-examples) - Official examples
   - [OpenGameArt](https://opengameart.org/) - Community assets

3. **Learning Resources:**
   - [Spine Tutorials](http://esotericsoftware.com/spine-tutorials)
   - YouTube tutorials
   - Community forums

## 💡 Integration Checklist

- [ ] Install Spine editor or use existing animations
- [ ] Export skeleton (.json, .atlas, .png)
- [ ] Add files to project
- [ ] Update CONFIG.SPINE.SKELETONS
- [ ] Load skeleton with spineManager.loadSkeleton()
- [ ] Create animation instance
- [ ] Add to game scene
- [ ] Test animations
- [ ] Add state machine for smooth transitions
- [ ] Optimize for performance

---

**Happy animating! 🎮✨**

For questions or issues, check the browser console for error messages and refer to the troubleshooting section above.

