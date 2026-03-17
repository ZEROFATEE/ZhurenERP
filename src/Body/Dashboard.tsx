import { Outlet, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "../components/ui/sidebar";
import AppSidebar from "../components/appsidebar";
import { Separator } from "../components/ui/separator";
import { cn } from "@/lib/utils";
import { Home, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const location = useLocation();
  const isRootDashboard = location.pathname === "/dashboard";
  
  // Get page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    return path.split("/")[1].charAt(0).toUpperCase() + path.split("/")[1].slice(1);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      
      <SidebarInset className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">

    

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">
            {isRootDashboard ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                      Dashboard
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                      Welcome back! Here's an overview of your business.
                    </p>
                  </div>
                </div>
                
                {/* Dashboard content area */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {/* Add your dashboard cards/widgets here */}
                  <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="font-semibold">Total Sales</h3>
                    <p className="mt-2 text-2xl font-bold">$0.00</p>
                  </div>
                  <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="font-semibold">Orders</h3>
                    <p className="mt-2 text-2xl font-bold">0</p>
                  </div>
                  <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="font-semibold">Inventory</h3>
                    <p className="mt-2 text-2xl font-bold">0 items</p>
                  </div>
                  <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="font-semibold">Vendors</h3>
                    <p className="mt-2 text-2xl font-bold">0</p>
                  </div>
                </div>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}