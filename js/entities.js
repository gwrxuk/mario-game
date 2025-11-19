/**
 * Game Entities
 * Player, Enemy, Coin, Block classes
 */

class Entity extends PIXI.Sprite {
    constructor(texture) {
        super(texture);
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.onGround = false;
        this.dead = false;
    }
    
    update(delta) {
        // Apply velocity
        this.x += this.velocity.x * delta;
        this.y += this.velocity.y * delta;
    }
    
    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }
}

class Player extends Entity {
    constructor(texture) {
        super(texture);
        this.width = CONFIG.PLAYER.WIDTH;
        this.height = CONFIG.PLAYER.HEIGHT;
        this.facingRight = true;
        this.jumping = false;
        this.running = false;
        this.invincible = false;
        this.invincibleTimer = 0;
        this.jumpPressTime = 0;
        this.maxJumpPressTime = 0.3;
    }
    
    jump() {
        if (this.onGround && !this.jumping) {
            this.velocity.y = CONFIG.PLAYER.JUMP_FORCE;
            this.jumping = true;
            this.onGround = false;
            this.jumpPressTime = 0;
        }
    }
    
    moveLeft() {
        this.acceleration.x = -CONFIG.PLAYER.ACCELERATION;
        this.facingRight = false;
    }
    
    moveRight() {
        this.acceleration.x = CONFIG.PLAYER.ACCELERATION;
        this.facingRight = true;
    }
    
    stopMoving() {
        this.acceleration.x = 0;
    }
    
    update(delta) {
        // Apply acceleration
        this.velocity.x += this.acceleration.x;
        
        // Apply friction
        if (this.onGround) {
            this.velocity.x *= CONFIG.PLAYER.DECELERATION;
        } else {
            this.velocity.x *= 0.98;
        }
        
        // Limit speed
        const maxSpeed = this.running ? CONFIG.PLAYER.MAX_RUN_SPEED : CONFIG.PLAYER.MAX_SPEED;
        if (Math.abs(this.velocity.x) > maxSpeed) {
            this.velocity.x = maxSpeed * Math.sign(this.velocity.x);
        }
        
        // Apply normal gravity (downward)
        if (!this.onGround) {
            this.velocity.y += CONFIG.GRAVITY;
            if (this.velocity.y > CONFIG.MAX_FALL_SPEED) {
                this.velocity.y = CONFIG.MAX_FALL_SPEED;
            }
        }
        
        // Jump hold for higher jumps
        if (this.jumping && this.jumpPressTime < this.maxJumpPressTime) {
            this.jumpPressTime += delta;
            this.velocity.y = CONFIG.PLAYER.JUMP_FORCE;
        }
        
        // Update invincibility
        if (this.invincible) {
            this.invincibleTimer -= delta;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
                this.alpha = 1;
            } else {
                // Flashing effect
                this.alpha = Math.sin(this.invincibleTimer * 20) > 0 ? 1 : 0.3;
            }
        }
        
        // Flip sprite based on direction
        this.scale.x = this.facingRight ? 1 : -1;
        
        // Reset onGround flag (will be set by collision detection)
        this.onGround = false;
        
        super.update(delta);
    }
    
    hit() {
        if (!this.invincible) {
            this.invincible = true;
            this.invincibleTimer = 2;
            this.velocity.y = -10;
            return true;
        }
        return false;
    }
    
    die() {
        this.dead = true;
        this.velocity.y = -15;
        this.velocity.x = 0;
    }
}

class Enemy extends Entity {
    constructor(texture, x, y) {
        super(texture);
        this.x = x;
        this.y = y;
        this.width = CONFIG.ENEMY.WIDTH;
        this.height = CONFIG.ENEMY.HEIGHT;
        this.velocity.x = -CONFIG.ENEMY.SPEED;
        this.stomped = false;
    }
    
    update(delta) {
        if (!this.stomped) {
            // Apply gravity
            this.velocity.y += CONFIG.GRAVITY;
            if (this.velocity.y > CONFIG.MAX_FALL_SPEED) {
                this.velocity.y = CONFIG.MAX_FALL_SPEED;
            }
        } else {
            // Fade out after being stomped
            this.alpha -= delta * 2;
            if (this.alpha <= 0) {
                this.dead = true;
            }
        }
        
        super.update(delta);
    }
    
    stomp() {
        if (!this.stomped) {
            this.stomped = true;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.scale.y = 0.3;
            return true;
        }
        return false;
    }
    
    reverseDirection() {
        this.velocity.x *= -1;
    }
}

class Coin extends Entity {
    constructor(texture, x, y) {
        super(texture);
        this.x = x;
        this.y = y;
        this.width = CONFIG.COIN.WIDTH;
        this.height = CONFIG.COIN.HEIGHT;
        this.anchor.set(0.5);
        this.collected = false;
        this.animationTime = 0;
    }
    
    update(delta) {
        if (!this.collected) {
            // Rotation animation
            this.rotation += CONFIG.COIN.ROTATION_SPEED;
            
            // Bobbing animation
            this.animationTime += delta;
            this.y += Math.sin(this.animationTime * 3) * 0.5;
        } else {
            // Collection animation
            this.y -= 5;
            this.alpha -= 0.05;
            if (this.alpha <= 0) {
                this.dead = true;
            }
        }
        
        super.update(delta);
    }
    
    collect() {
        if (!this.collected) {
            this.collected = true;
            return CONFIG.POINTS.COIN;
        }
        return 0;
    }
}

class Block extends PIXI.Sprite {
    constructor(texture, x, y, type = 'brick') {
        super(texture);
        this.x = x;
        this.y = y;
        this.width = CONFIG.BLOCK.SIZE;
        this.height = CONFIG.BLOCK.SIZE;
        this.type = type; // 'brick', 'question', 'ground', 'pipe'
        this.originalY = y;
        this.bumping = false;
        this.bumpOffset = 0;
        this.bumpDirection = 1;
        this.hasItem = type === 'question';
        this.used = false;
    }
    
    update(delta) {
        if (this.bumping) {
            this.bumpOffset += CONFIG.BLOCK.BUMP_SPEED * this.bumpDirection * delta;
            
            if (this.bumpDirection === 1 && this.bumpOffset >= CONFIG.BLOCK.BUMP_HEIGHT) {
                this.bumpDirection = -1;
            } else if (this.bumpDirection === -1 && this.bumpOffset <= 0) {
                this.bumping = false;
                this.bumpOffset = 0;
                this.bumpDirection = 1;
            }
            
            this.y = this.originalY - this.bumpOffset;
        }
    }
    
    hit() {
        if (!this.bumping) {
            this.bumping = true;
            
            if (this.type === 'question' && !this.used) {
                this.used = true;
                // Change texture to used block (would use a different texture in production)
                this.tint = 0x888888;
                return true; // Returns true if has item
            } else if (this.type === 'brick') {
                // Could break brick here
                return false;
            }
        }
        return false;
    }
    
    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }
}

class Flag extends PIXI.Sprite {
    constructor(texture, x, y) {
        super(texture);
        this.x = x;
        this.y = y;
        this.touched = false;
    }
    
    touch() {
        this.touched = true;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Entity, Player, Enemy, Coin, Block, Flag };
}

