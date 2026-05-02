// @ts-nocheck
"use client";
import dynamic from "next/dynamic";
import { Users, AlertTriangle, TrendingUp } from "lucide-react";
import { SEGMENTS, RFM_TIERS, DISCOUNT_UPLIFT_TIER } from "@/lib/data";
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

const PERSONA_STRATEGIES = [
  {
    name: "Champions",
    n: 18,
    revenue: "$1,347",
    orders: "2.1",
    sessions: "7.6",
    color: "amber",
    badge: "bg-amber-500/20 text-amber-300",
    strategy: "Price-insensitive VIP buyers. Launch exclusive loyalty program, early product access, personal account managers. NEVER deep-discount this group — it devalues the relationship.",
    risk: "6 Champions are NOT opted into email. Losing one is a material revenue risk.",
    action: "Contact the 6 non-email Champions via alternative channels this week.",
  },
  {
    name: "Core Buyers",
    n: 532,
    revenue: "$147",
    orders: "2.9",
    sessions: "7.5",
    color: "blue",
    badge: "bg-blue-500/20 text-blue-300",
    strategy: "Regular purchasers with solid AOV. Ideal for upsell and subscription programs. Target with bundle recommendations and loyalty upgrades (Bronze → Silver).",
    risk: "May drift to Dormant if order cadence drops. Monitor recency.",
    action: "Launch 'Complete Your Set' bundle recommendations at checkout.",
  },
  {
    name: "Engaged Browsers",
    n: 784,
    revenue: "$38",
    orders: "0.77",
    sessions: "10.3",
    color: "emerald",
    badge: "bg-emerald-500/20 text-emerald-300",
    strategy: "High intent (4.7 add-to-cart avg) but low conversion. Checkout friction is the blocker. Use: exit-intent popups, 1-hour abandoned cart email, single-page checkout.",
    risk: "Will become Dormant if not converted soon — urgency matters.",
    action: "Implement abandoned-cart trigger for this segment immediately.",
  },
  {
    name: "Dormant / At Risk",
    n: 1066,
    revenue: "$26",
    orders: "0.55",
    sessions: "6.3",
    color: "rose",
    badge: "bg-rose-500/20 text-rose-300",
    strategy: "Low engagement, low revenue. 3-touch win-back email sequence only. If no response after 30 days, suppress from paid acquisition targeting to avoid wasted spend.",
    risk: "Largest segment. Heavy spend here has poor ROI.",
    action: "Suppress from paid retargeting. Email win-back only.",
  },
];

export default function SegmentationPage() {
  const segNames = SEGMENTS.map((s) => s.name);
  const segRevenue = SEGMENTS.map((s) => s.totalRevenue);
  const segCounts = SEGMENTS.map((s) => s.nCustomers);
  const segColors = SEGMENTS.map((s) => s.color);
  const segSessions = SEGMENTS.map((s) => s.avgSessions);
  const segCart = SEGMENTS.map((s) => s.avgAddToCart);
  const segOrders = SEGMENTS.map((s) => s.avgOrders);

  const rfmNames = RFM_TIERS.filter((r) => r.avgRevenue > 0).map((r) => r.tier);
  const rfmAvgRev = RFM_TIERS.filter((r) => r.avgRevenue > 0).map((r) => r.avgRevenue);
  const rfmCounts = RFM_TIERS.filter((r) => r.count > 0).map((r) => r.count);
  const rfmCountNames = RFM_TIERS.map((r) => r.tier);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
          <Users className="h-6 w-6 text-violet-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Customer Segmentation</h1>
          <p className="mt-1 text-sm text-slate-400">Phase 3 — Who are our customers and how differently do they behave?</p>
        </div>
      </div>

      <MethodBox>
        K-Means clustering was applied to behavioral and transactional features (revenue, sessions, add-to-cart,
        checkout started, lead count). The optimal cluster count k=4 was selected by maximizing the silhouette
        score (0.194) and inspecting the elbow curve. Silhouette &gt;0.2 = acceptable separation.
        Segment revenue differences were validated with One-Way ANOVA (F=3,669, p&lt;0.0001) and
        Kruskal-Wallis (H=1,044, p&lt;0.0001) — confirming the clusters are statistically distinct, not arbitrary.
        An RFM model (Recency, Frequency, Monetary) was run independently as a cross-validation.
      </MethodBox>

      {/* KMeans validation + t-SNE */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">K-Means Validation: Elbow & Silhouette</h3>
          <p className="text-xs text-slate-400">Silhouette score peaks at k=4 (0.194). Elbow curve inflects at k=4. Both methods agree.</p>
          <img src="/outputs/kmeans_validation.png" alt="KMeans Validation" className="w-full rounded-lg" style={{ objectFit: "contain" }} />
          <p className="text-xs text-slate-400">Silhouette &gt; 0.15 = acceptable cluster separation. The elbow curve drop from k=3→4 confirms meaningful structure added by the 4th cluster.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">Segment Scatter — Behavioral Topology</h3>
          <p className="text-xs text-slate-400">2D projection of customer clusters by revenue vs. add-to-cart behavior</p>
          <img src="/outputs/segment_scatter.png" alt="Segment Scatter" className="w-full rounded-lg" style={{ objectFit: "contain" }} />
          <p className="text-xs text-slate-400">Champions are clearly separated in the revenue dimension. Engaged Browsers form a distinct high-cart / low-revenue cluster confirming the checkout friction hypothesis.</p>
        </div>
      </div>

      {/* t-SNE visualization */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
        <h3 className="text-sm font-semibold text-white">t-SNE Segment Topology — High-Dimensional Cluster Visualization</h3>
        <p className="text-xs text-slate-400">t-SNE reduces all behavioral features to 2D for visual cluster validation — confirms K-Means segments are geometrically distinct</p>
        <img src="/outputs/segment_tsne.png" alt="t-SNE Segment Topology" className="w-full rounded-lg max-h-96 object-contain" />
        <p className="text-xs text-slate-400 border-t border-slate-800 pt-2">
          <span className="font-medium text-slate-300">Why t-SNE: </span>
          K-Means operates in high-dimensional space. t-SNE projects onto 2D while preserving local neighborhood structure.
          Well-separated clusters in t-SNE space confirm the segments are genuinely distinct — not artifacts of the clustering algorithm.
        </p>
      </div>

      {/* Segment overview charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">Total Revenue by Segment</h3>
          <p className="text-xs text-slate-400">Gini coefficient = 0.673 — revenue is highly concentrated in top customers</p>
          <Plot
            data={[{
              type: "pie",
              labels: segNames,
              values: segRevenue,
              hole: 0.45,
              marker: { colors: segColors },
              textinfo: "label+percent",
              textfont: { size: 10 },
              hovertemplate: "<b>%{label}</b><br>Revenue: $%{value:,.0f}<br>%{percent}<extra></extra>",
            }]}
            layout={{
              ...PLOTLY_DARK_LAYOUT,
              height: 280,
              margin: { t: 10, r: 10, b: 30, l: 10 },
              showlegend: false,
            }}
            config={PLOTLY_CONFIG}
            style={{ width: "100%" }}
          />
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">Segment Behavioral Profiles</h3>
          <p className="text-xs text-slate-400">Avg Sessions, Add-to-Cart, Orders per customer — who engages vs. who buys</p>
          <Plot
            data={[
              { type: "bar", name: "Avg Sessions", x: segNames, y: segSessions, marker: { color: CHART_COLORS[0] } },
              { type: "bar", name: "Avg Add-to-Cart", x: segNames, y: segCart, marker: { color: CHART_COLORS[1] } },
              { type: "bar", name: "Avg Orders", x: segNames, y: segOrders, marker: { color: CHART_COLORS[2] } },
            ]}
            layout={{
              ...PLOTLY_DARK_LAYOUT,
              height: 280,
              barmode: "group",
              xaxis: { ...PLOTLY_DARK_LAYOUT.xaxis, tickangle: -10 },
              yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis, title: "Average per Customer" },
              legend: { orientation: "h", y: 1.1 },
            }}
            config={PLOTLY_CONFIG}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* Gini-Lorenz + Acq Cost vs CLV */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">Gini-Lorenz Curve — Revenue Inequality</h3>
          <p className="text-xs text-slate-400">Gini = 0.673 · The 45° diagonal = perfect equality. The larger the gap, the more concentrated revenue is.</p>
          <img src="/outputs/gini_lorenz.png" alt="Gini-Lorenz Curve" className="w-full rounded-lg" style={{ objectFit: "contain" }} />
          <p className="text-xs text-slate-400">18 Champion customers (0.75% of base) generate revenue equal to the bottom 1,000. Protecting this group delivers 37× more value per customer than acquiring new Bronze customers.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">Acquisition Cost vs. Projected CLV Matrix</h3>
          <p className="text-xs text-slate-400">14.2% of acquired customers have projected 6m CLV lower than their acquisition cost</p>
          <img src="/outputs/acq_cost_clv_matrix.png" alt="Acquisition Cost vs CLV Matrix" className="w-full rounded-lg" style={{ objectFit: "contain" }} />
          <p className="text-xs text-slate-400">Points below the 1:1 diagonal are loss-making acquisitions. Paid Search campaigns account for 65% of these — high CPA ($39.22) is not being offset by proportionally higher LTV.</p>
        </div>
      </div>

      {/* Key concentration insight */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="font-semibold text-amber-300">Revenue Concentration: Gini = 0.673</p>
            <p className="mt-1 text-sm text-amber-200/80">
              18 Champion customers generate $24,243 in total revenue — more than the bottom 1,000 customers combined ($676).
              The Lorenz curve confirms extreme inequality (0 = perfect equality, 1 = max inequality).
              This means protecting existing high-value customers is more important than acquiring new low-quality ones.
              <strong className="text-amber-300"> Churn prevention for Champions has a 37× revenue-per-customer ROI advantage over acquiring new Bronze customers.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Persona cards */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Segment Personas & Strategies</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {PERSONA_STRATEGIES.map((p) => (
            <div key={p.name} className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${p.badge}`}>{p.name}</span>
                <span className="text-sm text-slate-400">{p.n.toLocaleString()} customers</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-slate-800/60 px-2 py-2">
                  <p className="text-xs text-slate-400">Avg Revenue</p>
                  <p className="font-bold text-white">{p.revenue}</p>
                </div>
                <div className="rounded-lg bg-slate-800/60 px-2 py-2">
                  <p className="text-xs text-slate-400">Avg Orders</p>
                  <p className="font-bold text-white">{p.orders}</p>
                </div>
                <div className="rounded-lg bg-slate-800/60 px-2 py-2">
                  <p className="text-xs text-slate-400">Avg Sessions</p>
                  <p className="font-bold text-white">{p.sessions}</p>
                </div>
              </div>
              <div className="rounded-lg bg-slate-800/40 p-3 text-sm text-slate-300 leading-relaxed">
                <strong className="text-slate-200">Strategy: </strong>{p.strategy}
              </div>
              <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-xs text-rose-300">
                <strong>Risk: </strong>{p.risk}
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-300">
                <strong>Action: </strong>{p.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RFM */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
        <div>
          <h3 className="text-base font-semibold text-white">RFM Analysis — Independent Validation</h3>
          <p className="text-xs text-slate-400 mt-0.5">Recency · Frequency · Monetary scoring, run independently of K-Means to cross-validate segment quality</p>
        </div>
        <MethodBox>
          RFM scores rank customers on three dimensions: how recently they purchased, how often, and how much.
          Customers scoring high on all three are "Champions" in RFM terminology. Running RFM alongside
          K-Means provides triangulation — if both methods flag the same customers as high-value, confidence
          is higher. RFM is also interpretable by non-technical teams.
        </MethodBox>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {RFM_TIERS.map((r) => (
            <div key={r.tier} className="rounded-xl border border-slate-800 bg-slate-800/40 p-3 text-center">
              <p className="text-xs font-medium text-slate-400">{r.tier}</p>
              <p className="mt-1 text-xl font-bold text-white">{r.count.toLocaleString()}</p>
              <p className="text-xs text-slate-500">customers</p>
              <p className="mt-1 text-xs text-slate-400">${r.avgRevenue.toFixed(0)} avg rev</p>
            </div>
          ))}
        </div>
        <InsightBox>
          365 RFM Champions average $154 revenue each — consistent with the K-Means Champions ($1,347 total,
          but these are lifetime high-value not necessarily the same 18 extreme outliers). 339 "At Risk"
          customers ($136 avg revenue) represent a significant winback opportunity if contacted before they go cold.
          The 924 "No Orders" customers are pure acquisition cost with no realized return.
        </InsightBox>
      </div>

      {/* Discount by tier */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
        <h3 className="text-base font-semibold text-white">Discount Uplift by Loyalty Tier</h3>
        <p className="text-xs text-slate-400">Does discounting help or hurt conversion, per tier?</p>
        <Plot
          data={[{
            type: "bar",
            x: DISCOUNT_UPLIFT_TIER.map((d) => d.tier),
            y: DISCOUNT_UPLIFT_TIER.map((d) => d.uplift),
            marker: {
              color: DISCOUNT_UPLIFT_TIER.map((d) => d.uplift >= 0 ? CHART_COLORS[1] : CHART_COLORS[3]),
            },
            text: DISCOUNT_UPLIFT_TIER.map((d) => `${d.uplift > 0 ? "+" : ""}${d.uplift.toFixed(1)}pp`),
            textposition: "outside",
            hovertemplate: "<b>%{x}</b><br>Uplift: %{y:+.1f}pp<extra></extra>",
          }]}
          layout={{
            ...PLOTLY_DARK_LAYOUT,
            height: 250,
            yaxis: { ...PLOTLY_DARK_LAYOUT.yaxis, title: "Conversion Rate Uplift (pp)", zeroline: true, zerolinewidth: 2 },
          }}
          config={PLOTLY_CONFIG}
          style={{ width: "100%" }}
        />
        <InsightBox>
          Silver (+3.4pp) and Platinum (+1.5pp) tiers respond positively to discounts. Bronze and Gold tiers show
          negative discount uplift — offering discounts to Gold customers actually reduces their conversion probability.
          This may be because Gold customers have already decided to buy; a discount introduces unnecessary friction or
          signals that the brand is not premium enough for them.
        </InsightBox>
      </div>
    </div>
  );
}
