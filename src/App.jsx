import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainPage from "./pages/MainPage";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/register-account" element={<Register />} />
      <Route path="/mainpage" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
