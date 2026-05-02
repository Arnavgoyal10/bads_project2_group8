// @ts-nocheck
"use client";
import dynamic from "next/dynamic";
import { Target, Info } from "lucide-react";
import { LEAD_MODELS, LEAD_FEATURE_IMPORTANCE, LEAD_TIERS, HYPOTHESIS_TESTS, DISCOUNT_UPLIFT_CHANNEL } from "@/lib/data";
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

const PREMODEL_TESTS = [
  { test: "Chi-Square: lead_source → conversion", result: "χ²=21.00, p=0.033 ✓", significant: true, note: "Lead source has a statistically significant impact on conversion" },
  { test: "Mann-Whitney: add_to_cart (converters vs non)", result: "U=3,229,810, p=0.102 ✗", significant: false, note: "Add-to-cart alone does not distinguish converters" },
  { test: "Welch t-test: lead_score (converters vs non)", result: "t=12.90, p<0.0001 ✓✓✓", significant: true, note: "Lead score is the strongest pre-model signal" },
];

export default function LeadsPage() {
  const modelNames = LEAD_MODELS.map((m) => m.model);
  const modelCvAuc = LEAD_MODELS.map((m) => m.cvAuc);
  const modelAuc = LEAD_MODELS.map((m) => m.auc);

  const featNames = LEAD_FEATURE_IMPORTANCE.map((f) => f.feature).reverse();
  const featImportance = LEAD_FEATURE_IMPORTANCE.map((f) => f.importance).reverse();

  const hypothesisTests = HYPOTHESIS_TESTS;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
          <Target className="h-6 w-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Lead Conversion Prediction</h1>
          <p className="mt-1 text-sm text-slate-400">Phase 5 — Identifying leads most likely to convert within 30 days</p>
        </div>
      </div>

      <MethodBox>
        With 5,224 leads, the sales team cannot follow up on all with equal effort. We trained 5 classification
        models (Logistic Regression, Random Forest, Gradient Boosting, Naive Bayes, KNN) and selected the best
        using <strong>5-fold stratified cross-validated AUC</strong> — not test accuracy. CV AUC prevents
        overfitting and handles class imbalance (only 37% of leads convert). The winning model prioritizes
        leads into High/Medium/Low tiers for the sales team. Pre-model hypothesis tests were run first to
        confirm that chosen features have statistical signal before model training.
      </MethodBox>

      {/* Pre-model tests */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
        <h3 className="text-base font-semibold text-white">Pre-Model Hypothesis Tests</h3>
        <p className="text-xs text-slate-400">Run before modeling to validate that features have signal. If a feature fails here, including it in the model adds noise.</p>
        <div className="space-y-2">
          {PREMODEL_TESTS.map((t, i) => (
            <div key={i} className={`flex items-start gap-3 rounded-lg border p-3 ${t.significant ? "border-emerald-500/20 bg-emerald-500/5" : "border-slate-700 bg-slate-800/30"}`}>
              <span className={`mt-0.5 text-sm font-bold ${t.significant ? "text-emerald-400" : "text-slate-500"}`}>{t.significant ? "✓" : "✗"}</span>
              <div>
                <p className="text-sm font-medium text-slate-300">{t.test}</p>
                <p className={`text-xs font-mono ${t.significant ? "text-emerald-400" : "text-slate-500"}`}>{t.result}</p>
                <p className="text-xs text-slate-400 mt-0.5">{t.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model comparison */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-white">Model Comparison — 5-Fold Stratified CV AUC</h3>
          <p className="text-xs text-slate-400 mt-0.5">Selected model: Logistic Regression (highest CV AUC = 0.619, best precision/recall balance)</p>
        </div>
        <MethodBox>
          We prefer CV AUC over test accuracy because: (1) class imbalance makes accuracy misleading —
          a model predicting "no convert" always gets 63% accuracy, (2) AUC measures rank ordering ability
          which is what matters for lead prioritization, (3) cross-validation uses all data without overfitting
          to one specific test split. Logistic Regression was chosen over Gradient Boosting despite lower raw
          accuracy because its CV AUC is highest — it generalizes better to unseen leads.
        </MethodBox>
        <Plot
          data={[
            {
              type: "bar",
              name: "CV AUC (5-fold) ← selection metric",
              x: modelNames,
              y: modelCvAuc,
              marker: { color: LEAD_MODELS.map((m) => m.selected ? CHART_COLORS[1] : CHART_COLORS[0] + "88") },
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
            height: 300,
            barmode: "group",
            xaxis: { ...PLOTLY_DARK_LAYOUT.xaxis, tickangle: -15 },
            yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis, title: "AUC", range: [0.5, 0.68] },
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
              {LEAD_MODELS.map((m, i) => (
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

      {/* Feature importance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
          <h3 className="text-base font-semibold text-white">Feature Importance (Random Forest SHAP)</h3>
          <p className="text-xs text-slate-400">What drives lead conversion probability?</p>
          <Plot
            data={[{
              type: "bar",
              orientation: "h",
              x: featImportance,
              y: featNames,
              marker: { color: CHART_COLORS[0] },
            }]}
            layout={{
              ...PLOTLY_DARK_LAYOUT,
              height: 320,
              margin: { t: 10, r: 20, b: 40, l: 170 },
              xaxis: { ...PLOTLY_DARK_LAYOUT.xaxis, title: "Feature Importance" },
              yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis },
            }}
            config={PLOTLY_CONFIG}
            style={{ width: "100%" }}
          />
          <InsightBox>
            Lead score is the single most predictive feature (0.129) — the existing scoring system is working.
            Behavioral signals (time on site, pages viewed) are next strongest. Source attribution (Google, Meta)
            is relatively weak — focus energy on enriching the lead score and engagement data.
          </InsightBox>
        </div>

        {/* Lead tiers */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
          <h3 className="text-base font-semibold text-white">Lead Priority Tiers</h3>
          <p className="text-xs text-slate-400">All 5,224 leads scored and tiered. Optimal classification threshold: 0.17 (cost matrix: $20 miss vs $5 false positive)</p>
          <div className="space-y-3">
            {LEAD_TIERS.map((t) => (
              <div key={t.tier} className="rounded-lg border border-slate-700 bg-slate-800/40 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full" style={{ background: t.color }} />
                    <span className="font-semibold text-slate-200">{t.tier} Priority</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{t.count.toLocaleString()}</span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                  <span>Avg conversion prob: <strong className="text-slate-200">{(t.avgProb * 100).toFixed(1)}%</strong></span>
                  <span>{((t.count / 5224) * 100).toFixed(1)}% of all leads</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-slate-700">
                  <div className="h-1.5 rounded-full" style={{ width: `${(t.count / 5224) * 100}%`, background: t.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-200">
            <strong className="text-blue-400">Economic optimization: </strong>
            Using threshold 0.17 minimizes total cost at $4,010/cycle ($20 per missed convert, $5 per false positive).
            Default threshold of 0.50 would miss the majority of true converters.
          </div>
        </div>
      </div>

      {/* Model reliability charts */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
        <h3 className="text-base font-semibold text-white">Model Reliability — ROC, Calibration & Lift</h3>
        <MethodBox>
          AUC and accuracy alone can be misleading. We validate the selected Logistic Regression model using three
          additional diagnostics: (1) ROC curves compare all 5 models on true/false positive tradeoff,
          (2) the calibration curve checks if predicted probabilities match actual conversion rates,
          (3) the lift chart shows how much better our model is vs. random targeting across deciles.
        </MethodBox>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-300">ROC Curves — All 5 Models</p>
            <img src="/outputs/roc_curves.png" alt="ROC Curves" className="w-full rounded-lg" />
            <p className="text-xs text-slate-400">Logistic Regression (AUC=0.636) and Gradient Boosting (0.621) are closest. The selected model is not the highest test AUC — it wins on cross-validated AUC which better predicts generalization.</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-300">Calibration Curve</p>
            <img src="/outputs/calibration_curve.png" alt="Calibration Curve" className="w-full rounded-lg" />
            <p className="text-xs text-slate-400">The calibration curve shows predicted probabilities align with actual outcomes. A well-calibrated model means P=0.7 truly converts ~70% of the time — essential for threshold optimization.</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-300">Lift Chart</p>
            <img src="/outputs/lift_chart.png" alt="Lift Chart" className="w-full rounded-lg" />
            <p className="text-xs text-slate-400">Top decile lift: 1.4× — targeting the top 10% of scored leads yields 40% more conversions per contact than random. Focus sales on High-tier leads to maximize conversion per rep-hour.</p>
          </div>
        </div>
      </div>

      {/* Confusion Matrix */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">Confusion Matrix — Logistic Regression @ Threshold 0.17</h3>
          <p className="text-xs text-slate-400">Optimized threshold (0.17 vs default 0.50) dramatically increases recall for the minority convert class</p>
          <img src="/outputs/confusion_matrix.png" alt="Confusion Matrix" className="w-full rounded-lg" style={{ objectFit: "contain" }} />
          <p className="text-xs text-slate-400">At threshold=0.17, the model catches more true positives at the cost of more false positives — the right tradeoff when a missed conversion costs $20 but a false positive costs only $5.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">SHAP Global Feature Importance</h3>
          <p className="text-xs text-slate-400">SHAP values from Random Forest — direction and magnitude of feature contributions</p>
          <img src="/outputs/shap_summary.png" alt="SHAP Summary" className="w-full rounded-lg" style={{ objectFit: "contain" }} />
          <p className="text-xs text-slate-400">Lead score pushes predictions both ways — high scores strongly predict conversion, low scores strongly predict non-conversion. Behavioral features (time on site, pages viewed) are more consistently directional.</p>
        </div>
      </div>

      {/* Discount causal analysis */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
        <h3 className="text-base font-semibold text-white">Discount Effect on Conversion — Causal Analysis</h3>
        <p className="text-xs text-slate-400">IPTW causal estimate + logistic regression coefficient on discount_pct</p>
        <MethodBox>
          Simple correlation between discount offered and conversion rate is <strong>confounded</strong>:
          sales reps offer discounts to harder-to-convert leads, inflating the apparent effect.
          Inverse Probability Treatment Weighting (IPTW) creates a pseudo-randomized comparison by
          re-weighting observations by the inverse probability of receiving a discount. This isolates
          the true causal effect of discounting, independent of who gets offered one.
        </MethodBox>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-center">
            <p className="text-xs text-slate-400">IPTW Causal ATE</p>
            <p className="mt-1 text-3xl font-bold text-rose-400">−0.9pp</p>
            <p className="text-xs text-slate-500">discounts causally hurt conversion</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 text-center">
            <p className="text-xs text-slate-400">Logit Coefficient</p>
            <p className="mt-1 text-3xl font-bold text-rose-300">−0.013</p>
            <p className="text-xs text-slate-500">p=0.001 *** (statistically significant)</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 text-center">
            <p className="text-xs text-slate-400">Chi-Square: Flag × Conversion</p>
            <p className="mt-1 text-3xl font-bold text-slate-400">p=0.92</p>
            <p className="text-xs text-slate-500">raw correlation is confounded — not reliable</p>
          </div>
        </div>
        <InsightBox>
          Discounts do not cause conversion — they are a symptom of difficult-to-convert leads.
          Reps who offer discounts are not creating conversions; they are spending margin on leads
          that would have converted anyway or are chasing leads that will never convert.
          The right intervention is to improve lead quality (lead score threshold) not discount depth.
        </InsightBox>
      </div>

      {/* All hypothesis tests */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
        <h3 className="text-base font-semibold text-white">Full Hypothesis Test Battery</h3>
        <p className="text-xs text-slate-400">All tests run across this phase and Phase 2</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                {["Test", "Statistic", "p-value", "Sig", "Decision"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hypothesisTests.map((t, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-900/40">
                  <td className="px-3 py-2 text-slate-300">{t.test}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-400">{t.stat}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-400">{t.pValue < 0.001 ? "<0.001" : t.pValue.toFixed(4)}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${t.significant ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-700 text-slate-400"}`}>
                      {t.significant ? "✓" : "✗"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-400">{t.decision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
