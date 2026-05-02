// @ts-nocheck
"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  LayoutDashboard, TrendingUp, Users, Megaphone, Target, AlertTriangle,
  CheckCircle2, ArrowRight, DollarSign, ShoppingCart, BarChart3, Repeat,
} from "lucide-react";
import { KPI_SUMMARY, SEGMENTS, BUDGET_REALLOCATION } from "@/lib/data";
import { PLOTLY_DARK_LAYOUT, PLOTLY_CONFIG, CHART_COLORS } from "@/lib/plotly-theme";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900 p-5`}>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accent}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-500">{sub}</p>
    </div>
  );
}

function FindingCard({ title, stat, desc, tone }: { title: string; stat: string; desc: string; tone: "blue" | "emerald" | "amber" | "rose" }) {
  const colors = {
    blue: "border-blue-500/30 bg-blue-500/5 text-blue-300",
    emerald: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
    amber: "border-amber-500/30 bg-amber-500/5 text-amber-300",
    rose: "border-rose-500/30 bg-rose-500/5 text-rose-300",
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{title}</p>
      <p className="mt-1 text-2xl font-bold">{stat}</p>
      <p className="mt-1 text-xs opacity-80 leading-relaxed">{desc}</p>
    </div>
  );
}

const FINDINGS = [
  { title: "Budget Misallocation", stat: "42.7%", desc: "of total spend goes to Affiliate — the lowest ROAS channel at 0.11", tone: "rose" as const },
  { title: "Revenue Concentration", stat: "Gini 0.673", desc: "18 Champion customers generate more revenue than the bottom 1,000 combined", tone: "amber" as const },
  { title: "Conversion Opportunity", stat: "784 leads", desc: "Engaged Browsers browse & cart but never purchase — highest near-term opportunity", tone: "emerald" as const },
  { title: "Discount Backfire", stat: "−0.9pp", desc: "Discounts causally reduce conversion rate (IPTW causal estimate)", tone: "rose" as const },
  { title: "Retention Gap", stat: "24.3%", desc: "Only 1 in 4 customers repeats within 90 days — median time to 2nd purchase is effectively infinite", tone: "amber" as const },
  { title: "Best Retention Signal", stat: "R²=0.85", desc: "MLR confirms AOV is the dominant LTV predictor — maximize first-order basket size", tone: "blue" as const },
];

const QUICK_LINKS = [
  { label: "Data Audit", href: "/audit", icon: CheckCircle2, color: "text-emerald-400" },
  { label: "Descriptive Stats", href: "/descriptive", icon: BarChart3, color: "text-blue-400" },
  { label: "Customer Segments", href: "/segmentation", icon: Users, color: "text-violet-400" },
  { label: "Campaign Analysis", href: "/campaigns", icon: Megaphone, color: "text-amber-400" },
  { label: "Lead Conversion", href: "/leads", icon: Target, color: "text-cyan-400" },
  { label: "Retention & CLV", href: "/retention", icon: TrendingUp, color: "text-emerald-400" },
  { label: "Budget & Insights", href: "/insights", icon: DollarSign, color: "text-rose-400" },
  { label: "CMO Memo", href: "/memo", icon: CheckCircle2, color: "text-slate-400" },
];

export default function OverviewPage() {
  const segLabels = SEGMENTS.map((s) => s.name);
  const segRevenue = SEGMENTS.map((s) => s.totalRevenue);
  const segColors = SEGMENTS.map((s) => s.color);

  const budgetLabels = BUDGET_REALLOCATION.map((b) => b.channel);
  const budgetCurrent = BUDGET_REALLOCATION.map((b) => b.currentPct);
  const budgetRecommended = BUDGET_REALLOCATION.map((b) => b.recommendedPct);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
          <LayoutDashboard className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">NovaMart Marketing Analytics</h1>
          <p className="mt-1 text-sm text-slate-400">
            Campaign ROI · Customer Segmentation · Lead Conversion · Customer Growth
            <span className="ml-3 inline-block rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
              2,400 customers · 39 campaigns · 2,808 transactions
            </span>
          </p>
        </div>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total Revenue" value={`$${(KPI_SUMMARY.totalRevenue / 1000).toFixed(0)}K`} sub="across 2,808 transactions" accent="text-emerald-400" />
        <StatCard label="Avg Customer LTV" value={`$${KPI_SUMMARY.avgLTV}`} sub="CLV proxy (total spend)" accent="text-blue-400" />
        <StatCard label="Avg AOV" value={`$${KPI_SUMMARY.avgAOV}`} sub="95% CI: $54.67–$63.85" accent="text-cyan-400" />
        <StatCard label="Lead Conv. Rate" value={`${(KPI_SUMMARY.avgLCR * 100).toFixed(1)}%`} sub="30-day conversion window" accent="text-amber-400" />
        <StatCard label="Mean ROAS" value={KPI_SUMMARY.avgROAS.toFixed(2)} sub="95% CI: 0.17–0.30" accent="text-violet-400" />
        <StatCard label="90-day Repeat" value={`${(KPI_SUMMARY.repeatRate90d * 100).toFixed(1)}%`} sub="base retention rate" accent="text-rose-400" />
      </div>

      {/* Key Findings */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-white">Top Findings</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FINDINGS.map((f) => <FindingCard key={f.title} {...f} />)}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue by segment */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="mb-1 text-sm font-semibold text-white">Revenue by Customer Segment</h3>
          <p className="mb-3 text-xs text-slate-400">K-Means (k=4) · One-Way ANOVA: F=3,669, p&lt;0.0001 — segments are statistically distinct</p>
          <Plot
            data={[{
              type: "pie",
              labels: segLabels,
              values: segRevenue,
              hole: 0.45,
              marker: { colors: segColors },
              textinfo: "label+percent",
              textfont: { size: 11, color: "#e2e8f0" },
              hovertemplate: "<b>%{label}</b><br>Revenue: $%{value:,.0f}<br>Share: %{percent}<extra></extra>",
            }]}
            layout={{
              ...PLOTLY_DARK_LAYOUT,
              height: 300,
              margin: { t: 10, r: 10, b: 10, l: 10 },
              showlegend: true,
              legend: { orientation: "h", y: -0.05, font: { size: 10 } },
            }}
            config={PLOTLY_CONFIG}
            style={{ width: "100%" }}
          />
        </div>

        {/* Budget current vs recommended */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="mb-1 text-sm font-semibold text-white">Budget: Current vs. Recommended Allocation</h3>
          <p className="mb-3 text-xs text-slate-400">Composite score: 35% ROAS · 25% LCR · 25% Avg LTV · 15% Repeat Rate</p>
          <Plot
            data={[
              {
                type: "bar",
                name: "Current %",
                x: budgetLabels,
                y: budgetCurrent,
                marker: { color: CHART_COLORS[3] + "cc" },
              },
              {
                type: "bar",
                name: "Recommended %",
                x: budgetLabels,
                y: budgetRecommended,
                marker: { color: CHART_COLORS[1] + "cc" },
              },
            ]}
            layout={{
              ...PLOTLY_DARK_LAYOUT,
              height: 300,
              barmode: "group",
              xaxis: { ...PLOTLY_DARK_LAYOUT.xaxis, tickangle: -30 },
              yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis, title: "Budget %" },
              legend: { orientation: "h", y: 1.1 },
            }}
            config={PLOTLY_CONFIG}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* Priority Action Items */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <h2 className="text-base font-semibold text-amber-300">Priority Actions</h2>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          {[
            "Audit MKT2021 immediately ($999,999 spend, ROAS = 0.009)",
            "Contact 6 Champion customers not on email list",
            "Implement abandoned-cart email for 784 Engaged Browsers",
            "Begin Affiliate budget reduction: cap at 30% (from 42.7%)",
            "Tag 1,430 High-priority leads in CRM using model output",
            "Set 45-day re-engagement trigger for no-second-order customers",
          ].map((action, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">{i + 1}</span>
              <span className="text-slate-300">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick navigation */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-white">Explore the Analysis</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 p-4 text-center text-xs font-medium text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              <link.icon className={`h-6 w-6 ${link.color}`} />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
