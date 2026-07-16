// This is basically the websocket server
import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager.js";
const wss = new WebSocketServer({ port: 8000 });
const gameManager = new GameManager();
wss.on("connection", function connection(ws) {
    gameManager.addUser(ws);
    ws.on("disconnect", () => gameManager.removeUser(ws));
});
//# sourceMappingURL=index.js.map