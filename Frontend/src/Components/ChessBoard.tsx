import type { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useMemo, useState } from "react";
import { MOVE } from "../screens/Game";
import { PromotionModal } from "./PromotionModal";

type BoardCell = { square: Square; type: PieceSymbol; color: Color } | null;

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

const PIECE_UNICODE: Record<Color, Record<PieceSymbol, string>> = {
    w: { p: "♙", r: "♖", n: "♘", b: "♗", q: "♕", k: "♔" },
    b: { p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚" },
};

const LIGHT_SQUARE = "#ebecd0";
const DARK_SQUARE = "#779556";

export const ChessBoard = ({
    chess,
    board,
    socket,
    playerColor,
    myTurn,
    lastMove,
}: {
    chess: Chess;
    board: BoardCell[][];
    socket: WebSocket;
    playerColor: Color | null;
    myTurn: boolean;
    lastMove: { from: Square; to: Square } | null;
}) => {
    const [selected, setSelected] = useState<Square | null>(null);
    const [legalTargets, setLegalTargets] = useState<Square[]>([]);
    const [promotion, setPromotion] = useState<{ from: Square; to: Square } | null>(null);

    const orientation: Color = playerColor ?? "w";

    // Attach the correct square name to every cell (including empty ones) before
    // any flipping, so board orientation never breaks square identity.
    const cells = useMemo(() => {
        return board.map((row, r) =>
            row.map((piece, c) => ({
                square: `${FILES[c]}${8 - r}` as Square,
                piece,
            }))
        );
    }, [board]);

    const displayRows = orientation === "b" ? [...cells].reverse().map((row) => [...row].reverse()) : cells;

    const checkedKingSquare = useMemo(() => {
        if (!chess.inCheck()) return null;
        const turn = chess.turn();
        for (const row of board) {
            for (const cell of row) {
                if (cell && cell.type === "k" && cell.color === turn) return cell.square;
            }
        }
        return null;
    }, [board, chess]);

    const clearSelection = () => {
        setSelected(null);
        setLegalTargets([]);
    };

    const trySelect = (square: Square, piece: BoardCell) => {
        if (!myTurn || !playerColor) return;
        if (piece && piece.color === playerColor) {
            setSelected(square);
            setLegalTargets(chess.moves({ square, verbose: true }).map((m) => m.to as Square));
        } else {
            clearSelection();
        }
    };

    const sendMove = (from: Square, to: Square, promotionPiece?: "q" | "r" | "b" | "n") => {
        socket.send(
            JSON.stringify({
                type: MOVE,
                payload: { from, to, ...(promotionPiece ? { promotion: promotionPiece } : {}) },
            })
        );
        clearSelection();
        setPromotion(null);
    };

    const onSquareClick = (square: Square, piece: BoardCell) => {
        if (!myTurn) return;

        if (!selected) {
            trySelect(square, piece);
            return;
        }

        if (square === selected) {
            clearSelection();
            return;
        }

        if (legalTargets.includes(square)) {
            const movingPiece = chess.get(selected);
            const isPromotion = movingPiece?.type === "p" && (square[1] === "8" || square[1] === "1");
            if (isPromotion) {
                setPromotion({ from: selected, to: square });
            } else {
                sendMove(selected, square);
            }
            return;
        }

        trySelect(square, piece);
    };

    return (
        <div className="relative inline-block select-none">
            {promotion && playerColor && (
                <PromotionModal
                    color={playerColor}
                    onSelect={(p) => sendMove(promotion.from, promotion.to, p)}
                    onCancel={() => setPromotion(null)}
                />
            )}
            <div className="overflow-hidden rounded-sm border-4 border-neutral-800 shadow-2xl">
                {displayRows.map((row, i) => (
                    <div key={i} className="flex">
                        {row.map(({ square, piece }, j) => {
                            const isLight = (i + j) % 2 === 0;
                            const isSelected = selected === square;
                            const isLegalTarget = legalTargets.includes(square);
                            const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
                            const isChecked = checkedKingSquare === square;

                            const showFile = i === 7;
                            const showRank = j === 0;

                            return (
                                <div
                                    key={square}
                                    onClick={() => onSquareClick(square, piece)}
                                    className="relative flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16 md:h-[72px] md:w-[72px]"
                                    style={{ backgroundColor: isLight ? LIGHT_SQUARE : DARK_SQUARE }}
                                >
                                    {isLastMove && (
                                        <div className="absolute inset-0 bg-yellow-300/40" />
                                    )}
                                    {isChecked && (
                                        <div className="absolute inset-0 bg-red-500/60" />
                                    )}
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-yellow-400/50" />
                                    )}

                                    {piece && (
                                        <span
                                            className="z-10 cursor-pointer text-4xl leading-none sm:text-5xl md:text-6xl"
                                            style={{
                                                color: piece.color === "w" ? "#f9fafb" : "#1f2937",
                                                textShadow:
                                                    piece.color === "w"
                                                        ? "0 1px 2px rgba(0,0,0,0.6), 0 0 1px rgba(0,0,0,0.6)"
                                                        : "0 1px 1px rgba(255,255,255,0.35)",
                                            }}
                                        >
                                            {PIECE_UNICODE[piece.color][piece.type]}
                                        </span>
                                    )}

                                    {isLegalTarget && !piece && (
                                        <div className="absolute h-4 w-4 rounded-full bg-black/25 sm:h-5 sm:w-5" />
                                    )}
                                    {isLegalTarget && piece && (
                                        <div className="absolute inset-0 rounded-full ring-4 ring-inset ring-black/30" />
                                    )}

                                    {showFile && (
                                        <span
                                            className="absolute bottom-0.5 right-1 text-[10px] font-semibold sm:text-xs"
                                            style={{ color: isLight ? DARK_SQUARE : LIGHT_SQUARE }}
                                        >
                                            {square[0]}
                                        </span>
                                    )}
                                    {showRank && (
                                        <span
                                            className="absolute left-1 top-0.5 text-[10px] font-semibold sm:text-xs"
                                            style={{ color: isLight ? DARK_SQUARE : LIGHT_SQUARE }}
                                        >
                                            {square[1]}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};
