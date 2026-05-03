import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import Login from "./pages/Login";
import LeavePortal from "./pages/LeavePortal";
import WorkProgress from "./pages/WorkProgress";
import WorkReport from "./pages/WorkReport";
import NotFound from "./pages/NotFound.tsx";
import Dashboard from "./pages/Dashboard.tsx"


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/leave" replace />} />
             <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leave" element={<LeavePortal />} />
              <Route path="/progress" element={<WorkProgress />} />
              <Route path="/reports" element={<WorkReport />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
