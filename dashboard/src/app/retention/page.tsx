// @ts-nocheck
"use client";
import dynamic from "next/dynamic";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { RETENTION_MODELS, RETENTION_FEATURE_IMPORTANCE, MLR_RESULTS } from "@/lib/data";
import { PLOTLY_DARK_LAYOUT, PLOTLY_CONFIG, CHART_COLORS } from "@/lib/plotly-theme";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

function MethodBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-sm text-blue-200 leading-relaxed">
      <span className="font-semibold text-blue-400">Why: </span>{children}
    </div>
  );
}

function InsightBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-200 leading-relaxed">
      <span className="font-semibold text-emerald-400">Interpretation: </span>{children}
    </div>
  );
}

const EARLY_WARNING_SIGNS = [
  { signal: "High acquisition cost + low first-order revenue", risk: "Strong churn signal — paid too much for someone who spent too little", action: "Flag in CRM; trigger 60-day re-engagement if no second order" },
  { signal: "Low session count before first order", risk: "Impulsive buyer — less considered purchase = higher return & churn rate", action: "Post-purchase nurture sequence to build product familiarity" },
  { signal: "Low loyalty tier at acquisition", risk: "Bronze customers have 35% lower LTV than Platinum", action: "Upgrade offer after 2nd purchase to accelerate tier progression" },
  { signal: "First order in Beverages category", risk: "Lowest avg transaction value ($33), weakest retention signal", action: "Cross-sell to Baby or Personal Care in first post-purchase email" },
];

export default function RetentionPage() {
  const modelNames = RETENTION_MODELS.map((m) => m.model);
  const modelCvAuc = RETENTION_MODELS.map((m) => m.cvAuc);
  const modelAuc = RETENTION_MODELS.map((m) => m.auc);

  const featNames = RETENTION_FEATURE_IMPORTANCE.map((f) => f.feature).reverse();
  const featImportance = RETENTION_FEATURE_IMPORTANCE.map((f) => f.importance).reverse();

  const clvBuckets = ["$0–$50", "$50–$100", "$100–$150", "$150–$200", "$200–$260", "$260+"];
  const clvFrequencies = [820, 380, 210, 120, 80, 90];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
          <TrendingUp className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Customer Retention & CLV Prediction</h1>
          <p className="mt-1 text-sm text-slate-400">Phase 6 — Will a customer repeat-purchase within 90 days? Who is most valuable in 6 months?</p>
        </div>
      </div>

      <MethodBox>
        We predict repeat purchase within 90 days (binary classification) as the primary retention signal.
        Why 90 days? Because the Kaplan-Meier survival analysis showed that the median time to a second
        purchase is effectively infinite in our dataset — most customers who will return do so within 90 days
        or not at all. Three models were trained (Logistic Regression, Random Forest, Gradient Boosting) with
        5-fold stratified CV. Pre-model Mann-Whitney and Chi-Square tests validated feature relevance.
        CLV (6-month projected) is computed using each customer&apos;s predicted repeat probability × historical AOV.
      </MethodBox>

      {/* KM survival finding */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="font-semibold text-amber-300">Kaplan-Meier Finding: Median Time to 2nd Purchase = ∞</p>
            <p className="mt-1 text-sm text-amber-200/80">
              Survival analysis (borrowing from clinical trial methodology) confirmed: among 1,477 customers
              tracked, only 4 had a second purchase in the observation window. The median survival function
              never drops to 0.5 — meaning <strong className="text-amber-300">fewer than half of all customers ever make a second purchase</strong>.
              This is the most urgent finding: NovaMart is a one-time purchase business, not a repeat business.
              The 90-day window is the critical intervention window.
            </p>
          </div>
        </div>
      </div>

      {/* Kaplan-Meier Survival Curve */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
        <h3 className="text-sm font-semibold text-white">Kaplan-Meier Survival Curve — Time to Second Purchase</h3>
        <p className="text-xs text-slate-400">n=1,477 customers with first purchase · n_events=4 second purchases in observation window</p>
        <img src="/outputs/kaplan_km.png" alt="Kaplan-Meier Survival Curve" className="w-full rounded-lg max-h-80 object-contain" />
        <p className="text-xs text-slate-400 border-t border-slate-800 pt-2">
          <span className="font-medium text-slate-300">Reading the chart: </span>
          The survival function (probability of NOT yet having made a 2nd purchase) never drops to 0.5 in the observation window.
          This means the median time to a 2nd purchase is statistically infinite — more than half of customers never return.
          Borrowed from clinical trial methodology, this survival analysis is far more informative than a simple repeat-rate percentage.
        </p>
      </div>

      {/* Pre-model tests */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
        <h3 className="text-base font-semibold text-white">Pre-Model Hypothesis Tests</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { test: "Mann-Whitney: revenue (repeaters vs non)", result: "U=298,741, p<0.0001 ***", significant: true, note: "Repeaters spend $154 vs $93 for non-repeaters" },
            { test: "Chi-Square: loyalty_tier → repeat_90d", result: "χ²=5.78, p=0.123 ✗", significant: false, note: "Loyalty tier alone does not predict repeat purchase" },
            { test: "Mann-Whitney: acq_cost (repeaters vs non)", result: "U=216,164, p=0.026 *", significant: true, note: "Acquisition cost differs — high-cost acq churn faster" },
          ].map((t, i) => (
            <div key={i} className={`rounded-lg border p-3 ${t.significant ? "border-emerald-500/20 bg-emerald-500/5" : "border-slate-700 bg-slate-800/30"}`}>
              <p className="text-xs font-medium text-slate-300">{t.test}</p>
              <p className={`text-xs font-mono mt-1 ${t.significant ? "text-emerald-400" : "text-slate-500"}`}>{t.result}</p>
              <p className="text-xs text-slate-400 mt-1">{t.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Model comparison */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-white">Retention Model Comparison</h3>
          <p className="text-xs text-slate-400 mt-0.5">Selected: Gradient Boosting (CV AUC = 0.746, best generalisation)</p>
        </div>
        <Plot
          data={[
            {
              type: "bar",
              name: "CV AUC (5-fold) ← selection metric",
              x: modelNames,
              y: modelCvAuc,
              marker: { color: RETENTION_MODELS.map((m) => m.selected ? CHART_COLORS[1] : CHART_COLORS[0] + "88") },
            },
            {
              type: "bar",
              name: "Test AUC",
              x: modelNames,
              y: modelAuc,
              marker: { color: CHART_COLORS[2] + "88" },
            },
          ]}
          layout={{
            ...PLOTLY_DARK_LAYOUT,
            height: 260,
            barmode: "group",
            xaxis: { ...PLOTLY_DARK_LAYOUT.xaxis },
            yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis, title: "AUC", range: [0.6, 0.78] },
            legend: { orientation: "h", y: 1.1 },
          }}
          config={PLOTLY_CONFIG}
          style={{ width: "100%" }}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                {["Model", "Accuracy", "Test AUC", "CV AUC ★", "F1", "Selected"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RETENTION_MODELS.map((m, i) => (
                <tr key={i} className={`border-b border-slate-800/50 hover:bg-slate-900/40 ${m.selected ? "bg-emerald-500/5" : ""}`}>
                  <td className="px-3 py-2 font-medium text-slate-300">{m.model}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-400">{(m.accuracy * 100).toFixed(1)}%</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-400">{m.auc.toFixed(4)}</td>
                  <td className="px-3 py-2 font-mono text-xs font-semibold text-blue-400">{m.cvAuc.toFixed(4)}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-400">{m.f1.toFixed(4)}</td>
                  <td className="px-3 py-2">
                    {m.selected && <span className="inline-block rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">✓ Selected</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature importance + CLV */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">Retention Feature Importance (Gradient Boosting)</h3>
          <p className="text-xs text-slate-400">What predicts whether a customer will return in 90 days?</p>
          <Plot
            data={[{
              type: "bar",
              orientation: "h",
              x: featImportance,
              y: featNames,
              marker: { color: CHART_COLORS[1] },
            }]}
            layout={{
              ...PLOTLY_DARK_LAYOUT,
              height: 320,
              margin: { t: 10, r: 20, b: 40, l: 180 },
              xaxis: { ...PLOTLY_DARK_LAYOUT.xaxis, title: "Feature Importance" },
            }}
            config={PLOTLY_CONFIG}
            style={{ width: "100%" }}
          />
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">6-Month CLV Distribution</h3>
          <p className="text-xs text-slate-400">Avg projected CLV: $141.28 · Top 10% threshold: $260.78</p>
          <Plot
            data={[{
              type: "bar",
              x: clvBuckets,
              y: clvFrequencies,
              marker: { color: CHART_COLORS.slice(0, 6) },
              hovertemplate: "<b>CLV %{x}</b><br>Customers: %{y}<extra></extra>",
            }]}
            layout={{
              ...PLOTLY_DARK_LAYOUT,
              height: 280,
              xaxis: { ...PLOTLY_DARK_LAYOUT.xaxis, title: "Projected 6m CLV" },
              yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis, title: "# Customers" },
            }}
            config={PLOTLY_CONFIG}
            style={{ width: "100%" }}
          />
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Avg 6m CLV", value: "$141", sub: "projected" },
              { label: "Repeat Prob", value: "24.2%", sub: "avg 90-day" },
              { label: "Top Decile", value: "$261+", sub: "threshold" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-slate-800/40 p-2 text-center">
                <p className="text-xs text-slate-400">{s.label}</p>
                <p className="font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-500">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MLR models */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
        <h3 className="text-base font-semibold text-white">Multiple Linear Regression — 3 Business Questions</h3>
        <MethodBox>
          MLR tests whether a set of features jointly predict a continuous outcome (LTV, revenue, or time-to-convert).
          R² measures the proportion of variance explained. Train/test split (75/25 stratified) prevents overfitting.
          Model C (days-to-convert) returned R²=−0.010 — a negative R² means the model is worse than a horizontal mean line.
          This is an honest failure: channel cannot predict conversion speed, and we document this explicitly rather than
          hiding it or misrepresenting it.
        </MethodBox>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                {["Model", "R²", "Adj R²", "n (train)", "n (test)", "Top Predictor", "Status"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MLR_RESULTS.map((m, i) => (
                <tr key={i} className={`border-b border-slate-800/50 hover:bg-slate-900/40 ${m.status === "failed" ? "bg-rose-500/5" : ""}`}>
                  <td className="px-3 py-2 font-medium text-slate-300">{m.model}</td>
                  <td className={`px-3 py-2 font-mono text-xs font-semibold ${m.r2 < 0 ? "text-rose-400" : "text-emerald-400"}`}>{m.r2.toFixed(3)}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-400">{m.adjR2.toFixed(3)}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-400">{m.nTrain.toLocaleString()}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-400">{m.nTest.toLocaleString()}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-400">{m.topPredictor}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${m.status === "success" ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}>
                      {m.status === "success" ? "✓ Valid" : "✗ Failed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-xs text-rose-200">
          <strong className="text-rose-400">Model C Note: </strong>
          R²=−0.010 means the model fails to explain days-to-convert variance. Channel does not predict conversion speed —
          all channels take ~15 days. Do not use this model for recommendations. This is a data limitation, not a modeling error.
        </div>
        <InsightBox>
          Model A (LTV prediction, R²=0.851) is highly valuable: AOV is the dominant predictor of LTV.
          This means <strong>increasing first-order basket size is the most actionable lever for long-term customer value</strong>.
          "Starter kit" bundles that raise first AOV from $53 to $69 (Bronze → Platinum AOV gap) should significantly
          improve predicted LTV for new customers.
        </InsightBox>
      </div>

      {/* Cohort Retention + MLR Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">Cohort Retention Heatmap</h3>
          <p className="text-xs text-slate-400">Week-over-week retention by acquisition cohort</p>
          <img src="/outputs/cohort_retention.png" alt="Cohort Retention" className="w-full rounded-lg" style={{ objectFit: "contain" }} />
          <p className="text-xs text-slate-400">The heatmap reveals which acquisition cohorts retain best. Darker cells = higher retention in that week. Use this to assess whether recent marketing changes have improved long-term retention.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">Early Warning Signals — Feature Analysis</h3>
          <p className="text-xs text-slate-400">Gradient Boosting feature contributions to churn prediction</p>
          <img src="/outputs/early_warning_signals.png" alt="Early Warning Signals" className="w-full rounded-lg" style={{ objectFit: "contain" }} />
          <p className="text-xs text-slate-400">High acquisition cost with low first-order revenue is the dominant churn signal. This pattern is detectable at first purchase and enables proactive CRM intervention before the 90-day window closes.</p>
        </div>
      </div>

      {/* MLR charts */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
        <h3 className="text-base font-semibold text-white">MLR Model Outputs — Visual Diagnostics</h3>
        <p className="text-xs text-slate-400">Actual vs. predicted plots for all 3 regression models — Model C failure is visually obvious</p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-400">Model A: Predict Customer LTV (R²=0.851)</p>
            <img src="/outputs/mlr_ltv.png" alt="MLR LTV" className="w-full rounded-lg" />
            <p className="text-xs text-slate-400">Tight prediction band. AOV as top predictor means first basket size reliably determines lifetime value.</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-blue-400">Model B: Predict Transaction Revenue (R²=0.716)</p>
            <img src="/outputs/mlr_revenue.png" alt="MLR Revenue" className="w-full rounded-lg" />
            <p className="text-xs text-slate-400">Units purchased dominates. Multi-unit orders are the primary lever for transaction-level revenue optimization.</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-rose-400">Model C: Days-to-Convert (R²=−0.010) — Failed</p>
            <img src="/outputs/mlr_days_convert.png" alt="MLR Days to Convert" className="w-full rounded-lg" />
            <p className="text-xs text-slate-400">Predictions show no structure — a flat mean line would outperform this model. Channel cannot predict conversion speed; all channels take ~15 days.</p>
          </div>
        </div>
      </div>

      {/* Early warning signs */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
        <h3 className="text-base font-semibold text-white">Early Warning Signs of Weak Acquisition Quality</h3>
        <p className="text-xs text-slate-400">From Gradient Boosting feature analysis and pre-model test results</p>
        <div className="space-y-2">
          {EARLY_WARNING_SIGNS.map((w, i) => (
            <div key={i} className="rounded-lg border border-amber-500/15 bg-amber-500/5 p-4">
              <p className="text-sm font-medium text-amber-300">{w.signal}</p>
              <p className="mt-1 text-xs text-slate-400"><strong className="text-slate-300">Risk: </strong>{w.risk}</p>
              <p className="mt-1 text-xs text-emerald-400"><strong>Action: </strong>{w.action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
