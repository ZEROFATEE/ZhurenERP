import { Navigate, Outlet } from "react-router-dom";

// Simple version - checks if token exists in localStorage
export default function ProtectedRoutes() {
  const token = localStorage.getItem("authToken"); // or however you store auth
  
  // Not logged in? Redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in? Show the requested page
  return <Outlet />;
}