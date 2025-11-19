/**
 * Game Configuration
 */

const CONFIG = {
    // Game Settings (Vertical orientation)
    WIDTH: 480,
    HEIGHT: 800,
    TILE_SIZE: 32,
    
    // Physics (EXTREME FALLING!)
    GRAVITY: 5.0,      // MEGA STRONG GRAVITY!
    MAX_FALL_SPEED: 15000,  // 100x FASTER FALL!
    JUMP_FORCE: -450,  // MEGA VERTICAL JUMP! (10x)
    WALK_SPEED: 40,    // Slower horizontal (10x slower)
    RUN_SPEED: 60,     // Controlled horizontal
    FRICTION: 0.92,
    AIR_RESISTANCE: 0.98,
    
    // Player (VERTICAL ROCKET MODE!)
    PLAYER: {
        WIDTH: 28,
        HEIGHT: 32,
        JUMP_FORCE: -450,      // MEGA VERTICAL! (10x jump)
        WALK_SPEED: 40,        // Slower horizontal control
        RUN_SPEED: 60,         // Manageable speed
        ACCELERATION: 5,       // Moderate acceleration
        DECELERATION: 0.88,    // Good control
        MAX_SPEED: 50,         // Reasonable horizontal
        MAX_RUN_SPEED: 70      // Still fast but controllable
    },
    
    // Enemy
    ENEMY: {
        WIDTH: 28,
        HEIGHT: 28,
        SPEED: 1.5,
        JUMP_DEATH_VEL: -10
    },
    
    // Coin
    COIN: {
        WIDTH: 24,
        HEIGHT: 24,
        POINTS: 100,
        ROTATION_SPEED: 0.05
    },
    
    // Block
    BLOCK: {
        SIZE: 32,
        BUMP_HEIGHT: 10,
        BUMP_SPEED: 0.3
    },
    
    // Game Rules
    STARTING_LIVES: 3,
    TIME_LIMIT: 400,
    TIME_WARNING: 100,
    
    // Scoring
    POINTS: {
        COIN: 100,
        ENEMY_STOMP: 200,
        BLOCK_HIT: 50,
        TIME_BONUS: 10 // per second remaining
    },
    
    // Colors (for procedural graphics)
    COLORS: {
        SKY: 0x5c94fc,
        GROUND: 0x8B4513,
        GRASS: 0x00AA00,
        BRICK: 0xCC6600,
        QUESTION: 0xFFAA00,
        PIPE: 0x00AA00,
        COIN: 0xFFD700,
        PLAYER: 0xFF0000,
        ENEMY: 0x8B0000
    },
    
    // Camera (Vertical following)
    CAMERA: {
        FOLLOW_OFFSET: 300,  // Keep player in lower third
        SMOOTH_FACTOR: 0.15,
        MIN_Y: 0,
        DEADZONE_Y: 150,
        VERTICAL: true  // Camera follows Y axis
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

