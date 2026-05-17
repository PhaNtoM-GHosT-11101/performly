"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Users, CalendarRange, FileCheck,
  Shield, CreditCard, LogOut, Menu, X, Bell, ChevronRight,
  TrendingUp, TrendingDown, AlertCircle,
} from "lucide-react";
import { MeResponse, getMe, logout } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard, SkeletonRow } from "@/components/ui/skeleton";

/* ── Types ── */
type NavItem = { icon: LucideIcon; label: string; active: boolean };

/* ── Static data (demo) ── */
const roleLabels: Record<MeResponse["role"], string> = {
  admin: "Admin / HR", manager: "Manager", employee: "Employee",
};

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Overview",  active: true  },
  { icon: Users,           label: "People",    active: false },
  { icon: CalendarRange,   label: "Cycles",    active: false },
  { icon: FileCheck,       label: "Approvals", active: false },
  { icon: Shield,          label: "Audit",     active: false },
  { icon: CreditCard,      label: "Billing",   active: false },
];

const metricCards = [
  { label: "Submitted goals",  value: "186", change: "+18% from last cycle", trend: "up",      urgent: false },
  { label: "Pending review",   value: "34",  change: "11 due this week",      trend: "warn",    urgent: true  },
  { label: "Locked sheets",    value: "119", change: "64% approval rate",     trend: "up",      urgent: false },
  { label: "Blocked attempts", value: "27",  change: "Validation engine active", trend: "neutral", urgent: false },
];

const reviewQueue = [
  { name: "Priya Nair",    team: "Product Ops",        goals: 6, status: "Ready for review" as const },
  { name: "Aarav Mehta",   team: "Enterprise Sales",   goals: 5, status: "Needs attention"  as const },
  { name: "Kabir Shah",    team: "Customer Success",   goals: 7, status: "Changes requested" as const },
  { name: "Meera Iyer",    team: "Finance",            goals: 4, status: "Ready for review" as const },
];

const activityLog = [
  { action: "Manager approved Rohan's goals",   time: "2 min ago",   type: "approval" as const },
  { action: "Goal sheet locked after approval", time: "18 min ago",  type: "lock"     as const },
  { action: "Q2 window closes this Friday",     time: "1 hour ago",  type: "reminder" as const },
  { action: "Admin unlock reason recorded",     time: "Yesterday",   type: "audit"    as const },
];

const progressData = [
  { label: "Business goals",    pct: 78, color: "bg-violet-500" },
  { label: "People goals",      pct: 66, color: "bg-indigo-500"  },
  { label: "Process goals",     pct: 54, color: "bg-sky-500"     },
  { label: "Innovation goals",  pct: 41, color: "bg-emerald-500" },
];

const activityDot: Record<typeof activityLog[0]["type"], string> = {
  approval: "bg-emerald-400",
  lock:     "bg-violet-400",
  reminder: "bg-amber-400",
  audit:    "bg-sky-400",
};

/* ── Sidebar ── */
function Sidebar({ user, onLogout, isPending }: {
  user: MeResponse;
  onLogout: () => void;
  isPending: boolean;
}) {
  return (
    <aside className="flex h-full w-64 flex-col bg-[#0d0d10] border-r border-white/5">
      {/* Logo */}
      <div className="border-b border-white/5 px-5 py-4">
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold shadow-lg shadow-violet-500/25">
            P
          </div>
          <span className="text-sm font-semibold text-white">Performly</span>
        </a>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4" aria-label="Main navigation">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            aria-current={active ? "page" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              active
                ? "bg-violet-500/15 text-violet-300"
                : "text-white/35 hover:bg-white/5 hover:text-white/70"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            {active && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />}
          </button>
        ))}
      </nav>

      {/* Trial indicator */}
      <div className="border-t border-white/5 px-5 py-4 space-y-3">
        <div>
          <div className="flex justify-between text-[10px] text-white/30 mb-1">
            <span>Starter Trial</span>
            <span>30d left</span>
          </div>
          <div className="h-1 rounded-full bg-white/5">
            <div className="h-1 w-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
          </div>
        </div>

        {/* User chip */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white flex-shrink-0">
            {user.full_name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-white/70">{user.full_name}</p>
            <p className="text-[10px] text-white/30">{roleLabels[user.role]}</p>
          </div>
          <button
            onClick={onLogout}
            disabled={isPending}
            aria-label="Sign out"
            className="rounded-md p-1 text-white/25 hover:bg-white/5 hover:text-white/60 transition-colors"
          >
            {isPending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/60" /> : <LogOut className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ── Main dashboard ── */
export function DashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let mounted = true;
    getMe()
      .then((me) => { if (mounted) { setUser(me); setLoading(false); } })
      .catch(() => {
        if (mounted) router.replace("/login"); // Immediate redirect — no error flash
      });
    return () => { mounted = false; };
  }, [router]);

  function handleLogout() {
    startTransition(() => {
      void (async () => {
        await logout().catch(() => {});
        router.replace("/login");
      })();
    });
  }

  /* Loading skeleton */
  if (loading) {
    return (
      <main className="flex min-h-screen bg-zinc-50">
        <div className="hidden w-64 shrink-0 bg-[#0d0d10] lg:block" />
        <div className="flex-1 p-6 space-y-6">
          <div className="h-14 rounded-xl bg-white border border-zinc-200 animate-pulse" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="card lg:col-span-2 space-y-3">
              {[1,2,3,4].map(i => <SkeletonRow key={i} />)}
            </div>
            <div className="card space-y-3">
              {[1,2,3].map(i => <SkeletonRow key={i} />)}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="flex min-h-screen bg-zinc-50">
      {/* ── Desktop sidebar ── */}
      <div className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col">
        <div className="fixed top-0 bottom-0 w-64">
          <Sidebar user={user} onLogout={handleLogout} isPending={isPending} />
        </div>
      </div>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-10">
            <Sidebar user={user} onLogout={handleLogout} isPending={isPending} />
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3">
              {/* Hamburger (mobile) */}
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation"
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  {roleLabels[user.role]} Console
                </p>
                <h1 className="text-base font-bold text-zinc-900">Overview</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label="Notifications"
                className="relative rounded-lg p-2 text-zinc-500 hover:bg-zinc-100"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
              </button>
              <span className="hidden text-xs text-zinc-400 sm:block">{user.email}</span>
              <button
                onClick={handleLogout}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                {isPending ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
        </header>

        {/* Page body */}
        <div className="flex-1 p-5 space-y-6">

          {/* ── Metric cards ── */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metricCards.map((card) => (
              <div key={card.label} className="card group hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    {card.label}
                  </p>
                  {card.urgent && <Badge variant="warning" dot>Urgent</Badge>}
                </div>
                <p className="mt-2 text-2xl font-bold text-zinc-900">{card.value}</p>
                <div className="mt-1 flex items-center gap-1">
                  {card.trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                  {card.trend === "warn" && <AlertCircle className="h-3 w-3 text-amber-500" />}
                  {card.trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
                  <p className="text-xs text-zinc-400">{card.change}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Progress + Activity ── */}
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Progress */}
            <div className="card lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900">Quarterly Progress</h2>
                  <p className="mt-0.5 text-xs text-zinc-400">FY 2026 · Q2 window open</p>
                </div>
                <Badge variant="success" dot>72% overall</Badge>
              </div>
              <div className="mt-6 space-y-4">
                {progressData.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs text-zinc-600 mb-1.5">
                      <span>{item.label}</span>
                      <span className="font-semibold">{item.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${item.color} transition-all duration-1000`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div className="card">
              <h2 className="text-sm font-semibold text-zinc-900">Activity</h2>
              <div className="mt-4 space-y-3.5">
                {activityLog.map((item) => (
                  <div key={item.action} className="flex gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <div className={`h-2 w-2 rounded-full ${activityDot[item.type]}`} />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-700 leading-4">{item.action}</p>
                      <p className="mt-0.5 text-[10px] text-zinc-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Review queue ── */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-zinc-900">Manager Review Queue</h2>
              <button className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors">
                View all →
              </button>
            </div>
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-sm" aria-label="Review queue">
                <thead>
                  <tr className="border-b border-zinc-100 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    <th className="pb-2.5 pr-4">Employee</th>
                    <th className="pb-2.5 pr-4">Team</th>
                    <th className="pb-2.5 pr-4 text-center">Goals</th>
                    <th className="pb-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewQueue.map((row) => (
                    <tr key={row.name} className="group border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 text-xs font-bold text-violet-600 flex-shrink-0">
                            {row.name[0]}
                          </div>
                          <span className="font-medium text-zinc-900">{row.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-xs text-zinc-500">{row.team}</td>
                      <td className="py-3 pr-4 text-center">
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
                          {row.goals}
                        </span>
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            row.status === "Ready for review" ? "success" :
                            row.status === "Needs attention"  ? "warning" : "neutral"
                          }
                          dot
                        >
                          {row.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Session context ── */}
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Active session context
            </p>
            <div className="grid gap-4 text-xs text-zinc-600 sm:grid-cols-3">
              <div>
                <span className="font-semibold text-zinc-500">User</span>
                <p className="mt-0.5 text-zinc-900">{user.full_name} · {roleLabels[user.role]}</p>
                <p className="text-zinc-400">{user.email}</p>
              </div>
              <div>
                <span className="font-semibold text-zinc-500">Company ID</span>
                <p className="mt-0.5 font-mono text-[10px] text-zinc-600 break-all">{user.company_id}</p>
              </div>
              <div>
                <span className="font-semibold text-zinc-500">Membership ID</span>
                <p className="mt-0.5 font-mono text-[10px] text-zinc-600 break-all">{user.membership_id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
