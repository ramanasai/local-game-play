import React from 'react';
import { useGameStore } from '../../store/game.store';

export const Moves: React.FC = () => {
    const moves = useGameStore(state => state.moves);

    return (
        <div className="flex flex-col items-center bg-slate-800 px-6 py-2 rounded-lg shadow-md border border-slate-700">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Moves</span>
            <span className="text-2xl font-mono text-indigo-400">{moves}</span>
        </div>
    );
};
