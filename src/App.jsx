import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Login from "./pages/Login";
import Register from "./pages/Register";
import MainPage from "./pages/MainPage";
import MyRoutines from "./pages/MyRoutines";
import Routines from "./pages/Routines";
import './index.css';
import './components/common/Common.css';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/routines" element={<Routines />} />
          <Route path="/register-account" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/myroutines"
            element={
              <ProtectedRoute>
                <MyRoutines />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;