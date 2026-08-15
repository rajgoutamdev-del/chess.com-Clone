import type { Color, PieceSymbol } from "chess.js";

const PROMOTION_PIECES: PieceSymbol[] = ["q", "r", "b", "n"];

const PIECE_UNICODE: Record<Color, Partial<Record<PieceSymbol, string>>> = {
    w: { q: "♕", r: "♖", b: "♗", n: "♘" },
    b: { q: "♛", r: "♜", b: "♝", n: "♞" },
};

export const PromotionModal = ({
    color,
    onSelect,
    onCancel,
}: {
    color: Color;
    onSelect: (piece: "q" | "r" | "b" | "n") => void;
    onCancel: () => void;
}) => {
    return (
        <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/60"
            onClick={onCancel}
        >
            <div
                className="flex gap-2 rounded-lg bg-neutral-800 p-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {PROMOTION_PIECES.map((piece) => (
                    <button
                        key={piece}
                        onClick={() => onSelect(piece as "q" | "r" | "b" | "n")}
                        className="flex h-14 w-14 items-center justify-center rounded bg-neutral-700 text-4xl transition-colors hover:bg-green-600 sm:h-16 sm:w-16 sm:text-5xl"
                        style={{
                            color: color === "w" ? "#f9fafb" : "#1f2937",
                            textShadow:
                                color === "w"
                                    ? "0 1px 2px rgba(0,0,0,0.6)"
                                    : "0 1px 1px rgba(255,255,255,0.35)",
                        }}
                    >
                        {PIECE_UNICODE[color][piece]}
                    </button>
                ))}
            </div>
        </div>
    );
};
