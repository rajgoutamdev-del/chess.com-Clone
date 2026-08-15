import { INIT_GAME, MOVE } from "./messages.js";
import { Game } from "./Game.js";
import { convertProcessSignalToExitCode } from "node:util";
export class GameManager {
    games;
    pendingUser;
    users;
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user != socket);
        if (this.pendingUser === socket) {
            this.pendingUser = null;
        }
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    // start the game
                    const game = new Game(this.pendingUser, socket);
                    console.log("New game started");
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    console.log("Player added to waitinglist");
                    this.pendingUser = socket; // user waiting to connect with someone else to start the game
                }
            }
            if (message.type === MOVE) {
                // console.log("In make move, type matched");
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    // console.log("Going to make move");
                    game.makeMove(socket, message.payload);
                }
            }
        });
    }
}
//# sourceMappingURL=GameManager.js.map