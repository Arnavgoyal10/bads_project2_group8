"use client";
import { FileText, Download } from "lucide-react";

const MEMO_CONTENT = `# NovaMart Marketing Analytics — CMO Memo

> **Audience**: CMO, Head of Growth, Analytics Team
> **Scope**: Full 2024–2025 dataset · 2,400 customers · 39 campaigns · 2,808 leads · 2,808 transactions

---

## Executive Summary

NovaMart's marketing machine is generating leads efficiently on paper — but is systematically misallocating budget, over-relying on a single low-quality channel (affiliate), and leaving its most valuable customers under-served. Simultaneously, a large pool of digitally engaged but unconverted shoppers represents the single largest near-term revenue opportunity.

**Top 5 Findings:**

1. **Budget crisis**: Affiliate consumes 42.7% of spend ($1.12M) but has the worst ROAS (0.11) and below-average LTV ($65). Display acquires customers with the highest LTV ($87) at only 5.5% of budget.
2. **Revenue concentration**: 18 Champion customers generate more revenue ($24K) than the bottom 1,000 customers combined ($676). Gini coefficient = 0.673.
3. **Discount myth**: IPTW causal analysis proves discounts causally reduce conversion by 0.9pp. Discounts are a symptom of difficult leads, not a cure.
4. **Retention crisis**: Only 24.2% of customers repeat within 90 days. Kaplan-Meier survival analysis shows median time to second purchase is effectively infinite.
5. **Engagement-to-revenue gap**: 784 customers average 4.7 add-to-cart events but only $38 in revenue. A checkout friction fix could unlock $11–17K immediately.

---

## Theme 1: Budget Allocation Is Structurally Broken

**Why we ran this**: Channel spend data showed extreme variance. A composite scoring model (35% ROAS · 25% LCR · 25% LTV · 15% Repeat Rate) ranked channels on downstream value. Kruskal-Wallis confirmed LTV differences are statistically significant (H=20.39, p=0.040).

| Channel | Current % | Recommended % | Shift | Avg LTV | ROAS |
|---------|-----------|---------------|-------|---------|------|
| Paid Search | 9.9% | 24.8% | **+14.9pp** | $66.55 | 0.36 |
| Search | 5.9% | 18.4% | **+12.5pp** | $74.84 | 0.22 |
| Display | 5.5% | 17.1% | **+11.6pp** | $87.21 | 0.17 |
| Email | 12.9% | 13.7% | +0.8pp | $59.28 | 0.15 |
| Paid Social | 16.0% | 14.6% | −1.4pp | $67.93 | 0.25 |
| **Affiliate** | **42.7%** | **9.4%** | **−33.3pp** | $64.81 | 0.11 |
| Influencer | 7.2% | 2.0% | −5.2pp | $63.34 | 0.16 |

**Top 3 actions:**
- Reduce Affiliate from 42.7% to 9.4% over two quarters. Set minimum $70 LTV threshold for affiliate partners.
- Reinvest into Paid Search (+15pp) and Display (+12pp) — highest composite scores.
- Do not eliminate Affiliate entirely — its repeat rate (0.34) is above average.

---

## Theme 2: Campaign Quality vs. Surface Efficiency

**Why we ran this**: K-Means (k=2, silhouette=0.622) clustered campaigns. We cross-tabulated ROAS against 90-day repeat rate to find campaigns that look good short-term but fail long-term.

**8 campaigns flagged as Deceptively Efficient** (above-median ROAS, below-median repeat rate):
- MKT2013, MKT2006, MKT2031, MKT2000, MKT2017 (Paid Social) — ROAS 0.19–0.67, repeat rate 26–31%
- MKT2022, MKT2023 (Email) — ROAS 0.19–0.36, repeat rate 28–30%
- MKT2032 (Search) — ROAS 0.34, repeat rate 27%

**Critical anomaly**: MKT2021 spent $999,999 with ROAS 0.009 and CPA $21,277. Requires immediate audit.

**Top 3 actions:**
1. Audit MKT2021 — data error or real misrun?
2. Add repeat rate and 90-day LTV as mandatory campaign KPIs.
3. A/B test deceptive campaigns with loyalty-focused creative before re-running.

---

## Theme 3: Customer Segmentation

**Why we ran this**: K-Means (k=4, silhouette=0.194) on behavioral features, validated by ANOVA (F=3,669, p<0.0001). Gini = 0.673 quantified revenue inequality.

| Segment | Customers | Avg Revenue | Strategy |
|---------|-----------|-------------|---------|
| Champions | 18 | $1,347 | VIP program. Never discount. 6 not on email list — fix immediately. |
| Core Buyers | 532 | $147 | Upsell bundles, loyalty upgrade campaigns (Bronze → Silver). |
| Engaged Browsers | 784 | $38 | Exit-intent popup, 1-hour abandoned cart email, reduce checkout friction. |
| Dormant / At Risk | 1,066 | $26 | 3-touch win-back email; suppress from paid retargeting after 30 days. |

**Top 3 actions:**
1. Contact 6 Champion non-email customers via SMS or loyalty portal this week.
2. Implement 1-hour abandoned cart email for Engaged Browsers.
3. Suppress Dormant segment from paid retargeting.

---

## Theme 4: Lead Conversion & The Discount Myth

**Why we ran this**: 5-model comparison with 5-fold stratified CV AUC. IPTW causal inference for discount effect (corrects for reps offering discounts to harder leads).

**Best model**: Logistic Regression (CV AUC = 0.619, best precision/recall balance).
**Optimal threshold**: 0.17 (cost-optimized, not default 0.50). Total cost at optimal: $4,010/cycle.

**Lead pipeline:**
- High Priority: 1,430 leads (avg probability 77.9%) — human follow-up immediately
- Medium Priority: 773 leads (avg probability 45.7%) — CRM sequence
- Low Priority: 3,021 leads (avg probability 15.1%) — automated email only

**Discount findings:**
- IPTW causal ATE = −0.009 (discounts hurt conversion by 0.9pp)
- Discounts help: Influencer (+5.1pp), Affiliate (+4.9pp), Silver/Platinum tiers
- Discounts hurt: Search (−7.0pp), Display (−5.7pp), Paid Social (−2.8pp), Bronze/Gold tiers

**Top 3 actions:**
1. Retire blanket discount offers. Use discounts only for Influencer/Affiliate and Silver/Platinum.
2. Tag all leads with priority_tier in CRM.
3. Use threshold 0.17 for High-priority classification (not 0.50).

---

## Theme 5: Product & Return Rate Strategy

**Why we ran this**: Product category performance was absent from prior reporting. We decomposed transactions by category to find drivers of revenue, loyalty, and returns.

| Category | Total Revenue | Return Rate | First-Purchase Repeat Rate |
|----------|--------------|-------------|---------------------------|
| Baby | $39,903 | 7% | 52.4% |
| Personal Care | $26,873 | 8% | **58.0%** — highest |
| Beverages | $14,287 | 8% | 52.7% |

**Top 3 actions:**
1. Use Personal Care as first-order acquisition vehicle (highest repeat gateway).
2. Cross-sell Baby in post-purchase flows (highest AOV, lowest returns).
3. Review Beverages: premiumize or de-emphasize in marketing.

---

## Theme 6: Retention & Predicted CLV

**Why we ran this**: Kaplan-Meier survival analysis revealed the retention crisis: median time to second purchase is effectively infinite. Gradient Boosting retention model (CV AUC = 0.746) identifies at-risk customers. MLR confirmed AOV as the dominant LTV predictor (R²=0.851).

**Key numbers:**
- Base 90-day repeat rate: 24.2%
- Avg projected 6-month CLV: $141.28
- Top 10% CLV threshold: $260.78
- Repeaters spend $154 vs $93 for non-repeaters (Mann-Whitney p<0.0001)

**Top 3 actions:**
1. 45-day (not 90-day) win-back trigger for customers with no second order.
2. Launch starter kit bundles to maximize first-order AOV — dominant LTV predictor.
3. Rank customers by projected 6m CLV; invest CRM budget proportionally.

---

## Statistical Methodology Summary

| Analysis | Method | Why This Method |
|----------|--------|-----------------|
| Channel LTV comparison | Kruskal-Wallis | LTV is right-skewed; non-parametric is more robust |
| Segment validation | ANOVA + Kruskal-Wallis | Dual test confirms both parametric and non-parametric agree |
| Discount causal effect | IPTW | Corrects for selection bias (reps give discounts to harder leads) |
| Time to second purchase | Kaplan-Meier survival | Right-censored survival data — standard regression would be biased |
| Lead conversion model | 5-model CV AUC comparison | CV prevents overfitting; AUC handles class imbalance |
| LTV prediction | MLR train/test split | R²=0.851 on held-out test; AOV is dominant predictor |
| Budget allocation | Composite scoring (4 KPIs) | Blends short-term efficiency with long-term quality |
| Confidence intervals | Bootstrap (2,000 resamples) | No distributional assumption; works with skewed revenue data |
| LTV inequality | Gini coefficient | Standard inequality measure (0=equality, 1=max inequality) |

---

## Priority Action Checklist

**Next 30 Days:**
- ☐ Contact 6 Champion customers not on email list
- ☐ Audit MKT2021 ($999,999 spend, ROAS = 0.009)
- ☐ Implement 1-hour abandoned cart email for 784 Engaged Browsers
- ☐ Tag all leads with priority_tier in CRM

**Next 60 Days:**
- ☐ Begin Affiliate budget reduction: cap at 30% (from 42.7%)
- ☐ Launch Paid Search test campaigns with reallocated funds
- ☐ Add repeat_rate + 90-day LTV as mandatory campaign KPIs
- ☐ Set 45-day re-engagement trigger for no-second-order customers

**Next 90 Days:**
- ☐ Launch Personal Care first-purchase funnel
- ☐ Pilot VIP program for Champions segment
- ☐ Complete budget reallocation to target distribution
- ☐ Review Beverages category positioning

---

*NovaMart Analytics Pipeline v2.0 | Data period: 2024–2025 | Prepared by: Analytics Team*`;

function renderMemo(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-3xl font-bold text-white mt-6 mb-2">{line.slice(2)}</h1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl font-bold text-white mt-8 mb-3 border-b border-slate-800 pb-2">{line.slice(3)}</h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-base font-semibold text-slate-200 mt-5 mb-2">{line.slice(4)}</h3>
      );
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="border-l-2 border-blue-500 bg-blue-500/5 px-4 py-2 text-sm text-blue-200 my-3 rounded-r-lg italic">
          {line.slice(2)}
        </blockquote>
      );
    } else if (line.startsWith("---")) {
      elements.push(<hr key={i} className="border-slate-800 my-4" />);
    } else if (line.startsWith("| ")) {
      // Table
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const headers = tableLines[0].split("|").filter((c) => c.trim()).map((c) => c.trim());
      const rows = tableLines.slice(2).map((l) => l.split("|").filter((c) => c.trim()).map((c) => c.trim()));
      elements.push(
        <div key={`table-${i}`} className="my-4 overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                {headers.map((h, hi) => (
                  <th key={hi} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b border-slate-800/50 hover:bg-slate-900/40">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-slate-300" dangerouslySetInnerHTML={{ __html: cell.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-2 space-y-1 pl-4">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
              <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, "<strong class='text-slate-200'>$1</strong>") }} />
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-2 space-y-1 pl-4 list-decimal list-inside">
          {items.map((item, ii) => (
            <li key={ii} className="text-sm text-slate-300" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, "<strong class='text-slate-200'>$1</strong>") }} />
          ))}
        </ol>
      );
      continue;
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={i} className="text-sm font-semibold text-slate-200 mt-3 mb-1">{line.replace(/\*\*/g, "")}</p>
      );
    } else if (line.trim() !== "") {
      elements.push(
        <p key={i} className="text-sm text-slate-300 leading-relaxed my-1"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong class='text-slate-200'>$1</strong>") }} />
      );
    }
    i++;
  }

  return elements;
}

export default function MemoPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800">
            <FileText className="h-6 w-6 text-slate-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">CMO Decision Memo</h1>
            <p className="mt-1 text-sm text-slate-400">Full analysis narrative with findings, methodology, and recommendations</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">2024–2025 Data</span>
          <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-400">Analytics v2.0</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 lg:p-8">
        <div className="prose-custom">
          {renderMemo(MEMO_CONTENT)}
        </div>
      </div>
    </div>
  );
}
