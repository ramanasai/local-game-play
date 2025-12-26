import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Brain, Grid3x3, LogOut, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const GameCard = ({ title, description, icon: Icon, onClick, color }: any) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`group relative flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border border-border bg-card p-8 text-center shadow-lg transition-colors hover:border-${color}-500/50`}
    >
        <div className={`rounded-full bg-${color}-500/10 p-6 text-${color}-500 transition-colors group-hover:bg-${color}-500 group-hover:text-white`}>
            <Icon size={48} />
        </div>
        <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
    </motion.div>
);

const Home = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen flex-col p-4 md:p-8">
            <header className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Arcade</h1>
                    <p className="text-muted-foreground">Hello, {user?.username}</p>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 rounded-md border border-input px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </header>

            <main className="grid flex-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto w-full place-content-center">
                <GameCard
                    title="Memory Flip"
                    description="Test your memory by matching pairs of cards against the clock."
                    icon={Brain}
                    color="purple"
                    onClick={() => navigate('/memory')}
                />

                <GameCard
                    title="Tic-Tac-Toe"
                    description="Challenge the Minimax AI. Can you force a draw?"
                    icon={Grid3x3}
                    color="blue"
                    onClick={() => navigate('/tictactoe')}
                />

                {/* Placeholder for future games */}
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground opacity-50">
                    <Trophy size={48} />
                    <p className="mt-4">More games coming soon...</p>
                </div>
            </main>
        </div>
    );
};

export default Home;
