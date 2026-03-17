import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Truck,
  ShoppingCart,
  Package,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", label: "Home", icon: Home },
    { to: "/sales", label: "Sales", icon: Users },
    { to: "/vendormasterlist", label: "Vendors", icon: Truck },
    { to: "/purchases", label: "Purchases", icon: ShoppingCart },
    { to: "/inventory", label: "Inventory", icon: Package },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ERP
              </span>
              <span className="text-xs text-muted-foreground">Management</span>
            </div>
          )}


        {/* Collapse Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "absolute -right-3 top-16 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-md transition-all hover:scale-110 hover:shadow-lg",
            isCollapsed && "rotate-180"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
  
          <SidebarMenu className="space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = isActive(to);
              return (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton
                    asChild
                    tooltip={label}
                    className={cn(
                      "group relative overflow-hidden rounded-lg transition-all duration-200",
                      active
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <NavLink to={to} className="flex items-center gap-3 px-3 py-2.5">
                      <Icon
                        className={cn(
                          "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                          active && "text-white"
                        )}
                      />
                      <span className="font-medium">{label}</span>
                      {active && !isCollapsed && (
                        <span className="absolute right-2 h-2 w-2 rounded-full bg-white/80" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Logout */}
      <SidebarFooter className="border-t border-border/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="group rounded-lg text-muted-foreground transition-all duration-200 hover:bg-red-50 hover:text-red-600"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 transition-colors group-hover:bg-red-200">
                <LogOut className="h-4 w-4 text-red-600" />
              </div>
              {!isCollapsed && (
                <span className="font-medium">Logout</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}