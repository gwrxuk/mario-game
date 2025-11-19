# Super Mario - PixiJS Game 🍄

A complete Super Mario-style platformer game built with PixiJS!

## 🎮 Features

### Gameplay
- ✅ Classic platformer mechanics with running and jumping
- ✅ Multiple levels with increasing difficulty
- ✅ Enemies to stomp on
- ✅ Coins to collect
- ✅ Question blocks and brick blocks
- ✅ Pipes and obstacles
- ✅ Lives system
- ✅ Time limit per level
- ✅ Score tracking
- ✅ Level completion system

### Technical Features
- ✅ Built with PixiJS 7
- ✅ Smooth 60 FPS gameplay
- ✅ Procedural sprite generation (no external images needed!)
- ✅ Physics engine with gravity and collision detection
- ✅ Scrolling camera that follows player
- ✅ Mobile-optimized touch controls
- ✅ Responsive design
- ✅ Keyboard controls for desktop
- ✅ Game state management

## 🕹️ Controls

### Desktop
- **Arrow Keys** (← →): Move left/right
- **Space** or **Arrow Up**: Jump
- **Shift**: Run (hold for faster movement)

### Mobile
- **◀ ▶ Buttons**: Move left/right
- **A Button**: Jump
- **B Button**: Run (hold)

## 🚀 How to Run

### Option 1: Direct Open
Simply open `index.html` in a modern web browser.

### Option 2: Local Server (Recommended)
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server -p 8000
```

Then open `http://localhost:8000`

### Option 3: Live Server
If you're using VS Code, install the "Live Server" extension and click "Go Live".

## 📖 How to Play

### Objective
- Reach the flag at the end of each level
- Collect coins for points
- Defeat enemies by jumping on them
- Avoid falling into pits
- Complete levels before time runs out

### Scoring
- **Coins**: 100 points each
- **Enemy Stomp**: 200 points
- **Block Hit**: 50 points
- **Time Bonus**: 10 points per second remaining

### Tips
1. **Jump on enemies from above** to defeat them
2. **Hold run button** to jump farther
3. **Hit question blocks** from below for items
4. **Watch the timer** - you have 400 seconds per level
5. **Collect all coins** for maximum points
6. **Don't touch enemies from the side** - you'll lose a life!

## 🏗️ Project Structure

```
mario-game/
├── index.html              # Main HTML file
├── styles.css              # Game styling
├── js/
│   ├── config.js           # Game configuration
│   ├── graphics.js         # Procedural sprite generation
│   ├── entities.js         # Player, Enemy, Coin, Block classes
│   ├── physics.js          # Physics and collision detection
│   ├── level.js            # Level design and management
│   ├── game.js             # Main game logic
│   └── main.js             # Entry point and UI handlers
└── README.md               # This file
```

## 🔧 Technical Details

### PixiJS Setup
The game uses PixiJS 7 for rendering. All graphics are generated procedurally using PIXI.Graphics, so no image assets are required!

### Physics Engine
- **Gravity**: 0.8 pixels/frame²
- **Jump Force**: -15 pixels/frame
- **Max Fall Speed**: 15 pixels/frame
- **Walk Speed**: 3 pixels/frame
- **Run Speed**: 5-7 pixels/frame

### Collision Detection
Uses AABB (Axis-Aligned Bounding Box) collision detection with proper overlap resolution for:
- Player vs Blocks (ground, bricks, question blocks, pipes)
- Player vs Enemies (stomping or getting hit)
- Player vs Coins (collection)
- Enemy vs Blocks (turning around at walls)
- Player vs Flag (level completion)

### Game States
- **menu**: Start menu
- **playing**: Active gameplay
- **paused**: Game paused
- **gameover**: Game over screen
- **levelcomplete**: Level complete screen

### Level Design
Levels are defined as 2D arrays where each number represents a different tile type:
- `0`: Empty space
- `1`: Ground
- `2`: Brick block
- `3`: Question block
- `4`: Pipe top
- `5`: Pipe body
- `E`: Enemy spawn point
- `C`: Coin position
- `F`: Flag (level end)

## 🎨 Customization

### Changing Colors
Edit `js/config.js` and modify the `COLORS` object:
```javascript
COLORS: {
    SKY: 0x5c94fc,        // Sky blue
    GROUND: 0x8B4513,     // Brown
    BRICK: 0xCC6600,      // Orange-brown
    QUESTION: 0xFFAA00,   // Gold
    COIN: 0xFFD700,       // Gold
    PLAYER: 0xFF0000,     // Red (Mario)
    ENEMY: 0x8B0000       // Dark red (Goomba)
}
```

### Adjusting Physics
Edit `js/config.js` to change gameplay feel:
```javascript
GRAVITY: 0.8,           // Higher = falls faster
JUMP_FORCE: -15,        // Higher = jumps higher
WALK_SPEED: 3,          // Movement speed
RUN_SPEED: 5,           // Running speed
```

### Creating New Levels
Edit `js/level.js` and add a new level method:
```javascript
createLevel3() {
    const width = 200;
    const height = 17;
    const data = []; // Your level design
    
    return {
        width,
        height,
        data,
        enemies: [/* enemy positions */],
        coins: [/* coin positions */]
    };
}
```

### Adding New Sprites
Create new sprites in `js/graphics.js`:
```javascript
static createYourSprite(size) {
    const graphics = new PIXI.Graphics();
    // Draw your sprite
    return texture;
}
```

## 🐛 Known Limitations

1. **No sound effects** - Add Web Audio API for sounds
2. **Basic graphics** - Procedural graphics are simple
3. **Limited enemy AI** - Enemies only walk back and forth
4. **No power-ups** - No mushrooms or fire flowers yet
5. **Simple animations** - No sprite animations

## 🚀 Future Enhancements

### Easy Additions
- [ ] Sound effects (jump, coin, stomp, etc.)
- [ ] Background music
- [ ] Particle effects for coin collection
- [ ] More enemy types
- [ ] Power-ups (mushrooms, fire flowers)

### Medium Difficulty
- [ ] Sprite animations (walking, jumping)
- [ ] More level types (underground, castle)
- [ ] Breakable bricks
- [ ] Hidden blocks
- [ ] Moving platforms

### Advanced Features
- [ ] Boss battles
- [ ] Multiplayer mode
- [ ] Level editor
- [ ] Save/load system (localStorage)
- [ ] Leaderboards
- [ ] Achievement system

## 📱 Mobile Optimization

The game is fully optimized for mobile devices:
- Touch controls automatically appear on mobile/tablet
- Responsive canvas scaling
- Optimized performance for mobile browsers
- Prevents unwanted page scrolling
- Works in portrait and landscape modes

## 🌐 Browser Compatibility

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & iOS)
- ✅ Opera
- ⚠️ Older browsers may have performance issues

**Minimum Requirements:**
- ES6 JavaScript support
- WebGL support
- Modern browser (2020+)

## 📊 Performance

**Target**: 60 FPS
**Canvas Size**: 800×600
**Rendering**: Hardware-accelerated via WebGL

Tips for better performance:
- Close other browser tabs
- Update graphics drivers
- Use latest browser version
- Disable browser extensions

## 🎓 Learning Resources

### PixiJS
- [Official Documentation](https://pixijs.com/docs)
- [Examples](https://pixijs.io/examples/)
- [Tutorials](https://github.com/kittykatattack/learningPixi)

### Game Development
- [Game Programming Patterns](https://gameprogrammingpatterns.com/)
- [2D Collision Detection](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection)
- [Game Loop Explained](https://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing)

## 📝 Code Structure

### config.js
Game constants and configuration values

### graphics.js
Procedural sprite generation using PIXI.Graphics

### entities.js
Game entity classes:
- `Entity` - Base class
- `Player` - Player character
- `Enemy` - Enemy characters
- `Coin` - Collectible coins
- `Block` - Platform blocks
- `Flag` - Level end flag

### physics.js
Collision detection and resolution

### level.js
Level data and level management

### game.js
Main game loop and logic

### main.js
Initialization and UI handling

## 🤝 Contributing

Want to improve the game? Here's how:

1. **Add Sound**: Use Web Audio API or Howler.js
2. **Better Graphics**: Replace procedural graphics with sprite sheets
3. **More Levels**: Design new challenging levels
4. **New Features**: Add power-ups, different enemy types, etc.
5. **Optimize**: Improve performance for mobile devices

## 📄 License

This project is provided as-is for educational purposes.

## 🎉 Credits

- Built with [PixiJS](https://pixijs.com/)
- Inspired by Nintendo's Super Mario Bros.
- Created as a demonstration of game development with PixiJS

---

**Enjoy playing! 🍄👾🏁**

For questions or issues, check the code comments or modify the game to suit your needs!

