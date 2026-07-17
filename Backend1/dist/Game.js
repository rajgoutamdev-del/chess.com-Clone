import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages.js";
import { moveMessagePortToContext } from "node:worker_threads";
export class Game {
    player1;
    player2;
    board;
    startTime;
    countMoves = 0;
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
        // Validations
        // Is it this user move
        // Is the move valid
        // console.log("trying to make move");
        try {
            this.board.move(move);
        }
        catch (e) {
            return;
        }
        // console.log("move made");
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
        }
        if (this.countMoves % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));
        }
        this.countMoves++;
        // send the updated board to both the user
    }
}
//# sourceMappingURL=Game.js.map