import {
  FileText,
  Clock,
  CalendarOff,
  CheckCircle2,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// TYPES
type Stat = {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
};

// MOCK DATA
function useDashboard() {
  return {
    data: {
      userName: "Zeeshan",
      stats: {
        reportsThisWeek: 5,
        reportsThisWeekTrend: "+2",
        hoursLogged: 32,
        hoursLoggedTrend: "+4h",
        leaveBalance: 12,
        tasksCompleted: 18,
        tasksCompletedTrend: "+6",
      },
      reports: [
        { date: "2026-05-01", title: "API Integration", hours: 6, status: "Submitted" },
        { date: "2026-05-02", title: "UI Fixes", hours: 5, status: "Pending" },
      ],
      projects: [
        { name: "Work Weaver", progress: 70 },
        { name: "Dashboard Revamp", progress: 45 },
      ],
    },
  };
}

export default function Dashboard() {
  const { data } = useDashboard();

  const stats: Stat[] = [
    {
      label: "Reports",
      value: String(data.stats.reportsThisWeek),
      trend: data.stats.reportsThisWeekTrend,
      icon: FileText,
    },
    {
      label: "Hours",
      value: String(data.stats.hoursLogged),
      trend: data.stats.hoursLoggedTrend,
      icon: Clock,
    },
    {
      label: "Leave Balance",
      value: String(data.stats.leaveBalance),
      trend: "days",
      icon: CalendarOff,
    },
    {
      label: "Tasks Completed",
      value: String(data.stats.tasksCompleted),
      trend: data.stats.tasksCompletedTrend,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {data.userName} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's a quick overview of your activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;

          return (
            <Card
              key={s.label}
              className="hover:shadow-md transition-all duration-200"
            >
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>

                  <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                    <ArrowUpRight className="w-3 h-3" />
                    {s.trend}
                  </div>
                </div>

                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.reports.map((r) => (
            <div
              key={r.date}
              className="flex justify-between items-center p-2 rounded-lg hover:bg-muted transition"
            >
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">
                  {r.date} · {r.hours}h
                </p>
              </div>
              <Badge variant={r.status === "Submitted" ? "default" : "secondary"}>
                {r.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.projects.map((p) => (
            <div key={p.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{p.name}</span>
                <span className="text-muted-foreground">{p.progress}%</span>
              </div>
              <Progress value={p.progress} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}