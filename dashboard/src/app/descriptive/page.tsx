// @ts-nocheck
"use client";
import dynamic from "next/dynamic";
import { BarChart3, Info } from "lucide-react";
import {
  CHANNEL_QUALITY, CATEGORY_ANALYSIS, RETURN_RATE_BY_CHANNEL,
  SLR_RESULTS, DISCOUNT_UPLIFT_CHANNEL, LANDING_PAGE_LCR,
  DAYS_TO_CONVERT, LOYALTY_TIERS, CHANNEL_PERFORMANCE,
  REGION_ANALYSIS, DEVICE_ANALYSIS, CREATIVE_TYPE, CAMPAIGN_OBJECTIVE,
} from "@/lib/data";
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

function ChartCard({ title, method, children, insight }: { title: string; method: string; children: React.ReactNode; insight: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{method}</p>
      </div>
      {children}
      <div className="border-t border-slate-800 pt-3">
        <p className="text-xs text-slate-400 leading-relaxed"><span className="font-medium text-slate-300">Insight: </span>{insight}</p>
      </div>
    </div>
  );
}

export default function DescriptivePage() {
  const channelNames = CHANNEL_QUALITY.map((c) => c.channel);
  const channelLtv = CHANNEL_QUALITY.map((c) => c.avgLtv);
  const channelRepeat = CHANNEL_QUALITY.map((c) => c.repeatRate * 100);
  const channelAcqCost = CHANNEL_QUALITY.map((c) => c.avgAcqCost);

  const catNames = CATEGORY_ANALYSIS.map((c) => c.category);
  const catRevenue = CATEGORY_ANALYSIS.map((c) => c.totalRevenue);
  const catReturnRate = CATEGORY_ANALYSIS.map((c) => c.returnRate * 100);
  const catRepeatRate = CATEGORY_ANALYSIS.map((c) => c.firstPurchaseRepeatRate * 100);

  const retChannels = RETURN_RATE_BY_CHANNEL.map((r) => r.channel);
  const retRates = RETURN_RATE_BY_CHANNEL.map((r) => (r.returnRate * 100).toFixed(1));

  const discChannels = DISCOUNT_UPLIFT_CHANNEL.map((d) => d.channel);
  const discUplift = DISCOUNT_UPLIFT_CHANNEL.map((d) => d.uplift);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
          <BarChart3 className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Descriptive Statistics & Hypothesis Testing</h1>
          <p className="mt-1 text-sm text-slate-400">Phase 2 — Understanding the distribution and statistical differences in the data</p>
        </div>
      </div>

      <MethodBox>
        Descriptive statistics answer the question "what does the data look like?" before any modeling.
        We supplement summaries with formal hypothesis tests — Kruskal-Wallis (non-parametric ANOVA for skewed
        distributions), Chi-Square (categorical associations), and IPTW causal inference — to confirm that
        observed differences are statistically robust and not sampling noise.
      </MethodBox>

      {/* Channel Performance Matrix */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
        <div>
          <h3 className="text-base font-semibold text-white">Channel Performance Matrix — Leads, Conversions & CPL</h3>
          <p className="text-xs text-slate-400 mt-0.5">Chi-Square: χ²=18.07, p=0.006 ** — channels convert at statistically different rates</p>
        </div>
        <MethodBox>
          Before assessing customer quality, we first measure channel volume efficiency: how many leads each channel
          generates, how many convert (LCR), and what each conversion costs (CPL = total spend / conversions).
          CPL surfaces a critical flaw invisible in LCR alone — Affiliate has a CPL of $346,666 despite a 35.2% LCR.
        </MethodBox>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                {["Channel", "Leads", "Conversions", "LCR", "CPL ($)", "Flag"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHANNEL_PERFORMANCE.map((c, i) => (
                <tr key={i} className={`border-b border-slate-800/50 hover:bg-slate-900/40 ${c.channel === "Affiliate" ? "bg-rose-500/5" : ""}`}>
                  <td className="px-4 py-3 font-medium text-slate-300">{c.channel}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{c.leads.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{c.conversions.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-300 font-semibold">{(c.lcr * 100).toFixed(1)}%</td>
                  <td className={`px-4 py-3 font-mono text-xs font-semibold ${c.cpl > 100000 ? "text-rose-400" : "text-slate-400"}`}>
                    ${c.cpl > 1000 ? (c.cpl / 1000).toFixed(0) + "K" : c.cpl.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {c.cpl > 100000 && <span className="inline-block rounded-full bg-rose-500/15 px-2 py-0.5 text-xs font-medium text-rose-400">⚠ CPL outlier</span>}
                    {c.lcr > 0.39 && <span className="inline-block rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">✓ Top LCR</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-800 pt-3">
          <p className="text-xs text-slate-400 leading-relaxed"><span className="font-medium text-slate-300">Insight: </span>
            Affiliate's CPL of $346,666 is 5× the nearest channel — caused by MKT2021's $999,999 anomalous spend.
            Email leads on LCR (40.4%) and has the 3rd-lowest CPL ($67.8K per conversion). Paid Social generates the most leads (1,572) but at below-median LCR.
          </p>
        </div>
      </div>

      {/* Channel quality */}
      <ChartCard
        title="Channel → Customer Quality (LTV, Repeat Rate, Acquisition Cost)"
        method="Kruskal-Wallis test on LTV across channels: H=20.39, p=0.040 ✓ significant"
        insight="Influencer acquires the highest avg LTV customers ($76) and has the lowest return rate (6.6%). Display is second-highest LTV ($75) yet only gets 5.5% of budget — heavily underinvested. Email acquires the cheapest customers ($27 CPA) but they have the lowest LTV ($59)."
      >
        <Plot
          data={[
            { type: "bar", name: "Avg LTV ($)", x: channelNames, y: channelLtv, marker: { color: CHART_COLORS[0] } },
            { type: "bar", name: "Repeat Rate (%)", x: channelNames, y: channelRepeat, marker: { color: CHART_COLORS[1] } },
            { type: "bar", name: "Avg Acq. Cost ($)", x: channelNames, y: channelAcqCost, marker: { color: CHART_COLORS[2] } },
          ]}
          layout={{
            ...PLOTLY_DARK_LAYOUT,
            height: 300,
            barmode: "group",
            xaxis: { ...PLOTLY_DARK_LAYOUT.xaxis, tickangle: -20 },
            yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis, title: "Value" },
            legend: { orientation: "h", y: 1.1 },
          }}
          config={PLOTLY_CONFIG}
          style={{ width: "100%" }}
        />
      </ChartCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category revenue */}
        <ChartCard
          title="Product Category Revenue & Loyalty"
          method="Transaction-level aggregation by product_category (normalized from 9 raw variants)"
          insight="Baby leads in total revenue ($39.9K) and has the lowest return rate (7%). Personal Care has the highest first-purchase repeat rate (58%) — customers who start with Personal Care are the most likely to return."
        >
          <Plot
            data={[
              { type: "bar", name: "Total Revenue ($)", x: catNames, y: catRevenue, marker: { color: CHART_COLORS[0] } },
              { type: "bar", name: "Repeat Rate (%)", x: catNames, y: catRepeatRate, yaxis: "y2", marker: { color: CHART_COLORS[1] } },
            ]}
            layout={{
              ...PLOTLY_DARK_LAYOUT,
              height: 280,
              barmode: "group",
              xaxis: { ...PLOTLY_DARK_LAYOUT.xaxis, tickangle: -15 },
              yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis, title: "Revenue ($)" },
              yaxis2: { title: "Repeat Rate (%)", overlaying: "y", side: "right", showgrid: false, tickfont: { color: "#94a3b8" } },
              legend: { orientation: "h", y: 1.12 },
            }}
            config={PLOTLY_CONFIG}
            style={{ width: "100%" }}
          />
        </ChartCard>

        {/* Return rates */}
        <ChartCard
          title="Return Rate by Marketing Channel"
          method="Aggregation of returned_flag per channel. No formal test (rates are close to mean)."
          insight="Influencer channel has the lowest return rate (6.6%) — creators set accurate product expectations. Email has the highest (8.9%), suggesting email creative may be over-promising. Review email product descriptions and add imagery."
        >
          <Plot
            data={[{
              type: "bar",
              x: retChannels,
              y: retRates.map(Number),
              marker: {
                color: retRates.map((r) =>
                  Number(r) > 8.5 ? CHART_COLORS[3] : Number(r) < 7 ? CHART_COLORS[1] : CHART_COLORS[2]
                ),
              },
              hovertemplate: "<b>%{x}</b><br>Return Rate: %{y:.1f}%<extra></extra>",
            }]}
            layout={{
              ...PLOTLY_DARK_LAYOUT,
              height: 280,
              xaxis: { ...PLOTLY_DARK_LAYOUT.xaxis, tickangle: -20 },
              yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis, title: "Return Rate (%)" },
            }}
            config={PLOTLY_CONFIG}
            style={{ width: "100%" }}
          />
        </ChartCard>
      </div>

      {/* Discount uplift */}
      <ChartCard
        title="Discount Effect on Conversion — By Channel"
        method="IPTW causal inference (controls for selection bias: reps offer discounts to harder leads). Raw causal ATE = −0.9pp. Chi-Square: discount flag × conversion, p=0.917 (no raw correlation)."
        insight="Discounts help for Influencer (+5.1pp) and Affiliate (+4.9pp) channels. They actively hurt Search (−7.0pp), Display (−5.7pp), and Paid Social (−2.8pp). Do not deploy blanket discount strategies — channel matters enormously."
      >
        <Plot
          data={[{
            type: "bar",
            x: discChannels,
            y: discUplift,
            marker: {
              color: discUplift.map((u) => u >= 0 ? CHART_COLORS[1] : CHART_COLORS[3]),
            },
            hovertemplate: "<b>%{x}</b><br>Uplift: %{y:+.1f}pp<extra></extra>",
          }]}
          layout={{
            ...PLOTLY_DARK_LAYOUT,
            height: 260,
            xaxis: { ...PLOTLY_DARK_LAYOUT.xaxis, tickangle: -15 },
            yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis, title: "Conversion Rate Uplift (pp)", zeroline: true, zerolinewidth: 2, zerolinecolor: "#475569" },
          }}
          config={PLOTLY_CONFIG}
          style={{ width: "100%" }}
        />
      </ChartCard>

      {/* SLR table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
        <div>
          <h3 className="text-base font-semibold text-white">Simple Linear Regressions (8 Models)</h3>
          <p className="text-xs text-slate-400 mt-0.5">Each model tests a single business hypothesis — does X predict Y?</p>
        </div>
        <MethodBox>
          SLR was used to test directional hypotheses (e.g., "does more time on site lead to more conversions?").
          R² measures how much variance the predictor explains. Low R² with significant p-value means
          there is a real but weak linear relationship — other factors dominate.
        </MethodBox>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                {["Hypothesis", "n", "Slope", "R²", "p-value", "Significant"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLR_RESULTS.map((r, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-900/40">
                  <td className="px-4 py-3 text-slate-300">{r.model}</td>
                  <td className="px-4 py-3 text-slate-400">{r.n.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{r.slope > 0 ? "+" : ""}{r.slope.toFixed(4)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{r.r2.toFixed(4)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{r.pValue < 0.001 ? "<0.001" : r.pValue.toFixed(3)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${r.significant ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-700 text-slate-400"}`}>
                      {r.significant ? "✓ Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <InsightBox>
          Pages Viewed → Add-to-Cart (R²=0.054, p&lt;0.001) is the strongest SLR signal: more content consumption = stronger purchase intent.
          Discount % → Revenue is negative (slope = −0.50): higher discounts reduce transaction value. Both confirm that engagement quality
          matters more than promotional incentives.
        </InsightBox>
      </div>

      {/* Loyalty tier LTV */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
        <h3 className="text-base font-semibold text-white">LTV by Loyalty Tier</h3>
        <p className="text-xs text-slate-400">One-Way ANOVA: F=6.754, p=0.0002 *** · Kruskal-Wallis: H=25.29, p&lt;0.0001 *** — LTV differences are statistically significant</p>
        <MethodBox>
          Both parametric (ANOVA) and non-parametric (Kruskal-Wallis) tests were run because LTV is right-skewed.
          When both agree, we have strong confidence the differences are real, not driven by outliers.
          This validates that a tiered CRM investment strategy (spending more on Gold/Platinum) is statistically justified.
        </MethodBox>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {LOYALTY_TIERS.map((t) => (
            <div key={t.tier} className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 text-center">
              <p className="text-xs font-medium text-slate-400">{t.tier}</p>
              <p className="mt-1 text-2xl font-bold text-white">${t.avgLtv.toFixed(0)}</p>
              <p className="text-xs text-slate-500">Avg LTV · n={t.count}</p>
              <p className="text-xs text-slate-400 mt-1">AOV: ${t.avgAov.toFixed(0)}</p>
            </div>
          ))}
        </div>
        <InsightBox>
          Platinum tier LTV ($88.69) is 64% higher than Bronze ($54.07). The AOV gap ($69 vs $53) explains part of this.
          Invest in programs that migrate Bronze customers to Silver — loyalty upgrade campaigns can be justified by the $15.56 LTV gap.
        </InsightBox>
      </div>

      {/* Regional Analysis */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
        <div>
          <h3 className="text-base font-semibold text-white">Regional Performance Analysis</h3>
          <p className="text-xs text-slate-400 mt-0.5">Kruskal-Wallis: H=17.78, p=0.023 * — revenue differs significantly across regions</p>
        </div>
        <MethodBox>
          Regional breakdowns identify geographic concentration of value. Kruskal-Wallis confirms the revenue
          differences are not sampling noise. This surfaces targeting and media-buying opportunities in
          underperforming regions.
        </MethodBox>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Plot
            data={[
              { type: "bar", name: "Avg Revenue ($)", x: REGION_ANALYSIS.map((r) => r.region), y: REGION_ANALYSIS.map((r) => r.avgRevenue), marker: { color: CHART_COLORS[0] } },
              { type: "bar", name: "Avg LCR (%×100)", x: REGION_ANALYSIS.map((r) => r.region), y: REGION_ANALYSIS.map((r) => +(r.avgLcr * 100).toFixed(1)), marker: { color: CHART_COLORS[1] } },
            ]}
            layout={{
              ...PLOTLY_DARK_LAYOUT,
              height: 280,
              barmode: "group",
              xaxis: { ...PLOTLY_DARK_LAYOUT.xaxis, tickangle: -15 },
              yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis, title: "Value" },
              legend: { orientation: "h", y: 1.1 },
            }}
            config={PLOTLY_CONFIG}
            style={{ width: "100%" }}
          />
          <div className="space-y-2">
            {REGION_ANALYSIS.map((r) => (
              <div key={r.region} className="flex items-center justify-between rounded-lg bg-slate-800/40 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-slate-200">{r.region}</p>
                  <p className="text-xs text-slate-400">{r.customers.toLocaleString()} customers · LCR {(r.avgLcr * 100).toFixed(1)}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">${(r.totalRevenue / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-slate-400">Avg ${r.avgRevenue.toFixed(0)}</p>
                </div>
              </div>
            ))}
            <p className="text-xs text-slate-400 pt-1 border-t border-slate-800">South West leads on revenue ($56.5K) and LCR (39.7%). North West underperforms on both — investigate channel mix in that region.</p>
          </div>
        </div>
      </div>

      {/* Creative/Objective & Device */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
          <h3 className="text-base font-semibold text-white">Creative Type & Campaign Objective LCR</h3>
          <p className="text-xs text-slate-400">Chi-Square: Objective p=0.492 ns · Creative not formally tested — differences are small</p>
          <Plot
            data={[
              {
                type: "bar", name: "Creative Type", x: CREATIVE_TYPE.map((c) => c.type), y: CREATIVE_TYPE.map((c) => +(c.lcr * 100).toFixed(1)),
                marker: { color: CHART_COLORS[0] + "cc" },
              },
            ]}
            layout={{
              ...PLOTLY_DARK_LAYOUT,
              height: 240,
              xaxis: { ...PLOTLY_DARK_LAYOUT.xaxis, tickangle: -15 },
              yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis, title: "LCR (%)", range: [30, 40] },
              legend: { orientation: "h", y: 1.1 },
            }}
            config={PLOTLY_CONFIG}
            style={{ width: "100%" }}
          />
          <p className="text-xs text-slate-400 border-t border-slate-800 pt-2">
            <span className="font-medium text-slate-300">Insight: </span>
            Carousel (37.5%) and UGC (37.1%) outperform Testimonial (33.8%). No objective shows a statistically
            significant LCR advantage — Awareness and Lead Gen are virtually tied. Creative format matters more than campaign objective.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
          <h3 className="text-base font-semibold text-white">Device Analysis — Revenue & Engagement</h3>
          <p className="text-xs text-slate-400">Mann-Whitney: p=0.349 ns · Welch t: p=0.341 ns — no significant revenue difference between mobile and desktop</p>
          <Plot
            data={[
              { type: "bar", name: "Avg Revenue ($)", x: DEVICE_ANALYSIS.map((d) => d.device), y: DEVICE_ANALYSIS.map((d) => d.avgRevenue), marker: { color: CHART_COLORS[2] } },
              { type: "bar", name: "Customers", x: DEVICE_ANALYSIS.map((d) => d.device), y: DEVICE_ANALYSIS.map((d) => d.nCustomers), yaxis: "y2", marker: { color: CHART_COLORS[4] + "88" } },
            ]}
            layout={{
              ...PLOTLY_DARK_LAYOUT,
              height: 240,
              barmode: "group",
              yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis, title: "Avg Revenue ($)" },
              yaxis2: { title: "# Customers", overlaying: "y", side: "right", showgrid: false, tickfont: { color: "#94a3b8" } },
              legend: { orientation: "h", y: 1.1 },
            }}
            config={PLOTLY_CONFIG}
            style={{ width: "100%" }}
          />
          <p className="text-xs text-slate-400 border-t border-slate-800 pt-2">
            <span className="font-medium text-slate-300">Insight: </span>
            Mobile accounts for 68% of customers but generates 9.3% less avg revenue than desktop ($64.9 vs $71.5).
            The difference is not statistically significant — optimize for mobile UX but do not deprioritize desktop.
          </p>
        </div>
      </div>

      {/* SLR Panel image + Bootstrap */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">SLR Results Panel (8 Models)</h3>
          <p className="text-xs text-slate-400">Visual output of all 8 simple linear regressions run across this phase</p>
          <img src="/outputs/slr_panel.png" alt="SLR Panel" className="w-full rounded-lg" style={{ objectFit: "contain" }} />
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">Bootstrap Confidence Intervals</h3>
          <p className="text-xs text-slate-400">AOV: $58.87 (95% CI: $54.67–$63.85) · ROAS: 0.23 (95% CI: 0.17–0.30)</p>
          <div className="grid grid-cols-2 gap-2">
            <img src="/outputs/bootstrap_aov.png" alt="Bootstrap AOV CI" className="w-full rounded-lg" />
            <img src="/outputs/bootstrap_roas.png" alt="Bootstrap ROAS CI" className="w-full rounded-lg" />
          </div>
          <p className="text-xs text-slate-400">Bootstrap with 1,000 iterations confirms our KPI point estimates are stable. The wide ROAS CI (0.17–0.30) reflects genuine campaign variance, not measurement error.</p>
        </div>
      </div>

      {/* Intent signals image */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
        <h3 className="text-sm font-semibold text-white">Digital Intent Signals — Correlation with Purchase</h3>
        <p className="text-xs text-slate-400">Pages viewed → add-to-cart: r=0.233, R²=0.054, p&lt;0.001 ✓ · All other session signals: not significant</p>
        <img src="/outputs/intent_signals.png" alt="Intent Signals" className="w-full rounded-lg max-h-80 object-contain" />
        <p className="text-xs text-slate-400 border-t border-slate-800 pt-2">
          <span className="font-medium text-slate-300">Key finding: </span>
          Only pages viewed has a statistically significant relationship with purchase intent (via add-to-cart).
          Time on site, add-to-cart count, and checkout-started count are NOT significant predictors on their own.
          Content breadth matters more than time spent — optimize for content discovery, not session duration.
        </p>
      </div>

      {/* Landing page & days to convert */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
          <h3 className="text-base font-semibold text-white">Landing Page Conversion Rates</h3>
          <p className="text-xs text-slate-400">Chi-Square: χ²=10.22, df=5, p=0.069 — no statistically significant difference across pages</p>
          <Plot
            data={[{
              type: "bar",
              x: LANDING_PAGE_LCR.map((l) => l.page),
              y: LANDING_PAGE_LCR.map((l) => (l.lcr * 100).toFixed(1)).map(Number),
              marker: { color: CHART_COLORS[0] },
              hovertemplate: "<b>%{x}</b><br>LCR: %{y:.1f}%<extra></extra>",
            }]}
            layout={{
              ...PLOTLY_DARK_LAYOUT,
              height: 250,
              xaxis: { ...PLOTLY_DARK_LAYOUT.xaxis, tickangle: -20 },
              yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis, title: "Lead Conv. Rate (%)", range: [30, 42] },
            }}
            config={PLOTLY_CONFIG}
            style={{ width: "100%" }}
          />
          <p className="text-xs text-slate-400 border-t border-slate-800 pt-2">
            <span className="font-medium text-slate-300">Insight: </span>
            /landing-b leads at 39.6% vs /promo-summer at 33.6%, but the difference is not statistically significant (p=0.069).
            Do not redesign pages based on this data alone — run an A/B test with higher traffic to confirm.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
          <h3 className="text-base font-semibold text-white">Days to Convert by Channel</h3>
          <p className="text-xs text-slate-400">Kruskal-Wallis: H=3.635, p=0.726 — no significant difference. All channels convert in ~15 days.</p>
          <Plot
            data={[{
              type: "bar",
              x: DAYS_TO_CONVERT.map((d) => d.channel),
              y: DAYS_TO_CONVERT.map((d) => d.meanDays),
              marker: { color: CHART_COLORS[4] },
              hovertemplate: "<b>%{x}</b><br>Mean days: %{y:.1f}<extra></extra>",
            }]}
            layout={{
              ...PLOTLY_DARK_LAYOUT,
              height: 250,
              xaxis: { ...PLOTLY_DARK_LAYOUT.xaxis, tickangle: -20 },
              yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis, title: "Mean Days to Convert", range: [13, 18] },
            }}
            config={PLOTLY_CONFIG}
            style={{ width: "100%" }}
          />
          <p className="text-xs text-slate-400 border-t border-slate-800 pt-2">
            <span className="font-medium text-slate-300">Insight: </span>
            Every channel takes ~15 days from lead to conversion. Do not cut campaigns before day 15 expecting
            to save cost — you are likely cutting leads that are still in their conversion window.
          </p>
        </div>
      </div>
    </div>
  );
}
