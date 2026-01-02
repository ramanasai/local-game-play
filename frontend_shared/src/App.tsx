import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './features/auth/Login';
import Landing from './features/landing/Landing';
import Home from './features/home/Home';
import MemoryGame from './features/memory/Game.tsx'; // Game component
import TicTacToeGame from './features/tictactoe/Game.tsx';
import Game2048 from './features/game2048/Game.tsx';
import BlockBlastGame from './features/blockblast/Game.tsx';
import { ThemeProvider } from './components/theme-provider';
import Layout from './components/Layout';
import Leaderboard from './features/leaderboard/Leaderboard';
import ScrollToTop from './components/ScrollToTop';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#FF6B6B] text-white font-bold">Loading...</div>;
  if (!user) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
};

// Check if user is already logged in (for public pages)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
          <Routes>
            <Route path="/welcome" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<Home />} />
              <Route path="/memory" element={<MemoryGame />} />
              <Route path="/tictactoe" element={<TicTacToeGame />} />
              <Route path="/2048" element={<Game2048 />} />
              <Route path="/blockblast" element={<BlockBlastGame />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
