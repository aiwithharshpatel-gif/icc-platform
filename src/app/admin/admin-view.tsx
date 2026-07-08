"use client";

import * as React from "react";
import {
  LayoutDashboard, Users, CalendarDays, Tent, MessageSquare, Flag, CheckSquare,
  Shield, ScrollText, Search, ChevronUp, ChevronDown, Eye, Trash2, Ban,
  CheckCircle, XCircle, MoreHorizontal, TrendingUp, TrendingDown, ArrowRight,
  Flame, BarChart3, UserCheck, UserX, Star, AlertTriangle, Clock, Filter,
  Settings, Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { seedDatabaseAction } from "./actions";

/* ======================================================
   TYPES
   ====================================================== */
interface Stats {
  totalMembers: number; activeEvents: number; totalCampsites: number; feedPosts: number;
  pendingReports: number; pendingApprovals: number;
  memberGrowth: number[]; eventRegistrations: number[]; dailyPosts: number[];
  contentBreakdown: { text: number; photo: number; question: number; poll: number };
}
interface Member { id: string; name: string; email: string; state: string; experience: string; trips: number; role: string; status: string; joinDate: string; avatar: string | null; }
interface EventItem { id: string; title: string; organizer: string; date: string; location: string; capacity: number; registrations: number; status: string; }
interface Campsite { id: string; name: string; location: string; state: string; price: number; rating: number; reviews: number; status: string; }
interface PostItem { id: string; author: string; type: string; preview: string; likes: number; comments: number; reports: number; status: string; }
interface Report { id: string; reporter: string; contentType: string; reason: string; targetPreview: string; status: string; date: string; }
interface Approval { id: string; type: string; title: string; preview: string; submittedBy: string; status: string; date: string; }
interface LogEntry { id: string; admin: string; action: string; actionType: string; target: string; date: string; }

interface AdminViewProps {
  stats: Stats; members: Member[]; events: EventItem[]; campsites: Campsite[];
  posts: PostItem[]; reports: Report[]; approvals: Approval[]; activityLogs: LogEntry[];
}

/* ======================================================
   HELPERS
   ====================================================== */
function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getInitials(n: string) { return n.split(" ").map(x => x[0]).join("").toUpperCase().slice(0, 2); }

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const s = size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs";
  return (
    <div className={`${s} rounded-full bg-gradient-to-br from-primary/80 to-emerald-600 flex items-center justify-center text-white font-bold ring-1 ring-border`}>
      {getInitials(name)}
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
  published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
  featured: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400",
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
  pending: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400",
  completed: "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400",
  suspended: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400",
  flagged: "bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-400",
  open: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400",
  reviewing: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400",
  resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
  dismissed: "bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400",
  approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400",
};

const LOG_COLORS: Record<string, string> = {
  create: "text-emerald-500", update: "text-blue-500", delete: "text-red-500",
  approve: "text-emerald-500", reject: "text-red-500", suspend: "text-orange-500", restore: "text-violet-500",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${STATUS_COLORS[status] || STATUS_COLORS.active}`}>
      {status}
    </span>
  );
}

/* ======================================================
   MINI CHART COMPONENTS (CSS-based)
   ====================================================== */

function Sparkline({ data, color = "var(--primary)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 28;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-20 h-7" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

function BarChart({ data, labels, color = "var(--primary)" }: { data: number[]; labels: string[]; color?: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-40 px-2">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[9px] font-bold text-muted-foreground">{v}</span>
          <div
            className="w-full rounded-t-md transition-all duration-700"
            style={{ height: `${(v / max) * 100}%`, backgroundColor: color, minHeight: 4, opacity: 0.8 }}
          />
          <span className="text-[9px] text-muted-foreground">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data, color = "var(--primary)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 300; const h = 120;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 10) - 5}`).join(" ");
  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon fill="url(#lineGrad)" points={areaPoints} />
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  
  const segments = React.useMemo(() => {
    const acc: { label: string; value: number; color: string; pct: number; offset: number }[] = [];
    let tempPercent = 0;
    for (const d of data) {
      const pct = (d.value / total) * 100;
      const offset = tempPercent;
      tempPercent += pct;
      acc.push({ ...d, pct, offset });
    }
    return acc;
  }, [data, total]);

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-28 w-28 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="h-28 w-28 -rotate-90">
          {segments.map((d, i) => {
            return (
              <circle key={i} cx="18" cy="18" r="15.91549431" fill="none" stroke={d.color} strokeWidth="3"
                strokeDasharray={`${d.pct} ${100 - d.pct}`} strokeDashoffset={`${-d.offset}`} className="transition-all duration-700" />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-foreground">{total}</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-muted-foreground">{d.label}</span>
            <span className="text-xs font-bold text-foreground">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================================================
   STAT CARD
   ====================================================== */

function StatCard({ title, value, change, icon: Icon, trend, sparkData, color }: {
  title: string; value: string | number; change: string; icon: typeof Users;
  trend: "up" | "down"; sparkData: number[]; color: string;
}) {
  return (
    <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
            <p className="text-2xl font-extrabold text-foreground mt-1">{typeof value === "number" ? value.toLocaleString() : value}</p>
            <div className="flex items-center gap-1 mt-1.5">
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={`text-[10px] font-bold ${trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
                {change}
              </span>
              <span className="text-[10px] text-muted-foreground">vs last month</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
              <Icon className="h-4.5 w-4.5" style={{ color }} />
            </div>
            <Sparkline data={sparkData} color={color} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ======================================================
   DATA TABLE
   ====================================================== */

function DataTable<T>({
  data, columns, searchKey, searchPlaceholder, renderRow,
}: {
  data: T[]; columns: { key: string; label: string; width?: string }[];
  searchKey: string; searchPlaceholder: string;
  renderRow: (item: T, index: number) => React.ReactNode;
}) {
  const [search, setSearch] = React.useState("");
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

  const filtered = data.filter((item) => {
    const val = String((item as Record<string, unknown>)[searchKey] || "").toLowerCase();
    return val.includes(search.toLowerCase());
  });

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortKey]; const bv = (b as Record<string, unknown>)[sortKey];
        const cmp = String(av || "").localeCompare(String(bv || ""), undefined, { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      })
    : filtered;

  function handleSort(key: string) {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 text-xs bg-muted/30 rounded-lg border border-border/40 outline-none focus:border-primary/50 text-foreground"
          />
        </div>
        <span className="text-[10px] text-muted-foreground">{sorted.length} result{sorted.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/40">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/30 border-b border-border/30">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none"
                  style={{ width: col.width }}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </span>
                </th>
              ))}
              <th className="px-3 py-2.5 text-right font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {sorted.map((item, i) => renderRow(item, i))}
            {sorted.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="px-3 py-8 text-center text-muted-foreground">No results found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ======================================================
   PANEL: DASHBOARD OVERVIEW
   ====================================================== */

function OverviewPanel({ stats, logs }: { stats: Stats; logs: LogEntry[] }) {
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const regLabels = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Members" value={stats.totalMembers} change="+18.2%" icon={Users} trend="up" sparkData={stats.memberGrowth} color="#10b981" />
        <StatCard title="Active Events" value={stats.activeEvents} change="+8.5%" icon={CalendarDays} trend="up" sparkData={stats.eventRegistrations} color="#3b82f6" />
        <StatCard title="Campsites" value={stats.totalCampsites} change="+4.1%" icon={Tent} trend="up" sparkData={[30, 32, 34, 35, 38, 40, 42]} color="#8b5cf6" />
        <StatCard title="Feed Posts" value={stats.feedPosts} change="+24.3%" icon={MessageSquare} trend="up" sparkData={stats.dailyPosts.slice(-7)} color="#f59e0b" />
        <StatCard title="Pending Reports" value={stats.pendingReports} change="-12%" icon={Flag} trend="down" sparkData={[12, 9, 11, 8, 10, 7, 7]} color="#ef4444" />
        <StatCard title="Pending Approvals" value={stats.pendingApprovals} change="+2" icon={CheckSquare} trend="up" sparkData={[3, 5, 2, 4, 6, 3, 5]} color="#06b6d4" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Member Growth (12 months)
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <LineChart data={stats.memberGrowth} color="#10b981" />
            <div className="flex justify-between px-1 mt-1">
              {monthLabels.map((m) => <span key={m} className="text-[8px] text-muted-foreground">{m}</span>)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" /> Event Registrations (6 months)
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <BarChart data={stats.eventRegistrations} labels={regLabels} color="#3b82f6" />
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-500" /> Daily Post Activity (30 days)
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <LineChart data={stats.dailyPosts} color="#f59e0b" />
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-violet-500" /> Content Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 flex justify-center">
            <DonutChart data={[
              { label: "Text Posts", value: stats.contentBreakdown.text, color: "#3b82f6" },
              { label: "Photo Posts", value: stats.contentBreakdown.photo, color: "#10b981" },
              { label: "Questions", value: stats.contentBreakdown.question, color: "#f59e0b" },
              { label: "Polls", value: stats.contentBreakdown.poll, color: "#8b5cf6" },
            ]} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" /> Recent Admin Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-2">
            {logs.slice(0, 6).map((log) => (
              <div key={log.id} className="flex items-center gap-3 py-2 border-b border-border/10 last:border-0">
                <Avatar name={log.admin} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground truncate">
                    <span className="font-semibold">{log.admin}</span>{" "}
                    <span className={LOG_COLORS[log.actionType] || "text-muted-foreground"}>{log.action}</span>
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground flex-shrink-0">{timeAgo(log.date)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ======================================================
   PANEL: MEMBERS
   ====================================================== */

function MembersPanel({ members: initial }: { members: Member[] }) {
  const [members, setMembers] = React.useState(initial);

  function toggleStatus(id: string) {
    setMembers(members.map((m) => m.id === id ? { ...m, status: m.status === "active" ? "suspended" : "active" } : m));
  }

  function changeRole(id: string, role: string) {
    setMembers(members.map((m) => m.id === id ? { ...m, role } : m));
  }

  return (
    <DataTable
      data={members}
      searchKey="name"
      searchPlaceholder="Search members..."
      columns={[
        { key: "name", label: "Member", width: "25%" },
        { key: "state", label: "State" },
        { key: "experience", label: "Level" },
        { key: "trips", label: "Trips" },
        { key: "role", label: "Role" },
        { key: "status", label: "Status" },
      ]}
      renderRow={(m) => (
        <tr key={m.id} className="hover:bg-muted/20 transition-colors">
          <td className="px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Avatar name={m.name} />
              <div>
                <p className="font-semibold text-foreground">{m.name}</p>
                <p className="text-[10px] text-muted-foreground">{m.email}</p>
              </div>
            </div>
          </td>
          <td className="px-3 py-2.5 text-muted-foreground">{m.state}</td>
          <td className="px-3 py-2.5"><Badge variant={m.experience === "Expert" ? "accent" : "secondary"} className="text-[10px]">{m.experience}</Badge></td>
          <td className="px-3 py-2.5 font-semibold">{m.trips}</td>
          <td className="px-3 py-2.5">
            <select
              value={m.role}
              onChange={(e) => changeRole(m.id, e.target.value)}
              className="text-[10px] font-semibold bg-muted/30 border border-border/40 rounded px-1.5 py-0.5 outline-none text-foreground"
            >
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="member">Member</option>
            </select>
          </td>
          <td className="px-3 py-2.5"><StatusBadge status={m.status} /></td>
          <td className="px-3 py-2.5 text-right">
            <button onClick={() => toggleStatus(m.id)} className={`text-[10px] font-semibold px-2 py-1 rounded transition-colors ${m.status === "active" ? "text-red-500 hover:bg-red-500/10" : "text-emerald-500 hover:bg-emerald-500/10"}`}>
              {m.status === "active" ? <><Ban className="h-3 w-3 inline mr-0.5" /> Suspend</> : <><UserCheck className="h-3 w-3 inline mr-0.5" /> Activate</>}
            </button>
          </td>
        </tr>
      )}
    />
  );
}

/* ======================================================
   PANEL: EVENTS
   ====================================================== */

function EventsPanel({ events: initial }: { events: EventItem[] }) {
  const [events, setEvents] = React.useState(initial);

  function setStatus(id: string, status: string) {
    setEvents(events.map((e) => e.id === id ? { ...e, status } : e));
  }

  return (
    <DataTable
      data={events}
      searchKey="title"
      searchPlaceholder="Search events..."
      columns={[
        { key: "title", label: "Event", width: "25%" },
        { key: "organizer", label: "Organizer" },
        { key: "date", label: "Date" },
        { key: "location", label: "Location" },
        { key: "registrations", label: "Spots" },
        { key: "status", label: "Status" },
      ]}
      renderRow={(e) => (
        <tr key={e.id} className="hover:bg-muted/20 transition-colors">
          <td className="px-3 py-2.5 font-semibold text-foreground">{e.title}</td>
          <td className="px-3 py-2.5 text-muted-foreground">{e.organizer}</td>
          <td className="px-3 py-2.5 text-muted-foreground">{new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
          <td className="px-3 py-2.5 text-muted-foreground">{e.location}</td>
          <td className="px-3 py-2.5 font-semibold">{e.registrations}/{e.capacity}</td>
          <td className="px-3 py-2.5"><StatusBadge status={e.status} /></td>
          <td className="px-3 py-2.5 text-right space-x-1">
            {e.status === "pending" && (
              <>
                <button onClick={() => setStatus(e.id, "published")} className="text-[10px] font-semibold text-emerald-500 hover:bg-emerald-500/10 px-1.5 py-0.5 rounded"><CheckCircle className="h-3 w-3 inline" /> Approve</button>
                <button onClick={() => setStatus(e.id, "rejected")} className="text-[10px] font-semibold text-red-500 hover:bg-red-500/10 px-1.5 py-0.5 rounded"><XCircle className="h-3 w-3 inline" /> Reject</button>
              </>
            )}
            {e.status === "published" && (
              <button onClick={() => setStatus(e.id, "cancelled")} className="text-[10px] font-semibold text-red-500 hover:bg-red-500/10 px-1.5 py-0.5 rounded"><Ban className="h-3 w-3 inline" /> Cancel</button>
            )}
          </td>
        </tr>
      )}
    />
  );
}

/* ======================================================
   PANEL: CAMPSITES
   ====================================================== */

function CampsitesPanel({ campsites: initial }: { campsites: Campsite[] }) {
  const [sites, setSites] = React.useState(initial);

  function setStatus(id: string, status: string) {
    setSites(sites.map((c) => c.id === id ? { ...c, status } : c));
  }

  return (
    <DataTable
      data={sites}
      searchKey="name"
      searchPlaceholder="Search campsites..."
      columns={[
        { key: "name", label: "Campsite", width: "22%" },
        { key: "location", label: "Location" },
        { key: "state", label: "State" },
        { key: "price", label: "Price" },
        { key: "rating", label: "Rating" },
        { key: "reviews", label: "Reviews" },
        { key: "status", label: "Status" },
      ]}
      renderRow={(c) => (
        <tr key={c.id} className="hover:bg-muted/20 transition-colors">
          <td className="px-3 py-2.5 font-semibold text-foreground">{c.name}</td>
          <td className="px-3 py-2.5 text-muted-foreground">{c.location}</td>
          <td className="px-3 py-2.5 text-muted-foreground">{c.state}</td>
          <td className="px-3 py-2.5 font-semibold">₹{c.price}</td>
          <td className="px-3 py-2.5"><span className="flex items-center gap-0.5"><Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {c.rating}</span></td>
          <td className="px-3 py-2.5 text-muted-foreground">{c.reviews}</td>
          <td className="px-3 py-2.5"><StatusBadge status={c.status} /></td>
          <td className="px-3 py-2.5 text-right space-x-1">
            {c.status === "pending" && (
              <button onClick={() => setStatus(c.id, "active")} className="text-[10px] font-semibold text-emerald-500 hover:bg-emerald-500/10 px-1.5 py-0.5 rounded"><CheckCircle className="h-3 w-3 inline" /> Approve</button>
            )}
            {c.status === "active" && (
              <button onClick={() => setStatus(c.id, "featured")} className="text-[10px] font-semibold text-amber-500 hover:bg-amber-500/10 px-1.5 py-0.5 rounded"><Star className="h-3 w-3 inline" /> Feature</button>
            )}
          </td>
        </tr>
      )}
    />
  );
}

/* ======================================================
   PANEL: POSTS
   ====================================================== */

function PostsPanel({ posts: initial }: { posts: PostItem[] }) {
  const [posts, setPosts] = React.useState(initial);

  function setStatus(id: string, status: string) {
    setPosts(posts.map((p) => p.id === id ? { ...p, status } : p));
  }

  const TYPE_BADGES: Record<string, string> = { text: "default", photo: "success", question: "accent", poll: "secondary" };

  return (
    <DataTable
      data={posts}
      searchKey="author"
      searchPlaceholder="Search by author..."
      columns={[
        { key: "author", label: "Author" },
        { key: "type", label: "Type" },
        { key: "preview", label: "Content", width: "30%" },
        { key: "likes", label: "Likes" },
        { key: "comments", label: "Comments" },
        { key: "reports", label: "Reports" },
        { key: "status", label: "Status" },
      ]}
      renderRow={(p) => (
        <tr key={p.id} className="hover:bg-muted/20 transition-colors">
          <td className="px-3 py-2.5">
            <div className="flex items-center gap-2"><Avatar name={p.author} /><span className="font-semibold">{p.author}</span></div>
          </td>
          <td className="px-3 py-2.5"><Badge variant={(TYPE_BADGES[p.type] || "default") as "default" | "secondary" | "accent" | "outline" | "success"} className="text-[10px] capitalize">{p.type}</Badge></td>
          <td className="px-3 py-2.5 text-muted-foreground max-w-[200px] truncate">{p.preview}</td>
          <td className="px-3 py-2.5 font-semibold">{p.likes}</td>
          <td className="px-3 py-2.5 font-semibold">{p.comments}</td>
          <td className="px-3 py-2.5">{p.reports > 0 ? <span className="text-red-500 font-bold">{p.reports} ⚠</span> : <span className="text-muted-foreground">0</span>}</td>
          <td className="px-3 py-2.5"><StatusBadge status={p.status} /></td>
          <td className="px-3 py-2.5 text-right space-x-1">
            {p.status === "flagged" && (
              <>
                <button onClick={() => setStatus(p.id, "active")} className="text-[10px] font-semibold text-emerald-500 hover:bg-emerald-500/10 px-1.5 py-0.5 rounded"><CheckCircle className="h-3 w-3 inline" /> Approve</button>
                <button onClick={() => setStatus(p.id, "removed")} className="text-[10px] font-semibold text-red-500 hover:bg-red-500/10 px-1.5 py-0.5 rounded"><Trash2 className="h-3 w-3 inline" /> Remove</button>
              </>
            )}
          </td>
        </tr>
      )}
    />
  );
}

/* ======================================================
   PANEL: REPORTS
   ====================================================== */

function ReportsPanel({ reports: initial }: { reports: Report[] }) {
  const [reports, setReports] = React.useState(initial);

  function setStatus(id: string, status: string) {
    setReports(reports.map((r) => r.id === id ? { ...r, status } : r));
  }

  return (
    <DataTable
      data={reports}
      searchKey="reporter"
      searchPlaceholder="Search reports..."
      columns={[
        { key: "reporter", label: "Reporter" },
        { key: "contentType", label: "Type" },
        { key: "reason", label: "Reason", width: "20%" },
        { key: "targetPreview", label: "Content", width: "25%" },
        { key: "status", label: "Status" },
        { key: "date", label: "Date" },
      ]}
      renderRow={(r) => (
        <tr key={r.id} className="hover:bg-muted/20 transition-colors">
          <td className="px-3 py-2.5 font-semibold">{r.reporter}</td>
          <td className="px-3 py-2.5"><Badge variant="outline" className="text-[10px] capitalize">{r.contentType}</Badge></td>
          <td className="px-3 py-2.5 text-muted-foreground">{r.reason}</td>
          <td className="px-3 py-2.5 text-muted-foreground max-w-[180px] truncate">{r.targetPreview}</td>
          <td className="px-3 py-2.5"><StatusBadge status={r.status} /></td>
          <td className="px-3 py-2.5 text-[10px] text-muted-foreground">{timeAgo(r.date)}</td>
          <td className="px-3 py-2.5 text-right space-x-1">
            {r.status !== "resolved" && r.status !== "dismissed" && (
              <>
                <button onClick={() => setStatus(r.id, "resolved")} className="text-[10px] font-semibold text-emerald-500 hover:bg-emerald-500/10 px-1.5 py-0.5 rounded"><CheckCircle className="h-3 w-3 inline" /> Resolve</button>
                <button onClick={() => setStatus(r.id, "dismissed")} className="text-[10px] font-semibold text-muted-foreground hover:bg-muted/30 px-1.5 py-0.5 rounded"><XCircle className="h-3 w-3 inline" /> Dismiss</button>
              </>
            )}
          </td>
        </tr>
      )}
    />
  );
}

/* ======================================================
   PANEL: APPROVALS
   ====================================================== */

function ApprovalsPanel({ approvals: initial }: { approvals: Approval[] }) {
  const [items, setItems] = React.useState(initial);

  function setStatus(id: string, status: string) {
    setItems(items.map((a) => a.id === id ? { ...a, status } : a));
  }

  const pendingCount = items.filter((a) => a.status === "pending").length;
  const TYPE_ICONS: Record<string, typeof CalendarDays> = { event: CalendarDays, campsite: Tent, post: MessageSquare };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Badge variant="accent" className="text-xs">{pendingCount} pending</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((a) => {
          const Icon = TYPE_ICONS[a.type] || CheckSquare;
          return (
            <Card key={a.id} className={`border-border/50 shadow-sm overflow-hidden ${a.status === "pending" ? "ring-1 ring-blue-500/20" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{a.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">{a.type} · by {a.submittedBy}</p>
                      <p className="text-xs text-muted-foreground mt-1">{a.preview}</p>
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                {a.status === "pending" && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border/30">
                    <Button variant="primary" size="sm" className="text-[10px] h-7 gap-1 flex-1" onClick={() => setStatus(a.id, "approved")}>
                      <CheckCircle className="h-3 w-3" /> Approve
                    </Button>
                    <Button variant="outline" size="sm" className="text-[10px] h-7 gap-1 flex-1 text-red-500 border-red-500/30 hover:bg-red-500/10" onClick={() => setStatus(a.id, "rejected")}>
                      <XCircle className="h-3 w-3" /> Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ======================================================
   PANEL: ROLES
   ====================================================== */

function RolesPanel() {
  const permissions = [
    { perm: "View Dashboard", admin: true, mod: true, member: false },
    { perm: "Manage Members", admin: true, mod: false, member: false },
    { perm: "Manage Events", admin: true, mod: true, member: false },
    { perm: "Manage Campsites", admin: true, mod: true, member: false },
    { perm: "Moderate Posts", admin: true, mod: true, member: false },
    { perm: "Handle Reports", admin: true, mod: true, member: false },
    { perm: "Approve Content", admin: true, mod: false, member: false },
    { perm: "Assign Roles", admin: true, mod: false, member: false },
    { perm: "View Activity Logs", admin: true, mod: true, member: false },
    { perm: "Create Events", admin: true, mod: true, member: true },
    { perm: "Create Posts", admin: true, mod: true, member: true },
    { perm: "Join Events", admin: true, mod: true, member: true },
    { perm: "Submit Reviews", admin: true, mod: true, member: true },
  ];

  const [perms, setPerms] = React.useState(permissions);

  function toggle(idx: number, role: "admin" | "mod" | "member") {
    const copy = [...perms];
    copy[idx] = { ...copy[idx], [role]: !copy[idx][role] };
    setPerms(copy);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {[
          { role: "Admin", desc: "Full platform access", color: "text-red-500", icon: Shield },
          { role: "Moderator", desc: "Content & event management", color: "text-amber-500", icon: UserCheck },
          { role: "Member", desc: "Standard user access", color: "text-emerald-500", icon: Users },
        ].map((r) => (
          <Card key={r.role} className="flex-1 border-border/50 shadow-sm">
            <CardContent className="p-3 flex items-center gap-2">
              <r.icon className={`h-5 w-5 ${r.color}`} />
              <div>
                <p className="text-xs font-bold text-foreground">{r.role}</p>
                <p className="text-[10px] text-muted-foreground">{r.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/40">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/30 border-b border-border/30">
              <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-wider">Permission</th>
              <th className="px-4 py-2.5 text-center font-semibold text-red-500 uppercase tracking-wider">Admin</th>
              <th className="px-4 py-2.5 text-center font-semibold text-amber-500 uppercase tracking-wider">Moderator</th>
              <th className="px-4 py-2.5 text-center font-semibold text-emerald-500 uppercase tracking-wider">Member</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {perms.map((p, i) => (
              <tr key={p.perm} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-2.5 font-medium text-foreground">{p.perm}</td>
                {(["admin", "mod", "member"] as const).map((role) => (
                  <td key={role} className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => toggle(i, role)}
                      className={`h-5 w-5 rounded border-2 inline-flex items-center justify-center transition-all ${
                        p[role] ? "bg-primary border-primary text-primary-foreground" : "border-border/50 hover:border-primary/50"
                      }`}
                    >
                      {p[role] && <CheckCircle className="h-3 w-3" />}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ======================================================
   PANEL: ACTIVITY LOGS
   ====================================================== */

function LogsPanel({ logs }: { logs: LogEntry[] }) {
  const [filterType, setFilterType] = React.useState("all");
  const types = ["all", "create", "update", "delete", "approve", "reject", "suspend", "restore"];

  const filtered = filterType === "all" ? logs : logs.filter((l) => l.actionType === filterType);

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 flex-wrap">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize transition-colors ${
              filterType === t ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((log) => (
          <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/30 hover:bg-muted/20 transition-colors">
            <Avatar name={log.admin} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground">
                <span className="font-semibold">{log.admin}</span>{" "}
                <span className={LOG_COLORS[log.actionType] || "text-muted-foreground"}>{log.action}</span>
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-[9px] capitalize">{log.actionType}</Badge>
                <span className="text-[10px] text-muted-foreground">· {log.target}</span>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground flex-shrink-0">{timeAgo(log.date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================================================
   PANEL: SYSTEM SETTINGS & DB MANAGEMENT
   ====================================================== */

function SettingsPanel() {
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<{ success?: boolean; error?: string } | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-project.supabase.co";
  const isMock = supabaseUrl.includes("mock-project.supabase.co");

  async function handleSeed() {
    setLoading(true);
    setStatus(null);
    try {
      const res = await seedDatabaseAction();
      if (res.error) {
        setStatus({ error: res.error });
      } else {
        setStatus({ success: true });
      }
    } catch (e) {
      setStatus({ error: e instanceof Error ? e.message : "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  // Masking Supabase URL for security
  const maskedUrl = isMock 
    ? "https://mock-project.supabase.co" 
    : supabaseUrl.replace(/(https:\/\/)(.*)(\.supabase\.co)/, "$1******$3");

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Database className="h-4.5 w-4.5 text-primary" /> Database Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 border-b border-border/10">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Database Connection Mode</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`h-2.5 w-2.5 rounded-full ${isMock ? "bg-amber-500 animate-pulse" : "bg-emerald-500 shadow-[0_0_8px_#10b981]"}`} />
                <span className="text-xs font-bold text-foreground">
                  {isMock ? "Mock Sandbox Mode" : "Live Production Database"}
                </span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Connection Endpoint</p>
              <p className="text-xs font-semibold text-foreground mt-1 truncate">{maskedUrl}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-foreground">Initial Database Seeding</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If you have just connected a live database or cleared your tables, you can seed it with the default ICC campsites and events.
            </p>
            
            <div className="pt-2">
              <Button
                onClick={handleSeed}
                disabled={loading}
                variant="primary"
                className="gap-2 text-xs font-semibold"
              >
                {loading ? "Seeding Tables..." : "Seed Default Campsites & Events"}
              </Button>
            </div>
          </div>

          {status?.error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-xs font-medium">
              ❌ {status.error}
            </div>
          )}

          {status?.success && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-400 rounded-lg text-xs font-medium">
              ✅ Database seeded successfully! The default campsites and events are now loaded.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ======================================================
   MAIN ADMIN VIEW
   ====================================================== */

const PANELS: Record<string, { title: string; icon: typeof LayoutDashboard }> = {
  overview: { title: "Dashboard Overview", icon: LayoutDashboard },
  members: { title: "Members Management", icon: Users },
  events: { title: "Events Management", icon: CalendarDays },
  campsites: { title: "Campsites Management", icon: Tent },
  posts: { title: "Posts Moderation", icon: MessageSquare },
  reports: { title: "Content Reports", icon: Flag },
  approvals: { title: "Pending Approvals", icon: CheckSquare },
  roles: { title: "Roles & Permissions", icon: Shield },
  logs: { title: "Activity Logs", icon: ScrollText },
  settings: { title: "System & Database Settings", icon: Settings },
};

export default function AdminView(props: AdminViewProps) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";
  const panel = PANELS[tab] || PANELS.overview;
  const PanelIcon = panel.icon;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <PanelIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-foreground">{panel.title}</h1>
          <p className="text-xs text-muted-foreground">Manage and monitor the ICC platform</p>
        </div>
      </div>

      {/* Panel Content */}
      {tab === "overview" && <OverviewPanel stats={props.stats} logs={props.activityLogs} />}
      {tab === "members" && <MembersPanel members={props.members} />}
      {tab === "events" && <EventsPanel events={props.events} />}
      {tab === "campsites" && <CampsitesPanel campsites={props.campsites} />}
      {tab === "posts" && <PostsPanel posts={props.posts} />}
      {tab === "reports" && <ReportsPanel reports={props.reports} />}
      {tab === "approvals" && <ApprovalsPanel approvals={props.approvals} />}
      {tab === "roles" && <RolesPanel />}
      {tab === "logs" && <LogsPanel logs={props.activityLogs} />}
      {tab === "settings" && <SettingsPanel />}
    </div>
  );
}
