import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Grid3x3 } from 'lucide-react';
import { motion } from 'framer-motion';

const GridCell = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
    <div className={`relative border-r border-b border-border p-6 flex flex-col justify-between ${className}`}>
        {children}
    </div>
);

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            {/* Header Removed (Moved to Layout) */}

            {/* Main Grid Content */}
            <main className="flex-1 container mx-auto max-w-7xl border-l border-r border-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

                {/* Hero / Intro Section (Spans 2 cols) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 border-r border-b border-border p-12 flex flex-col justify-center min-h-[400px] relative overflow-hidden group">
                    {/* Decorative Grids */}
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                    </div>

                    <h1 className="relative text-6xl md:text-8xl font-black leading-none tracking-tighter mb-8 z-10">
                        PLAY.<br />
                        <span className="text-destructive">WIN.</span><br />
                        REPEAT.
                    </h1>
                    <p className="relative z-10 text-xl font-medium max-w-md text-muted-foreground">
                        Select a game module from the grid to begin your session.
                    </p>
                </div>

                {/* Tic Tac Toe Card */}
                <motion.div
                    whileHover={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}
                    className="col-span-1 border-r border-b border-border p-8 py-12 flex flex-col justify-between cursor-pointer group transition-colors duration-300"
                    onClick={() => navigate('/tictactoe')}
                >
                    <div className="flex justify-between items-start mb-12">
                        <span className="font-mono text-xs font-bold text-destructive tracking-widest">MODULE_01</span>
                        <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity -rotate-45 group-hover:rotate-0 transform duration-300" />
                    </div>
                    <div>
                        <Grid3x3 size={64} strokeWidth={1} className="font-mono text-muted-foreground mb-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <h2 className="text-3xl font-bold uppercase mb-2 text-foreground">Tic-Tac-Toe</h2>
                        <p className="text-sm text-muted-foreground font-mono">Infinite Mode • Minimax AI</p>
                    </div>
                </motion.div>

                {/* Memory Game Card */}
                <motion.div
                    whileHover={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}
                    className="col-span-1 border-r border-b border-border p-8 py-12 flex flex-col justify-between cursor-pointer group transition-colors duration-300"
                    onClick={() => navigate('/memory')}
                >
                    <div className="flex justify-between items-start mb-12">
                        <span className="font-mono text-xs font-bold text-destructive tracking-widest">MODULE_02</span>
                        <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity -rotate-45 group-hover:rotate-0 transform duration-300" />
                    </div>
                    <div>
                        <Brain size={64} strokeWidth={1} className="font-mono text-muted-foreground mb-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <h2 className="text-3xl font-bold uppercase mb-2 text-foreground">Memory Flip</h2>
                        <p className="text-sm text-muted-foreground font-mono">Pattern Recognition • Speed</p>
                    </div>
                </motion.div>

                {/* Filler Cells for Grid Texture */}
                <GridCell className="h-64 sm:h-auto hidden lg:flex items-center justify-center">
                    <span className="font-mono text-9xl font-black opacity-5 select-none hover:opacity-10 transition-opacity">03</span>
                </GridCell>
                <GridCell className="h-64 sm:h-auto hidden lg:flex items-center justify-center">
                    <span className="font-mono text-9xl font-black opacity-5 select-none hover:opacity-10 transition-opacity">04</span>
                </GridCell>
                <div className="hidden lg:block col-span-2 border-r border-b border-border p-8">
                    <div className="h-full w-full border border-dashed border-border flex items-center justify-center">
                        <span className="font-mono text-xs uppercase text-muted-foreground tracking-widest">System Status: Online</span>
                    </div>
                </div>

            </main>

            <footer className="border-t border-border bg-card text-card-foreground py-12">
                <div className="container mx-auto max-w-7xl px-6 flex justify-between items-end">
                    <div>
                        <p className="font-bold text-lg mb-2">LOCAL GAMES ARCADE</p>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            A showcase of classic game mechanics re-imagined with modern web technologies.
                        </p>
                    </div>
                    <span className="font-mono text-9xl leading-[0.75] font-black opacity-10 select-none hidden md:block">
                        LGA
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default Home;
