import { useEffect, useState, FormEvent } from "react";
import { format, differenceInCalendarDays } from "date-fns";
import api, { getErrorMessage } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/PageHeader";
import { Spinner, FullSpinner } from "@/components/Spinner";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

interface Leave {
  id: string | number;
  employeeName?: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days?: number;
  reason: string;
  status: string;
}

const calcDays = (from: string, to: string) => {
  try {
    return differenceInCalendarDays(new Date(to), new Date(from)) + 1;
  } catch {
    return 0;
  }
};

const fmt = (d: string) => {
  try {
    return format(new Date(d), "MMM d, yyyy");
  } catch {
    return d;
  }
};

const EmployeeView = () => {
  const [leaveType, setLeaveType] = useState("SICK");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Leave[]>("/api/leaves/my");
      setLeaves(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/leaves/apply", { leaveType, fromDate, toDate, reason });
      toast({ title: "Leave applied", description: "Your request has been submitted." });
      setFromDate("");
      setToDate("");
      setReason("");
      load();
    } catch (err) {
      toast({ title: "Failed to apply", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Apply for Leave</h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Leave Type</Label>
            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="SICK">Sick</SelectItem>
                <SelectItem value="CASUAL">Casual</SelectItem>
                <SelectItem value="EARNED">Earned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div />
          <div className="space-y-2">
            <Label htmlFor="from">From Date</Label>
            <Input id="from" type="date" required value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to">To Date</Label>
            <Input id="to" type="date" required value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea id="reason" required rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? <Spinner className="text-primary-foreground" /> : "Submit Request"}
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">My Leave History</h2>
        {loading ? (
          <FullSpinner />
        ) : error ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
        ) : leaves.length === 0 ? (
          <p className="text-sm text-muted-foreground">No leave requests yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leave Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.leaveType}</TableCell>
                  <TableCell>{fmt(l.fromDate)}</TableCell>
                  <TableCell>{fmt(l.toDate)}</TableCell>
                  <TableCell>{l.days ?? calcDays(l.fromDate, l.toDate)}</TableCell>
                  <TableCell className="max-w-xs truncate">{l.reason}</TableCell>
                  <TableCell><StatusBadge status={l.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
};

const OwnerView = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | number | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Leave[]>("/api/leaves/all");
      setLeaves(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const act = async (id: string | number, action: "approve" | "reject") => {
    setActingId(id);
    try {
      await api.put(`/api/leaves/${id}/${action}`);
      toast({ title: `Leave ${action}d` });
      load();
    } catch (err) {
      toast({ title: "Action failed", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setActingId(null);
    }
  };

  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold">All Leave Requests</h2>
      {loading ? (
        <FullSpinner />
      ) : error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
      ) : leaves.length === 0 ? (
        <p className="text-sm text-muted-foreground">No leave requests.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.employeeName || "—"}</TableCell>
                  <TableCell>{l.leaveType}</TableCell>
                  <TableCell>{fmt(l.fromDate)}</TableCell>
                  <TableCell>{fmt(l.toDate)}</TableCell>
                  <TableCell>{l.days ?? calcDays(l.fromDate, l.toDate)}</TableCell>
                  <TableCell className="max-w-xs truncate">{l.reason}</TableCell>
                  <TableCell><StatusBadge status={l.status} /></TableCell>
                  <TableCell className="text-right">
                    {l.status?.toUpperCase() === "PENDING" ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => act(l.id, "approve")} disabled={actingId === l.id}>
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => act(l.id, "reject")} disabled={actingId === l.id}>
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
};

const LeavePortal = () => {
  const { role } = useAuth();
  return (
    <>
      <PageHeader
        title="Leave Portal"
        description={role === "OWNER" ? "Review and act on employee leave requests." : "Apply for leave and track your requests."}
      />
      {role === "OWNER" ? <OwnerView /> : <EmployeeView />}
    </>
  );
};

export default LeavePortal;
