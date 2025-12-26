import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLeaderboard } from '../lib/api';
import { formatTime } from '../lib/time';

export const Leaderboard: React.FC = () => {
    const [scores, setScores] = useState<any[]>([]);

    useEffect(() => {
        getLeaderboard().then(setScores).catch(console.error);
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-yellow-400">Leaderboard 🏆</h1>
                    <Link to="/" className="text-slate-400 hover:text-white underline">Back to Home</Link>
                </div>

                <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
                    {scores.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 italic">
                            Loading scores... or no scores yet!
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-700 text-slate-300">
                                <tr>
                                    <th className="p-4">Rank</th>
                                    <th className="p-4">Player</th>
                                    <th className="p-4">Moves</th>
                                    <th className="p-4">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {scores.map((s, i) => (
                                    <tr key={s.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4 text-slate-500 font-mono">#{i + 1}</td>
                                        <td className="p-4 font-bold text-indigo-300">{s.username}</td>
                                        <td className="p-4 text-slate-200">{s.moves}</td>
                                        <td className="p-4 text-slate-400 font-mono">{formatTime(s.time_seconds)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};
