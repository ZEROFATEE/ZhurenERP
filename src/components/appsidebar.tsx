// src/components/AppSidebar.tsx
import { SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "./ui/sidebar";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Users, Truck, ShoppingCart, Package, LogOut } from "lucide-react";

export default function AppSidebar() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login"); 
  };

  return (
    <>
      <SidebarHeader>
        <h2 style={{ padding: "0 16px", color: "black" }}>My App</h2>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavLink to="/dashboard" style={{ textDecoration: "none" }}>
              {({ isActive }) => (
                <SidebarMenuButton isActive={isActive}>
                  <Home size={18} />
                  <span>Home</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <NavLink to="/sales" style={{ textDecoration: "none" }}>
              {({ isActive }) => (
                <SidebarMenuButton isActive={isActive}>
                  <Users size={18} />
                  <span>Sales</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <NavLink to="/vendormasterlist" style={{ textDecoration: "none" }}>
              {({ isActive }) => (
                <SidebarMenuButton isActive={isActive}>
                  <Truck size={18} />
                  <span>Vendor Master List</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <NavLink to="/purchases" style={{ textDecoration: "none" }}>
              {({ isActive }) => (
                <SidebarMenuButton isActive={isActive}>
                  <ShoppingCart size={18} />
                  <span>Purchases</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <NavLink to="/inventory" style={{ textDecoration: "none" }}>
              {({ isActive }) => (
                <SidebarMenuButton isActive={isActive}>
                  <Package size={18} />
                  <span>Inventory</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}