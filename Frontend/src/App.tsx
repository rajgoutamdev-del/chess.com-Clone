import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Landing } from "./screens/Landing";
import { Game } from "./screens/Game";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-900">
        <nav className="border-b border-neutral-800 px-4 py-3">
          <Link to="/" className="text-lg font-bold text-neutral-100">
            Chess<span className="text-green-500">.com</span> Clone
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
