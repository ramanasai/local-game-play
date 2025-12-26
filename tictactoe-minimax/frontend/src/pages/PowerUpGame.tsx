import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Square } from '../components/Square';
import '../App.css';

type PowerUpType = 'BOMB' | 'CLONE' | 'BLOCK' | null;

interface Inventory {
    BOMB: number;
    CLONE: number;
    BLOCK: number;
}

export function PowerUpGame() {
    const navigate = useNavigate();
    const [board, setBoard] = useState<string[]>(Array(9).fill(''));
    const [isHumanNext, setIsHumanNext] = useState(true); // Treat as P1 vs P2
    const [winner, setWinner] = useState<string | null>(null);

    // Inventory
    const [p1Inv, setP1Inv] = useState<Inventory>({ BOMB: 1, CLONE: 1, BLOCK: 1 });
    const [p2Inv, setP2Inv] = useState<Inventory>({ BOMB: 1, CLONE: 1, BLOCK: 1 });

    // Active Selection
    const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUpType>(null);

    // Helper: Next Player String
    const currentPlayer = isHumanNext ? 'X' : 'O';
    // Helper: Current Inventory
    const currentInv = isHumanNext ? p1Inv : p2Inv;
    const setInv = isHumanNext ? setP1Inv : setP2Inv;

    const checkWinner = (squares: string[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] !== '#' && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const handleSquareClick = (i: number) => {
        if (winner) return;

        const newBoard = [...board];

        // POWER UP LOGIC
        if (selectedPowerUp) {
            if (selectedPowerUp === 'BOMB') {
                if (newBoard[i] === '') return; // Must bomb something
                newBoard[i] = ''; // Boom
            }
            else if (selectedPowerUp === 'BLOCK') {
                if (newBoard[i] !== '') return;
                newBoard[i] = '#'; // Wall
            }
            else if (selectedPowerUp === 'CLONE') {
                if (newBoard[i] !== '') return;
                newBoard[i] = currentPlayer;
                // Clone to random neighbor
                const neighbors = getNeighbors(i);
                const emptyNeighbors = neighbors.filter(n => newBoard[n] === '');
                if (emptyNeighbors.length > 0) {
                    const randomIdx = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
                    newBoard[randomIdx] = currentPlayer;
                }
            }

            // Deduct inventory
            setInv({ ...currentInv, [selectedPowerUp!]: currentInv[selectedPowerUp!] - 1 });
            setSelectedPowerUp(null); // Reset selection
        }
        // NORMAL MOVE
        else {
            if (newBoard[i] !== '') return;
            newBoard[i] = currentPlayer;
        }

        // Clean up Walls (#) if they are old? 
        // Simplify: Walls stay for now, or we can make them 'fade' logic later.

        setBoard(newBoard);

        const w = checkWinner(newBoard);
        if (w) setWinner(w);
        else if (!newBoard.includes('')) setWinner('Draw');

        setIsHumanNext(!isHumanNext);
    };

    const getNeighbors = (i: number) => {
        // Simple adjacency list for 3x3
        const adj = [
            [1, 3, 4],       // 0
            [0, 2, 4, 5],    // 1
            [1, 5, 4],       // 2
            [0, 4, 6],       // 3
            [0, 1, 2, 3, 5, 6, 7, 8],// 4
            [2, 4, 8],       // 5
            [3, 7, 4],       // 6
            [6, 8, 4, 1],    // 7
            [5, 7, 4]        // 8
        ];
        return adj[i] || [];
    };

    const selectPowerUp = (type: PowerUpType) => {
        if (selectedPowerUp === type) setSelectedPowerUp(null); // Toggle off
        else if (currentInv[type!] > 0) setSelectedPowerUp(type);
    };

    return (
        <div className="game-container">
            <h1 className="glitch">Arcade Mode</h1>
            <div className="status status-monitor">
                {winner ? `Winner: ${winner}` : `Player: ${currentPlayer}`}
            </div>

            <div className="inventory">
                <span>Power-Ups:</span>
                <button
                    className={`power-btn ${selectedPowerUp === 'BOMB' ? 'active' : ''}`}
                    disabled={currentInv.BOMB === 0 || !!winner}
                    onClick={() => selectPowerUp('BOMB')}>
                    💣 Bomb ({currentInv.BOMB})
                </button>
                <button
                    className={`power-btn ${selectedPowerUp === 'CLONE' ? 'active' : ''}`}
                    disabled={currentInv.CLONE === 0 || !!winner}
                    onClick={() => selectPowerUp('CLONE')}>
                    👯 Clone ({currentInv.CLONE})
                </button>
                <button
                    className={`power-btn ${selectedPowerUp === 'BLOCK' ? 'active' : ''}`}
                    disabled={currentInv.BLOCK === 0 || !!winner}
                    onClick={() => selectPowerUp('BLOCK')}>
                    🧱 Block ({currentInv.BLOCK})
                </button>
            </div>

            <div className="board">
                <div className="board-row">
                    {[0, 1, 2].map(i => <Square key={i} value={board[i]} onClick={() => handleSquareClick(i)} />)}
                </div>
                <div className="board-row">
                    {[3, 4, 5].map(i => <Square key={i} value={board[i]} onClick={() => handleSquareClick(i)} />)}
                </div>
                <div className="board-row">
                    {[6, 7, 8].map(i => <Square key={i} value={board[i]} onClick={() => handleSquareClick(i)} />)}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                <button className="reset-btn" onClick={() => window.location.reload()}>Restart Game</button>
                <button className="back-btn" onClick={() => navigate('/')}>Back Main Menu</button>
            </div>
        </div>
    );
}
