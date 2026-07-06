"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Tent,
  MessageSquare,
  Flag,
  CheckSquare,
  Shield,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { key: "overview", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { key: "members", label: "Members", icon: Users, href: "/admin?tab=members" },
  { key: "events", label: "Events", icon: CalendarDays, href: "/admin?tab=events" },
  { key: "campsites", label: "Campsites", icon: Tent, href: "/admin?tab=campsites" },
  { key: "posts", label: "Posts", icon: MessageSquare, href: "/admin?tab=posts" },
  { key: "reports", label: "Reports", icon: Flag, href: "/admin?tab=reports" },
  { key: "approvals", label: "Approvals", icon: CheckSquare, href: "/admin?tab=approvals" },
  { key: "roles", label: "Roles", icon: Shield, href: "/admin?tab=roles" },
  { key: "logs", label: "Activity Logs", icon: ScrollText, href: "/admin?tab=logs" },
  { key: "settings", label: "DB Settings", icon: Settings, href: "/admin?tab=settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col fixed top-0 left-0 h-screen z-40 bg-card border-r border-border/50 transition-all duration-300 shadow-sm",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Flame className="h-4 w-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="text-sm font-extrabold gradient-text-forest whitespace-nowrap">ICC Admin</span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-muted/50 text-muted-foreground transition-colors flex-shrink-0"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = item.key === "overview"
              ? pathname === "/admin" && !new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("tab")
              : typeof window !== "undefined" && new URLSearchParams(window.location.search).get("tab") === item.key;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-primary" : "")} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border/30">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors",
            )}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass-nav h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
              <Flame className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold gradient-text-forest">ICC Admin</span>
          </div>
        </div>
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground font-medium">
          ← Site
        </Link>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />
          <aside className="md:hidden fixed top-14 left-0 bottom-0 w-[260px] bg-card border-r border-border z-50 overflow-y-auto animate-slide-up shadow-xl">
            <nav className="py-3 px-2 space-y-0.5">
              {sidebarItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          collapsed ? "md:ml-[68px]" : "md:ml-[240px]",
          "pt-14 md:pt-0"
        )}
      >
        {children}
      </main>
    </div>
  );
}
