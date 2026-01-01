import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGame2048Store } from './store';
import { cn } from '../../lib/utils';
import { useSwipeable } from 'react-swipeable';

// Note: If react-swipeable isn't installed, we can add keyboard listeners first.

const Game2048 = () => {
    const { grid, score, bestScore, gameOver, initGame, resetGame, move } = useGame2048Store();

    const handlers = useSwipeable({
        onSwipedLeft: () => move('left'),
        onSwipedRight: () => move('right'),
        onSwipedUp: () => move('up'),
        onSwipedDown: () => move('down'),
        preventScrollOnSwipe: true,
        trackMouse: true
    });

    useEffect(() => {
        initGame();
        return () => resetGame(); // Cleanup
    }, []);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp': move('up'); break;
                case 'ArrowDown': move('down'); break;
                case 'ArrowLeft': move('left'); break;
                case 'ArrowRight': move('right'); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [move]);

    // Color mapper for tiles
    const getTileColor = (value: number) => {
        switch (value) {
            case 2: return "bg-gray-200 text-gray-800";
            case 4: return "bg-orange-100 text-gray-800";
            case 8: return "bg-orange-300 text-white";
            case 16: return "bg-orange-500 text-white";
            case 32: return "bg-orange-600 text-white";
            case 64: return "bg-orange-700 text-white";
            case 128: return "bg-yellow-400 text-white shadow-[0_0_10px_rgba(250,204,21,0.5)]";
            case 256: return "bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]";
            case 512: return "bg-yellow-600 text-white shadow-[0_0_20px_rgba(202,138,4,0.5)]";
            case 1024: return "bg-yellow-700 text-white shadow-[0_0_25px_rgba(161,98,7,0.5)]";
            case 2048: return "bg-gradient-to-br from-yellow-400 to-red-500 text-white shadow-[0_0_30px_rgba(220,38,38,0.6)] animate-pulse";
            default: return "bg-gray-900 text-white";
        }
    };

    const getTileSize = (value: number) => {
        if (value >= 1024) return "text-2xl md:text-3xl";
        if (value >= 128) return "text-3xl md:text-4xl";
        return "text-4xl md:text-5xl";
    }

    // Grid Rendering
    // We render a background grid of empty cells, and then absolute positioned tiles on top

    return (
        <div className="min-h-screen flex flex-col items-center bg-background text-foreground p-4 overflow-hidden">
            {/* Header */}
            <div className="w-full max-w-md flex flex-col gap-6 mb-8 mt-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-6xl font-black text-primary">2048</h1>
                        <p className="text-muted-foreground font-medium">Join the numbers to get to 2048!</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-card border border-border rounded-lg p-3 min-w-[80px] text-center">
                            <div className="text-xs uppercase font-bold text-muted-foreground">Score</div>
                            <div className="text-xl font-bold">{score}</div>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-3 min-w-[80px] text-center">
                            <div className="text-xs uppercase font-bold text-muted-foreground">Best</div>
                            <div className="text-xl font-bold">{bestScore}</div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium">
                        <ArrowLeft size={20} /> Back
                    </Link>
                    <button
                        onClick={resetGame}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-transform active:scale-95"
                    >
                        <RefreshCw size={18} /> New Game
                    </button>
                </div>
            </div>

            {/* Game Board */}
            <div {...handlers} className="relative bg-muted/30 p-2 rounded-xl border-4 border-muted w-full max-w-md aspect-square select-none touch-none">
                {/* Background Grid */}
                <div className="grid grid-cols-4 grid-rows-4 w-full h-full relative z-0">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="p-1 w-full h-full">
                            <div className="bg-muted/50 rounded-lg w-full h-full" />
                        </div>
                    ))}
                </div>

                {/* Tiles */}
                <div className="absolute inset-0 w-full h-full z-10">
                    <AnimatePresence>
                        {grid.map(tile => (
                            <motion.div
                                key={tile.id}
                                initial={tile.isNew ? { scale: 0, opacity: 0 } : false}
                                animate={{
                                    left: `${tile.x * 25}%`,
                                    top: `${tile.y * 25}%`,
                                    scale: 1,
                                    opacity: 1,
                                    zIndex: tile.toDestroy ? 0 : 10
                                }}
                                transition={{
                                    duration: 0.1, // Fast slide
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 40
                                }}
                                className="absolute w-1/4 h-1/4 p-1 box-border"
                            >
                                <div className={cn(
                                    "w-full h-full rounded-lg flex items-center justify-center font-bold shadow-sm transition-colors duration-200 select-none",
                                    getTileColor(tile.value),
                                    getTileSize(tile.value),
                                    tile.toDestroy && "opacity-0" // Optional: fade out if behind
                                )}>
                                    {tile.value}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Game Over Overlay */}
                {gameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-background/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-6"
                    >
                        <h2 className="text-4xl font-black mb-2 text-foreground">Game Over!</h2>
                        <p className="text-xl mb-6 text-muted-foreground">You scored <span className="font-bold text-foreground">{score}</span> points</p>
                        <button
                            onClick={resetGame}
                            className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold text-lg hover:bg-primary/90 shadow-lg"
                        >
                            Try Again
                        </button>
                    </motion.div>
                )}
            </div>

            <p className="mt-8 text-muted-foreground text-sm font-medium">
                Use <span className="font-bold text-foreground">Arrow Keys</span> or Swipe to move tiles
            </p>
        </div>
    );
};

export default Game2048;
