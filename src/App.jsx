import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./layout/Navbar";

export default function App() {
  return (
    <Router>
      <Navbar />
    </Router>
  );
}