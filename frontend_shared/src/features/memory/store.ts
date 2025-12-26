import { create } from 'zustand';
import { type Card, generateDeck } from './utils';
import { submitMemoryScore } from '../../lib/api';

export type GridSize = '4x3' | '4x4' | '6x4' | '6x6' | '8x5';

interface MemoryStore {
    cards: Card[];
    moves: number;
    matches: number;
    timer: number;
    isPlaying: boolean;
    isGameWon: boolean;
    flippedCards: Card[];
    gridSize: GridSize;

    setGridSize: (size: GridSize) => void;
    startGame: () => void;
    resetGame: () => void;
    flipCard: (cardId: string) => void;
    checkMatch: () => void;
    incrementTimer: () => void;
}

export const useMemoryStore = create<MemoryStore>((set, get) => ({
    cards: [],
    moves: 0,
    matches: 0,
    timer: 0,
    isPlaying: false,
    isGameWon: false,
    flippedCards: [],
    gridSize: '4x4',

    setGridSize: (gridSize) => set({ gridSize }),

    startGame: () => {
        const { gridSize } = get();
        let pairs = 8;
        if (gridSize === '4x3') pairs = 6;
        if (gridSize === '6x4') pairs = 12;
        if (gridSize === '6x6') pairs = 18;
        if (gridSize === '8x5') pairs = 20;

        set({
            cards: generateDeck(pairs),
            moves: 0,
            matches: 0,
            timer: 0,
            isPlaying: true,
            isGameWon: false,
            flippedCards: [],
        });
    },

    resetGame: () => {
        set({
            cards: [],
            moves: 0,
            matches: 0,
            timer: 0,
            isPlaying: false,
            isGameWon: false,
            flippedCards: [],
        });
    },

    flipCard: (cardId: string) => {
        const { cards, flippedCards, isPlaying } = get();
        if (!isPlaying || flippedCards.length >= 2) return;

        const cardIndex = cards.findIndex(c => c.id === cardId);
        if (cards[cardIndex].isFlipped || cards[cardIndex].isMatched) return;

        const newCards = cards.map((c, i) =>
            i === cardIndex ? { ...c, isFlipped: true } : c
        );

        set({
            cards: newCards,
            flippedCards: [...flippedCards, newCards[cardIndex]],
            moves: get().moves + 1,
        });

        if (flippedCards.length === 1) {
            setTimeout(() => get().checkMatch(), 600);
        }
    },

    checkMatch: () => {
        const { cards, flippedCards, matches, moves, timer } = get();
        const [first, second] = flippedCards;

        if (first.value === second.value) {
            // Match!
            const newCards = cards.map(c =>
                c.value === first.value ? { ...c, isMatched: true } : c
            );
            const newMatches = matches + 1;
            set({
                cards: newCards,
                flippedCards: [],
                matches: newMatches,
            });

            // Check win
            if (newMatches === cards.length / 2) {
                set({ isPlaying: false, isGameWon: true });
                submitMemoryScore(moves, timer).catch(console.error);
            }

        } else {
            // No match
            const newCards = cards.map(c =>
                c.id === first.id || c.id === second.id ? { ...c, isFlipped: false } : c
            );
            set({
                cards: newCards,
                flippedCards: [],
            });
        }
    },

    incrementTimer: () => set(state => ({ timer: state.timer + 1 })),
}));
