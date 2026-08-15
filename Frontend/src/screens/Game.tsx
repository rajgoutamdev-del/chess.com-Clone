import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import type { Color, PieceSymbol, Square } from "chess.js";
import { Button } from "../Components/Button";
import { ChessBoard } from "../Components/ChessBoard";
import { GameOverModal } from "../Components/GameOverModal";
import { MoveHistory } from "../Components/MoveHistory";
import { useSocket } from "../hooks/useSocket";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "GAME_OVER";

type Phase = "idle" | "waiting" | "playing" | "over";

const PIECE_UNICODE: Record<Color, Record<PieceSymbol, string>> = {
    w: { p: "♙", r: "♖", n: "♘", b: "♗", q: "♕", k: "♔" },
    b: { p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚" },
};

const CapturedTray = ({ pieces, color }: { pieces: PieceSymbol[]; color: Color }) => (
    <div className="flex h-5 min-w-0 flex-wrap text-lg leading-none text-neutral-400">
        {pieces.map((p, i) => (
            <span key={i}>{PIECE_UNICODE[color][p]}</span>
        ))}
    </div>
);

const PlayerRow = ({
    name,
    color,
    active,
    captured,
    capturedColor,
}: {
    name: string;
    color: Color | null;
    active: boolean;
    captured: PieceSymbol[];
    capturedColor: Color;
}) => (
    <div
        className={`flex w-full max-w-[576px] items-center justify-between rounded px-2 py-1.5 transition-colors ${
            active ? "bg-neutral-800" : ""
        }`}
    >
        <div className="flex items-center gap-2">
            <span
                className={`h-3 w-3 rounded-full ${
                    color === "b" ? "border border-neutral-500 bg-neutral-900" : "bg-white"
                }`}
            />
            <span className="font-medium text-neutral-200">{name}</span>
        </div>
        <CapturedTray pieces={captured} color={capturedColor} />
    </div>
);

export const Game = () => {
    const socket = useSocket();
    const chessRef = useRef(new Chess());
    const [board, setBoard] = useState(chessRef.current.board());
    const [playerColor, setPlayerColor] = useState<Color | null>(null);
    const [phase, setPhase] = useState<Phase>("idle");
    const [winner, setWinner] = useState<string | null>(null);
    const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
    const [historyVersion, setHistoryVersion] = useState(0);

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            switch (message.type) {
                case INIT_GAME: {
                    chessRef.current = new Chess();
                    setBoard(chessRef.current.board());
                    setPlayerColor(message.payload.color === "white" ? "w" : "b");
                    setLastMove(null);
                    setWinner(null);
                    setPhase("playing");
                    setHistoryVersion((v) => v + 1);
                    break;
                }
                case MOVE: {
                    const move = message.payload;
                    chessRef.current.move(move);
                    setBoard(chessRef.current.board());
                    setLastMove({ from: move.from, to: move.to });
                    setHistoryVersion((v) => v + 1);
                    break;
                }
                case GAME_OVER: {
                    setWinner(message.payload.winner);
                    setPhase("over");
                    break;
                }
            }
        };
    }, [socket]);

    if (!socket) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center text-neutral-400">
                Connecting to server...
            </div>
        );
    }

    const chess = chessRef.current;
    const turn = chess.turn();
    const myTurn = phase === "playing" && playerColor === turn;
    const inCheck = chess.inCheck();

    const capturedByWhite: PieceSymbol[] = [];
    const capturedByBlack: PieceSymbol[] = [];
    chess.history({ verbose: true }).forEach((m) => {
        if (m.captured) {
            (m.color === "w" ? capturedByWhite : capturedByBlack).push(m.captured as PieceSymbol);
        }
    });

    const youAreWhite = playerColor !== "b";
    const topCaptured = youAreWhite ? capturedByBlack : capturedByWhite;
    const bottomCaptured = youAreWhite ? capturedByWhite : capturedByBlack;

    const playOnline = () => {
        socket.send(JSON.stringify({ type: INIT_GAME }));
        setPhase("waiting");
    };

    return (
        <div className="flex justify-center px-4">
            <div className="w-full max-w-screen-lg pb-16 pt-8">
                <div className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-3">
                    <div className="flex flex-col items-center gap-2 lg:col-span-2">
                        <PlayerRow
                            name="Opponent"
                            color={youAreWhite ? "b" : "w"}
                            active={phase === "playing" && turn !== playerColor}
                            captured={topCaptured}
                            capturedColor={youAreWhite ? "w" : "b"}
                        />

                        <div className="relative">
                            <ChessBoard
                                chess={chess}
                                board={board}
                                socket={socket}
                                playerColor={playerColor}
                                myTurn={myTurn}
                                lastMove={lastMove}
                            />
                            {phase === "over" && winner && (
                                <GameOverModal
                                    chess={chess}
                                    winner={winner}
                                    playerColor={playerColor}
                                    onPlayAgain={playOnline}
                                />
                            )}
                        </div>

                        <PlayerRow
                            name="You"
                            color={playerColor ?? "w"}
                            active={phase === "playing" && turn === playerColor}
                            captured={bottomCaptured}
                            capturedColor={youAreWhite ? "b" : "w"}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="rounded-lg bg-neutral-800 p-4">
                            {phase === "idle" && (
                                <>
                                    <p className="mb-4 text-neutral-300">Ready to play a game?</p>
                                    <Button onClick={playOnline}>Play Online</Button>
                                </>
                            )}
                            {phase === "waiting" && (
                                <p className="animate-pulse text-neutral-300">Waiting for an opponent...</p>
                            )}
                            {phase === "playing" && (
                                <div>
                                    <p className="font-semibold text-neutral-100">
                                        {myTurn ? "Your move" : "Opponent's move"}
                                        {inCheck && <span className="text-red-400"> · Check!</span>}
                                    </p>
                                    <p className="mt-1 text-sm text-neutral-400">
                                        You are playing {playerColor === "w" ? "White" : "Black"}
                                    </p>
                                </div>
                            )}
                            {phase === "over" && winner && (
                                <div>
                                    <p className="font-semibold capitalize text-neutral-100">{winner} wins</p>
                                    <div className="mt-3">
                                        <Button onClick={playOnline}>Play Again</Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <MoveHistory key={historyVersion} history={chess.history()} />
                    </div>
                </div>
            </div>
        </div>
    );
};
