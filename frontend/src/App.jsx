import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import ProtectedRoute from "./auth/ProtectedRoute";
import MainLayout from "./components/Layout";

export default function App() {
  return (
    <Routes>
      {/* Root route → redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* All routes that need layout and auth */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/products" element={<Products />} />
        <Route path="/sales" element={<Sales />} />
      </Route>

      {/* Catch-all → redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
