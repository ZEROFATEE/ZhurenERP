import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const token = localStorage.getItem("authToken");
  
  // Already logged in? Go to home
  if (token) {
    return <Navigate to="/" replace />;
  }

  // Not logged in? Show public page (login, etc.)
  return <Outlet />;
}