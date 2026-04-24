import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import RecipeDetail from "./pages/RecipeDetail";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/recipe" element={<RecipeDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;