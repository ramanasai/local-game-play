import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Ghost } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FF6B6B] flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-20 right-20 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[40px] p-12 text-center shadow-2xl max-w-md w-full relative z-10"
            >
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400"
                >
                    <Ghost size={48} />
                </motion.div>

                <h1 className="text-6xl font-black text-gray-800 mb-2 tracking-tighter">404</h1>
                <h2 className="text-xl font-bold text-gray-600 mb-6">Page Not Found</h2>
                <p className="text-gray-500 mb-8">
                    Oops! It looks like this level hasn't been designed yet.
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="w-full bg-[#FF6B6B] text-white font-bold py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <Home size={20} />
                    Back to Arcade
                </button>
            </motion.div>
        </div>
    );
};

export default NotFound;
