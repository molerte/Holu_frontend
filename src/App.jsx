import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import SignIn from "./pages/SignIn";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/signin" element={<SignIn />} />

    </Routes>
  );
} /*End of App.jsx */
