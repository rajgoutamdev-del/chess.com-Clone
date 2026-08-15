import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages.js";
export class Game {
    player1;
    player2;
    board;
    startTime;
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        // Only the player whose turn it is may move
        const isWhitesTurn = this.board.turn() === "w";
        if ((isWhitesTurn && socket !== this.player1) || (!isWhitesTurn && socket !== this.player2)) {
            return;
        }
        try {
            this.board.move(move);
        }
        catch (e) {
            return;
        }
        this.player1.send(JSON.stringify({
            type: MOVE,
            payload: move
        }));
        this.player2.send(JSON.stringify({
            type: MOVE,
            payload: move
        }));
        if (this.board.isGameOver()) {
            const payload = {
                winner: this.board.turn() === "w" ? "black" : "white"
            };
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload
            }));
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload
            }));
        }
    }
}
//# sourceMappingURL=Game.js.map