export interface Card {
    id: string;
    value: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const EMOJIS = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮',
    '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺',
    '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🕷', '🦂', '🐢',
    '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟',
    '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🦣', '🐘'
];

export const generateDeck = (pairs: number = 8): Card[] => {
    const selectedEmojis = EMOJIS.slice(0, pairs);
    const deck = [...selectedEmojis, ...selectedEmojis]
        .sort(() => Math.random() - 0.5)
        .map((emoji, index) => ({
            id: `card-${index}-${emoji}`,
            value: emoji,
            isFlipped: false,
            isMatched: false,
        }));
    return deck;
};
