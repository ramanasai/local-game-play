import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Cpu, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { getTicTacToeMove, saveTicTacToeMatch } from '../../lib/api';

interface SquareProps {
    value: string;
    onClick: () => void;
    isWinning?: boolean;
    isFading?: boolean;
    isLatest?: boolean;
    disabled?: boolean;
}

const Square = ({ value, onClick, isWinning, isFading, isLatest, disabled }: SquareProps) => {
    return (
        <button
            className={cn(
                "h-24 w-24 rounded-xl text-4xl font-bold flex items-center justify-center transition-all duration-300 relative border-2",
                !value && !disabled && "hover:bg-accent/50",
                value === 'X' ? "text-blue-500 border-blue-500/20 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "",
                value === 'O' ? "text-red-500 border-red-500/20 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.3)]" : "",
                !value && "border-border bg-card",
                isWinning && "bg-green-500/20 border-green-500 scale-105 shadow-[0_0_30px_rgba(34,197,94,0.5)] z-10",
                isFading && "opacity-40 scale-90 grayscale",
                isLatest && "ring-2 ring-white/50 ring-offset-2 ring-offset-background"
            )}
            onClick={onClick}
            disabled={disabled}
        >
            <AnimatePresence mode='wait'>
                {value && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {value}
                    </motion.div>
                )}
            </AnimatePresence>
            {isFading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-foreground/50 font-mono bg-background/80 px-1 rounded">FADING</span>
                </div>
            )}
        </button>
    );
};

const TicTacToeGame = () => {
    const [board, setBoard] = useState<string[]>(Array(9).fill(''));
    const [isHumanNext, setIsHumanNext] = useState(true);
    const [winner, setWinner] = useState<string | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [xQueue, setXQueue] = useState<number[]>([]); // Tracks X moves
    const [oQueue, setOQueue] = useState<number[]>([]); // Tracks O moves
    const [isTwoPlayer, setIsTwoPlayer] = useState(false);
    const [movesCount, setMovesCount] = useState(0);

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

    const handleClick = (i: number) => {
        if (board[i] || winner || loading) return;
        if (!isTwoPlayer && !isHumanNext) return;

        const currentPlayer = isHumanNext ? 'X' : 'O';
        const newBoard = [...board];
        let newXQueue = [...xQueue];
        let newOQueue = [...oQueue];

        if (currentPlayer === 'X') {
            if (newXQueue.length >= 3) {
                const remove = newXQueue.shift();
                if (remove !== undefined) newBoard[remove] = '';
            }
            newXQueue.push(i);
            setXQueue(newXQueue);
        } else {
            if (newOQueue.length >= 3) {
                const remove = newOQueue.shift();
                if (remove !== undefined) newBoard[remove] = '';
            }
            newOQueue.push(i);
            setOQueue(newOQueue);
        }

        newBoard[i] = currentPlayer;
        setBoard(newBoard);
        setMovesCount(prev => prev + 1);

        const result = checkWinner(newBoard);
        if (result) {
            handleGameOver(result.winner, result.line);
        } else {
            setIsHumanNext(!isHumanNext);
        }
    };

    const handleGameOver = (winner: string, line: number[]) => {
        setWinner(winner);
        setWinningLine(line);
        // Save match
        saveTicTacToeMatch(
            isTwoPlayer ? 'pvp' : 'hard', // Assuming AI is hard
            winner === 'X' ? 'win' : winner === 'O' ? 'loss' : 'draw',
            movesCount // This is just local count, simpler than tracking exact moves count from server
        ).catch(console.error);
    };

    // AI Turn
    useEffect(() => {
        if (!isTwoPlayer && !isHumanNext && !winner && !loading) {
            const makeAiMove = async () => {
                setLoading(true);
                try {
                    const { index } = await getTicTacToeMove(board, xQueue, oQueue);
                    if (index !== -1) {
                        const newBoard = [...board];
                        let newOQueue = [...oQueue];

                        if (newOQueue.length >= 3) {
                            const remove = newOQueue.shift();
                            if (remove !== undefined) newBoard[remove] = '';
                        }

                        newBoard[index] = 'O';
                        newOQueue.push(index);

                        setBoard(newBoard);
                        setOQueue(newOQueue);
                        setMovesCount(prev => prev + 1);

                        const result = checkWinner(newBoard);
                        if (result) {
                            handleGameOver(result.winner, result.line);
                        } else {
                            setIsHumanNext(true);
                        }
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            };
            makeAiMove();
        }
    }, [isHumanNext, winner, isTwoPlayer]);

    const resetGame = () => {
        setBoard(Array(9).fill(''));
        setIsHumanNext(true);
        setWinner(null);
        setWinningLine(null);
        setXQueue([]);
        setOQueue([]);
        setMovesCount(0);
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-background text-foreground p-4">
            {/* Header */}
            <div className="w-full max-w-lg flex items-center justify-between mb-12">
                <Link to="/" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <ArrowLeft size={24} />
                    <span className="font-bold">Back</span>
                </Link>

                <div className="flex gap-2 bg-card p-1 rounded-lg border border-border">
                    <button
                        onClick={() => { setIsTwoPlayer(false); resetGame(); }}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                            !isTwoPlayer ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <Cpu size={16} /> AI
                    </button>
                    <button
                        onClick={() => { setIsTwoPlayer(true); resetGame(); }}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                            isTwoPlayer ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <Users size={16} /> PvP
                    </button>
                </div>

                <button
                    onClick={resetGame}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                    title="Restart"
                >
                    <RefreshCw size={24} />
                </button>
            </div>

            {/* Game Board */}
            <div className="relative">
                <div className="grid grid-cols-3 gap-3 p-3 bg-card rounded-2xl border border-border  shadow-xl">
                    {board.map((val, i) => (
                        <Square
                            key={i}
                            value={val}
                            onClick={() => handleClick(i)}
                            isWinning={winningLine?.includes(i)}
                            isFading={
                                (val === 'X' && xQueue[0] === i && xQueue.length >= 3) ||
                                (val === 'O' && oQueue[0] === i && oQueue.length >= 3)
                            }
                            isLatest={
                                (val === 'X' && xQueue[xQueue.length - 1] === i) ||
                                (val === 'O' && oQueue[oQueue.length - 1] === i)
                            }
                            disabled={!!winner || loading || (val !== '' && !winningLine)}
                        />
                    ))}
                </div>

                {/* Status Overlay */}
                <div className="mt-8 text-center h-12">
                    {winner ? (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={cn(
                                "text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r",
                                winner === 'X' ? "from-blue-400 to-blue-600" : "from-red-400 to-red-600"
                            )}
                        >
                            {winner === 'Draw' ? 'Game Draw!' : `${winner} Wins!`}
                        </motion.div>
                    ) : (
                        <div className="text-xl text-muted-foreground flex items-center gap-2 justify-center">
                            {loading ? (
                                <>Thinking<motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}>...</motion.span></>
                            ) : (
                                <>Next Turn: <span className={cn("font-bold", isHumanNext ? "text-blue-500" : "text-red-500")}>{isHumanNext ? 'X' : 'O'}</span></>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Instructions */}
            <div className="mt-12 max-w-sm text-center text-sm text-muted-foreground bg-accent/50 p-4 rounded-xl">
                <p className="font-semibold mb-1 text-foreground">Infinite Mode</p>
                <p>Only 3 pieces allowed per player. Placing a 4th piece removes your oldest one.</p>
            </div>
        </div>
    );
};

export default TicTacToeGame;
