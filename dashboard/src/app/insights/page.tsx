"use client";
import { Lightbulb, CheckCircle2, Clock, TrendingUp, DollarSign, Users, Target, AlertTriangle } from "lucide-react";

function PriorityBadge({ p }: { p: string }) {
  if (p === "critical") return <span className="inline-block rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-medium text-rose-400">🔴 Critical</span>;
  if (p === "high") return <span className="inline-block rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">🟠 High</span>;
  return <span className="inline-block rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">🟡 Medium</span>;
}

const THEMES = [
  {
    id: 1,
    icon: DollarSign,
    iconColor: "text-rose-400",
    iconBg: "bg-rose-500/10",
    title: "Budget Allocation is Structurally Broken",
    priority: "critical",
    why: "The raw campaign data showed wide variance in spend across channels. We hypothesized that money was not going to channels generating the most valuable customers. A composite score model (35% ROAS · 25% LCR · 25% LTV · 15% Repeat Rate) was built to rank channels on downstream value, not surface metrics. Kruskal-Wallis confirmed LTV differs significantly across channels (H=20.39, p=0.040).",
    findings: [
      "Affiliate consumes 42.7% of budget ($1.12M) but has the lowest ROAS (0.11) and below-average LTV ($65)",
      "Display acquires customers with the highest avg LTV ($87) at only 5.5% of budget",
      "Paid Search composite score = 0.726 (highest) vs Affiliate = 0.276 (lowest)",
    ],
    recommendations: [
      "Reduce Affiliate from 42.7% → 9.4% (−33pp). Enforce $70 minimum 90-day LTV per affiliate partner.",
      "Reinvest into Paid Search (+15pp), organic Search (+12pp), Display (+12pp)",
      "Do not eliminate Affiliate entirely — its repeat rate (0.34) is above channel average",
    ],
  },
  {
    id: 2,
    icon: AlertTriangle,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    title: "Campaign Quality vs. Surface Efficiency",
    priority: "high",
    why: "ROAS measures immediate return but not whether campaigns attract repeat buyers. K-Means (k=2, silhouette=0.622) clustered campaigns, then we cross-tabulated cluster membership against 90-day customer repeat rate. Campaigns with above-median ROAS but below-median repeat rate were flagged as 'Deceptively Efficient' — they flatter short-term P&L while degrading CLV.",
    findings: [
      "8 campaigns flagged as Deceptively Efficient — primarily Paid Social (5) and Email (2)",
      "MKT2021 is a critical spend anomaly: $999,999 spent, ROAS = 0.009, CPA = $21,277",
      "14% of campaigns show CTR decay after day 14 — creative fatigue",
    ],
    recommendations: [
      "Audit MKT2021 immediately — data error or catastrophically misrun campaign",
      "Add repeat_rate and 90-day LTV as mandatory KPIs alongside ROAS in campaign dashboards",
      "Implement 14-day creative rotation rule for all social campaigns",
    ],
  },
  {
    id: 3,
    icon: Users,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
    title: "Customer Segmentation — Where the Money Lives",
    priority: "critical",
    why: "K-Means (k=4, silhouette=0.194) identified 4 behaviorally distinct segments. Differences were validated with ANOVA (F=3,669, p<0.0001) and Kruskal-Wallis (H=1,044, p<0.0001). The Gini coefficient (0.673) quantified revenue inequality. An independent RFM model cross-validated segment quality.",
    findings: [
      "18 Champions generate $24K revenue — more than the bottom 1,000 customers combined ($676)",
      "Gini = 0.673: extreme concentration means top-customer protection is the #1 retention priority",
      "784 Engaged Browsers average 4.7 add-to-cart events but only $38 revenue — checkout friction is the blocker",
      "6 Champions are NOT opted into email — critical CRM gap",
    ],
    recommendations: [
      "Launch VIP program for Champions: personal manager, early access, exclusive bundles. Never discount.",
      "Implement 1-hour abandoned cart email for Engaged Browsers (estimated uplift: $11–17K)",
      "Contact the 6 non-email Champions via SMS or loyalty portal this week",
      "3-touch email win-back for Dormant segment; suppress from paid retargeting after 30 days",
    ],
  },
  {
    id: 4,
    icon: Target,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    title: "Lead Conversion & The Discount Myth",
    priority: "high",
    why: "5-model comparison with 5-fold stratified CV AUC identified the best lead scoring model. IPTW causal inference (not raw correlation) was used for discount analysis because reps offer discounts to harder leads, confounding the naive correlation. Pre-model hypothesis tests validated feature relevance before training.",
    findings: [
      "Lead score is the single strongest conversion predictor (importance = 0.129)",
      "Optimal classification threshold: 0.17 (not default 0.50) — minimizes cost at $4,010/cycle",
      "IPTW causal ATE: discounts reduce conversion probability by 0.9pp",
      "Discount uplift varies: Influencer +5.1pp vs Search −7.0pp — channel matters enormously",
    ],
    recommendations: [
      "Prioritize 1,430 High-tier leads with immediate human follow-up; automate Low-tier",
      "Retire blanket discount offers. Use discounts only for Influencer/Affiliate channels and Silver/Platinum tiers",
      "Integrate lead scoring model into CRM — every new lead gets a priority_tier tag",
    ],
  },
  {
    id: 5,
    icon: TrendingUp,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    title: "Product & Return Rate Strategy",
    priority: "medium",
    why: "Product category performance was absent from prior reporting — all revenue was aggregated at the customer level. We decomposed transactions by category (normalized from 9 raw variants to 6) to identify which products drive revenue vs. loyalty vs. returns. Return rates by channel detect whether certain acquisition sources attract mismatched buyers.",
    findings: [
      "Baby: highest revenue ($39.9K), lowest return rate (7%) — hero category",
      "Personal Care: highest first-purchase repeat rate (58%) — the loyalty gateway category",
      "Beverages: lowest revenue ($14.3K), lowest avg price ($33) — strategic review needed",
      "Influencer acquisitions have the lowest return rate (6.6%); Email has the highest (8.9%)",
    ],
    recommendations: [
      "Use Personal Care as the first-order acquisition vehicle — 58% of first-time Personal Care buyers return",
      "Cross-sell Baby products in post-purchase flows (highest AOV, lowest returns)",
      "Review Beverages: premiumize range or reduce marketing investment",
      "For Email: add 360° product imagery and accurate size guides to reduce returns",
    ],
  },
  {
    id: 6,
    icon: TrendingUp,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    title: "Retention & Predicted CLV",
    priority: "high",
    why: "Kaplan-Meier survival analysis (borrowed from clinical trial methodology) estimated the time-to-second-purchase distribution. This revealed the retention crisis: median time to second purchase is infinite. The 90-day retention model (Gradient Boosting, CV AUC=0.746) identifies customers at risk before they churn. MLR confirmed AOV as the dominant LTV predictor (R²=0.851).",
    findings: [
      "Only 24.2% of customers repeat within 90 days — Kaplan-Meier shows median time to 2nd purchase is effectively ∞",
      "Repeating customers spend $154 vs $93 for non-repeaters (Mann-Whitney p<0.0001)",
      "High acquisition cost + low first-order revenue = the strongest churn predictor",
      "AOV dominates LTV prediction (MLR R²=0.851) — first basket size is the key lever",
    ],
    recommendations: [
      "Any customer with no second order after 45 days enters automated win-back (not 90)",
      "Maximize first-order basket size through 'starter kit' bundles — AOV drives LTV",
      "Flag customers with acquisition cost >$45 + first order <$50 for CRM priority follow-up",
      "Rank all customers by projected 6m CLV; invest CRM budget proportionally (top decile: $261+)",
    ],
  },
];

const ACTIONS_30 = [
  "Identify and contact 6 Champion customers not on email list",
  "Audit MKT2021 ($999,999 spend, ROAS = 0.009) — data error or real?",
  "Implement 1-hour abandoned cart email for 784 Engaged Browsers",
  "Tag all leads with priority_tier in CRM using model output",
];

const ACTIONS_60 = [
  "Begin Affiliate budget reduction: cap at 30% (from 42.7%)",
  "Launch Paid Search test campaigns with incremental reallocation funds",
  "Add repeat_rate + 90-day LTV as mandatory campaign KPIs",
  "Set 45-day re-engagement trigger for no-second-order customers",
];

const ACTIONS_90 = [
  "Launch Personal Care first-purchase funnel (highest repeat gateway)",
  "Pilot VIP program for Champions segment",
  "Complete budget reallocation to target distribution",
  "Review Beverages category positioning — premiumize or de-emphasize",
];

export default function InsightsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10">
          <Lightbulb className="h-6 w-6 text-yellow-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Business Insights & Recommendations</h1>
          <p className="mt-1 text-sm text-slate-400">Synthesized findings from all 8 analytical phases — with methodology justification for each</p>
        </div>
      </div>

      {/* Summary table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80">
              {["Priority", "Theme", "Key Finding", "Expected Impact"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { p: "critical", theme: "Budget Reallocation", finding: "Affiliate takes 42.7% of spend but delivers worst ROAS + LTV", impact: "Reallocate 33pp → Paid Search / Display" },
              { p: "critical", theme: "Engaged Browser Conversion", finding: "784 customers browse & cart but never buy", impact: "Retargeting campaign unlocks $11–17K revenue" },
              { p: "high", theme: "Champion Retention", finding: "18 Champions drive $24K revenue; 6 not on email", impact: "VIP program + CRM fix required immediately" },
              { p: "high", theme: "Discount Strategy", finding: "Discounts causally hurt conversion (−0.9pp)", impact: "Eliminate blanket discounting; use selectively" },
              { p: "medium", theme: "Category Portfolio", finding: "Baby leads revenue; Personal Care leads loyalty", impact: "Category-specific cross-sell strategy" },
              { p: "high", theme: "Retention Crisis", finding: "Only 24.2% repeat in 90 days; median 2nd purchase = ∞", impact: "45-day win-back trigger + starter kit bundles" },
            ].map((r, i) => (
              <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-900/40">
                <td className="px-4 py-3"><PriorityBadge p={r.p} /></td>
                <td className="px-4 py-3 font-medium text-slate-300">{r.theme}</td>
                <td className="px-4 py-3 text-slate-400">{r.finding}</td>
                <td className="px-4 py-3 text-slate-300">{r.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Theme deep dives */}
      {THEMES.map((theme) => (
        <div key={theme.id} className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${theme.iconBg}`}>
              <theme.icon className={`h-5 w-5 ${theme.iconColor}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-white">{theme.id}. {theme.title}</h2>
                <PriorityBadge p={theme.priority} />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-sm text-blue-200 leading-relaxed">
            <span className="font-semibold text-blue-400">Why we ran this analysis: </span>{theme.why}
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Key Findings</p>
              <ul className="space-y-1.5">
                {theme.findings.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Recommendations</p>
              <ul className="space-y-1.5">
                {theme.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}

      {/* Action checklist */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-400" /> Priority Action Checklist
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {[
            { period: "Next 30 Days", color: "rose", actions: ACTIONS_30 },
            { period: "Next 60 Days", color: "amber", actions: ACTIONS_60 },
            { period: "Next 90 Days", color: "emerald", actions: ACTIONS_90 },
          ].map((block) => (
            <div key={block.period}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${block.color === "rose" ? "text-rose-400" : block.color === "amber" ? "text-amber-400" : "text-emerald-400"}`}>
                {block.period}
              </p>
              <ul className="space-y-2">
                {block.actions.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-xs font-bold ${block.color === "rose" ? "bg-rose-500/20 text-rose-400" : block.color === "amber" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                      {i + 1}
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
