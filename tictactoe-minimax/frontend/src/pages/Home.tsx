import { useNavigate } from 'react-router-dom';
// We can move styles to a separate CSS or use inline for now
import '../App.css';

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="game-container">
            <h1>Tic-Tac-Toe Universe</h1>
            <p>Select a game mode to begin:</p>

            <div className="game-menu">
                <div className="card" onClick={() => navigate('/infinite')}>
                    <h3>Infinite Tic-Tac-Toe</h3>
                    <p>3 marks max. Oldest one disappears!</p>
                </div>



                <div className="card" onClick={() => navigate('/powerup')}>
                    <h3>Power-Up Arcade</h3>
                    <p>Bombs, Swaps, and Chaos!</p>
                </div>
            </div>
        </div>
    );
}
