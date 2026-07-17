import { useNavigate } from "react-router-dom";
import { Button } from "../Components/Button";

export const Landing = () => {

    const navigate = useNavigate();

    return <div className="flex justify-center" >
        <div className="mt-2 max-w-screen ">
            <div className="grid grid-cols-1 gap4 md:grid-cols-2">
                <div className="flex justify-center" >
                    <img src={"/chess_main.webp"} />
                </div>

                <div>
                    <div className="flex justify-center">
                        <h1 className="text-4xl font-bold">Play chess here</h1>
                    </div>
                    
                    <div className="mt-4">
                        <Button onClick={ () => {
                            navigate("/game")
                        }} >
                            Play Online
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}