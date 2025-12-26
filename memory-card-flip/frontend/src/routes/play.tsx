import React from 'react';
import { GameBoard } from '../components/GameBoard/GameBoard';
import { Timer } from '../components/HUD/Timer';
import { Moves } from '../components/HUD/Moves';
import { Toast } from '../components/UI/Toast';
import { useGameStore } from '../store/game.store';
import { Link } from 'react-router-dom';

export const Play: React.FC = () => {
    const resetGame = useGameStore(state => state.resetGame);
    const startGame = useGameStore(state => state.startGame);
    const isGameWon = useGameStore(state => state.isGameWon);
    const moves = useGameStore(state => state.moves);
    const timer = useGameStore(state => state.timer);
    const gridSize = useGameStore(state => state.gridSize);
    const setGridSize = useGameStore(state => state.setGridSize);

    return (
        <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black text-white flex flex-col items-center py-8">
            {isGameWon && (
                <Toast
                    message={`Victory! Completed in ${moves} moves and ${timer}s.`}
                    duration={5000}
                />
            )}
            <header className="w-full max-w-4xl px-4 flex flex-col md:flex-row items-center justify-between mb-4 md:mb-8 gap-4">
                <div className="flex items-center justify-between w-full md:w-auto">
                    <Link to="/" className="text-xl md:text-2xl font-bold text-slate-400 hover:text-white transition-colors">
                        ⬅ Memory
                    </Link>
                    {/* Mobile Restart Button */}
                    <button
                        onClick={() => { resetGame(); startGame(); }}
                        className="md:hidden flex items-center gap-2 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300 transition-colors"
                    >
                        <span>Restart</span> 🔄
                    </button>
                </div>

                <div className="flex flex-wrap justify-center gap-3 md:gap-4 items-center bg-slate-800/80 p-2 rounded-xl backdrop-blur-md w-full md:w-auto">
                    <select
                        value={gridSize}
                        onChange={(e) => {
                            setGridSize(e.target.value as any);
                            resetGame();
                            setTimeout(startGame, 0);
                        }}
                        className="bg-slate-700 border-none text-white rounded-lg px-2 py-1.5 text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                        <option value="4x3">4x3 (Easy)</option>
                        <option value="4x4">4x4 (Medium)</option>
                        <option value="6x4">6x4 (Hard)</option>
                        <option value="6x6">6x6 (Expert)</option>
                        <option value="8x5">8x5 (Master)</option>
                    </select>

                    <div className="w-px h-5 bg-slate-600 hidden md:block"></div>

                    <div className="flex items-center gap-3">
                        <Timer />
                        <div className="w-px h-4 bg-slate-600 md:hidden"></div>
                        <Moves />
                    </div>
                </div>

                {/* Desktop Restart Button */}
                <button
                    onClick={() => { resetGame(); startGame(); }}
                    className="hidden md:block p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors"
                >
                    Restart 🔄
                </button>
            </header>

            <main className="flex-1 w-full max-w-4xl flex items-center justify-center p-4">
                <GameBoard />
            </main>
        </div>
    );
};
