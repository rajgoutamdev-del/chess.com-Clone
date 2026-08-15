import type { Chess, Color } from "chess.js";
import { Button } from "./Button";

const reasonFor = (chess: Chess) => {
    if (chess.isCheckmate()) return "Checkmate";
    if (chess.isStalemate()) return "Stalemate";
    if (chess.isInsufficientMaterial()) return "Insufficient material";
    if (chess.isThreefoldRepetition()) return "Threefold repetition";
    if (chess.isDrawByFiftyMoves()) return "Fifty-move rule";
    if (chess.isDraw()) return "Draw";
    return "Game over";
};

export const GameOverModal = ({
    chess,
    winner,
    playerColor,
    onPlayAgain,
}: {
    chess: Chess;
    winner: string;
    playerColor: Color | null;
    onPlayAgain: () => void;
}) => {
    const isDraw = chess.isDraw();
    const won = !isDraw && playerColor === (winner === "white" ? "w" : "b");

    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-sm bg-black/70">
            <div className="rounded-lg bg-neutral-800 px-8 py-6 text-center shadow-2xl">
                <h2 className="mb-1 text-3xl font-bold text-white">
                    {isDraw ? "Draw" : won ? "You Won!" : "You Lost"}
                </h2>
                <p className="mb-6 text-neutral-400">
                    {isDraw ? reasonFor(chess) : (
                        <>
                            <span className="capitalize">{winner}</span> wins by {reasonFor(chess).toLowerCase()}
                        </>
                    )}
                </p>
                <Button onClick={onPlayAgain}>Play Again</Button>
            </div>
        </div>
    );
};
