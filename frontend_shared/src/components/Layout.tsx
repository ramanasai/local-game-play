import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Trophy, Settings } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import SettingsModal from '../features/home/SettingsModal';

const Layout = () => {
    const { user, logout } = useAuthStore();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="min-h-screen bg-transparent text-foreground flex flex-col font-sans transition-colors duration-300">
            {/* Common Header */}
            <header className="border-b border-white/20 sticky top-0 z-50 bg-white/10 backdrop-blur-md">
                <div className="container mx-auto max-w-7xl grid grid-cols-12">
                    {/* Logo Area */}
                    <div className="col-span-6 md:col-span-4 border-r border-border p-4 md:p-6 flex items-center gap-4">
                        <Link to="/" className="text-2xl font-black tracking-tighter text-destructive hover:scale-105 transition-transform block">
                            ARCADE
                        </Link>
                    </div>

                    {/* Controls Area */}
                    <div className="col-span-6 md:col-span-8 flex items-center justify-end p-4 md:p-6 gap-4 md:gap-6">
                        <span className="hidden md:inline font-mono text-xs uppercase tracking-widest text-muted-foreground">
                            User: {user?.username}
                        </span>

                        <Link to="/leaderboard" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors" title="Leaderboard">
                            <Trophy size={18} className="text-yellow-500" />
                            <span className="hidden sm:inline">Hall of Fame</span>
                        </Link>

                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors"
                            title="Security Settings"
                        >
                            <Settings size={18} />
                            <span className="hidden sm:inline">Settings</span>
                        </button>

                        <ModeToggle />

                        <button
                            onClick={logout}
                            className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-destructive transition-colors relative"
                        >
                            {/* Separator */}
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-px h-4 bg-border hidden sm:block"></div>
                            <LogOut size={16} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <Outlet />

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
};

export default Layout;
