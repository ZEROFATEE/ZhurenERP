// src/components/security/PublicRoutes.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PublicRoute() {
  const token = localStorage.getItem("authToken");
  const location = useLocation();

  // If user is logged in, redirect to dashboard
  // BUT only if they're not already going to dashboard (prevents loop)
  if (token && location.pathname !== "/dashboard") {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise show the public route (login page)
  return <Outlet />;
}