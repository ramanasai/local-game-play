import { useEffect, useState } from 'react';
import { getMemoryLeaderboard, getTicTacToeLeaderboard, get2048Leaderboard, getLeaderboardBlockBlast } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Brain, Grid3x3, Medal, Layers, LayoutGrid } from 'lucide-react';
import { cn } from '../../lib/utils'; // Assuming this exists

type LeaderboardTab = 'memory' | 'tictactoe' | '2048' | 'blockblast';

const Leaderboard = () => {
    const [activeTab, setActiveTab] = useState<LeaderboardTab>('memory');
    const [memoryScores, setMemoryScores] = useState<any[]>([]);
    const [tttScores, setTttScores] = useState<any[]>([]);
    const [scores2048, setScores2048] = useState<any[]>([]);
    const [scoresBlockBlast, setScoresBlockBlast] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [memData, tttData, data2048, dataBlockBlast] = await Promise.all([
                    getMemoryLeaderboard(),
                    getTicTacToeLeaderboard(),
                    get2048Leaderboard(),
                    getLeaderboardBlockBlast()
                ]);
                setMemoryScores(memData || []);
                setTttScores(tttData || []);
                setScores2048(data2048 || []);
                setScoresBlockBlast(dataBlockBlast || []);
            } catch (err) {
                console.error("Failed to fetch leaderboards", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderMedal = (index: number) => {
        if (index === 0) return <Medal className="text-yellow-400" size={24} />;
        if (index === 1) return <Medal className="text-gray-400" size={24} />;
        if (index === 2) return <Medal className="text-amber-600" size={24} />;
        return <span className="font-mono text-lg opacity-50 w-6 text-center">{index + 1}</span>;
    };

    return (
        <div className="min-h-[calc(100vh-80px)] container mx-auto max-w-4xl p-6 flex flex-col items-center">

            <div className="text-center mb-12">
                <Trophy size={64} className="mx-auto text-yellow-500 mb-4" />
                <h1 className="text-4xl font-black tracking-tighter mb-2">HALL OF FAME</h1>
                <p className="text-muted-foreground">Top performers across the arcade.</p>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-muted/50 rounded-xl mb-8 border border-border flex-wrap justify-center gap-2">
                <button
                    onClick={() => setActiveTab('memory')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all",
                        activeTab === 'memory'
                            ? "bg-background text-foreground shadow-sm scale-105"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Brain size={18} />
                    MEMORY FLIP
                </button>
                <button
                    onClick={() => setActiveTab('tictactoe')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all",
                        activeTab === 'tictactoe'
                            ? "bg-background text-foreground shadow-sm scale-105"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Grid3x3 size={18} />
                    TIC-TAC-TOE
                </button>
                <button
                    onClick={() => setActiveTab('2048')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all",
                        activeTab === '2048'
                            ? "bg-background text-foreground shadow-sm scale-105"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Layers size={18} />
                    2048
                </button>
                <button
                    onClick={() => setActiveTab('blockblast')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all",
                        activeTab === 'blockblast'
                            ? "bg-background text-foreground shadow-sm scale-105"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <LayoutGrid size={18} />
                    BLOCK BLAST
                </button>
            </div>

            {/* Content */}
            <div className="w-full max-w-2xl bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
                <div className="grid grid-cols-12 bg-muted/30 p-4 border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <div className="col-span-2 text-center">Rank</div>
                    <div className="col-span-6">Player</div>
                    <div className="col-span-4 text-right">
                        {activeTab === 'memory' ? 'Time (Moves)' : activeTab === 'tictactoe' ? 'Wins (Hard)' : 'Score'}
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-muted-foreground animate-pulse">Loading scores...</div>
                ) : (
                    <div className="divide-y divide-border">
                        <AnimatePresence mode="wait">
                            {activeTab === 'memory' ? (
                                memoryScores.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">No scores yet. Be the first!</div>
                                ) : (
                                    memoryScores.map((score, i) => (
                                        <motion.div
                                            key={score.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="grid grid-cols-12 p-4 items-center hover:bg-muted/30 transition-colors"
                                        >
                                            <div className="col-span-2 flex justify-center">{renderMedal(i)}</div>
                                            <div className="col-span-6 font-bold truncate pr-4">{score.username}</div>
                                            <div className="col-span-4 text-right font-mono flex items-center justify-end gap-2">
                                                <span className="text-lg">{score.time_seconds}s</span>
                                                <span className="text-xs text-muted-foreground">({score.moves}m)</span>
                                            </div>
                                        </motion.div>
                                    ))
                                )
                            ) : activeTab === 'tictactoe' ? (
                                tttScores.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">No champions yet. Defeat the AI!</div>
                                ) : (
                                    tttScores.map((score, i) => (
                                        <motion.div
                                            key={score.user_id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="grid grid-cols-12 p-4 items-center hover:bg-muted/30 transition-colors"
                                        >
                                            <div className="col-span-2 flex justify-center">{renderMedal(i)}</div>
                                            <div className="col-span-6 font-bold truncate pr-4">{score.username}</div>
                                            <div className="col-span-4 text-right font-mono text-lg text-primary">
                                                {score.wins} Wins
                                            </div>
                                        </motion.div>
                                    ))
                                )
                            ) : activeTab === '2048' ? (
                                scores2048.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">No high scores yet. Start merging!</div>
                                ) : (
                                    scores2048.map((score, i) => (
                                        <motion.div
                                            key={score.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="grid grid-cols-12 p-4 items-center hover:bg-muted/30 transition-colors"
                                        >
                                            <div className="col-span-2 flex justify-center">{renderMedal(i)}</div>
                                            <div className="col-span-6 font-bold truncate pr-4">{score.username}</div>
                                            <div className="col-span-4 text-right font-mono text-lg text-yellow-500 font-bold">
                                                {score.score}
                                            </div>
                                        </motion.div>
                                    ))
                                )
                            ) : (
                                scoresBlockBlast.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">No high scores yet. Start blasting!</div>
                                ) : (
                                    scoresBlockBlast.map((score, i) => (
                                        <motion.div
                                            key={score.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="grid grid-cols-12 p-4 items-center hover:bg-muted/30 transition-colors"
                                        >
                                            <div className="col-span-2 flex justify-center">{renderMedal(i)}</div>
                                            <div className="col-span-6 font-bold truncate pr-4">{score.username}</div>
                                            <div className="col-span-4 text-right font-mono text-lg text-blue-500 font-bold">
                                                {score.score}
                                            </div>
                                        </motion.div>
                                    ))
                                )
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
