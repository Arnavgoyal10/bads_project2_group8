// @ts-nocheck
"use client";
import dynamic from "next/dynamic";
import { Megaphone, AlertTriangle, TrendingUp } from "lucide-react";
import { BUDGET_REALLOCATION, DECEPTIVE_CAMPAIGNS, CHANNEL_QUALITY } from "@/lib/data";
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

export default function CampaignsPage() {
  const budgetChannels = BUDGET_REALLOCATION.map((b) => b.channel);
  const shifts = BUDGET_REALLOCATION.map((b) => b.shift);
  const compositScores = BUDGET_REALLOCATION.map((b) => b.compositeScore);

  const decChannels = DECEPTIVE_CAMPAIGNS.map((d) => d.id);
  const decRoas = DECEPTIVE_CAMPAIGNS.map((d) => d.roas);
  const decRepeat = DECEPTIVE_CAMPAIGNS.map((d) => d.repeatRate * 100);

  const channelNames = CHANNEL_QUALITY.map((c) => c.channel);
  const channelLtv = CHANNEL_QUALITY.map((c) => c.avgLtv);
  const channelRoas = BUDGET_REALLOCATION.map((b) => b.roas);
  const budgetChannelNames = BUDGET_REALLOCATION.map((b) => b.channel);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
          <Megaphone className="h-6 w-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Campaign & Channel Analysis</h1>
          <p className="mt-1 text-sm text-slate-400">Phase 4 — Grouping campaigns, finding deceptive efficiency, and building a budget reallocation model</p>
        </div>
      </div>

      <MethodBox>
        K-Means clustering (k=2, silhouette = 0.622) was applied to campaign-level features (spend, LCR, ROAS, CPA)
        to group campaigns into "High Efficiency" and "Volume Drivers." Beyond surface clustering, we cross-tabulated
        ROAS against downstream customer repeat rate to identify campaigns that look good on short-term metrics
        but fail to attract repeat buyers — "Deceptive Efficiency." The budget reallocation model uses a composite
        score (35% ROAS · 25% LCR · 25% Avg LTV · 15% Repeat Rate) to recommend budget shifts grounded in
        long-term customer value, not just immediate returns.
      </MethodBox>

      {/* Spend anomaly alert */}
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/8 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
          <div>
            <p className="font-semibold text-rose-300">🚨 Spend Anomaly: MKT2021</p>
            <p className="mt-1 text-sm text-rose-200/80">
              Campaign MKT2021 spent <strong className="text-rose-300">$999,999</strong> — a 20× outlier vs. all other campaigns.
              Its ROAS was <strong className="text-rose-300">0.009</strong> (effectively zero) and CPA was <strong>$21,277</strong>
              vs. the normal cluster average of $921. This single campaign may represent a data entry error or a catastrophic misrun.
              <strong className="text-rose-300"> Immediate audit required.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Campaign clusters */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
        <h3 className="text-base font-semibold text-white">Campaign Clusters — K-Means (k=2, Silhouette = 0.622)</h3>
        <p className="text-xs text-slate-400">Strong cluster separation. Group 1 = High Efficiency (35 campaigns), Group 0 = Volume Driver (1 campaign: MKT2021)</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
            <p className="font-semibold text-emerald-300">Group 1: High Efficiency (35 campaigns)</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { label: "Avg Spend", value: "$46,419" },
                { label: "Avg ROAS", value: "0.239" },
                { label: "Avg LCR", value: "36.4%" },
                { label: "Avg CPA", value: "$921" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-slate-800/40 p-2">
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-2">
            <p className="font-semibold text-rose-300">Group 0: Volume Driver (1 campaign)</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { label: "Avg Spend", value: "$999,999" },
                { label: "Avg ROAS", value: "0.009" },
                { label: "Avg LCR", value: "34.8%" },
                { label: "Avg CPA", value: "$21,277" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-slate-800/40 p-2">
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="font-semibold text-rose-300">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200">
          <strong>Creative Lifecycle: </strong>14% of campaigns show a significant CTR drop after day 14, indicating creative fatigue.
          Recommendation: implement a 14-day creative rotation rule for all social campaigns.
          Social lead gen campaigns also take 5–7 days to reach peak LCR — avoid shutting them down in the first week.
        </div>
      </div>

      {/* Campaign Spend vs ROAS Scatter + Lifecycle */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">Campaign Spend vs. ROAS — Anomaly Detection</h3>
          <p className="text-xs text-slate-400">MKT2021 is a 20× spend outlier with near-zero ROAS — visible in the top-left corner</p>
          <img src="/outputs/campaign_spend_roas.png" alt="Campaign Spend vs ROAS Scatter" className="w-full rounded-lg" style={{ objectFit: "contain" }} />
          <p className="text-xs text-slate-400">All other campaigns cluster below $150K spend. MKT2021 at $999,999 with ROAS=0.009 is either a data entry error or a catastrophically misrun campaign requiring immediate audit.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">Campaign Performance Lifecycle</h3>
          <p className="text-xs text-slate-400">14% of campaigns show CTR decay after day 14 · Social Lead Gen campaigns reach peak LCR at day 5–7</p>
          <img src="/outputs/campaign_lifecycle.png" alt="Campaign Lifecycle" className="w-full rounded-lg" style={{ objectFit: "contain" }} />
          <p className="text-xs text-slate-400">Creative fatigue is measurable. Implement 14-day creative refresh cycles for social campaigns. Avoid shutting down Lead Gen campaigns in the first week — they haven't reached peak performance yet.</p>
        </div>
      </div>

      {/* Efficiency Frontier */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
        <h3 className="text-sm font-semibold text-white">Efficiency Frontier — ROAS vs. Customer Repeat Rate</h3>
        <p className="text-xs text-slate-400">Campaigns in the top-right quadrant are genuinely efficient on both immediate returns AND long-term retention</p>
        <img src="/outputs/efficiency_frontier.png" alt="Efficiency Frontier" className="w-full rounded-lg max-h-96 object-contain" />
        <p className="text-xs text-slate-400 border-t border-slate-800 pt-2">
          <span className="font-medium text-slate-300">Interpretation: </span>
          The frontier separates campaigns by two dimensions: ROAS (immediate revenue) and repeat rate (retention quality).
          Campaigns flagged as "Deceptively Efficient" fall in the high-ROAS / low-retention quadrant — they look good on monthly P&L
          but erode CLV. Target the top-right quadrant for scale-up.
        </p>
      </div>

      {/* Creative-Objective matrix image */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
        <h3 className="text-sm font-semibold text-white">Creative × Objective Efficiency Matrix</h3>
        <p className="text-xs text-slate-400">Heatmap of LCR across creative type × campaign objective combinations</p>
        <img src="/outputs/creative_objective_matrix.png" alt="Creative Objective Matrix" className="w-full rounded-lg max-h-80 object-contain" />
        <p className="text-xs text-slate-400 border-t border-slate-800 pt-2">
          <span className="font-medium text-slate-300">Interpretation: </span>
          The matrix reveals which creative-objective combinations underperform or outperform. Campaign objective alone has no
          significant effect (Chi-Square p=0.492). Pairing the right creative format with the right objective amplifies LCR beyond what either variable achieves alone.
        </p>
      </div>

      {/* Deceptive efficiency */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
        <div>
          <h3 className="text-base font-semibold text-white">Deceptive Efficiency — Campaigns That Look Good but Aren&apos;t</h3>
          <p className="text-xs text-slate-400 mt-0.5">Above-median ROAS + below-median repeat rate = customers that convert once but never come back</p>
        </div>
        <MethodBox>
          ROAS only measures immediate revenue return per dollar spent. A campaign can have a strong ROAS by
          attracting price-sensitive buyers who never repurchase. We define "Deceptive Efficiency" as campaigns
          in the above-median ROAS bucket that fall below median in customer 90-day repeat rate.
          These campaigns flatter the P&L in Month 1 but destroy long-term CLV.
        </MethodBox>
        <Plot
          data={[
            {
              type: "bar",
              name: "ROAS",
              x: decChannels,
              y: decRoas,
              marker: { color: CHART_COLORS[3] + "cc" },
              yaxis: "y",
            },
            {
              type: "bar",
              name: "Repeat Rate (%)",
              x: decChannels,
              y: decRepeat,
              marker: { color: CHART_COLORS[2] + "cc" },
              yaxis: "y2",
            },
          ]}
          layout={{
            ...PLOTLY_DARK_LAYOUT,
            height: 300,
            barmode: "group",
            yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis, title: "ROAS" },
            yaxis2: { title: "Repeat Rate (%)", overlaying: "y", side: "right", showgrid: false, tickfont: { color: "#94a3b8" } },
            xaxis: { ...PLOTLY_DARK_LAYOUT.xaxis, tickangle: -20 },
            legend: { orientation: "h", y: 1.1 },
          }}
          config={PLOTLY_CONFIG}
          style={{ width: "100%" }}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                {["Campaign", "Channel", "ROAS", "Repeat Rate", "Avg LTV", "Action"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DECEPTIVE_CAMPAIGNS.map((c, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-900/40">
                  <td className="px-3 py-2 font-mono text-amber-400 font-semibold">{c.id}</td>
                  <td className="px-3 py-2 text-slate-300">{c.channel}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-300">{c.roas.toFixed(3)}</td>
                  <td className="px-3 py-2 font-mono text-xs text-rose-400">{(c.repeatRate * 100).toFixed(1)}%</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-300">${c.avgLtv.toFixed(0)}</td>
                  <td className="px-3 py-2 text-xs text-slate-400">A/B test with loyalty-focused creative</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <InsightBox>
          8 campaigns are deceptively efficient — primarily Paid Social (5 campaigns) and Email (2 campaigns).
          These campaigns attract buyers with above-average first-order conversion but below-average retention.
          Before re-running them, test alternate creatives emphasizing subscription value, loyalty perks, or
          bundle value rather than one-time promotional hooks.
        </InsightBox>
      </div>

      {/* Budget reallocation */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-white">Budget Reallocation Recommendation</h3>
          <p className="text-xs text-slate-400 mt-0.5">Composite score = 35% ROAS + 25% LCR + 25% Avg LTV + 15% Repeat Rate (all min-max normalized)</p>
        </div>
        <MethodBox>
          A single metric like ROAS rewards channels that convert quickly but ignores customer quality.
          The composite scoring model blends four dimensions: immediate efficiency (ROAS + LCR) and
          downstream quality (LTV + repeat rate). Each weight reflects the approximate contribution
          of that dimension to long-run profitability. The output is an evidence-based budget shift
          recommendation — not a gut-feel reallocation.
        </MethodBox>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Plot
            data={[
              {
                type: "bar",
                name: "Current %",
                x: budgetChannels,
                y: BUDGET_REALLOCATION.map((b) => b.currentPct),
                marker: { color: CHART_COLORS[3] + "cc" },
              },
              {
                type: "bar",
                name: "Recommended %",
                x: budgetChannels,
                y: BUDGET_REALLOCATION.map((b) => b.recommendedPct),
                marker: { color: CHART_COLORS[1] + "cc" },
              },
            ]}
            layout={{
              ...PLOTLY_DARK_LAYOUT,
              height: 280,
              barmode: "group",
              title: { text: "Current vs. Recommended Budget", font: { size: 12 } },
              xaxis: { ...PLOTLY_DARK_LAYOUT.xaxis, tickangle: -20 },
              yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis, title: "Budget %" },
              legend: { orientation: "h", y: 1.15 },
            }}
            config={PLOTLY_CONFIG}
            style={{ width: "100%" }}
          />
          <Plot
            data={[{
              type: "bar",
              x: budgetChannels,
              y: shifts,
              marker: { color: shifts.map((s) => s >= 0 ? CHART_COLORS[1] : CHART_COLORS[3]) },
              text: shifts.map((s) => `${s > 0 ? "+" : ""}${s.toFixed(1)}pp`),
              textposition: "outside",
              hovertemplate: "<b>%{x}</b><br>Shift: %{y:+.1f}pp<extra></extra>",
            }]}
            layout={{
              ...PLOTLY_DARK_LAYOUT,
              height: 280,
              title: { text: "Budget Shift (percentage points)", font: { size: 12 } },
              xaxis: { ...PLOTLY_DARK_LAYOUT.xaxis, tickangle: -20 },
              yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis, title: "Shift (pp)", zeroline: true, zerolinewidth: 2 },
            }}
            config={PLOTLY_CONFIG}
            style={{ width: "100%" }}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                {["Channel", "Current %", "Recommended %", "Shift", "ROAS", "Avg LTV", "Composite Score"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BUDGET_REALLOCATION.sort((a, b) => b.shift - a.shift).map((r, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-900/40">
                  <td className="px-3 py-2 font-medium text-slate-300">{r.channel}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-400">{r.currentPct}%</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-300">{r.recommendedPct}%</td>
                  <td className={`px-3 py-2 font-mono text-xs font-semibold ${r.shift > 0 ? "text-emerald-400" : r.shift < 0 ? "text-rose-400" : "text-slate-400"}`}>
                    {r.shift > 0 ? "+" : ""}{r.shift.toFixed(1)}pp
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-400">{r.roas.toFixed(3)}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-300">${r.avgLtv.toFixed(0)}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 rounded-full bg-slate-700 w-16">
                        <div
                          className="h-1.5 rounded-full bg-blue-400"
                          style={{ width: `${r.compositeScore * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-slate-400">{r.compositeScore.toFixed(3)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <InsightBox>
          Affiliate should be reduced from 42.7% to 9.4% (−33pp). This frees ~$870K in annual spend that
          can be reinvested in Paid Search (+15pp) and Display (+12pp) — channels that acquire customers with
          higher LTV and repeat rates. Do not eliminate Affiliate entirely: its repeat rate (0.34) is above
          channel average. Instead, enforce a $70 minimum 90-day LTV threshold for affiliate partnerships.
        </InsightBox>
      </div>
    </div>
  );
}
