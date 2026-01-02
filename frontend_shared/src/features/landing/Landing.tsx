import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import landscapeBg from '../../assets/login-bg.png';

const Landing = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault();
        // Navigate to login, potentially passing the username state if we wanted to pre-fill it
        // For now, simple navigation since Login handles its own state. 
        // We could pass it via state: { username }
        navigate('/login', { state: { username } });
    };

    return (
        <div className="relative min-h-screen w-full font-sans text-gray-900 overflow-hidden flex flex-col">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${landscapeBg})` }}
            >
                {/* Overlay to ensure text readability if needed, though design looks clean */}
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
                <div className="font-bold text-lg tracking-tight text-gray-900">
                    LOCAL GAMES
                </div>
                <div className="w-20">
                    {/* Spacer for centering or auth buttton */}
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 -mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-gray-900 mb-6 leading-[1.1]">
                        The new standard <br />
                        in local gaming
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700/90 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
                        Meet the unified platform that brings your favorite classic arcade games together. Simple, fast, and beautifully designed.
                    </p>

                    {/* Input Area */}
                    <form onSubmit={handleStart} className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full sm:w-auto flex-1 bg-white/40 backdrop-blur-md border border-white/40 rounded-full px-6 py-4 text-gray-900 placeholder:text-gray-600 outline-none focus:bg-white/60 transition-all shadow-sm"
                        />
                        <button
                            type="submit"
                            className="bg-black text-white rounded-full px-8 py-4 font-medium hover:scale-105 active:scale-95 transition-all shadow-lg w-full sm:w-auto"
                        >
                            Get started
                        </button>
                    </form>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-6 text-center text-gray-600/60 text-xs font-medium">
                © 2026 Local Games Arcade. All rights reserved.
            </footer>
        </div>
    );
};

export default Landing;
