import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMemoryStore, type GridSize } from './store';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { RefreshCw, Trophy } from 'lucide-react';

const CardComponent = ({ card, onClick }: { card: any, onClick: () => void }) => (
    <motion.div
        className={cn(
            "aspect-square relative cursor-pointer",
            (card.isFlipped || card.isMatched) ? "pointer-events-none" : ""
        )}
        style={{ perspective: '1000px' }}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        <motion.div
            className={cn(
                "w-full h-full transition-all duration-300 relative rounded-xl shadow-lg",
                // Use classes for rotation state, but styles for 3d properties
            )}
            style={{
                transformStyle: 'preserve-3d',
                WebkitTransformStyle: 'preserve-3d',
                transform: (card.isFlipped || card.isMatched) ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
            initial={false}
            animate={{ rotateY: (card.isFlipped || card.isMatched) ? 180 : 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Front (Back of card design) - Visible when NOT flipped (0deg) */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl border-2 border-primary/20 flex items-center justify-center backface-hidden"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
                <span className="text-2xl opacity-20">?</span>
            </div>

            {/* Back (Emoji) - Visible when FLIPPED (180deg) */}
            <div
                className={cn(
                    "absolute inset-0 bg-card rounded-xl border-2 border-primary flex items-center justify-center text-4xl backface-hidden",
                    card.isMatched ? "bg-green-500/10 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : ""
                )}
                style={{
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                }}
            >
                {card.value}
            </div>
        </motion.div>
    </motion.div>
);

const MemoryGame = () => {
    const {
        cards, moves, timer, isPlaying, isGameWon, gridSize,
        setGridSize, startGame, resetGame, flipCard, incrementTimer
    } = useMemoryStore();

    useEffect(() => {
        return () => resetGame(); // Cleanup
    }, [resetGame]);

    useEffect(() => {
        let interval: any;
        if (isPlaying && !isGameWon) {
            interval = setInterval(incrementTimer, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, isGameWon, incrementTimer]);

    // Grid classes based on size
    const getGridClass = () => {
        switch (gridSize) {
            case '4x3': return 'grid-cols-4';
            case '4x4': return 'grid-cols-4';
            case '6x4': return 'grid-cols-6';
            case '6x6': return 'grid-cols-6';
            case '8x5': return 'grid-cols-8';
            default: return 'grid-cols-4';
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-background text-foreground p-4">
            {/* Header (Replaced by Layout) */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-6 md:mb-8 gap-4">
                {/* Mobile Stats (Only visible on small screens to save space) */}
                <div className="flex md:hidden items-center gap-3 text-sm">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-muted-foreground uppercase">Moves</span>
                        <span className="font-mono font-bold leading-none">{moves}</span>
                    </div>
                    <div className="h-6 w-px bg-border"></div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-muted-foreground uppercase">Time</span>
                        <span className="font-mono font-bold leading-none">{timer}s</span>
                    </div>
                </div>

                {/* Desktop Stats */}
                <div className="hidden md:flex items-center gap-4 bg-card p-2 rounded-xl border border-border">
                    <div className="flex flex-col items-center px-4 border-r border-border">
                        <span className="text-xs text-muted-foreground uppercase">Moves</span>
                        <span className="font-mono text-xl font-bold">{moves}</span>
                    </div>
                    <div className="flex flex-col items-center px-4">
                        <span className="text-xs text-muted-foreground uppercase">Time</span>
                        <span className="font-mono text-xl font-bold">{timer}s</span>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2 bg-card md:bg-transparent p-2 md:p-0 rounded-lg border md:border-none border-border ml-auto">
                    <select
                        value={gridSize}
                        onChange={(e) => {
                            setGridSize(e.target.value as GridSize);
                            resetGame();
                        }}
                        className="bg-transparent md:bg-card border-none md:border md:border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                    >
                        <option value="4x3">4x3 (Easy)</option>
                        <option value="4x4">4x4 (Medium)</option>
                        <option value="6x4">6x4 (Hard)</option>
                        <option value="6x6">6x6 (Expert)</option>
                        <option value="8x5">8x5 (Master)</option>
                    </select>
                    <button
                        onClick={() => { resetGame(); startGame(); }}
                        className="p-2 hover:bg-accent rounded-lg transition-colors flex-shrink-0"
                        title="Restart"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            {/* Game Board */}
            <div className="flex-1 w-full max-w-4xl flex items-center justify-center min-h-0 overflow-visible">
                {!isPlaying && !isGameWon ? (
                    <div className="text-center py-12">
                        <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                            Ready to Play?
                        </h2>
                        <button
                            onClick={startGame}
                            className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold text-lg hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
                        >
                            Start Game
                        </button>
                    </div>
                ) : (
                    <div className={cn(
                        "grid w-full max-w-2xl px-2 md:px-4",
                        "gap-2 md:gap-4", // Smaller gap on mobile
                        getGridClass()
                    )}>
                        {cards.map(card => (
                            <CardComponent
                                key={card.id}
                                card={card}
                                onClick={() => flipCard(card.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Win Overlay */}
            <AnimatePresence>
                {isGameWon && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.5, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-card border border-primary/50 p-8 rounded-2xl max-w-sm w-full text-center shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                        >
                            <Trophy className="mx-auto text-yellow-500 mb-4" size={64} />
                            <h2 className="text-3xl font-bold mb-2">Victory!</h2>
                            <p className="text-muted-foreground mb-6">
                                You completed the {gridSize} grid in <span className="text-foreground font-bold">{moves}</span> moves
                                and <span className="text-foreground font-bold">{timer}s</span>.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Link
                                    to="/"
                                    className="px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                                >
                                    Home
                                </Link>
                                <button
                                    onClick={() => { resetGame(); startGame(); }}
                                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Play Again
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MemoryGame;
