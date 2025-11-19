# 🎮 Super Mario Game - Quick Start

## What You Have

A **complete, playable Super Mario-style platformer game** built with PixiJS!

## 🚀 Play Now (3 Steps)

### Step 1: Open the Game
```bash
cd /Users/junghualiu/case/kastor/mario-game
```

### Step 2: Start a Server
```bash
# Choose one:
python3 -m http.server 8000
# OR
npx http-server -p 8000
```

### Step 3: Play!
Open your browser to: **http://localhost:8000**

**OR** simply double-click `index.html` to play immediately!

## 🕹️ Controls

### Desktop
- **← →** Move
- **Space** Jump
- **Shift** Run

### Mobile
- **◀ ▶** Move
- **A** Jump
- **B** Run

## ✨ Features

✅ Classic platformer gameplay
✅ Multiple levels
✅ Enemies to stomp
✅ Coins to collect
✅ Question blocks
✅ Mobile controls
✅ Score & lives system
✅ NO external assets needed!

## 🎯 Quick Tips

1. Jump on enemies from above to defeat them
2. Hit question blocks for points
3. Collect all coins for max score
4. Don't fall in pits!
5. Reach the flag before time runs out

## 📊 Game Stats

- **Total Lines**: 2,581
- **Files**: 10
- **No Dependencies**: Just PixiJS from CDN
- **Graphics**: 100% procedurally generated!

## 🔧 Customization

Want to change something? Check these files:

- **`js/config.js`** - Game settings (speed, gravity, etc.)
- **`js/level.js`** - Level design
- **`js/graphics.js`** - Sprite appearance
- **`styles.css`** - UI colors and styling

## 🎮 What Works

✅ Player movement & physics
✅ Jumping & running
✅ Collision detection
✅ Enemy AI (walk & turn)
✅ Coin collection
✅ Block interactions
✅ Score tracking
✅ Lives system
✅ Timer
✅ Level progression
✅ Game over & level complete screens
✅ Mobile touch controls
✅ Scrolling camera
✅ Multiple levels

## 📂 Project Structure

```
mario-game/
├── index.html          # Main game page
├── styles.css          # Retro Mario styling
├── js/
│   ├── config.js       # Configuration
│   ├── graphics.js     # Sprite generation
│   ├── entities.js     # Player, Enemy, Coin, Block
│   ├── physics.js      # Collision detection
│   ├── level.js        # Level designs
│   ├── game.js         # Main game logic
│   └── main.js         # Initialization
└── README.md           # Full documentation
```

## 🎨 Tech Highlights

### Procedural Graphics
All sprites are drawn with code - no image files needed!
- Player (Mario-style character)
- Enemies (Goomba-style)
- Coins (spinning gold)
- Blocks (bricks, question blocks)
- Ground & pipes
- Flag

### Physics Engine
- Gravity simulation
- Jump mechanics with hold-to-jump-higher
- Velocity and acceleration
- Smooth movement

### Collision Detection
- AABB collision detection
- Proper overlap resolution
- Multiple collision types:
  - Player vs Blocks
  - Player vs Enemies
  - Player vs Coins
  - Enemy vs Blocks

### Game States
- Menu system
- Playing state
- Pause functionality
- Game over screen
- Level complete screen

## 🎯 Gameplay Objective

**Goal**: Reach the flag at the end of each level!

**Score Points By:**
- Collecting coins (100 pts each)
- Stomping enemies (200 pts)
- Time bonus (faster = more points)

**Avoid:**
- Touching enemies from the side
- Falling into pits
- Running out of time

## 🏆 Challenge Yourself

- Beat Level 1 without losing a life
- Collect all coins in one run
- Speed run: complete as fast as possible
- No enemy kills: avoid all enemies

## 🐛 Troubleshooting

**Game won't load?**
- Use a local server (see Step 2 above)
- Check browser console for errors
- Make sure JavaScript is enabled

**Controls not working?**
- Click on the game canvas first
- Check if mobile controls appear on small screens
- Try a different browser

**Performance issues?**
- Close other tabs
- Update your browser
- Try desktop instead of mobile

## 🚀 Next Steps

Want to enhance the game?

**Easy:**
- Edit colors in `config.js`
- Adjust jump height/speed
- Add more coins to levels
- Change enemy speed

**Medium:**
- Design new levels in `level.js`
- Add new enemy types
- Create power-ups
- Add sound effects

**Advanced:**
- Implement sprite animations
- Add boss battles
- Create level editor
- Add multiplayer

## 📞 Need Help?

Check the full **README.md** for:
- Detailed documentation
- Code structure explanation
- Customization guides
- Learning resources

---

## 🎉 Ready to Play!

```bash
# Start server
python3 -m http.server 8000

# Open browser
http://localhost:8000

# Have fun! 🍄
```

**Enjoy the game!** 🎮👾🏁

