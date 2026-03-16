// src/Body/Dashboard.tsx
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarInset } from "../components/ui/sidebar";
import AppSidebar from "../components/appsidebar";

export default function Dashboard() {
  const location = useLocation();
  const isRootDashboard = location.pathname === "/dashboard";

  return (
    <SidebarProvider>
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar>
          <AppSidebar />
        </Sidebar>
        
        <SidebarInset style={{ flex: 1, padding: "20px", overflow: "auto" }}>
          {isRootDashboard ? (
            <div>
              <h1>Dashboard Home</h1>
              <p>insert tabs and brrrr</p>
            </div>
          ) : (
            <Outlet />
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}