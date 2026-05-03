import { useState, FormEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
// import { Briefcase } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/Spinner";

const Login = () => {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("EMPLOYEE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (token) return <Navigate to="/leave" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Backend bypassed — mock auth on the frontend
      await new Promise((r) => setTimeout(r, 400));
      const mockToken = `mock-${role}-${Date.now()}`;
      const name = email.split("@")[0] || (role === "OWNER" ? "Owner" : "Employee");
      login(mockToken, role, name);
      navigate("/leave");
    } catch (err) {
      setError("Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (r: Role) => {
    setRole(r);
    setEmail(r === "OWNER" ? "noor@ikt.com" : "employee@demo.com");
    setPassword("demo1234");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            {/* <Briefcase className="h-5 w-5" /> */}
             <img
              src="/logoikt-final.png"
              alt="Logo"
              className="h-5 w-5 object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Workforce Management</h1>
            <p className="text-xs text-muted-foreground">Demo mode — backend bypassed</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Sign in as</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMPLOYEE">Employee</SelectItem>
                <SelectItem value="OWNER">Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner className="text-primary-foreground" /> : "Sign in"}
          </Button>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => quickFill("EMPLOYEE")}
            >
              Use Employee demo
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => quickFill("OWNER")}
            >
              Use Owner demo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
