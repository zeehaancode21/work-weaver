import { Outlet, Navigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/context/AuthContext";

export const AppLayout = () => {
  const { token } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      
      {/* Sidebar */}
      <div className="hidden md:flex w-[250px] shrink-0 border-r">
        <AppSidebar />
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* 🔥 Header */}
        <header className="h-14 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-10">
          <h1 className="text-sm font-semibold">Employee Panel</h1>
          <div className="text-sm text-muted-foreground">
            Welcome 👋
          </div>
        </header>

        {/* 🔥 Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};