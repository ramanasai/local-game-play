import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import loginBg from '../../assets/login-bg.png';

const Login = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useAuthStore(state => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        setLoading(true);
        setError('');
        try {
            await login(username);
            navigate('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col font-sans text-gray-900">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${loginBg})` }}
            >
                {/* Gentle overlay to ensure text readability if needed, though the design is clean */}
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Header / Nav */}
            <header className="relative z-10 flex w-full items-center justify-between px-8 py-6">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-gray-900">LOCAL GAMES</span>
                </div>
                <div>
                    {/* Placeholder for header action if needed */}
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl space-y-6"
                >
                    <h1 className="text-5xl font-medium tracking-tight text-gray-900 md:text-7xl lg:text-8xl drop-shadow-sm">
                        The new standard<br />
                        in local gaming
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-gray-700 md:text-xl font-light leading-relaxed">
                        Meet the unified platform that brings your favorite classic arcade games together.
                        Simple, fast, and beautifully designed.
                    </p>

                    <div className="pt-8">
                        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-sm flex-col gap-3 sm:flex-row">
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="flex-1 rounded-full border border-gray-300/50 bg-white/80 px-6 py-3 text-base text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 backdrop-blur-sm transition-all"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-full bg-black px-8 py-3 text-base font-medium text-white transition-transform hover:scale-105 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-70"
                            >
                                {loading ? 'Loading...' : 'Get started'}
                            </button>
                        </form>
                        {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
                    </div>
                </motion.div>
            </main>

            {/* Footer-like element or bottom spacing */}
            <div className="relative z-10 pb-8 text-center text-xs text-gray-600">
                <p>&copy; 2026 Local Games Arcade. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Login;
