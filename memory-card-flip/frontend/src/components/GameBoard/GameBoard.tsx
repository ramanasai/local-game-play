import React, { useEffect } from 'react';
import { useGameStore } from '../../store/game.store';
import { Card } from './Card';

export const GameBoard: React.FC = () => {
    const { cards, startGame, isPlaying, gridSize } = useGameStore();

    useEffect(() => {
        if (!isPlaying && cards.length === 0) {
            startGame();
        }
    }, [isPlaying, cards, startGame]);

    const gridClass = {
        '4x3': 'grid-cols-3 sm:grid-cols-4', // 3 cols on mobile, 4 on sm+
        '4x4': 'grid-cols-4',
        '6x4': 'grid-cols-4 md:grid-cols-6',
        '6x6': 'grid-cols-4 sm:grid-cols-6',
        '8x5': 'grid-cols-4 sm:grid-cols-5 md:grid-cols-8',
    }[gridSize || '4x4'];

    return (
        <div className={`grid ${gridClass} gap-2 md:gap-4 p-2 md:p-4 place-items-center bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-sm mx-auto`}>
            {cards.map((card) => (
                <Card key={card.id} card={card} />
            ))}
        </div>
    );
};
