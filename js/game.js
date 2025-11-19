/**
 * Main Game Class
 */

class MarioGame {
    constructor() {
        this.app = null;
        this.player = null;
        this.enemies = [];
        this.coins = [];
        this.blocks = [];
        this.flag = null;
        
        this.gameContainer = null;
        this.worldContainer = null;
        
        this.levelManager = new LevelManager();
        this.currentLevel = null;
        
        this.camera = { x: 0, y: 0, targetY: 0 };
        
        this.score = 0;
        this.coinCount = 0;
        this.lives = CONFIG.STARTING_LIVES;
        this.time = CONFIG.TIME_LIMIT;
        this.gameState = 'menu'; // menu, playing, paused, gameover, levelcomplete
        
        this.keys = {};
        this.mobileControls = {
            left: false,
            right: false,
            jump: false,
            run: false
        };
        
        this.timeSinceLastUpdate = 0;
    }
    
    async init() {
        // Create PixiJS application
        this.app = new PIXI.Application({
            width: CONFIG.WIDTH,
            height: CONFIG.HEIGHT,
            backgroundColor: CONFIG.COLORS.SKY,
            antialias: false,
            resolution: window.devicePixelRatio || 1
        });
        
        document.getElementById('game-container').appendChild(this.app.view);
        
        // Create containers
        this.worldContainer = new PIXI.Container();
        this.gameContainer = new PIXI.Container();
        this.app.stage.addChild(this.gameContainer);
        this.gameContainer.addChild(this.worldContainer);
        
        // Generate textures using app renderer
        this.textures = {
            player: GraphicsGenerator.createPlayer(this.app),
            enemy: GraphicsGenerator.createEnemy(this.app),
            coin: GraphicsGenerator.createCoin(this.app),
            brick: GraphicsGenerator.createBrick(this.app),
            question: GraphicsGenerator.createQuestionBlock(this.app),
            ground: GraphicsGenerator.createGround(this.app),
            pipeTop: GraphicsGenerator.createPipe(this.app, 32, true),
            pipeBody: GraphicsGenerator.createPipe(this.app, 32, false),
            flag: GraphicsGenerator.createFlag(this.app)
        };
        
        // Setup input
        this.setupInput();
        
        // Setup game loop
        this.app.ticker.add((delta) => this.gameLoop(delta));
        
        // Hide loading screen
        document.getElementById('loading-screen').classList.add('hidden');
        
        return true;
    }
    
    setupInput() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ' || e.key === 'ArrowUp') {
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Mobile controls
        const setupMobileButton = (id, action) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.mobileControls[action] = true;
                });
                btn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.mobileControls[action] = false;
                });
            }
        };
        
        setupMobileButton('btn-left', 'left');
        setupMobileButton('btn-right', 'right');
        setupMobileButton('btn-jump', 'jump');
        setupMobileButton('btn-run', 'run');
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.coinCount = 0;
        this.lives = CONFIG.STARTING_LIVES;
        this.time = CONFIG.TIME_LIMIT;
        this.levelManager.currentLevel = 1;
        
        this.loadLevel();
        this.updateHUD();
        
        // Hide menu
        document.getElementById('start-menu').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
    }
    
    loadLevel() {
        // Clear existing entities
        this.worldContainer.removeChildren();
        this.enemies = [];
        this.coins = [];
        this.blocks = [];
        
        // Get level data
        this.currentLevel = this.levelManager.getCurrentLevel();
        const data = this.currentLevel.data;
        
        // Create level geometry
        for (let y = 0; y < data.length; y++) {
            for (let x = 0; x < data[y].length; x++) {
                const tile = data[y][x];
                const posX = x * CONFIG.TILE_SIZE;
                const posY = y * CONFIG.TILE_SIZE;
                
                if (tile === 1) {
                    const block = new Block(this.textures.ground, posX, posY, 'ground');
                    this.blocks.push(block);
                    this.worldContainer.addChild(block);
                } else if (tile === 2) {
                    const block = new Block(this.textures.brick, posX, posY, 'brick');
                    this.blocks.push(block);
                    this.worldContainer.addChild(block);
                } else if (tile === 3) {
                    const block = new Block(this.textures.question, posX, posY, 'question');
                    this.blocks.push(block);
                    this.worldContainer.addChild(block);
                } else if (tile === 4) {
                    const block = new Block(this.textures.pipeTop, posX, posY, 'pipe');
                    this.blocks.push(block);
                    this.worldContainer.addChild(block);
                } else if (tile === 5) {
                    const block = new Block(this.textures.pipeBody, posX, posY, 'pipe');
                    this.blocks.push(block);
                    this.worldContainer.addChild(block);
                } else if (tile === 'F') {
                    this.flag = new Flag(this.textures.flag, posX, posY);
                    this.worldContainer.addChild(this.flag);
                }
            }
        }
        
        // Create enemies
        this.currentLevel.enemies.forEach(enemyData => {
            const enemy = new Enemy(
                this.textures.enemy,
                enemyData.x * CONFIG.TILE_SIZE,
                enemyData.y * CONFIG.TILE_SIZE
            );
            this.enemies.push(enemy);
            this.worldContainer.addChild(enemy);
        });
        
        // Create coins
        this.currentLevel.coins.forEach(coinData => {
            const coin = new Coin(
                this.textures.coin,
                coinData.x * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
                coinData.y * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2
            );
            this.coins.push(coin);
            this.worldContainer.addChild(coin);
        });
        
        // Create player LAST (so it renders on top)
        this.player = new Player(this.textures.player);
        this.player.x = CONFIG.WIDTH / 2 - CONFIG.PLAYER.WIDTH / 2;  // Center horizontally
        this.player.y = CONFIG.HEIGHT - 150;  // Start near bottom
        this.player.visible = true;
        this.player.alpha = 1;
        // Set explicit dimensions based on texture
        if (this.player.texture && this.player.texture.width) {
            console.log('Player texture size:', this.player.texture.width, 'x', this.player.texture.height);
        }
        console.log('Player created at:', this.player.x, this.player.y);
        this.worldContainer.addChild(this.player);
        console.log('Player added to world, children count:', this.worldContainer.children.length);
        
        // Reset camera
        this.camera.x = 0;
        this.camera.y = 0;
        this.camera.targetY = 0;
    }
    
    gameLoop(delta) {
        if (this.gameState !== 'playing') return;
        
        const deltaTime = delta / 60; // Normalize to 60 FPS
        
        // Update timer
        this.timeSinceLastUpdate += deltaTime;
        if (this.timeSinceLastUpdate >= 1) {
            this.time--;
            this.timeSinceLastUpdate = 0;
            
            if (this.time <= 0) {
                this.playerDeath();
            }
        }
        
        this.handleInput();
        this.updatePlayer(deltaTime);
        this.updateEnemies(deltaTime);
        this.updateCoins(deltaTime);
        this.updateBlocks(deltaTime);
        this.updateCamera(deltaTime);
        this.checkCollisions();
        this.updateHUD();
        
        // Check if player fell off bottom of screen
        if (this.player.y > this.camera.y + CONFIG.HEIGHT + 100) {
            this.playerDeath();
        }
        
        // Check if reached the top goal
        if (this.flag && !this.flag.touched && Physics.checkFlagTouch(this.player, this.flag)) {
            this.levelComplete();
        }
    }
    
    handleInput() {
        if (!this.player || this.player.dead) return;
        
        const isLeft = this.keys['ArrowLeft'] || this.mobileControls.left;
        const isRight = this.keys['ArrowRight'] || this.mobileControls.right;
        const isJump = this.keys[' '] || this.keys['ArrowUp'] || this.mobileControls.jump;
        const isRun = this.keys['Shift'] || this.mobileControls.run;
        
        this.player.running = isRun;
        
        if (isLeft) {
            this.player.moveLeft();
        } else if (isRight) {
            this.player.moveRight();
        } else {
            this.player.stopMoving();
        }
        
        if (isJump) {
            this.player.jump();
        } else {
            this.player.jumpPressTime = this.player.maxJumpPressTime; // Stop jump boost
        }
    }
    
    updatePlayer(delta) {
        if (this.player) {
            this.player.update(delta);
        }
    }
    
    updateEnemies(delta) {
        this.enemies = this.enemies.filter(enemy => {
            if (!enemy.dead) {
                enemy.update(delta);
                return true;
            }
            this.worldContainer.removeChild(enemy);
            return false;
        });
    }
    
    updateCoins(delta) {
        this.coins = this.coins.filter(coin => {
            if (!coin.dead) {
                coin.update(delta);
                return true;
            }
            this.worldContainer.removeChild(coin);
            return false;
        });
    }
    
    updateBlocks(delta) {
        this.blocks.forEach(block => block.update(delta));
    }
    
    updateCamera(delta) {
        // Camera follows player UPWARD as they climb
        // Keep player in lower third of screen
        this.camera.targetY = Math.max(0, this.player.y - CONFIG.HEIGHT + 250);
        
        // Smooth camera movement
        this.camera.y += (this.camera.targetY - this.camera.y) * CONFIG.CAMERA.SMOOTH_FACTOR;
        
        // Never let camera go below 0
        this.camera.y = Math.max(0, this.camera.y);
        
        // Apply camera offset (move world down as player goes up)
        this.worldContainer.y = -this.camera.y;
    }
    
    checkCollisions() {
        if (!this.player || this.player.dead) return;
        
        // Player vs Blocks
        this.blocks.forEach(block => {
            Physics.resolvePlayerBlockCollision(this.player, block);
        });
        
        // Player vs Enemies
        this.enemies.forEach(enemy => {
            const result = Physics.resolvePlayerEnemyCollision(this.player, enemy);
            if (result === 'stomp') {
                this.addScore(CONFIG.POINTS.ENEMY_STOMP);
            } else if (result === 'hit') {
                if (this.player.hit()) {
                    this.lives--;
                    if (this.lives <= 0) {
                        this.playerDeath();
                    }
                }
            }
        });
        
        // Player vs Coins
        this.coins.forEach(coin => {
            if (Physics.checkCoinCollection(this.player, coin)) {
                const points = coin.collect();
                if (points > 0) {
                    this.addScore(points);
                    this.coinCount++;
                }
            }
        });
        
        // Enemies vs Blocks
        this.enemies.forEach(enemy => {
            this.blocks.forEach(block => {
                Physics.resolveEnemyBlockCollision(enemy, block);
            });
        });
    }
    
    addScore(points) {
        this.score += points;
    }
    
    playerDeath() {
        this.lives--;
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Respawn
            this.player.x = 100;
            this.player.y = 300;
            this.player.velocity = { x: 0, y: 0 };
            this.player.dead = false;
            this.time = CONFIG.TIME_LIMIT;
        }
    }
    
    levelComplete() {
        this.flag.touch();
        this.gameState = 'levelcomplete';
        
        const timeBonus = this.time * CONFIG.POINTS.TIME_BONUS;
        this.addScore(timeBonus);
        
        document.getElementById('level-score').textContent = this.score;
        document.getElementById('time-bonus').textContent = timeBonus;
        document.getElementById('level-complete-screen').classList.remove('hidden');
    }
    
    nextLevel() {
        document.getElementById('level-complete-screen').classList.add('hidden');
        this.levelManager.nextLevel();
        this.time = CONFIG.TIME_LIMIT;
        this.loadLevel();
        this.gameState = 'playing';
    }
    
    gameOver() {
        this.gameState = 'gameover';
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-coins').textContent = this.coinCount;
        document.getElementById('game-over-screen').classList.remove('hidden');
    }
    
    updateHUD() {
        document.getElementById('score').textContent = String(this.score).padStart(6, '0');
        document.getElementById('coins').textContent = '×' + String(this.coinCount).padStart(2, '0');
        document.getElementById('world').textContent = '1-' + this.levelManager.currentLevel;
        document.getElementById('time').textContent = String(this.time).padStart(3, '0');
        document.getElementById('lives').textContent = '×' + String(this.lives).padStart(2, '0');
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarioGame;
}

