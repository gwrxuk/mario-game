/**
 * Physics and Collision Detection
 */

class Physics {
    /**
     * Check and resolve collision between two rectangles
     */
    static checkCollision(rect1, rect2) {
        return rect1.left < rect2.right &&
               rect1.right > rect2.left &&
               rect1.top < rect2.bottom &&
               rect1.bottom > rect2.top;
    }
    
    /**
     * Resolve collision between player and block
     */
    static resolvePlayerBlockCollision(player, block) {
        const playerBounds = player.getBounds();
        const blockBounds = block.getBounds();
        
        if (!this.checkCollision(playerBounds, blockBounds)) {
            return false;
        }
        
        // Calculate overlap on each axis
        const overlapLeft = playerBounds.right - blockBounds.left;
        const overlapRight = blockBounds.right - playerBounds.left;
        const overlapTop = playerBounds.bottom - blockBounds.top;
        const overlapBottom = blockBounds.bottom - playerBounds.top;
        
        // Find minimum overlap
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
        
        // Resolve based on which side has minimum overlap
        if (minOverlap === overlapTop && player.velocity.y > 0) {
            // Player hitting block from top (landing on it)
            player.y = blockBounds.top - player.height;
            player.velocity.y = 0;
            player.onGround = true;
            player.jumping = false;
        } else if (minOverlap === overlapBottom && player.velocity.y < 0) {
            // Player hitting block from bottom (head hitting)
            player.y = blockBounds.bottom;
            player.velocity.y = 0;
            block.hit();
        } else if (minOverlap === overlapLeft) {
            // Player hitting from right
            player.x = blockBounds.left - player.width;
            player.velocity.x = 0;
        } else if (minOverlap === overlapRight) {
            // Player hitting from left
            player.x = blockBounds.right;
            player.velocity.x = 0;
        }
        
        return true;
    }
    
    /**
     * Resolve collision between player and enemy
     */
    static resolvePlayerEnemyCollision(player, enemy) {
        const playerBounds = player.getBounds();
        const enemyBounds = enemy.getBounds();
        
        if (!this.checkCollision(playerBounds, enemyBounds)) {
            return null;
        }
        
        if (enemy.stomped) {
            return null;
        }
        
        // Check if player is stomping enemy (coming from above)
        const overlapTop = playerBounds.bottom - enemyBounds.top;
        const overlapBottom = enemyBounds.bottom - playerBounds.top;
        
        if (overlapTop < overlapBottom && player.velocity.y > 0) {
            // Player stomped enemy
            enemy.stomp();
            player.velocity.y = CONFIG.ENEMY.JUMP_DEATH_VEL;
            player.onGround = false;
            return 'stomp';
        } else {
            // Enemy hit player
            return 'hit';
        }
    }
    
    /**
     * Resolve collision between enemy and block
     */
    static resolveEnemyBlockCollision(enemy, block) {
        const enemyBounds = enemy.getBounds();
        const blockBounds = block.getBounds();
        
        if (!this.checkCollision(enemyBounds, blockBounds)) {
            return false;
        }
        
        // Calculate overlap
        const overlapLeft = enemyBounds.right - blockBounds.left;
        const overlapRight = blockBounds.right - enemyBounds.left;
        const overlapTop = enemyBounds.bottom - blockBounds.top;
        const overlapBottom = blockBounds.bottom - enemyBounds.top;
        
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
        
        if (minOverlap === overlapTop && enemy.velocity.y > 0) {
            // Enemy landing on block
            enemy.y = blockBounds.top - enemy.height;
            enemy.velocity.y = 0;
            enemy.onGround = true;
        } else if (minOverlap === overlapLeft || minOverlap === overlapRight) {
            // Enemy hitting wall, reverse direction
            enemy.reverseDirection();
        }
        
        return true;
    }
    
    /**
     * Check if player collected a coin
     */
    static checkCoinCollection(player, coin) {
        const playerBounds = player.getBounds();
        const coinBounds = coin.getBounds();
        
        return this.checkCollision(playerBounds, coinBounds);
    }
    
    /**
     * Check if player touched the flag
     */
    static checkFlagTouch(player, flag) {
        const playerBounds = player.getBounds();
        const flagBounds = {
            left: flag.x,
            right: flag.x + flag.width,
            top: flag.y,
            bottom: flag.y + flag.height
        };
        
        return this.checkCollision(playerBounds, flagBounds);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Physics;
}

