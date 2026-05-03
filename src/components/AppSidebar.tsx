import { NavLink, useNavigate } from "react-router-dom";
import { Briefcase, CalendarDays, ClipboardList, FileText, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/leave", label: "Leave Portal", icon: CalendarDays },
  { to: "/progress", label: "Work Progress", icon: ClipboardList },
  { to: "/reports", label: "Work Report", icon: FileText },
];

export const AppSidebar = () => {
  const { name, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="flex h-screen w-[250px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-sidebar-border px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          {/* <Briefcase className="h-5 w-5" /> */}
          <img
            src="/logoikt-final.png"
            alt="Logo"
            className="h-5 w-5 object-cover"
          />

        </div>
        <div>
          <div className="text-base font-semibold text-white">IK Tangience</div>
          <div className="text-xs text-sidebar-foreground/70">Management</div>
        </div>
      </div>

      {/* User info */}
      <div className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold text-white">
            {name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-white">{name || "User"}</div>
            <div className="text-xs uppercase tracking-wide text-sidebar-primary">{role}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
};
