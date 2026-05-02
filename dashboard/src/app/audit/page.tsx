"use client";
import { Shield, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { DATA_QUALITY_ISSUES } from "@/lib/data";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">{title}</h2>
      {children}
    </div>
  );
}

function MethodBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-sm text-blue-200 leading-relaxed">
      <span className="font-semibold text-blue-400">Why we did this: </span>{children}
    </div>
  );
}

const SCORE_CARDS = [
  { table: "Customers", score: 99.7, status: "healthy" },
  { table: "Campaigns", score: 68.1, status: "critical" },
  { table: "Leads", score: 89.8, status: "warning" },
  { table: "Transactions", score: 88.3, status: "warning" },
  { table: "Sessions", score: 78.0, status: "warning" },
];

const STATS = [
  { label: "Raw Customers", value: "2,418", note: "→ 2,400 after dedup" },
  { label: "Raw Campaigns", value: "42", note: "→ 39 after dedup (3 dupes)" },
  { label: "Leads", value: "5,224", note: "22% anonymous (no customer_id)" },
  { label: "Website Sessions", value: "19,045", note: "22% not matched to a customer" },
  { label: "Transactions", value: "2,808", note: "6 product categories (normalized)" },
  { label: "Channel Variants", value: "11 → 7", note: "Normalized to canonical names" },
];

const ABT_KPIS = [
  { kpi: "LCR", formula: "converted_leads / total_leads", purpose: "Lead quality ratio per customer" },
  { kpi: "CPA", formula: "total_acquisition_cost / converted_leads", purpose: "Efficiency of spend per conversion" },
  { kpi: "AOV", formula: "total_revenue / total_orders", purpose: "Average transaction value" },
  { kpi: "Return Rate", formula: "total_returned / total_orders", purpose: "Product satisfaction signal" },
  { kpi: "CLV Proxy", formula: "total_revenue (historical)", purpose: "Realized lifetime value" },
  { kpi: "Recency (days)", formula: "max_order_date − anchor_date", purpose: "Decay signal for RFM" },
  { kpi: "Engagement Score", formula: "checkout×3 + add_to_cart×2 + pages/10 − bounce", purpose: "Session intent composite" },
];

export default function AuditPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
          <Shield className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Data Audit & Analytical Base Table</h1>
          <p className="mt-1 text-sm text-slate-400">Phase 1 — Before any analysis, we must trust the data</p>
        </div>
      </div>

      <MethodBox>
        Raw operational data from five tables (customers, campaigns, leads, website_sessions, transactions)
        was audited for duplicates, invalid values, encoding inconsistencies, and broken join keys.
        Every issue was documented and treated systematically before building the Analytical Base Table (ABT).
        The ABT is the single source of truth for all downstream analyses — joining all tables
        at the customer level with pre-computed KPIs.
      </MethodBox>

      {/* Data maturity scores */}
      <Section title="Data Maturity Scores">
        <p className="text-sm text-slate-400">Composite score per table: completeness + logical validity. Above 90 = Healthy; 70–90 = Warning; below 70 = Critical.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {SCORE_CARDS.map((s) => (
            <div key={s.table} className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
              <p className="text-xs font-medium text-slate-400">{s.table}</p>
              <p className={`mt-1 text-2xl font-bold ${s.status === "healthy" ? "text-emerald-400" : s.status === "critical" ? "text-rose-400" : "text-amber-400"}`}>{s.score}</p>
              <div className="mt-1 flex items-center justify-center gap-1">
                {s.status === "healthy"
                  ? <><CheckCircle2 className="h-3 w-3 text-emerald-400" /><span className="text-xs text-emerald-400">Healthy</span></>
                  : s.status === "critical"
                  ? <><AlertTriangle className="h-3 w-3 text-rose-400" /><span className="text-xs text-rose-400">Critical</span></>
                  : <><AlertTriangle className="h-3 w-3 text-amber-400" /><span className="text-xs text-amber-400">Warning</span></>
                }
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Dataset sizes */}
      <Section title="Dataset Summary">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-lg border border-slate-800 bg-slate-900 p-3">
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className="mt-0.5 text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500">{s.note}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Issues found */}
      <Section title="Issues Found & Treatments">
        <p className="text-sm text-slate-400">Every issue below was documented in the audit note before being corrected. Nothing was silently dropped.</p>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Table</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Issue</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Treatment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Severity</th>
              </tr>
            </thead>
            <tbody>
              {DATA_QUALITY_ISSUES.map((issue, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-900/40">
                  <td className="px-4 py-3 font-medium text-slate-300">{issue.table}</td>
                  <td className="px-4 py-3 text-slate-400">{issue.issue}</td>
                  <td className="px-4 py-3 text-slate-400">{issue.treatment}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      issue.severity === "high" ? "bg-rose-500/15 text-rose-400" :
                      issue.severity === "medium" ? "bg-amber-500/15 text-amber-400" :
                      "bg-slate-700 text-slate-300"
                    }`}>{issue.severity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ABT KPIs */}
      <Section title="Analytical Base Table — Engineered KPIs">
        <MethodBox>
          The ABT joins all five tables at the customer grain. KPIs are computed once and stored, ensuring
          every downstream model uses identical feature definitions. This prevents calculation drift
          between phases (e.g., LCR in segmentation differs from LCR in lead prediction if computed ad hoc).
        </MethodBox>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">KPI</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Formula</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {ABT_KPIS.map((k, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-900/40">
                  <td className="px-4 py-3 font-mono text-blue-400 font-semibold">{k.kpi}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{k.formula}</td>
                  <td className="px-4 py-3 text-slate-300">{k.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Identity resolution gap */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="font-semibold text-amber-300">Strategic Fix Required: Identity Resolution</p>
            <p className="mt-1 text-sm text-amber-200/80">
              22% of website sessions are anonymous — no customer_id link. This means one in five engagement
              signals (add-to-cart, checkout started) cannot be attributed to a customer journey.
              <strong className="text-amber-300"> Fix</strong>: Implement server-side tracking or first-party cookie reconciliation to close this gap.
              Every 1% improvement in session match rate recovers attribution data for ~190 additional customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
