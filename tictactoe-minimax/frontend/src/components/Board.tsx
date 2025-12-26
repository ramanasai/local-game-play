import { Square } from './Square';

interface BoardProps {
    squares: string[];
    onClick: (i: number) => void;
    winningLine: number[] | null;
    xQueue: number[];
    oQueue: number[];
}

export function Board({ squares, onClick, winningLine, xQueue, oQueue }: BoardProps) {
    const renderSquare = (i: number) => {
        const isWinningSquare = winningLine?.includes(i);

        // Check if this square is fading (about to be removed)
        // It fades if it is the oldest move (queue[0]) AND the player has placed 3 moves already 
        // (so the NEXT move will remove this one).
        // Wait, rule is: placing 4th removes 1st. So if queue has 3, the one at index 0 is "at risk".
        let isFading = false;
        if (squares[i] === 'X' && xQueue.length >= 3 && xQueue[0] === i) {
            isFading = true;
        } else if (squares[i] === 'O' && oQueue.length >= 3 && oQueue[0] === i) {
            isFading = true;
        }

        return (
            <Square
                value={squares[i]}
                onClick={() => onClick(i)}
                isWinningSquare={!!isWinningSquare}
                isFading={isFading}
            />
        );
    };

    return (
        <div className="board">
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
}
