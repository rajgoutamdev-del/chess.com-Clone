// This is basically the websocket server
import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager.js";
console.log("Starting WebSocket server...");
const wss = new WebSocketServer({ port: 8000 });
console.log("WebSocket server is running on port 8000");
const gameManager = new GameManager();
wss.on("connection", function connection(ws) {
    console.log("Connection made");
    gameManager.addUser(ws);
    ws.on("close", () => {
        console.log("Connection closed");
        gameManager.removeUser(ws);
    });
});
//# sourceMappingURL=index.js.map