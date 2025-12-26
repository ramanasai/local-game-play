export interface Card {
    id: string;
    value: string; // emoji or image url
    isFlipped: boolean;
    isMatched: boolean;
}

export interface GameState {
    cards: Card[];
    moves: number;
    matches: number;
    timer: number;
    isPlaying: boolean;
    isGameWon: boolean;
    flippedCards: Card[];
}
