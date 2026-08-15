import { useNavigate } from "react-router-dom";
import { Button } from "../Components/Button";

export const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center px-4">
            <div className="w-full max-w-screen-lg">
                <div className="grid grid-cols-1 items-center gap-10 py-10 md:grid-cols-2 md:py-20">
                    <div className="flex justify-center">
                        <img
                            src="/chess_main.webp"
                            alt="Chess board"
                            className="w-full max-w-md rounded-lg shadow-2xl"
                        />
                    </div>

                    <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
                        <h1 className="text-4xl font-bold text-neutral-100 md:text-5xl">
                            Play Chess Online
                        </h1>
                        <p className="max-w-md text-lg text-neutral-400">
                            Challenge a live opponent in real time. No signup, no friction — just click
                            play and you'll be matched instantly.
                        </p>
                        <div className="mt-2">
                            <Button onClick={() => navigate("/game")}>Play Online</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
