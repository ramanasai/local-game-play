import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Board } from '../components/Board';
// Adjust import path if needed based on where api.ts is located relative to pages/
import { suggestMove } from '../services/api';
import '../App.css';

interface InfiniteGameProps {
    startTwoPlayer?: boolean; // Optional prop if we want to force a mode on load
}

export function InfiniteGame({ startTwoPlayer = false }: InfiniteGameProps) {
    const navigate = useNavigate();
    const [board, setBoard] = useState<string[]>(Array(9).fill(''));
    const [isHumanNext, setIsHumanNext] = useState(true);
    const [winner, setWinner] = useState<string | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [xQueue, setXQueue] = useState<number[]>([]);
    const [oQueue, setOQueue] = useState<number[]>([]);

    // Game Mode: vs AI (default) or Two Player
    const [isTwoPlayer, setIsTwoPlayer] = useState(startTwoPlayer);

    const checkWinner = (squares: string[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return { winner: squares[a], line: lines[i] };
            }
        }
        return null;
    };

    const isBoardFull = (squares: string[]) => {
        return squares.every((square) => square !== '');
    };

    const handleClick = (i: number) => {
        if (board[i] || winner || loading) return;

        // Strict turn checking for vs AI
        if (!isTwoPlayer && !isHumanNext) return;

        const currentPlayer = isHumanNext ? 'X' : 'O';

        const newBoard = [...board];
        let newXQueue = [...xQueue];
        let newOQueue = [...oQueue];

        // Logic for X (Human always starts as X in this setup, or P1)
        if (currentPlayer === 'X') {
            if (newXQueue.length >= 3) {
                const indexToRemove = newXQueue.shift();
                if (indexToRemove !== undefined) newBoard[indexToRemove] = '';
            }
            newXQueue.push(i);
            setXQueue(newXQueue);
        }
        // Logic for O (P2 or AI)
        else {
            if (newOQueue.length >= 3) {
                const indexToRemove = newOQueue.shift();
                if (indexToRemove !== undefined) newBoard[indexToRemove] = '';
            }
            newOQueue.push(i);
            setOQueue(newOQueue);
        }

        newBoard[i] = currentPlayer;
        setBoard(newBoard);

        // Check Result
        const result = checkWinner(newBoard);
        if (result) {
            setWinner(result.winner);
            setWinningLine(result.line);
        } else if (isBoardFull(newBoard)) {
            setWinner('Draw');
        }

        setIsHumanNext(!isHumanNext);
    };

    // AI Effect
    useEffect(() => {
        // Only run if not two player mode, and it's O's turn (AI)
        if (!isTwoPlayer && !isHumanNext && !winner && !loading) {
            const makeAiMove = async () => {
                setLoading(true);
                try {
                    // Pass current queues to AI so it knows what will disappear
                    const index = await suggestMove(board, xQueue, oQueue);
                    if (index !== -1) {
                        const newBoard = [...board];
                        let newOQueue = [...oQueue];

                        if (newOQueue.length >= 3) {
                            const indexToRemove = newOQueue.shift();
                            if (indexToRemove !== undefined) {
                                newBoard[indexToRemove] = '';
                            }
                        }

                        newBoard[index] = 'O';
                        newOQueue.push(index);

                        setBoard(newBoard);
                        setOQueue(newOQueue);

                        const result = checkWinner(newBoard);
                        if (result) {
                            setWinner(result.winner);
                            setWinningLine(result.line);
                        }
                        else if (isBoardFull(newBoard)) setWinner('Draw');

                        setIsHumanNext(true); // Hand back to human
                    }
                } catch (error) {
                    console.error("AI failed to move:", error);
                } finally {
                    setLoading(false);
                }
            };
            makeAiMove();
        }
    }, [isHumanNext, winner, board, loading, xQueue, oQueue, isTwoPlayer]);

    const resetGame = () => {
        setBoard(Array(9).fill(''));
        setIsHumanNext(true);
        setWinner(null);
        setWinningLine(null);
        setXQueue([]);
        setOQueue([]);
    };

    return (
        <div className="game-container">
            <h1 className="glitch">Infinite Logic</h1>

            <div className="controls">
                <div className="switch-container">
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={isTwoPlayer}
                            onChange={(e) => {
                                setIsTwoPlayer(e.target.checked);
                                resetGame();
                            }}
                        />
                        <span className="slider"></span>
                    </label>
                    <span className="toggle-label">Two Player Mode</span>
                </div>
            </div>

            <div className="status status-monitor">
                {winner ? (
                    winner === 'Draw' ? "It's a Draw!" : `Winner: ${winner}`
                ) : (
                    `Next player: ${isHumanNext ? 'X' : 'O'}`
                )}
            </div>
            <Board
                squares={board}
                onClick={handleClick}
                winningLine={winningLine}
                xQueue={xQueue}
                oQueue={oQueue}
            />
            <button className="reset-btn" onClick={resetGame}>Restart Game</button>
            <button className="back-btn" onClick={() => navigate('/')}>Back Main Menu</button>
        </div>
    );
}
