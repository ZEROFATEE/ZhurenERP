import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Dashboard from "./Body/Dashboard"
import SalesPage from "./Body/Sales"
import LoginPage from "./Body/Login"
import ErrorPage from "./Body/ErrorPage"
import PurchasePage from "./Body/Purchases"
import VendorPage from "./Body/VendorMasterlist"
import InventoryPage from "./Body/Inventory"

import ProtectedRoutes from "./components/security/ProtectedRoutes"
import PublicRoute from "./components/security/PublicRoutes"

export const router = createBrowserRouter([
  // Default redirect
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  
   // Protected routes (require "login")
  {
    element: <ProtectedRoutes />,
    children: [
      {
        element: <Dashboard />,
        children: [
          { 
  element: <Dashboard />,
  children: [
    { path: "/dashboard", element: <Dashboard />, errorElement: <ErrorPage /> }, // ⭐ Use component
    { path: "/sales", element: <SalesPage />, errorElement: <ErrorPage /> },
    { path: "/inventory", element: <InventoryPage />, errorElement: <ErrorPage /> },
    { path: "/purchases", element: <PurchasePage />, errorElement: <ErrorPage /> },
    { path: "/vendormasterlist", element: <VendorPage />, errorElement: <ErrorPage /> },
  ],
}
    ],
  },
  
  // Public routes (no auth needed)
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <LoginPage />, errorElement: <ErrorPage /> },
    ],
  },
  
  { path: "*", element: <ErrorPage /> },
]}
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}