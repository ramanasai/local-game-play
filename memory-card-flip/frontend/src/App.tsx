import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './routes/index';
import { Play } from './routes/play';
import { Leaderboard } from './routes/leaderboard';
import { useGameStore } from './store/game.store';
import { useEffect } from 'react';

function App() {
  const init = useGameStore(state => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  )
}

export default App
