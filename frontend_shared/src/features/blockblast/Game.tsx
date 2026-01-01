import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ArrowLeft, Pause, Play, ChevronLeft, ChevronRight, RotateCw, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlockBlastStore } from './store';
import { cn } from '../../lib/utils';

const BlockBlastGame = () => {
    const {
        grid, score, gameOver, isPaused, activePiece,
        initGame, resetGame, tick, moveHorizontal, rotate, hardDrop, togglePause
    } = useBlockBlastStore();

    // Game Loop
    useEffect(() => {
        initGame();
        return () => { }; // Cleanup handled by component unmount mostly
    }, []);

    useEffect(() => {
        if (gameOver || isPaused) return;
        const interval = setInterval(tick, 800); // 800ms initial speed
        return () => clearInterval(interval);
    }, [gameOver, isPaused, tick, score]);

    // Keyboard Controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameOver || isPaused) return;
            switch (e.key) {
                case 'ArrowLeft': moveHorizontal(-1); break;
                case 'ArrowRight': moveHorizontal(1); break;
                case 'ArrowUp': rotate(); break;
                case 'ArrowDown': tick(); break;
                case ' ': hardDrop(); break;
                case 'Escape': togglePause(); break;
                case 'p': togglePause(); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameOver, isPaused, moveHorizontal, rotate, tick, hardDrop, togglePause]);

    const renderGrid = () => {
        const displayGrid = grid.map(row => row.map(cell => cell ? cell.color : null));
        if (activePiece) {
            activePiece.matrix.forEach((row, r) => {
                row.forEach((val, c) => {
                    if (val !== 0) {
                        const gridY = activePiece.y + r;
                        const gridX = activePiece.x + c;
                        if (gridY >= 0 && gridY < 20 && gridX >= 0 && gridX < 10) {
                            displayGrid[gridY][gridX] = activePiece.color;
                        }
                    }
                });
            });
        }
        return displayGrid;
    };

    const displayGrid = renderGrid();

    return (
        <div className="h-[100dvh] w-full flex flex-col bg-background text-foreground overflow-hidden touch-none">
            {/* Header: Compact */}
            <header className="shrink-0 p-4 pb-2 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <Link to="/" className="p-2 rounded-full hover:bg-muted/50 transition-colors">
                        <ArrowLeft size={24} className="text-muted-foreground" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-primary leading-tight">Block Blast</h1>
                        <p className="text-xs text-muted-foreground font-medium">Clear lines!</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="flex flex-col items-end mr-2">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Score</span>
                        <span className="text-xl font-bold leading-none">{score}</span>
                    </div>
                    <button
                        onClick={togglePause}
                        className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                        {isPaused ? <Play size={20} /> : <Pause size={20} />}
                    </button>
                    <button
                        onClick={resetGame}
                        className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </header>

            {/* Game Area: Flexible */}
            <main className="flex-1 flex items-center justify-center p-2 min-h-0">
                <div className="relative h-full w-full max-w-sm flex items-center justify-center">
                    {/* Aspect Ratio Container for Grid (10 / 20 = 0.5) */}
                    <div className="relative aspect-[10/20] h-full max-h-full border-2 border-muted bg-black/20 rounded-md p-1 shadow-2xl">
                        <div className="grid grid-cols-10 grid-rows-[20] gap-px w-full h-full bg-muted/10">
                            {displayGrid.map((row, r) => (
                                row.map((color, c) => (
                                    <div
                                        key={`${r}-${c}`}
                                        className={cn(
                                            "w-full h-full rounded-[1px]",
                                            color ? color : "bg-transparent"
                                        )}
                                    />
                                ))
                            ))}
                        </div>

                        {/* Overlays */}
                        <AnimatePresence>
                            {(gameOver || isPaused) && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-6"
                                >
                                    <h2 className="text-3xl font-black mb-2 text-foreground">
                                        {gameOver ? "Game Over" : "Paused"}
                                    </h2>
                                    {gameOver && (
                                        <>
                                            <p className="text-lg mb-6 text-muted-foreground">Final Score: {score}</p>
                                            <button
                                                onClick={resetGame}
                                                className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-transform"
                                            >
                                                Try Again
                                            </button>
                                        </>
                                    )}
                                    {isPaused && !gameOver && (
                                        <button
                                            onClick={togglePause}
                                            className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-transform"
                                        >
                                            Resume
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Controls: Compact & Bottom Aligned */}
            <div className="shrink-0 p-4 pb-8 md:pb-4 w-full max-w-sm mx-auto grid grid-cols-3 gap-3 md:hidden">
                <div className="col-start-2 flex justify-center">
                    <button
                        className="w-14 h-14 bg-muted rounded-full flex items-center justify-center active:bg-muted/70 touch-manipulation shadow-sm"
                        onClick={() => rotate()}
                    >
                        <RotateCw size={24} />
                    </button>
                </div>

                <div className="col-start-1 row-start-2 flex justify-center">
                    <button
                        className="w-14 h-14 bg-muted rounded-full flex items-center justify-center active:bg-muted/70 touch-manipulation shadow-sm"
                        onClick={() => moveHorizontal(-1)}
                    >
                        <ChevronLeft size={30} />
                    </button>
                </div>

                <div className="col-start-2 row-start-2 flex justify-center">
                    <button
                        className="w-14 h-14 bg-muted rounded-full flex items-center justify-center active:bg-muted/70 touch-manipulation shadow-sm"
                        onClick={() => tick()}
                    >
                        <ArrowDown size={30} />
                    </button>
                </div>

                <div className="col-start-3 row-start-2 flex justify-center">
                    <button
                        className="w-14 h-14 bg-muted rounded-full flex items-center justify-center active:bg-muted/70 touch-manipulation shadow-sm"
                        onClick={() => moveHorizontal(1)}
                    >
                        <ChevronRight size={30} />
                    </button>
                </div>

                <div className="col-start-2 row-start-3 flex justify-center">
                    <button
                        className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center active:scale-95 shadow-lg touch-manipulation border-4 border-background"
                        onClick={() => hardDrop()}
                    >
                        <ArrowDown size={32} className="animate-bounce" />
                    </button>
                </div>
            </div>

            {/* Desktop Hint */}
            <div className="hidden md:block shrink-0 p-4 text-center text-muted-foreground text-sm border-t border-border/50">
                Arrow Keys to Move/Rotate • Space to Drop • P to Pause
            </div>
        </div>
    );
};

export default BlockBlastGame;
