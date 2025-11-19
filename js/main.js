/**
 * Main Entry Point and UI Handlers
 */

let game = null;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', async () => {
    setupMenuHandlers();
    await initGame();
});

/**
 * Initialize the game
 */
async function initGame() {
    try {
        // Show loading progress
        updateLoadingProgress(20, 'Initializing PixiJS...');
        
        game = new MarioGame();
        
        updateLoadingProgress(50, 'Loading graphics...');
        await game.init();
        
        updateLoadingProgress(100, 'Ready!');
        
        // Small delay to show completed loading
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            // Ensure start menu is visible
            document.getElementById('start-menu').classList.remove('hidden');
        }, 500);
        
    } catch (error) {
        console.error('Failed to initialize game:', error);
        document.getElementById('loading-text').textContent = 'Error loading game. Please refresh.';
    }
}

/**
 * Update loading bar
 */
function updateLoadingProgress(percent, text) {
    document.getElementById('loading-progress').style.width = percent + '%';
    document.getElementById('loading-text').textContent = text;
}

/**
 * Setup menu button handlers
 */
function setupMenuHandlers() {
    // Start game
    document.getElementById('btn-start').addEventListener('click', () => {
        if (game) {
            game.startGame();
        }
    });
    
    // Show instructions
    document.getElementById('btn-instructions').addEventListener('click', () => {
        document.getElementById('start-menu').classList.add('hidden');
        document.getElementById('instructions-screen').classList.remove('hidden');
    });
    
    // Close instructions
    document.getElementById('btn-close-instructions').addEventListener('click', () => {
        document.getElementById('instructions-screen').classList.add('hidden');
        document.getElementById('start-menu').classList.remove('hidden');
    });
    
    // Restart game
    document.getElementById('btn-restart').addEventListener('click', () => {
        if (game) {
            game.startGame();
        }
    });
    
    // Back to menu from game over
    document.getElementById('btn-menu').addEventListener('click', () => {
        document.getElementById('game-over-screen').classList.add('hidden');
        document.getElementById('start-menu').classList.remove('hidden');
    });
    
    // Next level
    document.getElementById('btn-next-level').addEventListener('click', () => {
        if (game) {
            game.nextLevel();
        }
    });
    
    // Prevent default touch behaviors
    document.addEventListener('touchmove', (e) => {
        if (e.target.closest('#mobile-controls')) {
            e.preventDefault();
        }
    }, { passive: false });
}

/**
 * Pause game on visibility change
 */
document.addEventListener('visibilitychange', () => {
    if (game && document.hidden) {
        if (game.gameState === 'playing') {
            game.gameState = 'paused';
        }
    }
});

/**
 * Handle window resize
 */
window.addEventListener('resize', () => {
    if (game && game.app) {
        // Optional: resize canvas to fit window
        // This is a simple implementation
        const container = document.getElementById('game-container');
        const scale = Math.min(
            container.clientWidth / CONFIG.WIDTH,
            container.clientHeight / CONFIG.HEIGHT
        );
        
        game.app.view.style.width = (CONFIG.WIDTH * scale) + 'px';
        game.app.view.style.height = (CONFIG.HEIGHT * scale) + 'px';
    }
});

// Initial resize
window.dispatchEvent(new Event('resize'));

