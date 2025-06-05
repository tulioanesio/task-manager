import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;