import { create } from 'zustand';
import { submitBlockBlastScore } from '../../lib/api';

// --- Types ---
export type Block = {
    color: string;
    locked: boolean;
};

export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type ActivePiece = {
    type: TetrominoType;
    matrix: number[][]; // 1s and 0s
    x: number; // Grid Column
    y: number; // Grid Row
    color: string;
};

interface BlockBlastState {
    grid: (Block | null)[][];
    score: number;
    bestScore: number;
    gameOver: boolean;
    isPaused: boolean;
    activePiece: ActivePiece | null;
    nextPieceType: TetrominoType;

    // Actions
    initGame: () => void;
    resetGame: () => void;
    tick: () => void;
    moveHorizontal: (dir: -1 | 1) => void;
    rotate: () => void;
    hardDrop: () => void;
    togglePause: () => void;
}

// --- Constants ---
const COLS = 10;
const ROWS = 20;

const COLORS: Record<TetrominoType, string> = {
    I: 'bg-cyan-500',
    O: 'bg-yellow-500',
    T: 'bg-purple-500',
    S: 'bg-green-500',
    Z: 'bg-red-500',
    J: 'bg-blue-500',
    L: 'bg-orange-500',
};

const SHAPES: Record<TetrominoType, number[][]> = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ]
};

// --- Helpers ---
const createEmptyGrid = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

const getRandomTetrominoType = (): TetrominoType => {
    const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    return types[Math.floor(Math.random() * types.length)];
};

const getBestScore = () => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('blockblast-best') || '0');
};

const checkCollision = (grid: (Block | null)[][], piece: ActivePiece, moveX: number = 0, moveY: number = 0, newMatrix?: number[][]): boolean => {
    const matrix = newMatrix || piece.matrix;
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
            if (matrix[r][c] !== 0) {
                const newX = piece.x + c + moveX;
                const newY = piece.y + r + moveY;

                // Wall/Floor checks
                if (newX < 0 || newX >= COLS || newY >= ROWS) return true;

                // Existing block checks (ignore negative Y as it's above board)
                if (newY >= 0 && grid[newY][newX] !== null) return true;
            }
        }
    }
    return false;
};

const rotateMatrix = (matrix: number[][]): number[][] => {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const newMatrix = Array.from({ length: cols }, () => Array(rows).fill(0));
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            newMatrix[x][rows - 1 - y] = matrix[y][x];
        }
    }
    return newMatrix;
};

// --- Store ---
export const useBlockBlastStore = create<BlockBlastState>((set, get) => ({
    grid: createEmptyGrid(),
    score: 0,
    bestScore: getBestScore(),
    gameOver: false,
    isPaused: false,
    activePiece: null,
    nextPieceType: getRandomTetrominoType(),

    initGame: () => {
        const type = getRandomTetrominoType();
        set({
            grid: createEmptyGrid(),
            score: 0,
            gameOver: false,
            isPaused: false,
            activePiece: {
                type,
                matrix: SHAPES[type],
                x: Math.floor(COLS / 2) - 2,
                y: type === 'I' ? -1 : 0, // Spawn slightly higher
                color: COLORS[type]
            },
            nextPieceType: getRandomTetrominoType()
        });
    },

    resetGame: () => get().initGame(),

    togglePause: () => set(state => ({ isPaused: !state.isPaused })),

    moveHorizontal: (dir) => {
        const { grid, activePiece, gameOver, isPaused } = get();
        if (gameOver || isPaused || !activePiece) return;

        if (!checkCollision(grid, activePiece, dir, 0)) {
            set({
                activePiece: { ...activePiece, x: activePiece.x + dir }
            });
        }
    },

    rotate: () => {
        const { grid, activePiece, gameOver, isPaused } = get();
        if (gameOver || isPaused || !activePiece) return;

        const rotatedMatrix = rotateMatrix(activePiece.matrix);
        // Basic wall kick: if rotation collides, try moving left/right
        let offset = 0;
        if (checkCollision(grid, activePiece, 0, 0, rotatedMatrix)) {
            // Try shift right
            if (!checkCollision(grid, activePiece, 1, 0, rotatedMatrix)) offset = 1;
            // Try shift left
            else if (!checkCollision(grid, activePiece, -1, 0, rotatedMatrix)) offset = -1;
            else return; // Cannot rotate
        }

        set({
            activePiece: {
                ...activePiece,
                matrix: rotatedMatrix,
                x: activePiece.x + offset
            }
        });
    },

    tick: () => {
        const { grid, activePiece, gameOver, isPaused, score, nextPieceType } = get();
        if (gameOver || isPaused || !activePiece) return;

        // Try moving down
        if (!checkCollision(grid, activePiece, 0, 1)) {
            set({ activePiece: { ...activePiece, y: activePiece.y + 1 } });
        } else {
            // Lock Piece
            const newGrid = grid.map(r => [...r]);

            // Check for game over (lock out above top)
            let isGameOver = false;

            activePiece.matrix.forEach((row, r) => {
                row.forEach((val, c) => {
                    if (val !== 0) {
                        const gridY = activePiece.y + r;
                        const gridX = activePiece.x + c;
                        if (gridY < 0) {
                            isGameOver = true;
                        } else if (gridY < ROWS) {
                            newGrid[gridY][gridX] = { color: activePiece.color, locked: true };
                        }
                    }
                });
            });

            if (isGameOver) {
                set({ gameOver: true });
                submitBlockBlastScore(score).catch(console.error);
                return;
            }

            // Clear Lines
            let linesCleared = 0;
            for (let r = ROWS - 1; r >= 0; r--) {
                if (newGrid[r].every(cell => cell !== null)) {
                    newGrid.splice(r, 1);
                    newGrid.unshift(Array(COLS).fill(null));
                    linesCleared++;
                    r++; // Re-check same row index since we shifted
                }
            }

            // Scoring (Standard NES scoring roughly)
            const lineScores = [0, 40, 100, 300, 1200];
            const newScore = score + lineScores[linesCleared];

            // Update Best Score
            if (newScore > get().bestScore) {
                localStorage.setItem('blockblast-best', newScore.toString());
            }

            // Spawn Next
            const newType = nextPieceType;
            set({
                grid: newGrid,
                score: newScore,
                bestScore: Math.max(newScore, get().bestScore),
                activePiece: {
                    type: newType,
                    matrix: SHAPES[newType],
                    x: Math.floor(COLS / 2) - 2,
                    y: newType === 'I' ? -1 : 0,
                    color: COLORS[newType]
                },
                nextPieceType: getRandomTetrominoType()
            });

            // Immediate collision on spawn = Game Over
            if (checkCollision(newGrid, get().activePiece!)) {
                set({ gameOver: true });
                submitBlockBlastScore(newScore).catch(console.error);
            }
        }
    },

    hardDrop: () => {
        const { grid, activePiece, gameOver, isPaused } = get();
        if (gameOver || isPaused || !activePiece) return;

        let dropY = 0;
        while (!checkCollision(grid, activePiece, 0, dropY + 1)) {
            dropY++;
        }

        // Move to bottom then tick to lock
        set({ activePiece: { ...activePiece, y: activePiece.y + dropY } });
        get().tick(); // Lock immediately
    }
}));
