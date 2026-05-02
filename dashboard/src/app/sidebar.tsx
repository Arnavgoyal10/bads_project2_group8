"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Shield,
  BarChart3,
  Users,
  Megaphone,
  Target,
  TrendingUp,
  Lightbulb,
  FileText,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, href: "/" },
  { label: "Data Audit", icon: Shield, href: "/audit" },
  { label: "Descriptive Stats", icon: BarChart3, href: "/descriptive" },
  { label: "Segmentation", icon: Users, href: "/segmentation" },
  { label: "Campaigns", icon: Megaphone, href: "/campaigns" },
  { label: "Lead Conversion", icon: Target, href: "/leads" },
  { label: "Retention & CLV", icon: TrendingUp, href: "/retention" },
  { label: "Budget & Insights", icon: Lightbulb, href: "/insights" },
  { label: "CMO Memo", icon: FileText, href: "/memo" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const nav = (
    <nav className="flex-1 overflow-y-auto px-2 py-4">
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-blue-400" : "text-slate-500")} />
                {(!collapsed || mobileOpen) && <span className="truncate">{item.label}</span>}
                {isActive && (!collapsed || mobileOpen) && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  const header = (
    <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500">
        <ShoppingCart className="h-4 w-4 text-white" />
      </div>
      {(!collapsed || mobileOpen) && (
        <div className="overflow-hidden">
          <span className="block truncate text-sm font-bold text-white">NovaMart Analytics</span>
          <p className="truncate text-[10px] text-slate-400">Marketing Intelligence</p>
        </div>
      )}
    </div>
  );

  const footer = (
    <div className="border-t border-slate-800 p-3 space-y-2">
      {(!collapsed || mobileOpen) && <ThemeToggle />}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="hidden lg:flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        className="fixed left-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 lg:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5 text-slate-300" /> : <Menu className="h-5 w-5 text-slate-300" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/80 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 lg:flex",
          collapsed ? "w-[60px]" : "w-60"
        )}
      >
        {header}
        {nav}
        {footer}
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen w-72 flex-col bg-slate-900 border-r border-slate-800 transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {header}
        {nav}
        {footer}
      </aside>
    </>
  );
}
