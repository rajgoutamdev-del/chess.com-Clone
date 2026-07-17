import { useEffect, useState } from "react";
import { Button } from "../Components/Button";
import { ChessBoard } from "../Components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";


export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "GAME_OVER";

export const Game = () => {

    const socket = useSocket();
    const [chess,setChess] = useState(new Chess());
    const [board,setBoard] = useState(chess.board());
    

    useEffect(() => {
        if(!socket) {
            return;
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);

            switch(message.type) {
                case INIT_GAME:
                    setChess(new Chess());
                    setBoard(chess.board());
                    console.log("game initialized");
                    break;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    console.log("Move made");
                    break;
                case GAME_OVER:
                    console.log("Game over");
                    break;
                
            }
        }
    }, [socket])

    if(!socket) return <div>connecting...</div>

    return <div className="flex justify-center" >
        <div className="pt-8 max-w-screen-lg w-full">
            <div className="grid grid-cols-6 gap-4 w-full">
                {/* Here we are dividing the webpage in two sections one for chess board and second for the utility area */}
                <div className="col-span-4 w-full flex justify-center" >
                    <ChessBoard socket={socket} board={board} />
                </div>
                <div>
                    <Button onClick={ () => {
                            socket.send(JSON.stringify({
                                type:INIT_GAME
                            }))
                        }} >
                            Play Online
                        </Button>
                </div>
            </div>
        </div>
    </div>
}