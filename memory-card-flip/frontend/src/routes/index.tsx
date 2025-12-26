import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore } from '../store/game.store';

export const Home: React.FC = () => {
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user, login } = useGameStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;
        setIsLoading(true);
        await login(username);
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-4">
            <div className="max-w-md w-full text-center space-y-8 animate-fade-in-down">
                <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 drop-shadow-2xl">
                    Memory Flip
                </h1>
                <p className="text-slate-300 text-xl font-light">
                    Test your memory and race against the clock.
                </p>

                {!user ? (
                    <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-xs mx-auto">
                        <input
                            type="text"
                            placeholder="Enter Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'Joining...' : 'Enter Game'}
                        </button>
                    </form>
                ) : (
                    <div className="flex flex-col gap-4 pt-8">
                        <p className="text-xl text-indigo-300">Welcome, {user.username}!</p>
                        <Link
                            to="/play"
                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
                        >
                            Start Game 🎮
                        </Link>
                        <Link
                            to="/leaderboard"
                            className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-semibold text-lg hover:text-white transition-all hover:scale-105"
                        >
                            Leaderboard 🏆
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
