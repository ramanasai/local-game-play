import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import { InfiniteGame } from './pages/InfiniteGame';
import { PowerUpGame } from './pages/PowerUpGame';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/infinite" element={<InfiniteGame />} />
        <Route path="/powerup" element={<PowerUpGame />} />
      </Routes>
    </Router>
  );
}

export default App;
