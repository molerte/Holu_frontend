import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainPage from "./pages/MainPage";
import Navbar from "./layout/Navbar";
import MyRoutines from "./pages/MyRoutines";
import Routines from "./pages/Routines";


export default function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/register-account" element={<Register />} />
      <Route path="/mainpage" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/myroutines" element={<MyRoutines />} />
      <Route path="/routines" element={<Routines />} />
    </Routes>
    </>
  );
}
