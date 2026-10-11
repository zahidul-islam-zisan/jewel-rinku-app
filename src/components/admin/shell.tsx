"use client";

import { usePrototype } from "@/hooks/use-prototype";
import { cn } from "@/lib/utils";
import {
  Activity,
  Bell,
  Briefcase,
  Building2,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Newspaper,
  PanelLeft,
  Search,
  Settings,
  Users,
  Calendar,
  BarChart3,
  Inbox,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/employers", label: "Employers", icon: Building2 },
  { href: "/admin/employer-inquiries", label: "Employer inquiries", icon: Inbox },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/admin/applications", label: "Applications", icon: ClipboardList },
  { href: "/admin/candidates", label: "Applicants", icon: Users },
  { href: "/admin/interviews", label: "Interviews", icon: Calendar },
  { href: "/admin/documents", label: "Documents", icon: FileText },
  { href: "/admin/training", label: "Training", icon: GraduationCap },
  { href: "/admin/content", label: "Website content", icon: Newspaper },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/activity-logs", label: "Activity logs", icon: Activity },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { state, store, ready } = usePrototype();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!ready || isLogin) return;
    if (state.session.role !== "admin") router.replace("/admin/login");
  }, [state.session.role, isLogin, router, ready]);

  if (isLogin) return <>{children}</>;
  if (!ready || state.session.role !== "admin") {
    return <div className="p-8 text-sm text-muted">Loading staff workspace…</div>;
  }

  const unread = state.notifications.filter((n) => n.adminVisible && !n.read).length;
  const crumbs = pathname.split("/").filter(Boolean);

  return (
    <div className="flex min-h-full bg-canvas">
      <aside
        className={cn(
          "hidden shrink-0 flex-col bg-navy text-white md:flex",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <div className="flex items-center justify-between px-3 py-4">
          {!collapsed ? <span className="text-sm font-semibold">Staff workspace</span> : null}
          <button type="button" onClick={() => setCollapsed((c) => !c)} aria-label="Collapse sidebar">
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "mb-0.5 flex items-center gap-2 rounded-md px-2 py-2 text-sm text-white/80 hover:bg-white/10",
                pathname.startsWith(item.href) && "bg-white/10 text-white",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed ? item.label : null}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-white px-4 py-3">
          <button type="button" className="md:hidden" onClick={() => setMobile((m) => !m)} aria-label="Open menu">
            <Menu />
          </button>
          <nav aria-label="Breadcrumb" className="hidden text-xs text-muted sm:block">
            {crumbs.map((c, i) => (
              <span key={c}>
                {i ? " / " : ""}
                {c}
              </span>
            ))}
          </nav>
          <label className="relative ml-auto hidden sm:block">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search jobs"
              className="h-9 rounded-md border border-border pl-8 pr-3 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") router.push(`/admin/jobs?q=${encodeURIComponent(q)}`);
              }}
            />
          </label>
          <span className="relative text-muted">
            <Bell className="h-5 w-5" />
            {unread ? (
              <span className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-gold text-center text-[10px] text-navy">
                {unread}
              </span>
            ) : null}
          </span>
          <button
            type="button"
            className="text-sm text-navy"
            onClick={() => {
              store.logout();
              router.push("/");
            }}
          >
            {state.session.name}
          </button>
        </header>
        {mobile ? (
          <nav className="grid grid-cols-2 gap-2 border-b border-border bg-white p-3 md:hidden">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="text-sm text-navy" onClick={() => setMobile(false)}>
                {n.label}
              </Link>
            ))}
          </nav>
        ) : null}
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
