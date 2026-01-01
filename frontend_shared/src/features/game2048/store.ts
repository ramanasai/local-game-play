import { create } from 'zustand';
import { submit2048Score } from '../../lib/api';

type Tile = {
    id: number;
    value: number;
    x: number;
    y: number;
    isMerged?: boolean;
    isNew?: boolean;
    toDestroy?: boolean;
};

interface Game2048State {
    grid: Tile[];
    score: number;
    bestScore: number;
    gameOver: boolean;
    gameWon: boolean;

    // Actions
    move: (direction: 'up' | 'down' | 'left' | 'right') => void;
    resetGame: () => void;
    cleanup: () => void;
    // Internal helpers
    initGame: () => void;
}

const GRID_SIZE = 4;

const getBestScore = () => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('2048-best') || '0');
};

const getEmptyCells = (grid: Tile[]) => {
    const cells: { x: number, y: number }[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
            if (!grid.find(t => t.x === x && t.y === y)) {
                cells.push({ x, y });
            }
        }
    }
    return cells;
};

const spawnTile = (grid: Tile[], count = 1): Tile[] => {
    const newGrid = [...grid];
    for (let i = 0; i < count; i++) {
        const empty = getEmptyCells(newGrid);
        if (empty.length === 0) break;
        const { x, y } = empty[Math.floor(Math.random() * empty.length)];
        newGrid.push({
            id: Date.now() + Math.random(),
            value: Math.random() < 0.9 ? 2 : 4,
            x,
            y,
            isNew: true
        });
    }
    return newGrid;
};

// Helper to check if any moves are possible
const canMove = (grid: Tile[]) => {
    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
            const tile = grid.find(t => t.x === x && t.y === y);
            if (!tile) return true; // Empty cell
            // Check neighbors
            const neighbors = [
                grid.find(t => t.x === x + 1 && t.y === y),
                grid.find(t => t.x === x && t.y === y + 1)
            ];
            for (const n of neighbors) {
                if (n && n.value === tile.value) return true;
            }
        }
    }
    return false;
};

export const useGame2048Store = create<Game2048State>((set, get) => ({
    grid: [],
    score: 0,
    bestScore: getBestScore(),
    gameOver: false,
    gameWon: false,

    initGame: () => {
        set({
            grid: spawnTile([], 2),
            score: 0,
            gameOver: false,
            gameWon: false
        });
    },

    resetGame: () => get().initGame(),

    move: (direction) => {
        const { grid, score, gameOver } = get();
        if (gameOver) return;

        // Cleanup any pending destroyed tiles before starting new move
        const cleanGrid = grid.filter(t => !t.toDestroy);

        let moved = false;
        let newScore = score;
        // create deep copy for manipulation
        const newGrid = cleanGrid.map(t => ({ ...t, isMerged: false, isNew: false }));

        // Sorting Logic based on direction to process items in correct order
        const sortTiles = (tiles: Tile[]) => {
            return tiles.sort((a, b) => {
                if (direction === 'up') return a.y - b.y;
                if (direction === 'down') return b.y - a.y;
                if (direction === 'left') return a.x - b.x;
                if (direction === 'right') return b.x - a.x;
                return 0;
            });
        };

        const sortedTiles = sortTiles(newGrid);

        sortedTiles.forEach(tile => {
            let { x, y } = tile;
            let nextX = x;
            let nextY = y;

            // Determine movement vector
            const dx = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
            const dy = direction === 'up' ? -1 : direction === 'down' ? 1 : 0;

            // Move as far as possible
            while (true) {
                const checkX = nextX + dx;
                const checkY = nextY + dy;

                if (checkX < 0 || checkX >= GRID_SIZE || checkY < 0 || checkY >= GRID_SIZE) break;

                // Collision check: Ignore tiles that are moving with us (handled by order) 
                // but we must check against the *current state* of newGrid for static obstructions.
                const occupied = newGrid.find(t => t.x === checkX && t.y === checkY && !t.toDestroy);

                if (!occupied) {
                    // Empty space, keep moving
                    nextX = checkX;
                    nextY = checkY;
                } else if (!occupied.isMerged && occupied.value === tile.value) {
                    // Merge
                    nextX = checkX;
                    nextY = checkY;

                    // Mark as destroyed
                    tile.toDestroy = true;

                    // Update target
                    occupied.value *= 2;
                    occupied.isMerged = true;
                    newScore += occupied.value;
                    moved = true;
                    break; // Stop moving
                } else {
                    break; // Hit different value or already merged
                }
            }

            // Update position
            if (tile.x !== nextX || tile.y !== nextY) {
                tile.x = nextX;
                tile.y = nextY;
                moved = true;
            }
        });

        if (moved) {
            const gridWithNew = spawnTile(newGrid, 1);

            // Check best score
            const currentBest = get().bestScore;
            if (newScore > currentBest) {
                localStorage.setItem('2048-best', newScore.toString());
            }

            // Check Game Over
            const activeTiles = gridWithNew.filter(t => !t.toDestroy);
            const isGameOver = getEmptyCells(activeTiles).length === 0 && !canMove(activeTiles);

            if (isGameOver) {
                submit2048Score(newScore).catch(console.error);
            }

            set({
                grid: gridWithNew,
                score: newScore,
                bestScore: Math.max(newScore, currentBest),
                gameOver: isGameOver
            });

            // Schedule cleanup of destroyed tiles
            setTimeout(() => {
                get().cleanup();
            }, 100);
        }
    },

    cleanup: () => {
        set(state => ({
            grid: state.grid.filter(t => !t.toDestroy)
        }));
    }
}));
