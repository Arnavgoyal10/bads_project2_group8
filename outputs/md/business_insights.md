# NovaMart Marketing Analytics — Business Insights & Recommendations

> **Audience**: CMO, Head of Growth, Analytics Team  
> **Scope**: Full 2024–2025 dataset · 2,400 customers · 39 campaigns · 2,808 leads · 2,808 transactions

---

## Executive Summary

NovaMart's marketing machine is generating leads efficiently on paper — but is systematically misallocating budget, over-relying on a single low-quality channel (affiliate), and leaving its most valuable customers under-served. Simultaneously, a large pool of digitally engaged but unconverted shoppers represents the single largest near-term revenue opportunity. The analyses below provide statistically validated, directly actionable recommendations across five strategic themes.

| Priority | Theme | Key Finding | Expected Impact |
|----------|-------|------------|-----------------|
| 🔴 Critical | Budget Reallocation | Affiliate takes 42.7% of spend but delivers the worst ROAS + LTV | Reallocate 33pp → Paid Search / Display |
| 🔴 Critical | Engaged Browser Conversion | 784 customers browse & cart but never buy | Retargeting campaign could unlock ~$17K revenue |
| 🟠 High | Champion Retention | 18 Champions drive $24K revenue; 6 not on email list | CRM / VIP program required immediately |
| 🟠 High | Discount Strategy | Discounts causally hurt conversion rate (–0.9pp) | Eliminate blanket discounting; use selectively by channel |
| 🟡 Medium | Category Portfolio | Baby leads revenue; Personal Care leads loyalty | Category-specific cross-sell strategy |

---

## Theme 1: Budget Allocation Is Structurally Broken

### Why We Did This Analysis
The raw campaign data showed wide variance in spend across channels. The business question: *are we spending where we get the best customers, or just the most clicks?* A budget reallocation model was built using a composite score (35% ROAS · 25% Lead Conversion Rate · 25% Customer LTV · 15% Repeat Rate) to rank channels on downstream value, not surface metrics.

We also ran a **Kruskal-Wallis test** (non-parametric ANOVA alternative used because LTV is heavily right-skewed) to statistically confirm that LTV differs meaningfully across acquisition channels before making reallocation recommendations.

### What the Data Shows

| Channel | Current Budget % | Recommended % | Shift | Avg Customer LTV | ROAS |
|---------|-----------------|---------------|-------|------------------|------|
| Paid Search | 9.9% | 24.8% | **+14.9pp** | $66.55 | 0.36 |
| Search | 5.9% | 18.4% | **+12.5pp** | $74.84 | 0.22 |
| Display | 5.5% | 17.1% | **+11.6pp** | **$87.21** | 0.17 |
| Email | 12.9% | 13.7% | +0.8pp | $59.28 | 0.15 |
| Paid Social | 16.0% | 14.6% | –1.4pp | $67.93 | 0.25 |
| **Affiliate** | **42.7%** | **9.4%** | **–33.3pp** | $64.81 | 0.11 |
| Influencer | 7.2% | 2.0% | –5.2pp | $76.22 | 0.16 |

**Key insight**: Affiliate consumes 42.7% of total marketing spend — $1.12M — but has the lowest ROAS (0.11) and below-average customer LTV. Meanwhile, Display acquires customers with the highest average LTV ($87) at just 5.5% of budget.

### Recommendation
Reduce affiliate budget by 33 percentage points over two quarters. Reinvest into Paid Search (+15pp), organic Search (+12pp), and Display (+12pp). Set a minimum 90-day CLV threshold for affiliate partnerships — any partner network not meeting $70 customer LTV after 90 days should be terminated. **Do not eliminate affiliate entirely** — its repeat rate (0.34) is actually above channel average.

---

## Theme 2: Campaign Quality vs. Surface Efficiency

### Why We Did This Analysis
ROAS (Return on Ad Spend) is the most commonly cited campaign KPI, but it only measures immediate revenue return, not whether the campaign attracts customers who come back. We hypothesized that some campaigns "look good" on ROAS but deliver one-time buyers. To test this, we built a **K-Means clustering model** on campaign performance features (spend, ROAS, LCR, CPA) and then cross-tabulated cluster membership against downstream customer repeat rate.

Campaigns with above-median ROAS **and** below-median repeat rate were flagged as **Deceptive Efficiency** — they flatter the short-term P&L while degrading long-term customer value.

### What the Data Shows

**8 campaigns flagged as Deceptively Efficient:**

| Campaign | Channel | ROAS | Repeat Rate | Avg Customer LTV |
|----------|---------|------|-------------|------------------|
| MKT2013 | Paid Social | 0.667 | 29.6% | $79.87 |
| MKT2006 | Paid Social | 0.596 | 30.6% | $67.95 |
| MKT2031 | Paid Social | 0.370 | 31.0% | $66.53 |
| MKT2022 | Email | 0.356 | 27.9% | $53.49 |
| MKT2032 | Search | 0.339 | 26.6% | $70.49 |
| MKT2000 | Paid Social | 0.304 | 27.6% | $48.93 |
| MKT2017 | Paid Social | 0.194 | 26.0% | $67.96 |
| MKT2023 | Email | 0.189 | 30.2% | $73.32 |

**Spend anomaly**: MKT2021 spent **$999,999** — a 20× outlier — and returned a ROAS of 0.009. This single campaign's CPA was $21,277 vs. the normal cluster average of $921. This requires immediate audit.

**Creative decay**: 14% of campaigns show a significant CTR drop after day 14, indicating creative fatigue.

### Recommendation
1. Audit MKT2021 immediately — the spend level and near-zero ROAS suggest either a data entry error or a severely mismanaged campaign.
2. Add repeat rate and 90-day LTV as mandatory KPIs alongside ROAS in all campaign reporting.
3. For the 8 deceptively efficient campaigns: before re-running them, A/B test creative and landing page against a control emphasizing subscription/loyalty sign-up rather than one-time conversion.
4. Implement a 14-day creative rotation rule for all social campaigns to counter CTR decay.

---

## Theme 3: Customer Segmentation — Where the Money Actually Lives

### Why We Did This Analysis
Not all customers are worth the same, and treating them uniformly wastes both money and relationship equity. We used **K-Means clustering** (validated with silhouette score k=4: 0.194) on behavioral and transactional features — then confirmed segment differences with **One-Way ANOVA** (F=3669, p<0.0001) and **Kruskal-Wallis** (H=1044, p<0.0001). We also computed an **RFM scoring model** (Recency, Frequency, Monetary) as an independent validation of segment quality.

The **Gini coefficient (0.673)** was calculated to quantify LTV inequality — this confirms that NovaMart's revenue is highly concentrated in a small fraction of customers, making protection of top-tier customers a strategic priority.

### What the Data Shows

| Segment | Customers | Avg Revenue | Total Revenue | Avg Sessions | Avg Add-to-Cart |
|---------|-----------|------------|---------------|--------------|-----------------|
| Champions | 18 | $1,346.85 | $24,243 | 7.6 | 2.8 |
| Core Buyers | 532 | $146.62 | $78,004 | 7.5 | 2.6 |
| Engaged Browsers | 784 | $37.58 | $29,465 | **10.3** | **4.7** |
| Dormant / At Risk | 1,066 | $26.24 | $27,970 | 6.3 | 1.9 |

**Critical finding — Gini = 0.673**: The top 10% of customers by projected 6-month CLV are worth more than $260 each, while the bottom 50% average near $0 in projected repeat revenue. This is extreme concentration.

**Engaged Browsers are the highest-opportunity segment**: 784 customers average 10.3 sessions and 4.7 add-to-cart events — but only $37 in revenue. Their average checkout-started rate is 2.58 per customer. Something is breaking in the checkout funnel for this group.

**Loyalty tier LTV is statistically validated** (ANOVA: F=6.75, p=0.0002):

| Tier | Avg LTV | Avg AOV | Count |
|------|---------|---------|-------|
| Platinum | $88.69 | $69.37 | 142 |
| Gold | $82.04 | $62.94 | 502 |
| Silver | $69.63 | $60.94 | 704 |
| Bronze | $54.07 | $53.39 | 1,052 |

### Recommendations

**Champions (18 customers)**:
- These 18 people generate more revenue than the bottom 1,000 combined. Launch a VIP program: personal account manager, early product access, exclusive bundles. **Never discount to this group** — they are price-insensitive and discounting devalues the relationship.
- **Urgent**: 6 Champions are not opted into email. Contact these 6 directly through alternative channels (SMS, loyalty portal) — losing one Champion to churn without a re-engagement path is a significant risk.

**Engaged Browsers (784 customers)**:
- The checkout abandonment signal here is strong. Deploy: (1) exit-intent popups, (2) abandoned cart emails within 1 hour, (3) single-friction checkout flow. A 15% conversion of this segment at a conservative $100 average order value would add ~$11.8K in immediate revenue; at Core Buyer average AOV it reaches ~$17.2K.
- Do NOT lead with a discount — the causal analysis shows discounts don't drive these customers.

**Core Buyers (532 customers)**:
- Upsell opportunity. AOV is solid ($62) but order frequency can grow. Introduce bundle recommendations and subscription options at checkout.

**Dormant / At Risk (1,066 customers)**:
- Win-back email sequence (3 touches over 30 days). If no response, suppress from paid acquisition targeting to reduce wasted spend. Do not invest in paid retargeting for this segment.

---

## Theme 4: Lead Conversion — Scoring, Prioritization & the Discount Myth

### Why We Did This Analysis

**Lead prediction**: With 5,224 total leads, the sales team cannot follow up on all of them with equal effort. We trained and compared 5 classification models (Logistic Regression, Random Forest, Gradient Boosting, Naive Bayes, KNN) using **stratified 5-fold cross-validation** to identify which leads are most likely to convert. Cross-validation prevents overfitting; stratification ensures class balance across folds. The best model was selected on held-out AUC, not training accuracy.

**Discount causal analysis**: A simple correlation between discount and conversion would be misleading because sales reps tend to offer discounts to *harder* leads. We used **Inverse Probability Treatment Weighting (IPTW)** — a causal inference technique that controls for selection bias — to estimate the *true* causal effect of discounts on conversion. We also ran a logistic regression controlling for all observed covariates.

### What the Data Shows

**Lead model performance**:

| Model | AUC (Test) | CV AUC (5-fold) | F1 |
|-------|-----------|-----------------|-----|
| **Logistic Regression** | **0.636** | **0.619** | 0.505 |
| Gradient Boosting | 0.621 | 0.607 | 0.231 |
| Naive Bayes | 0.620 | 0.602 | 0.212 |
| Random Forest | 0.607 | 0.585 | 0.298 |
| KNN | 0.559 | 0.533 | 0.358 |

**Lead score is the single most predictive feature** (importance: 0.129) — validating that the scoring model already in use has genuine signal. Time on site (0.094) and pages viewed (0.089) are the next strongest signals.

**Current lead pipeline**:
| Priority Tier | Count | Avg Predicted Probability |
|--------------|-------|--------------------------|
| High (>66%) | 1,430 | 77.9% |
| Medium (33–66%) | 773 | 45.7% |
| Low (<33%) | 3,021 | 15.1% |

**Optimal classification threshold: 0.17** (cost-optimized: $20 per missed conversion vs. $5 per false positive). This threshold correctly identifies far more converters than the default 0.5, at a total cost of $4,010 per cycle.

**Discount effect — the counterintuitive finding**:

The raw correlation between discounts and conversion is positive — but this is **confounded** (reps offer discounts to harder leads). After controlling for selection bias via IPTW:

> **IPTW causal estimate: discounts reduce conversion probability by 0.9 percentage points (ATE = –0.0089)**

The logistic model coefficient on discount_pct is also negative (–0.013, p=0.001). Discounts do not cause conversions — they are a symptom of difficult-to-convert leads.

**Discount uplift varies dramatically by channel**:

| Channel | Uplift (pp) |
|---------|------------|
| Influencer | **+5.1pp** |
| Affiliate | **+4.9pp** |
| Paid Search | +2.6pp |
| Email | +1.6pp |
| Paid Social | **–2.8pp** |
| Display | –5.7pp |
| Search | –7.0pp |

**Discount uplift by loyalty tier**:

| Tier | Uplift (pp) |
|------|------------|
| Silver | +3.4pp |
| Platinum | +1.5pp |
| Bronze | **–1.2pp** |
| Gold | **–1.9pp** |

### Recommendations

1. **Prioritize the 1,430 High-tier leads** with immediate human follow-up. For Low-tier leads, use automated email sequences only — no sales rep time.
2. **Retire blanket discount offers** as a conversion tactic. The causal evidence shows they don't work and may signal desperation, which can reduce perceived value.
3. **Use discounts selectively**: they lift conversion for Influencer and Affiliate channels (+5pp) and for Silver/Platinum tiers. They actively hurt conversion for Paid Social, Display, and Gold/Bronze tier customers.
4. Integrate the lead scoring model into the CRM — every new lead should receive a priority_tier tag on entry.

---

## Theme 5: Product & Return Rate Strategy

### Why We Did This Analysis

Product category performance was completely absent from prior reporting — all revenue was aggregated at the customer level. We decomposed transactions by category to identify which products drive revenue, which drive loyalty (repeat first-purchase rate), and which drive returns. We also analyzed return rates by marketing channel to detect whether certain acquisition sources are attracting mismatched buyers. This helps separate a product quality problem from a targeting problem.

### What the Data Shows

**Category performance**:

| Category | Total Revenue | Avg Price | Return Rate | First-Purchase Repeat Rate |
|----------|--------------|-----------|-------------|---------------------------|
| Baby | **$39,903** | $84.72 | **7%** | 52.4% |
| Home Care | $32,015 | $65.60 | 8% | 47.5% |
| Supplements | $31,198 | $68.87 | 9% | 47.7% |
| **Personal Care** | $26,873 | $58.17 | 8% | **58.0%** |
| Snacks | $19,533 | $40.27 | 8% | 51.6% |
| Beverages | $14,287 | $33.07 | 8% | 52.7% |

**Return rates by marketing channel**:

| Channel | Return Rate | Avg Transaction Value |
|---------|------------|----------------------|
| Email | 8.9% | $61.73 |
| Paid Search | 8.8% | $61.15 |
| Affiliate | 8.4% | $50.94 |
| Paid Social | 8.2% | $68.21 |
| Direct | 7.9% | $62.23 |
| Organic | 7.7% | $54.49 |
| **Influencer** | **6.6%** | $52.87 |

**SLR finding**: Discount % → Revenue has a statistically significant **negative** slope (–$0.50 per 1% discount, p<0.001). Higher discounts are associated with lower transaction values — likely because discounts cluster on lower-priced SKUs.

### Recommendations

1. **Baby is the hero category**: Highest revenue, lowest return rate, strong repeat rate. Ensure stock availability and prioritize Baby in new customer acquisition landing pages. Consider a Baby subscription/subscription-box product.

2. **Personal Care is the loyalty gateway**: 58% of customers who buy Personal Care first become repeat buyers — higher than any other category. Use Personal Care as the first-order acquisition vehicle with an intro offer, then cross-sell Baby and Supplements.

3. **Beverages needs a strategic review**: Lowest revenue, lowest price point — it may be pulling down AOV without contributing proportionally to LTV. Evaluate whether to invest in premiumizing the Beverages range or de-emphasizing it in marketing.

4. **Influencer channel has the lowest return rate (6.6%)**: This suggests influencer content creates accurate product expectations. Despite the budget reallocation recommendation to reduce influencer spend overall (driven by ROAS), the quality of buyers from this channel is high — structure influencer partnerships on a CPA model with retention bonuses rather than impressions.

5. **Email acquisitions have the highest return rate (8.9%)**: Review email campaign creative for accuracy of product descriptions. Consider adding 360° product imagery and size guides to reduce post-purchase disappointment.

---

## Theme 6: Retention & Predicted CLV

### Why We Did This Analysis

Acquiring a customer who never returns is simply a cost center. We built a **retention prediction model** (repeat purchase within 90 days) to identify at-risk customers before they churn, enabling pre-emptive intervention. We used **Kaplan-Meier survival analysis** — a technique borrowed from clinical trials — to estimate the *distribution of time-to-second-purchase*, which gives a more complete picture than a binary "did they repeat?" flag.

We also projected **6-month CLV** using each customer's predicted repeat probability and their historical AOV, enabling prioritization of CRM spend by expected future value.

### What the Data Shows

**Retention model**:

| Model | Test AUC | CV AUC (5-fold) |
|-------|---------|-----------------|
| Gradient Boosting | 0.721 | **0.746** |
| Random Forest | 0.699 | 0.737 |
| Logistic Regression | 0.680 | 0.687 |

**Base repeat rate: 24.3%** — meaning nearly 3 in 4 customers who make a first purchase never return within 90 days.

**Kaplan-Meier finding**: Median days to second purchase = **infinity** in the observed window. Fewer than 1% of customers made a second purchase within the tracking period. This is the most urgent retention signal in the dataset.

**Top retention predictors** (from Gradient Boosting feature importance):
1. Total revenue from first order (0.240) — higher first-order value → stronger repeat signal
2. Total acquisition cost (0.105) — high-cost acquisitions churn faster
3. Pages viewed before purchase (0.094) — more pre-purchase research → more committed buyer

**CLV projections**:
- Average 6-month projected CLV: **$141.28**
- Top 10% of customers are projected at **$260+** over 6 months
- Average repeat probability in 90 days: **24.2%**

**Early warning flags** (churn predictors):
- High acquisition cost **+** low first-order revenue → strong churn signal
- Low session count prior to first order → lower retention probability

### Recommendations

1. **The 90-day repeat window is critical**: Given that median time-to-second-purchase is effectively infinite, any customer who hasn't reordered within 45 days should enter an automated win-back sequence. Do not wait 90 days to intervene.

2. **First-order value is the strongest retention signal (r=0.24)**: Structure new customer offers to maximize first-order basket size, not just acquisition. A $50+ first order is a significantly better retention signal than a $20 entry order. Consider "starter kits" that bundle 2–3 categories.

3. **High-cost acquisitions need faster monetization**: Customers with acquisition costs above $45 who don't reorder within 60 days are highly likely to churn permanently. Flag these in the CRM and trigger a targeted re-engagement flow.

4. **Use the CLV model for CRM budget allocation**: Rank customers by projected 6-month CLV. The top decile ($260+) should receive concierge-level CRM investment (personal outreach, exclusive offers). The bottom 50% should receive automated-only treatment.

5. **Mann-Whitney test confirmed**: Repeating customers spend $154.62 on average vs. $93.26 for non-repeaters (p<0.0001). The revenue impact of even a modest improvement in retention is disproportionate — each percentage point improvement in repeat rate adds ~$906 in marginal incremental revenue across the active customer base (or ~$2,282 in full repeater revenue value).

---

## Statistical Appendix: Why Each Test Was Chosen

| Analysis | Test / Method | Why This Test |
|----------|--------------|---------------|
| Channel LTV comparison | Kruskal-Wallis | LTV is right-skewed; non-parametric test is more robust than ANOVA here |
| Segment revenue differences | ANOVA + Kruskal-Wallis | Dual test to confirm both parametric and non-parametric agree |
| LTV across loyalty tiers | One-Way ANOVA + Kruskal-Wallis | Same reason; validates tier investment is justified |
| Income band × loyalty tier | Chi-Square + Cramér's V | Both variables are categorical; Cramér's V measures effect size |
| Landing page × conversion | Chi-Square | Tests whether page choice is an independent driver of conversion |
| Device × conversion | Chi-Square | Tests whether mobile vs. desktop significantly affects conversion |
| Discount effect on conversion | IPTW causal model | Simple correlation is confounded; IPTW controls for selection bias |
| Time to second purchase | Kaplan-Meier | Right-censored survival data — standard regression would be biased |
| Lead conversion prediction | 5-model comparison + CV AUC | CV AUC prevents overfitting; multiple models reduce model selection bias |
| Customer retention prediction | Same 5-model framework | Same rationale; AUC used because classes are imbalanced |
| Customer segmentation | K-Means + silhouette score | Silhouette validates cluster quality; K-Means is interpretable for business use |
| Campaign clustering | K-Means (k=2) | Two-cluster solution had silhouette score 0.622 — clean high/low separation |
| Channel AOV differences | Kruskal-Wallis + Tukey HSD | Kruskal tests significance; Tukey identifies which channel pairs differ |
| LTV prediction | MLR with train/test split | R²=0.851 on held-out test; AOV is the dominant predictor |
| Transaction revenue prediction | MLR | R²=0.716; units sold is the dominant predictor (expected) |
| Days-to-convert prediction | MLR | R²=–0.010; model failed — channel does not predict conversion speed |
| Budget composite scoring | Composite index (ROAS 35% + LCR 25% + LTV 25% + Repeat 15%) | Weighted to balance short-term efficiency with long-term customer quality |
| Confidence intervals | Bootstrap (2,000 resamples) | No distributional assumption required; works with skewed revenue data |
| LTV inequality | Gini coefficient + Lorenz curve | Standard inequality measure; directly interpretable (0–1 scale) |

---

## Priority Action Checklist

### Next 30 Days
- [ ] Identify and contact the 6 Champion customers not on the email list
- [ ] Audit MKT2021 ($999,999 spend, ROAS 0.009) — determine if this is data error or real
- [ ] Implement 1-hour abandoned cart email for Engaged Browser segment (784 customers)
- [ ] Tag all active leads with priority_tier (High/Medium/Low) in CRM using model output

### Next 60 Days
- [ ] Begin affiliate budget reduction: cap at 30% of total spend (from 42.7%)
- [ ] Launch Paid Search test campaigns with incremental reallocation funds
- [ ] Add repeat_rate and 90-day LTV as mandatory metrics in campaign dashboards
- [ ] Set up automated 45-day re-engagement trigger for customers with no second order

### Next 90 Days
- [ ] Launch Personal Care first-purchase funnel (highest repeat gateway)
- [ ] Pilot VIP program for Champions segment
- [ ] Complete budget reallocation to target distribution (Paid Search 25%, Display 17%)
- [ ] Review Beverages category positioning — premiumize or de-emphasize

---

*Generated from NovaMart Analytics Pipeline v2.0 | Data period: 2024–2025*
