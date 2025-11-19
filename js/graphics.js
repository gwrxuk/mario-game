/**
 * Graphics and Sprite Generation
 * Creates procedural sprites for the game
 */

class GraphicsGenerator {
    /**
     * Create player sprite
     */
    static createPlayer(app, size = 32) {
        const graphics = new PIXI.Graphics();
        
        // Body (red overalls)
        graphics.beginFill(0xFF0000);
        graphics.drawRect(6, 10, 20, 22);
        graphics.endFill();
        
        // Head (skin tone)
        graphics.beginFill(0xFFCCBB);
        graphics.drawRect(8, 4, 16, 12);
        graphics.endFill();
        
        // Hat (red)
        graphics.beginFill(0xFF0000);
        graphics.drawRect(6, 0, 20, 6);
        graphics.endFill();
        
        // Eyes (simple dots)
        graphics.beginFill(0x000000);
        graphics.drawCircle(12, 8, 2);
        graphics.drawCircle(20, 8, 2);
        graphics.endFill();
        
        // Mustache
        graphics.beginFill(0x8B4513);
        graphics.drawRect(10, 12, 12, 3);
        graphics.endFill();
        
        // Feet/shoes
        graphics.beginFill(0x8B4513);
        graphics.drawRect(6, 28, 8, 4);
        graphics.drawRect(18, 28, 8, 4);
        graphics.endFill();
        
        return app.renderer.generateTexture(graphics);
    }
    
    /**
     * Create enemy sprite (Goomba-like)
     */
    static createEnemy(app, size = 28) {
        const graphics = new PIXI.Graphics();
        
        // Body (brown)
        graphics.beginFill(0x8B4513);
        graphics.drawRoundedRect(2, 8, 24, 16, 4);
        graphics.endFill();
        
        // Eyes (angry)
        graphics.beginFill(0xFFFFFF);
        graphics.drawCircle(10, 12, 4);
        graphics.drawCircle(18, 12, 4);
        graphics.endFill();
        
        graphics.beginFill(0x000000);
        graphics.drawCircle(11, 12, 2);
        graphics.drawCircle(17, 12, 2);
        graphics.endFill();
        
        // Eyebrows (angry)
        graphics.lineStyle(2, 0x000000);
        graphics.moveTo(6, 10);
        graphics.lineTo(12, 9);
        graphics.moveTo(16, 9);
        graphics.lineTo(22, 10);
        graphics.lineStyle(0);
        
        // Feet
        graphics.beginFill(0x654321);
        graphics.drawRect(4, 24, 8, 4);
        graphics.drawRect(16, 24, 8, 4);
        graphics.endFill();
        
        return app.renderer.generateTexture(graphics);
    }
    
    /**
     * Create coin sprite
     */
    static createCoin(app, size = 24) {
        const graphics = new PIXI.Graphics();
        
        // Outer circle (gold)
        graphics.beginFill(0xFFD700);
        graphics.drawCircle(12, 12, 10);
        graphics.endFill();
        
        // Inner circle (lighter gold)
        graphics.beginFill(0xFFFF00);
        graphics.drawCircle(12, 12, 7);
        graphics.endFill();
        
        // Symbol or shine
        graphics.beginFill(0xFFD700);
        graphics.drawRect(10, 8, 4, 8);
        graphics.drawRect(8, 10, 8, 4);
        graphics.endFill();
        
        return app.renderer.generateTexture(graphics);
    }
    
    /**
     * Create brick block
     */
    static createBrick(app, size = 32) {
        const graphics = new PIXI.Graphics();
        
        // Background
        graphics.beginFill(0xCC6600);
        graphics.drawRect(0, 0, size, size);
        graphics.endFill();
        
        // Brick pattern
        graphics.lineStyle(2, 0x8B4513);
        
        // Horizontal lines
        graphics.moveTo(0, size / 2);
        graphics.lineTo(size, size / 2);
        
        // Vertical lines
        graphics.moveTo(size / 2, 0);
        graphics.lineTo(size / 2, size / 2);
        graphics.moveTo(size / 2, size / 2);
        graphics.lineTo(size / 2, size);
        
        // Shading
        graphics.lineStyle(1, 0x000000, 0.3);
        graphics.drawRect(2, 2, size - 4, size - 4);
        
        graphics.lineStyle(0);
        
        return app.renderer.generateTexture(graphics);
    }
    
    /**
     * Create question block
     */
    static createQuestionBlock(app, size = 32) {
        const graphics = new PIXI.Graphics();
        
        // Background
        graphics.beginFill(0xFFAA00);
        graphics.drawRect(0, 0, size, size);
        graphics.endFill();
        
        // Question mark
        graphics.beginFill(0xFFFFFF);
        // Top curve
        graphics.drawCircle(size / 2, size / 3, 6);
        graphics.endFill();
        
        graphics.beginFill(0xFFAA00);
        graphics.drawCircle(size / 2, size / 3, 4);
        graphics.endFill();
        
        // Stem
        graphics.beginFill(0xFFFFFF);
        graphics.drawRect(size / 2 - 2, size / 2, 4, 6);
        graphics.endFill();
        
        // Dot
        graphics.beginFill(0xFFFFFF);
        graphics.drawCircle(size / 2, size * 0.75, 3);
        graphics.endFill();
        
        // Border
        graphics.lineStyle(2, 0xFFFFFF, 0.5);
        graphics.drawRect(2, 2, size - 4, size - 4);
        graphics.lineStyle(0);
        
        return app.renderer.generateTexture(graphics);
    }
    
    /**
     * Create ground tile
     */
    static createGround(app, size = 32) {
        const graphics = new PIXI.Graphics();
        
        // Ground
        graphics.beginFill(0x8B4513);
        graphics.drawRect(0, 0, size, size);
        graphics.endFill();
        
        // Grass on top
        graphics.beginFill(0x00AA00);
        graphics.drawRect(0, 0, size, 4);
        graphics.endFill();
        
        // Dirt pattern
        graphics.beginFill(0x654321);
        graphics.drawCircle(8, 12, 3);
        graphics.drawCircle(20, 20, 2);
        graphics.drawCircle(16, 26, 2);
        graphics.endFill();
        
        return app.renderer.generateTexture(graphics);
    }
    
    /**
     * Create pipe segment
     */
    static createPipe(app, size = 32, isTop = false) {
        const graphics = new PIXI.Graphics();
        
        // Pipe body
        graphics.beginFill(0x00AA00);
        if (isTop) {
            graphics.drawRect(0, 4, size, size - 4);
            // Pipe top (wider)
            graphics.drawRect(-2, 0, size + 4, 6);
        } else {
            graphics.drawRect(0, 0, size, size);
        }
        graphics.endFill();
        
        // Dark shading
        graphics.beginFill(0x008800);
        if (isTop) {
            graphics.drawRect(0, 4, 4, size - 4);
            graphics.drawRect(-2, 0, 4, 6);
        } else {
            graphics.drawRect(0, 0, 4, size);
        }
        graphics.endFill();
        
        // Light highlight
        graphics.beginFill(0x00CC00);
        if (isTop) {
            graphics.drawRect(size - 4, 4, 4, size - 4);
            graphics.drawRect(size - 2, 0, 4, 6);
        } else {
            graphics.drawRect(size - 4, 0, 4, size);
        }
        graphics.endFill();
        
        return app.renderer.generateTexture(graphics);
    }
    
    /**
     * Create flag pole
     */
    static createFlag(app, width = 48, height = 64) {
        const graphics = new PIXI.Graphics();
        
        // Pole
        graphics.beginFill(0xFFFFFF);
        graphics.drawRect(4, 0, 4, height);
        graphics.endFill();
        
        // Flag
        graphics.beginFill(0xFF0000);
        graphics.moveTo(8, 8);
        graphics.lineTo(width, 8);
        graphics.lineTo(width, 32);
        graphics.lineTo(8, 32);
        graphics.closePath();
        graphics.endFill();
        
        // Flag pattern
        graphics.beginFill(0xFFFFFF);
        graphics.drawCircle(28, 20, 6);
        graphics.endFill();
        
        return app.renderer.generateTexture(graphics);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GraphicsGenerator;
}
