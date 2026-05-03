import { useEffect, useState, FormEvent } from "react";
import { format } from "date-fns";
import api, { getErrorMessage } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/PageHeader";
import { Spinner, FullSpinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface Report {
  id: string | number;
  employeeName?: string;
  reportTitle: string;
  date: string;
  workDone: string;
  challenges: string;
  planForTomorrow: string;
}

const fmt = (d: string) => {
  try { return format(new Date(d), "MMM d, yyyy"); } catch { return d; }
};

const EmployeeView = () => {
  const [reportTitle, setReportTitle] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [workDone, setWorkDone] = useState("");
  const [challenges, setChallenges] = useState("");
  const [planForTomorrow, setPlanForTomorrow] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Report[]>("/api/reports/my");
      setReports(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/reports/submit", { reportTitle, date, workDone, challenges, planForTomorrow });
      toast({ title: "Report submitted" });
      setReportTitle("");
      setWorkDone("");
      setChallenges("");
      setPlanForTomorrow("");
      load();
    } catch (err) {
      toast({ title: "Failed", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Submit Daily Report</h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Report Title</Label>
            <Input id="title" required value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="work">Work Done</Label>
            <Textarea id="work" rows={3} required value={workDone} onChange={(e) => setWorkDone(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="ch">Challenges</Label>
            <Textarea id="ch" rows={3} value={challenges} onChange={(e) => setChallenges(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="plan">Plan for Tomorrow</Label>
            <Textarea id="plan" rows={3} value={planForTomorrow} onChange={(e) => setPlanForTomorrow(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? <Spinner className="text-primary-foreground" /> : "Submit Report"}
            </Button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-base font-semibold">My Reports</h2>
        {loading ? (
          <FullSpinner />
        ) : error ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
        ) : reports.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reports yet.</p>
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <div key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-semibold">{r.reportTitle}</h3>
                  <span className="text-xs text-muted-foreground">{fmt(r.date)}</span>
                </div>
                <div className="grid gap-3 text-sm md:grid-cols-3">
                  <div>
                    <div className="mb-1 text-xs font-medium uppercase text-muted-foreground">Work Done</div>
                    <p className="text-foreground/90">{r.workDone}</p>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-medium uppercase text-muted-foreground">Challenges</div>
                    <p className="text-foreground/90">{r.challenges || "—"}</p>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-medium uppercase text-muted-foreground">Plan for Tomorrow</div>
                    <p className="text-foreground/90">{r.planForTomorrow || "—"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const OwnerView = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<Report | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Report[]>("/api/reports/all");
        setReports(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {loading ? (
          <FullSpinner />
        ) : error ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
        ) : reports.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reports submitted.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Report Title</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow
                  key={r.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setActive(r)}
                >
                  <TableCell className="font-medium">{r.employeeName || "—"}</TableCell>
                  <TableCell>{fmt(r.date)}</TableCell>
                  <TableCell>{r.reportTitle}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{active?.reportTitle}</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {active?.employeeName} · {active && fmt(active.date)}
            </p>
          </DialogHeader>
          {active && (
            <div className="space-y-4 text-sm">
              <div>
                <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Work Done</div>
                <p className="whitespace-pre-wrap">{active.workDone}</p>
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Challenges</div>
                <p className="whitespace-pre-wrap">{active.challenges || "—"}</p>
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Plan for Tomorrow</div>
                <p className="whitespace-pre-wrap">{active.planForTomorrow || "—"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const WorkReport = () => {
  const { role } = useAuth();
  return (
    <>
      <PageHeader
        title="Work Report"
        description={role === "OWNER" ? "Browse all employee reports." : "Submit and review your daily reports."}
      />
      {role === "OWNER" ? <OwnerView /> : <EmployeeView />}
    </>
  );
};

export default WorkReport;
