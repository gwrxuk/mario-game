/**
 * Level Design and Management
 * Vertical jumping game - Mario jumps UP!
 */

class LevelManager {
    constructor() {
        this.currentLevel = 1;
        this.levels = this.createLevels();
    }
    
    createLevels() {
        return {
            1: this.createVerticalLevel1(),
            2: this.createVerticalLevel2()
        };
    }
    
    /**
     * Create vertical level - Mario jumps upward!
     */
    createVerticalLevel1() {
        const width = 15;  // Narrow for mobile
        const height = 100; // Very tall for upward climbing
        
        // Create empty level
        const data = [];
        for (let y = 0; y < height; y++) {
            data[y] = [];
            for (let x = 0; x < width; x++) {
                data[y][x] = 0;
            }
        }
        
        // Starting platform at bottom
        for (let x = 2; x < 13; x++) {
            data[height - 2][x] = 1;
        }
        
        // Create ascending platforms in a zigzag pattern
        let currentY = height - 8;
        let direction = 1;  // 1 = right, -1 = left
        let currentX = 3;
        
        for (let i = 0; i < 30; i++) {
            // Platform width varies
            const platformWidth = 3 + Math.floor(Math.random() * 2);
            
            for (let x = currentX; x < Math.min(currentX + platformWidth, width); x++) {
                if (x >= 0 && x < width && currentY >= 0) {
                    const blockType = Math.random() > 0.7 ? 3 : 2;  // Question or brick
                    data[currentY][x] = blockType;
                }
            }
            
            // Move up and alternate left/right
            currentY -= 3 + Math.floor(Math.random() * 2);
            currentX += direction * (2 + Math.floor(Math.random() * 3));
            
            // Bounce off edges
            if (currentX < 1) {
                currentX = 1;
                direction = 1;
            } else if (currentX > width - 5) {
                currentX = width - 5;
                direction = -1;
            }
        }
        
        // Flag at the top
        data[5][7] = 'F';
        
        return {
            width,
            height,
            data,
            enemies: [
                // Floating enemies at various heights
                { x: 7, y: height - 10 },
                { x: 10, y: height - 20 },
                { x: 5, y: height - 30 },
                { x: 8, y: height - 40 },
                { x: 6, y: height - 50 }
            ],
            coins: [
                // Coins scattered vertically
                { x: 5, y: height - 12 },
                { x: 9, y: height - 15 },
                { x: 7, y: height - 22 },
                { x: 4, y: height - 28 },
                { x: 11, y: height - 35 },
                { x: 6, y: height - 42 },
                { x: 8, y: height - 48 },
                { x: 10, y: height - 55 },
                { x: 5, y: height - 62 },
                { x: 7, y: height - 70 }
            ]
        };
    }
    
    createVerticalLevel2() {
        const width = 15;
        const height = 120;
        
        const data = [];
        for (let y = 0; y < height; y++) {
            data[y] = [];
            for (let x = 0; x < width; x++) {
                data[y][x] = 0;
            }
        }
        
        // Starting platform
        for (let x = 4; x < 11; x++) {
            data[height - 2][x] = 1;
        }
        
        // Create spiral staircase pattern
        let currentY = height - 8;
        let angle = 0;
        const centerX = 7;
        const radius = 4;
        
        for (let i = 0; i < 40; i++) {
            const x = Math.floor(centerX + Math.cos(angle) * radius);
            const platformWidth = 3;
            
            for (let px = x; px < Math.min(x + platformWidth, width); px++) {
                if (px >= 0 && px < width && currentY >= 0) {
                    data[currentY][px] = Math.random() > 0.6 ? 3 : 2;
                }
            }
            
            currentY -= 3;
            angle += Math.PI / 4;
        }
        
        // Flag at top
        data[8][7] = 'F';
        
        return {
            width,
            height,
            data,
            enemies: [
                { x: 7, y: height - 15 },
                { x: 9, y: height - 30 },
                { x: 5, y: height - 45 },
                { x: 8, y: height - 60 }
            ],
            coins: [
                { x: 7, y: height - 18 },
                { x: 6, y: height - 32 },
                { x: 9, y: height - 48 },
                { x: 7, y: height - 65 }
            ]
        };
    }
    
    getLevel(levelNumber) {
        return this.levels[levelNumber] || this.levels[1];
    }
    
    getCurrentLevel() {
        return this.getLevel(this.currentLevel);
    }
    
    nextLevel() {
        this.currentLevel++;
        if (!this.levels[this.currentLevel]) {
            this.currentLevel = 1;
        }
        return this.getCurrentLevel();
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LevelManager;
}
