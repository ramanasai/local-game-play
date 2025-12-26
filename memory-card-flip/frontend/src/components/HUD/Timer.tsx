import React, { useEffect } from 'react';
import { useGameStore } from '../../store/game.store';
import { formatTime } from '../../lib/time';

export const Timer: React.FC = () => {
    const { timer, isPlaying, incrementTimer } = useGameStore();

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isPlaying) {
            interval = setInterval(() => {
                incrementTimer();
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, incrementTimer]);

    return (
        <div className="flex flex-col items-center bg-slate-800 px-6 py-2 rounded-lg shadow-md border border-slate-700">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Time</span>
            <span className="text-2xl font-mono text-indigo-400">{formatTime(timer)}</span>
        </div>
    );
};
