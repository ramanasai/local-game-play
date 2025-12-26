import React from 'react';
import type { Card as CardType } from './types';
import { useGameStore } from '../../store/game.store';
import clsx from 'clsx';

interface CardProps {
    card: CardType;
}

export const Card: React.FC<CardProps> = ({ card }) => {
    const flipCard = useGameStore(state => state.flipCard);

    return (
        <div
            onClick={() => flipCard(card.id)}
            className={clsx(
                "relative w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 cursor-pointer transition-transform duration-500 transform-style-3d",
                card.isFlipped || card.isMatched ? "rotate-y-180" : ""
            )}
            style={{ perspective: '1000px' }}
        >
            <div
                className={clsx(
                    "absolute w-full h-full bg-slate-700 rounded-lg md:rounded-xl shadow-lg backface-hidden flex items-center justify-center border-2 md:border-4 border-slate-600 transition-colors hover:border-slate-500"
                )}
            >
                <span className="text-2xl md:text-4xl">❓</span>
            </div>

            <div
                className={clsx(
                    "absolute w-full h-full bg-indigo-600 rounded-lg md:rounded-xl shadow-lg backface-hidden flex items-center justify-center border-2 md:border-4 border-indigo-400 rotate-y-180",
                    card.isMatched ? "bg-green-600 border-green-400 ring-4 ring-green-300 ring-opacity-50" : ""
                )}
            >
                <span className="text-3xl md:text-6xl">{card.value}</span>
            </div>
        </div>
    );
};
