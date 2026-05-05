import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ScrollToTop from './components/layout/ScrollToTop';
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainPage from "./pages/MainPage";
import MyRoutines from "./pages/MyRoutines";
import SavedRoutines from "./pages/SavedRoutines";
import Routines from "./pages/Routines";
import './index.css';
import './components/common/Common.css';

const HomeRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/routines" replace /> : <MainPage />;
}

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeRoute />} />
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

          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <SavedRoutines />
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