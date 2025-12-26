
interface SquareProps {
    value: string;
    onClick: () => void;
    isWinningSquare?: boolean;
    isFading?: boolean;
}

export function Square({ value, onClick, isWinningSquare, isFading }: SquareProps) {
    let className = "square";
    if (isWinningSquare) className += " winning";
    if (isFading) className += " fading";

    return (
        <button className={className} onClick={onClick}>
            <span className={`piece-${value}`}>{value}</span>
        </button>
    );
}
