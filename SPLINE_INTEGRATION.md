# Spline 3D Integration Guide

This guide explains how to integrate Spline 3D scenes into your Super Mario game.

## 🎯 Overview

The game now supports Spline 3D integration, allowing you to add interactive 3D scenes and animations to enhance your game experience. You can use Spline for:

- 3D backgrounds and environments
- Victory/Game Over animations
- Interactive 3D effects
- Menu backgrounds
- Power-up effects

## 📦 What's Included

### Files Added

1. **`js/spline-manager.js`** - Core Spline integration manager
2. **HTML Elements** - Spline viewer container in `index.html`
3. **CSS Styles** - Spline viewer styling in `styles.css`
4. **Configuration** - Spline settings in `js/config.js`

### Features

- ✅ **Easy scene loading** - Load Spline scenes with a single function call
- ✅ **Multiple display modes** - Background, overlay, or fullscreen
- ✅ **Interactive controls** - Show/hide scenes dynamically
- ✅ **Object interaction** - Interact with Spline objects from your game
- ✅ **Performance optimized** - Automatic pause when hidden
- ✅ **Mobile responsive** - Works on all devices

## 🚀 Quick Start

### Step 1: Create Your Spline Scene

1. Go to [Spline.design](https://spline.design/)
2. Create your 3D scene
3. Export/Publish your scene
4. Copy the scene URL (looks like: `https://prod.spline.design/YOUR-SCENE-ID/scene.splinecode`)

### Step 2: Add Scene URL to Configuration

Edit `js/config.js` and add your scene URLs:

```javascript
SPLINE: {
    ENABLED: true,
    SCENES: {
        'menu_background': 'https://prod.spline.design/YOUR-MENU-SCENE/scene.splinecode',
        'victory_animation': 'https://prod.spline.design/YOUR-VICTORY-SCENE/scene.splinecode',
        'gameover_scene': 'https://prod.spline.design/YOUR-GAMEOVER-SCENE/scene.splinecode',
        'powerup_effect': null
    },
    DEFAULT_OPTIONS: {
        autoStart: true,
        showOnLoad: false,
        background: 'transparent',
        position: 'overlay'
    }
}
```

### Step 3: Initialize Spline Manager

In your game code (e.g., `js/main.js` or `js/game.js`):

```javascript
// Create Spline manager instance
const splineManager = new SplineManager();

// Load a scene
splineManager.loadScene(CONFIG.SPLINE.SCENES.menu_background, {
    position: 'background',
    background: 'transparent',
    showOnLoad: false
});
```

### Step 4: Show/Hide Scenes

```javascript
// Show the Spline viewer
splineManager.show();

// Hide the Spline viewer
splineManager.hide();

// Toggle visibility
splineManager.toggle();
```

## 📚 API Reference

### SplineManager Class

#### Constructor

```javascript
const splineManager = new SplineManager();
```

Creates a new Spline manager instance.

#### Methods

##### `loadScene(sceneUrl, options)`

Load a Spline scene.

**Parameters:**
- `sceneUrl` (string) - URL to your Spline scene
- `options` (object) - Configuration options:
  - `autoStart` (boolean) - Auto-start animation (default: `true`)
  - `showOnLoad` (boolean) - Show viewer after loading (default: `false`)
  - `background` (string) - Background color (default: `'transparent'`)
  - `position` (string) - Display mode: `'overlay'`, `'background'`, `'fullscreen'` (default: `'overlay'`)

**Returns:** `Promise<boolean>` - Success status

**Example:**
```javascript
await splineManager.loadScene(
    'https://prod.spline.design/YOUR-SCENE/scene.splinecode',
    {
        position: 'background',
        background: 'rgba(0,0,0,0.5)',
        showOnLoad: true
    }
);
```

##### `show()`

Show the Spline viewer.

```javascript
splineManager.show();
```

##### `hide()`

Hide the Spline viewer.

```javascript
splineManager.hide();
```

##### `toggle()`

Toggle viewer visibility.

```javascript
splineManager.toggle();
```

##### `start()`

Start/resume Spline animation.

```javascript
splineManager.start();
```

##### `pause()`

Pause Spline animation.

```javascript
splineManager.pause();
```

##### `interact(objectName, action, value)`

Interact with Spline scene objects.

**Parameters:**
- `objectName` (string) - Name of the object in Spline
- `action` (string) - Action: `'emitEvent'` or `'setVariable'`
- `value` (any) - Value to pass

**Example:**
```javascript
// Trigger an event on a Spline object
splineManager.interact('Button', 'emitEvent');

// Set a variable on a Spline object
splineManager.interact('Cube', 'setVariable', { rotation: 45 });
```

##### `getObject(name)`

Get a Spline object by name.

**Returns:** `object|null` - Spline object

```javascript
const myObject = splineManager.getObject('MyCube');
```

##### `setCameraPosition(x, y, z)`

Set the camera position in the Spline scene.

```javascript
splineManager.setCameraPosition(0, 5, 10);
```

##### `cleanup()`

Clean up and dispose of Spline resources.

```javascript
splineManager.cleanup();
```

##### `destroy()`

Destroy the Spline manager and remove all listeners.

```javascript
splineManager.destroy();
```

## 🎮 Usage Examples

### Example 1: Menu Background

Add a 3D animated background to your menu:

```javascript
// In your menu initialization code
const splineManager = new SplineManager();

// Load menu background
await splineManager.loadScene(
    CONFIG.SPLINE.SCENES.menu_background,
    {
        position: 'background',
        background: 'transparent',
        showOnLoad: true,
        autoStart: true
    }
);

// When user starts game, hide it
document.getElementById('btn-start').addEventListener('click', () => {
    splineManager.hide();
    // Start game...
});
```

### Example 2: Victory Animation

Show a 3D animation when player wins:

```javascript
// In your game win condition
function onLevelComplete() {
    const splineManager = new SplineManager();
    
    // Load and show victory animation
    splineManager.loadScene(
        CONFIG.SPLINE.SCENES.victory_animation,
        {
            position: 'overlay',
            showOnLoad: true,
            autoStart: true
        }
    );
    
    // Hide after 3 seconds
    setTimeout(() => {
        splineManager.hide();
        // Continue to next level...
    }, 3000);
}
```

### Example 3: Interactive 3D Object

Interact with Spline objects based on game events:

```javascript
const splineManager = new SplineManager();

// Load scene with interactive object
await splineManager.loadScene('https://prod.spline.design/YOUR-SCENE/scene.splinecode');
splineManager.show();

// When player collects coin
function onCoinCollect() {
    // Trigger animation in Spline
    splineManager.interact('CoinAnimation', 'emitEvent');
}

// Update object based on score
function updateScore(newScore) {
    splineManager.interact('ScoreDisplay', 'setVariable', newScore);
}
```

### Example 4: Dynamic Camera Control

Control the Spline camera based on game state:

```javascript
const splineManager = new SplineManager();

await splineManager.loadScene('https://prod.spline.design/YOUR-SCENE/scene.splinecode');

// Move camera based on player position
function updateSplineCamera(playerX, playerY) {
    const cameraX = playerX * 0.01; // Scale factor
    const cameraY = playerY * 0.01;
    splineManager.setCameraPosition(cameraX, cameraY, 10);
}
```

## 🎨 Display Modes

### Overlay Mode (Default)

Displays Spline scene on top of the game with semi-transparent background.

```javascript
{ position: 'overlay' }
```

**Use cases:**
- Victory/Game Over screens
- Pop-up effects
- Interactive menus

### Background Mode

Displays Spline scene behind the game (lowest z-index).

```javascript
{ position: 'background' }
```

**Use cases:**
- Animated backgrounds
- Environmental effects
- Menu backgrounds

### Fullscreen Mode

Displays Spline scene in fullscreen mode.

```javascript
{ position: 'fullscreen' }
```

**Use cases:**
- Cutscenes
- Loading screens
- Standalone 3D experiences

## 🎯 Best Practices

### Performance

1. **Lazy Loading** - Only load scenes when needed
```javascript
// Don't load all scenes at once
// Load on-demand instead
function showVictory() {
    if (!splineManager.isLoaded) {
        await splineManager.loadScene(CONFIG.SPLINE.SCENES.victory_animation);
    }
    splineManager.show();
}
```

2. **Pause When Hidden** - Scenes automatically pause when hidden
```javascript
// This is automatic, but you can control it
splineManager.hide(); // Automatically pauses
splineManager.show(); // Automatically resumes
```

3. **Clean Up** - Dispose of unused scenes
```javascript
// When switching levels or ending game
splineManager.cleanup();
```

### Scene Design

1. **Keep scenes lightweight** - Optimize polygon count
2. **Use efficient materials** - Avoid complex shaders on mobile
3. **Test on mobile devices** - Ensure good performance
4. **Use appropriate textures** - Compress and optimize images

### Integration Tips

1. **Match visual style** - Keep 3D scenes consistent with game art
2. **Smooth transitions** - Use CSS transitions for show/hide
3. **Responsive design** - Test on different screen sizes
4. **Keyboard shortcuts** - ESC key closes Spline viewer by default
5. **Mobile considerations** - Close button is touch-optimized

## 🔧 Troubleshooting

### Scene Not Loading

**Problem:** Scene doesn't appear or load fails.

**Solutions:**
1. Check scene URL is correct
2. Verify Spline runtime is loaded (check browser console)
3. Ensure scene is published in Spline
4. Check network tab for loading errors

```javascript
// Add error handling
const loaded = await splineManager.loadScene(sceneUrl);
if (!loaded) {
    console.error('Failed to load Spline scene');
    // Fallback behavior
}
```

### Performance Issues

**Problem:** Game lags when Spline scene is active.

**Solutions:**
1. Reduce polygon count in Spline
2. Use background mode instead of overlay
3. Pause scene when not visible
4. Optimize Spline scene complexity

```javascript
// Pause when game is active
if (gameState === 'playing') {
    splineManager.pause();
}
```

### Z-Index Issues

**Problem:** Spline scene appears behind other elements.

**Solution:** Adjust z-index in `styles.css`:

```css
.spline-viewer {
    z-index: 1000; /* Adjust as needed */
}
```

### Mobile Touch Issues

**Problem:** Touch controls don't work in Spline scene.

**Solution:** Use pointer-events CSS:

```css
/* For non-interactive backgrounds */
.spline-viewer {
    pointer-events: none;
}

/* For interactive scenes */
.spline-viewer.interactive {
    pointer-events: auto;
}
```

## 📱 Mobile Optimization

### Touch Events

The Spline viewer automatically handles touch events:
- Close button is optimized for touch (40px on mobile)
- ESC key works on devices with keyboards
- Swipe gestures work in Spline scenes

### Viewport

Ensure proper viewport settings in `index.html`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### Performance

On mobile devices:
1. Keep scenes simple (lower polygon count)
2. Use efficient materials
3. Test on target devices
4. Monitor FPS and adjust accordingly

## 🌟 Advanced Features

### Custom Events

Listen to Spline events in your game:

```javascript
// Access Spline app directly
const app = splineManager.splineApp;

app.addEventListener('splineEvent', (event) => {
    console.log('Spline event:', event);
    // Handle event in your game
});
```

### Multiple Scenes

Manage multiple Spline instances:

```javascript
const backgroundManager = new SplineManager();
const effectsManager = new SplineManager();

// Load different scenes
await backgroundManager.loadScene(CONFIG.SPLINE.SCENES.menu_background);
await effectsManager.loadScene(CONFIG.SPLINE.SCENES.powerup_effect);
```

### Integration with Game State

Sync Spline with game state:

```javascript
class MarioGame {
    constructor() {
        this.splineManager = new SplineManager();
        // ...
    }
    
    onGameStateChange(newState) {
        switch(newState) {
            case 'menu':
                this.splineManager.loadScene(CONFIG.SPLINE.SCENES.menu_background);
                this.splineManager.show();
                break;
            case 'playing':
                this.splineManager.hide();
                break;
            case 'gameover':
                this.splineManager.loadScene(CONFIG.SPLINE.SCENES.gameover_scene);
                this.splineManager.show();
                break;
        }
    }
}
```

## 📖 Resources

- [Spline Official Website](https://spline.design/)
- [Spline Documentation](https://docs.spline.design/)
- [Spline Runtime API](https://github.com/splinetool/runtime)
- [Spline Community](https://community.spline.design/)

## 🎉 Examples

Check out the game's source code for complete integration examples:
- `js/spline-manager.js` - Core implementation
- `js/config.js` - Configuration
- `index.html` - HTML structure
- `styles.css` - Styling

## 💡 Tips

1. **Start simple** - Begin with a basic background scene
2. **Test early** - Test on multiple devices and browsers
3. **Optimize** - Keep scenes lightweight for best performance
4. **Iterate** - Refine your 3D scenes based on gameplay needs
5. **Have fun!** - Experiment with creative 3D effects!

---

**Happy 3D gaming! 🎮🌟**

For questions or issues, check the browser console for error messages and refer to the troubleshooting section above.

