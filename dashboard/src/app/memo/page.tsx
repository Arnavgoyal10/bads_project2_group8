"use client";
import { FileText, Download } from "lucide-react";

const MEMO_CONTENT = `# NovaMart Marketing Analytics — CMO Decision Memo

> **Audience**: Chief Marketing Officer, Head of Growth, Analytics Team
> **Scope**: Full 2024–2025 dataset · 2,400 customers · 39 campaigns · 5,224 leads · 2,808 transactions
> **Prepared by**: Analytics Team · Data Period: 2024–2025

---

## Executive Summary

NovaMart is running a fundamentally inefficient marketing operation. The headline numbers look acceptable — a functioning lead pipeline, reasonable AOV, broad customer base — but the data reveals four structural problems that are costing the business measurable revenue every quarter.

First, 42.7% of the entire marketing budget flows into a single channel (Affiliate) that generates the worst return on ad spend (0.11) and below-average customer lifetime value. The three channels that generate the highest-LTV customers — Search, Display, and Paid Search — share only 21.3% of the budget combined. This is not a marginal inefficiency; it is a structural misallocation that compounds every month it goes uncorrected.

Second, NovaMart's revenue base is dangerously concentrated. Eighteen customers generate more total revenue than the bottom one thousand combined. A single unexpected churn event in the Champions segment causes a revenue impact equivalent to losing 50+ average customers. There is no VIP retention infrastructure in place.

Third, the company is treating discounts as a conversion lever when the data proves they are not. After controlling for the fact that sales reps disproportionately offer discounts to the hardest-to-convert leads, the true causal effect of discounting is a net negative: −0.9 percentage points on conversion probability. The business is spending margin for outcomes that would have happened anyway — or were never going to happen regardless.

Fourth, NovaMart is operationally a one-time purchase business despite being structured like a retention business. Fewer than one in four customers makes a second purchase within 90 days. Kaplan-Meier survival analysis shows the median time to a second purchase is statistically infinite. This is the single most important finding in the entire analysis.

**Top 5 Strategic Findings:**

1. **Budget misallocation (Critical)**: Affiliate takes 42.7% of spend ($1.12M) with ROAS 0.11. Paid Search, the highest-performing channel by composite score (0.726), gets only 9.9%.
2. **Revenue concentration (Critical)**: Gini coefficient = 0.673. 18 Champion customers ($1,347 avg revenue) outperform the bottom 1,000 ($26 avg). Six Champions are not on the email list.
3. **Retention crisis (High)**: 75.8% of customers never make a second purchase. Median time to repeat purchase is infinite by Kaplan-Meier analysis.
4. **Discount myth (High)**: Discounts causally reduce conversion by 0.9pp (IPTW ATE = −0.009, p=0.001). Blanket discounting destroys margin with no conversion benefit.
5. **Engagement-conversion gap (High)**: 784 Engaged Browsers average 4.7 add-to-cart events but only $38 revenue. Checkout friction is blocking $11–17K in recoverable revenue.

---

## Finding 1: Budget Allocation Is Structurally Broken

### How We Found It

We began by computing per-channel performance across four dimensions that reflect both short-term efficiency and long-term customer quality: ROAS (immediate revenue return), Lead Conversion Rate (LCR), Average Customer LTV (revenue per acquired customer), and 90-day repeat purchase rate (retention quality). Each metric was min-max normalized and combined into a composite score weighted at 35% ROAS · 25% LCR · 25% LTV · 15% Repeat Rate.

To verify that LTV differences across channels are statistically real and not sampling noise, we ran a Kruskal-Wallis test (non-parametric, appropriate because LTV is heavily right-skewed). The test returned H=20.39, p=0.040 — confirming statistically significant differences in customer quality across channels. This means budget reallocation is not a judgment call; it is evidence-based.

We also computed Cost Per Lead (CPL = total spend / total conversions) to surface a critical metric that LCR alone cannot reveal: Affiliate's 35.2% LCR looks reasonable until you see that its CPL is $346,666 per conversion, driven entirely by the MKT2021 anomaly campaign ($999,999 spend, ROAS 0.009).

### The Finding

| Channel | Current % | Recommended % | Shift | Avg LTV | ROAS | Composite Score |
|---------|-----------|---------------|-------|---------|------|-----------------|
| Paid Search | 9.9% | 24.8% | **+14.9pp** | $66.55 | 0.360 | 0.726 |
| Search | 5.9% | 18.4% | **+12.5pp** | $74.84 | 0.221 | 0.539 |
| Display | 5.5% | 17.1% | **+11.6pp** | $74.59 | 0.173 | 0.500 |
| Email | 12.9% | 13.7% | +0.8pp | $59.28 | 0.151 | 0.400 |
| Paid Social | 16.0% | 14.6% | −1.4pp | $67.93 | 0.250 | 0.426 |
| **Affiliate** | **42.7%** | **9.4%** | **−33.3pp** | $64.81 | 0.113 | 0.276 |
| Influencer | 7.2% | 2.0% | −5.2pp | $76.22 | 0.155 | 0.059 |

Paid Search has the highest composite score (0.726) but receives less than 10% of budget. Affiliate has the lowest composite score (0.276) and consumes 42.7%. The gap between what gets funded and what performs is the single largest structural problem in this marketing operation.

Influencer's low composite score (0.059) is driven primarily by low ROAS (0.155), but importantly it acquires the highest-LTV customers ($76.22 avg) and has the lowest return rate (6.6%). The recommendation to reduce Influencer budget should be reviewed against a longer time horizon — if LTV measurement is under-counting referral effects, this recommendation may be premature.

### Business Impact

Current annual affiliate spend is approximately $1.12M. At the recommended 9.4% allocation (down from 42.7%), roughly $870K is freed annually. Reinvesting this into Paid Search and Display — channels with proven composite scores of 0.726 and 0.500 — has a calculable expected value. If Paid Search's avg LTV of $66.55 is maintained at scale, each $39.22 acquisition cost delivers $66.55 in lifetime revenue — a 1.70× LTV/CAC ratio that is among the best in the portfolio.

### Actions and Implementation

**Action 1: Affiliate Budget Reduction (Months 1–2)**
- Step 1: Identify all active affiliate partner contracts and flag any with 30-day termination clauses.
- Step 2: Reduce new affiliate campaign approvals immediately. Do not renew campaigns with ROAS below 0.15 or customer LTV below $70.
- Step 3: Set a hard cap at 30% of total spend by end of Month 1, reducing to 15% by end of Month 2, and 9.4% by end of Month 3.
- Step 4: Do not eliminate Affiliate entirely — its repeat rate (0.34) is above channel average and some partners may perform above the portfolio mean. Enforce per-partner LTV benchmarking.
- Owner: Paid Media Manager + Finance to approve budget reallocation

**Action 2: Paid Search Scale-Up (Months 1–3)**
- Step 1: Increase Paid Search budget incrementally — add $50K/month from reallocated Affiliate funds for 3 months.
- Step 2: Monitor ROAS and new-customer LTV at each increment. If ROAS drops below 0.25 at scale, pause and investigate keyword expansion quality before adding more budget.
- Step 3: Bid on high-intent keywords aligned with Baby and Personal Care categories (highest-LTV product categories per the category analysis).
- Step 4: Add a 90-day LTV tracking tag to all Paid Search conversion events — this ensures future budget decisions use downstream LTV, not just first-order revenue.
- Owner: Paid Search Manager + Analytics Team

**Action 3: Display Channel Investment (Months 2–3)**
- Step 1: Launch Display retargeting campaigns targeting website visitors from high-intent pages (product pages, cart pages).
- Step 2: Use the 784 Engaged Browsers segment as the primary Display retargeting audience — they have already demonstrated purchase intent with 4.7 add-to-cart events.
- Step 3: Track LTV for Display-acquired customers over 90 days; benchmark against the $74.59 LTV average.
- Owner: Digital Advertising Team

---

## Finding 2: Campaign Quality vs. Surface Efficiency

### How We Found It

Standard campaign reporting uses ROAS as the primary KPI. ROAS only measures first-order revenue return — it cannot detect whether a campaign acquires customers who never return. To identify campaigns that look good on monthly P&L but are quietly eroding long-term CLV, we applied K-Means clustering (k=2) to campaign-level features (spend, LCR, ROAS, CPA). The clustering achieved a silhouette score of 0.622 — indicating strong, well-separated groups.

After clustering, we computed the 90-day repeat rate for customers acquired by each campaign. Campaigns with above-median ROAS but below-median repeat rate were flagged as Deceptively Efficient — a label that captures the gap between how these campaigns appear in monthly reporting vs. their actual impact on customer lifetime value.

A separate anomaly detection step identified MKT2021 as a statistical outlier: it sits at the 99th percentile of campaign spend ($999,999) and simultaneously has the lowest ROAS in the entire portfolio (0.009), meaning it generated roughly $9,360 in revenue on $999,999 in spend. This is either a catastrophic data entry error or the worst-performing campaign in company history.

### The Finding

K-Means produced two campaign groups: 35 "High Efficiency" campaigns (avg spend $46,419, avg ROAS 0.239, avg CPA $921) and 1 "Volume Driver" campaign (MKT2021: spend $999,999, ROAS 0.009, CPA $21,277).

Within the High Efficiency group, 8 campaigns were flagged as Deceptively Efficient:

| Campaign | Channel | ROAS | Repeat Rate | Avg LTV | Problem |
|---------|---------|------|-------------|---------|---------|
| MKT2013 | Paid Social | 0.667 | 29.6% | $79.87 | High ROAS, low retention |
| MKT2006 | Paid Social | 0.596 | 30.6% | $67.95 | High ROAS, low retention |
| MKT2031 | Paid Social | 0.370 | 31.0% | $66.53 | Above-median ROAS, low retention |
| MKT2022 | Email | 0.356 | 27.9% | $53.49 | Low LTV + low retention |
| MKT2032 | Search | 0.339 | 26.6% | $70.49 | Above-median ROAS, worst retention |
| MKT2000 | Paid Social | 0.304 | 27.6% | $48.93 | Lowest avg LTV, low retention |
| MKT2017 | Paid Social | 0.194 | 26.0% | $67.96 | Marginally above median ROAS, poor retention |
| MKT2023 | Email | 0.189 | 30.2% | $73.32 | Near-median ROAS, low retention |

Additionally, 14% of all campaigns show a statistically significant CTR decay after day 14, indicating creative fatigue. Social Lead Gen campaigns take 5–7 days to reach peak LCR — campaigns are frequently being shut down before they reach peak performance.

### Business Impact

The 8 deceptively efficient campaigns collectively attract customers with below-average retention. If each deceptive campaign acquires 50 customers per run at a repeat rate 5pp below the 34% portfolio average, that is 2.5 fewer repeat customers per campaign. At a repeater lifetime value of ~$154 (vs. $93 for non-repeaters), the delta is $61 per lost repeater — or $152 per campaign run in forgone CLV. Across 8 campaigns run quarterly, this is approximately $4,880 in annual CLV destruction, not visible in monthly ROAS reporting.

MKT2021's $999,999 spend at ROAS 0.009 represents approximately $990,000 in unrecovered spend, assuming the campaign generated $9,360 in actual revenue. This is the single most urgent line item in the entire analysis.

### Actions and Implementation

**Action 1: Audit MKT2021 Immediately (Days 1–5)**
- Step 1: Pull raw transaction data attributed to MKT2021 and verify whether $9,360 in revenue is correct.
- Step 2: Cross-reference the campaign's traffic source, landing page, and conversion tracking setup. A $999,999 spend with correct ROAS would require $9M+ in revenue — this is almost certainly a spend entry error (e.g., a comma misplaced in a media buy) or a tracking failure.
- Step 3: If confirmed as a data error, correct it in the source system and rerun the ROAS analysis. If it is a real misrun, file a retrospective with Finance and the media agency.
- Owner: Marketing Ops + Finance Audit

**Action 2: Add Long-Term KPIs to Campaign Dashboards (Month 1)**
- Step 1: Modify the campaign reporting template to include three new columns alongside ROAS: 90-day Repeat Rate, Avg 90-day Customer LTV, and a Composite Score (35% ROAS · 25% LCR · 25% LTV · 15% Repeat Rate).
- Step 2: Set minimum thresholds for campaign renewal: ROAS ≥ 0.15 AND repeat rate ≥ 28% AND LTV ≥ $55. Any campaign below threshold requires a creative refresh before re-approval.
- Step 3: Build an automated 90-day lookback tag in the CRM so that customer LTV is retroactively attributed to the source campaign.
- Owner: Analytics + CRM Team

**Action 3: Creative Rotation Rule for Social (Month 1)**
- Step 1: Implement a 14-day mandatory creative refresh for all Paid Social campaigns. After 14 days, swap to a new creative variant (minimum 2 variants prepared before campaign launch).
- Step 2: For Lead Gen Social campaigns, enforce a minimum 7-day runtime before any performance review. Campaigns showing low LCR in days 1–7 are in the ramp-up phase, not underperforming.
- Owner: Creative Team + Paid Social Manager

**Action 4: A/B Test Deceptively Efficient Campaigns (Months 1–2)**
- Step 1: Before re-running any of the 8 flagged campaigns, split the audience: 50% receive the original creative (promotional hook), 50% receive a loyalty-focused creative (subscription value, bundle savings, community membership).
- Step 2: Measure 30-day LCR AND 90-day repeat rate. If the loyalty creative matches or exceeds LCR while improving repeat rate, it becomes the default.
- Owner: Creative + Performance Marketing

---

## Finding 3: Customer Segmentation & Revenue Concentration

### How We Found It

Customer segmentation began with feature engineering on the Analytical Base Table (ABT): we computed per-customer totals for revenue, orders, sessions, add-to-cart events, and checkout starts. K-Means clustering was applied to these behavioral and transactional features. The optimal cluster count k=4 was selected by maximizing the silhouette score (0.194 at k=4 vs. lower scores at k=3 and k=5) and inspecting the elbow curve.

Critically, we did not accept the clusters on face value. Two statistical tests validated that the revenue differences between segments are not sampling artifacts: One-Way ANOVA (F=3,669, p<0.0001) and Kruskal-Wallis (H=1,044, p<0.0001). With p-values this extreme, the segments are among the most statistically distinct customer groups that can be identified in consumer data.

Revenue inequality was quantified using the Gini coefficient (0.673), borrowed from economics. A Lorenz curve was plotted to visualize the concentration. An independent RFM (Recency, Frequency, Monetary) analysis was run as a cross-validation — if both methods flag the same customers as high-value, confidence is significantly higher than if only one method does.

### The Finding

| Segment | Customers | Avg Revenue | Total Revenue | Avg Sessions | Avg Add-to-Cart | Avg Orders |
|---------|-----------|-------------|---------------|--------------|-----------------|------------|
| Champions | 18 | $1,347 | $24,243 | 7.6 | 2.8 | 2.1 |
| Core Buyers | 532 | $147 | $78,004 | 7.5 | 2.6 | 2.9 |
| Engaged Browsers | 784 | $38 | $29,465 | 10.3 | 4.7 | 0.77 |
| Dormant / At Risk | 1,066 | $26 | $27,970 | 6.3 | 1.9 | 0.55 |

Revenue concentration (Gini = 0.673): the 18 Champion customers (0.75% of base) generate $24,243 in total revenue. The bottom 1,000 customers generate a combined $676 — meaning Champions produce 35.9× the revenue per customer compared to the lowest tier.

The Engaged Browser finding is the most actionable in the near term: these 784 customers have an average of 4.7 add-to-cart events (the highest of any segment, including Core Buyers at 2.6) but only 0.77 orders and $38 in revenue. The add-to-cart behavior signals genuine purchase intent; the failure to complete purchase is a checkout friction problem, not a demand problem.

Six Champion customers have not opted into email — the primary CRM channel. At an average revenue of $1,347 per Champion, losing a single one of these customers to churn is equivalent to losing 52 average customers simultaneously.

### Business Impact

**Champions (18 customers)**: Each Champion generates $1,347 on average. The absence of a structured VIP program means this value is sustained by accident rather than by design. A single churn event in this group erases the equivalent of 52 average customer-years of revenue. The 6 non-email Champions are the highest-priority CRM gap in the entire portfolio — there is no failsafe if these customers become unreachable.

**Engaged Browsers (784 customers)**: At a 15% conversion rate from browse to first purchase (the observed rate for similar behavioral profiles), implementing an abandoned cart sequence could convert approximately 118 customers at Core Buyer-level AOV ($147), generating $17,300 in incremental revenue. Conservative estimate at 10% conversion: $11,600.

**Dormant / At Risk (1,066 customers)**: These customers have effectively churned without formally leaving. Deploying a 3-touch win-back email sequence costs approximately $0.10–$0.30 per email (SaaS ESP cost), or $320–$960 total for the segment. If even 3% reactivate at an AOV of $52, that is 32 orders worth $1,664 in revenue — a 1.7–5.2× return on the email cost alone.

### Actions and Implementation

**Action 1: Contact 6 Non-Email Champions (Days 1–3)**
- Step 1: Pull the CRM records for all 18 Champion customers. Identify the 6 with no email address on file.
- Step 2: For each of the 6, identify alternative contact methods: loyalty program phone number, in-app notification, SMS if available, or direct mail if physical address is on file.
- Step 3: Send a personalized outreach acknowledging their status: "You are one of our most valued customers. We want to ensure you receive exclusive early access and offers — please confirm your preferred contact."
- Step 4: Enroll confirmed contacts into a dedicated Champions CRM list with a 0-discount, exclusivity-first communication cadence.
- Owner: CRM Manager (Priority: Urgent, complete within 3 business days)

**Action 2: VIP Program for Champions (Month 1 design, Month 2 launch)**
- Step 1: Define the VIP program structure: early access to new products (48-hour window), dedicated account contact (not a chatbot), annual gift basket or personalized package, quarterly NPS survey.
- Step 2: Never offer deep discounts to Champions — these are price-insensitive VIP buyers. Discounting devalues the relationship and signals the brand is not premium.
- Step 3: Identify the 12% of Core Buyers who match Champions on order frequency but have lower AOV. Target these with upsell bundles (e.g., "Complete Your Set") to accelerate their migration to Champion status.
- Owner: Brand + CRM Team

**Action 3: Abandoned Cart Email Sequence for Engaged Browsers (Month 1)**
- Step 1: In the email automation platform (Klaviyo, Mailchimp, or equivalent), create a trigger: any customer session with add-to-cart = True and order_completed = False within 1 hour fires the first email.
- Step 2: Email 1 (1 hour post-abandonment): Subject "You left something behind" — show the specific abandoned item with a clean product image, price, and a single CTA button. No discount.
- Step 3: Email 2 (24 hours post-abandonment): If no purchase, send social proof ("143 people bought this week") and a secondary CTA. Still no discount.
- Step 4: Email 3 (72 hours post-abandonment): Final email. For Influencer and Affiliate-sourced leads only, offer a 10% discount (per the discount uplift analysis). For Search and Display-sourced leads, offer free shipping instead — discounts hurt conversion for these sources.
- Step 5: Measure: open rate, click rate, and 7-day conversion rate from email click to purchase. Benchmark: 15% click-to-purchase target.
- Owner: Email Marketing Manager + CRM Developer

**Action 4: Suppress Dormant Segment from Paid Retargeting (Month 1)**
- Step 1: Export the Dormant / At Risk segment customer list from CRM.
- Step 2: Upload as an exclusion audience in Google Ads, Meta Ads, and any DSP platforms currently running retargeting.
- Step 3: Simultaneously launch a 3-touch email win-back sequence: Email 1 "We miss you" with top-selling product recommendations; Email 2 "Here is what's new" with new arrivals; Email 3 final reactivation offer (10% off, 14-day expiry).
- Step 4: After 30 days with no email engagement (no opens), move these customers to suppressed-permanently in the email platform. Do not continue mailing non-openers — this degrades sender reputation.
- Owner: Email Team + Paid Media (Exclusion List Setup)

---

## Finding 4: Lead Conversion & The Discount Myth

### How We Found It

With 5,224 leads in the pipeline, the sales team cannot give equal attention to every lead. We trained 5 classification models (Logistic Regression, Random Forest, Gradient Boosting, Naive Bayes, KNN) to score each lead's probability of converting within 30 days. Model selection used 5-fold stratified cross-validated AUC — not test accuracy.

The reason for CV AUC over accuracy: 63% of leads do not convert. A model that predicts "never converts" achieves 63% accuracy without learning anything useful. AUC measures whether the model correctly ranks converters above non-converters, which is exactly what lead prioritization requires.

The selected model (Logistic Regression, CV AUC = 0.619) was then calibrated using a business cost matrix: a missed conversion (false negative) costs $20 in lost revenue; a false positive (wasted sales rep time) costs $5. The optimal classification threshold derived from this cost matrix is 0.17 — far below the naive default of 0.50. At the optimal threshold, total cost per evaluation cycle is $4,010.

For the discount analysis, we encountered a classic confounding problem: sales reps tend to offer discounts to the hardest-to-convert leads, making discounts and non-conversion correlated in the raw data even if discounts have zero causal effect. To isolate the true causal effect, we used Inverse Probability Treatment Weighting (IPTW) — a method that creates a pseudo-randomized comparison by re-weighting observations based on the probability of receiving a discount. This is the only statistically valid way to answer the question "do discounts cause conversion?" in this dataset.

### The Finding

Logistic Regression achieved the highest cross-validated AUC (0.619) and the best F1 score (0.505), outperforming Gradient Boosting (CV AUC 0.607, F1 0.231) on both dimensions. The lower-accuracy model generalizes better — a textbook example of why CV AUC dominates test accuracy for imbalanced classification.

Feature importance (Random Forest SHAP values) shows lead score as the dominant predictor (importance 0.129), followed by behavioral engagement: avg time on site (0.094), avg pages viewed (0.089), and age (0.080). Source channel (Google, Meta) contributes only 0.022 and 0.021 respectively — lead source is nearly irrelevant once behavioral features are included.

The 5,224 leads scored at optimal threshold 0.17 break into three operational tiers:

| Priority Tier | Leads | Avg Conversion Probability | Action |
|--------------|-------|---------------------------|--------|
| High | 1,430 | 77.9% | Human outreach within 24 hours |
| Medium | 773 | 45.7% | Automated CRM sequence + re-score at day 7 |
| Low | 3,021 | 15.1% | Email nurture only — no rep time |

Discount causal analysis findings:
- IPTW Average Treatment Effect (ATE) = −0.009: discounts causally reduce conversion probability by 0.9 percentage points after controlling for selection bias.
- Logistic regression coefficient on discount_pct = −0.013, p=0.001 — statistically significant.
- Raw Chi-Square: discount flag × conversion = p=0.917 (not significant) — the raw correlation is confounded and cannot be trusted.

Discount uplift varies dramatically by channel and loyalty tier:

| Group | Discount Uplift | Interpretation |
|-------|----------------|----------------|
| Influencer channel | +5.1pp | Discount works — creator audiences are deal-responsive |
| Affiliate channel | +4.9pp | Positive uplift — partner-driven audiences respond to deals |
| Silver loyalty tier | +3.4pp | Positive uplift — aspirational buyers convert with a nudge |
| Platinum loyalty tier | +1.5pp | Marginal positive uplift |
| Bronze loyalty tier | −1.2pp | Discount reduces conversion — may signal price/quality concern |
| Gold loyalty tier | −1.9pp | Discount actively hurts conversion — Gold buyers have already decided |
| Display channel | −5.7pp | Discount hurts conversion significantly |
| Search channel | −7.0pp | Strongest negative effect — discount may undermine brand perception |

### Business Impact

Lead prioritization ROI: the High-priority tier contains 1,430 leads at 77.9% avg conversion probability. Without prioritization, if reps spread effort equally across 5,224 leads, approximately 37% convert (1,933 conversions). If reps concentrate 80% of their time on the 1,430 High-tier leads, expected conversions from that tier = 1,114. The business recovers more value per rep-hour with no increase in headcount.

Discount margin recovery: assuming average discount depth of 8–10% on an AOV of $58.87, each unnecessary discount costs $4.71–$5.89 per transaction. If discounts are currently offered to 25% of non-converting leads (est. 3,300 leads), eliminating blanket discounts to the 2,000+ leads where uplift is negative saves approximately $9,400–$11,800 in margin per cycle.

### Actions and Implementation

**Action 1: Integrate Lead Scoring Model into CRM (Month 1)**
- Step 1: Export the trained Logistic Regression model (serialized as a .pkl or ONNX file) and the scaler from the analytics pipeline.
- Step 2: Build a CRM integration that, upon every new lead creation, computes the 7 required features (lead_score, avg_time_on_site, avg_pages_viewed, age, total_sessions, discount_pct, total_add_to_cart) and calls the model.
- Step 3: Write the output probability and the priority_tier label (High / Medium / Low using threshold 0.17) back to the CRM lead record as custom fields.
- Step 4: Configure CRM queue views so that High-priority leads appear at the top of every sales rep's daily task list.
- Step 5: Set up a re-scoring webhook: if a Medium-tier lead visits the site again within 7 days, re-score using updated session data.
- Owner: CRM Developer + Analytics Team + Sales Operations

**Action 2: Retire Blanket Discount Campaigns (Immediate)**
- Step 1: Review all currently active lead nurture sequences that include a discount offer. Identify which channel and loyalty tier each sequence targets.
- Step 2: Remove discount offers from all sequences targeting: Display-acquired leads, Search-acquired leads, Paid Social-acquired leads, and Gold or Bronze loyalty tiers.
- Step 3: Replace the discount with alternative conversion levers: free shipping, limited-time product bundle, social proof ("1,200 customers bought this last month"), or urgency messaging ("only 3 left in stock").
- Step 4: Keep discount offers in sequences targeting Influencer and Affiliate channels, and Silver/Platinum loyalty tiers where uplift is confirmed positive.
- Owner: Email Marketing Manager + Sales Enablement

**Action 3: Implement Optimal Classification Threshold (Month 1)**
- Step 1: Communicate to the sales team that the model classifies leads at threshold 0.17, not 0.50. A lead scoring 0.25 probability is classified as "High" because at the cost matrix ($20 miss vs. $5 false positive), contacting that lead is economically justified.
- Step 2: Update the CRM field description for priority_tier to include the economic rationale so reps do not override High-tier designations based on a misunderstanding of the probability score.
- Step 3: Monitor total cost per cycle monthly. Target: ≤$4,010. If cost rises, re-calibrate the threshold.
- Owner: Sales Operations + Analytics

---

## Finding 5: Product Category Strategy

### How We Found It

All prior reporting aggregated revenue at the customer level with no product-category breakdown. This left a critical blind spot: different products acquire fundamentally different types of customers. We normalized product_category from 9 raw label variants (baby, baby care, baby products, etc.) to 6 canonical categories, then computed: total revenue, average transaction value, return rate, average discount depth, and — critically — the first-purchase repeat rate (whether a customer who first bought in this category returned for a second purchase within the observation window).

Return rate by channel was also computed to identify whether certain acquisition sources attract mismatched buyers who return products at above-average rates.

### The Finding

| Category | Transactions | Total Revenue | Avg Revenue | Return Rate | Avg Discount | First-Purchase Repeat Rate |
|---------|-------------|---------------|-------------|-------------|--------------|---------------------------|
| Baby | 474 | $39,903 | $84.72 | 7.0% | 8.4% | 52.4% |
| Home Care | 488 | $32,015 | $65.60 | 8.0% | 8.2% | 47.5% |
| Supplements | 458 | $31,198 | $68.87 | 9.0% | 8.9% | 47.7% |
| Personal Care | 463 | $26,873 | $58.17 | 8.0% | 8.1% | **58.0%** |
| Snacks | 489 | $19,533 | $40.27 | 8.0% | 8.5% | 51.6% |
| Beverages | 436 | $14,287 | $33.07 | 8.0% | 8.9% | 52.7% |

Personal Care has the highest first-purchase repeat rate (58.0%), making it the best gateway category for new customer acquisition — customers who start with Personal Care are statistically the most likely to return. Baby has the highest revenue per transaction ($84.72) and lowest return rate (7.0%), making it the hero upsell category. Beverages has the lowest revenue per transaction ($33.07) — less than 40% of Baby's AOV — suggesting it serves as a low-value entry point.

Return rate by acquisition channel reveals a secondary insight: Influencer-acquired customers return products at 6.6% — the lowest rate in the portfolio — while Email-acquired customers return at 8.9% — the highest. This 2.3pp gap, across ~400 transactions per channel, represents approximately 9 additional returns per Email channel cycle.

### Business Impact

Gateway category strategy: if 10% of new customer acquisition campaigns (e.g., top-of-funnel Google Shopping or Meta catalogue ads) prioritize Personal Care products, and Personal Care's 58% repeat rate holds, NovaMart acquires 5.8% more repeat customers per cohort versus acquiring them through Beverages (52.7% repeat) — a 10.2% relative improvement in 90-day retention for those customers, achieved through product selection alone.

Return rate: if Email channel returns drop from 8.9% to 7.5% through improved product descriptions (still above Influencer at 6.6% but a realistic improvement), and Email processes 406 transactions, this prevents approximately 5–6 additional returns per cycle. At avg Email transaction revenue of $61.73, this recovers $308–$370 per cycle in revenue that would otherwise be refunded.

### Actions and Implementation

**Action 1: Reposition Personal Care as the Acquisition Gateway (Month 2)**
- Step 1: Redesign top-of-funnel paid campaigns (Google Shopping, Meta catalogue) to feature Personal Care products as the entry-point SKUs. These campaigns should target new-customer audiences (exclude existing purchasers).
- Step 2: Set CRM attribution tracking so that a customer's first-purchased category is recorded at acquisition. This enables the analytics team to verify whether Personal Care first-purchasers continue to repeat-buy at 58% over time.
- Step 3: Train the recommendation algorithm (or email personalization logic) to cross-sell Baby products in the first post-purchase email for Personal Care first-buyers — combining the highest-repeat gateway with the highest-AOV category.
- Owner: Paid Acquisition Team + Product Marketing

**Action 2: Fix Email Return Rate (Month 1)**
- Step 1: Audit the top 10 most-returned Email-promoted SKUs. For each, assess: does the product description match the delivered item? Is there a known sizing or quality issue?
- Step 2: Add 360° product imagery (4+ angles) and a clear spec table to all Email featured products. Add a "Read 50 customer reviews" social proof link.
- Step 3: Re-run return rate analysis after 60 days. Target: reduce Email return rate from 8.9% to ≤8.0%.
- Owner: Content Team + Email Merchandising Manager

**Action 3: Strategic Review of Beverages (Month 3)**
- Step 1: Assess whether Beverages is a volume SKU (drives basket size for cross-sell) or a standalone category. Pull the data: of customers who buy Beverages, what is their next purchase category?
- Step 2: If Beverages serves primarily as an add-on to Baby or Snacks baskets, keep it but do not invest in standalone Beverages acquisition campaigns.
- Step 3: If Beverages is being used as a top-of-funnel entry point, discontinue: the $33 AOV acquires the lowest-value transaction in the portfolio.
- Owner: Category Management + Analytics

---

## Finding 6: Retention Crisis & Predicted CLV

### How We Found It

The retention analysis began with Kaplan-Meier survival analysis — a method borrowed from clinical trial research that estimates the probability of an event (second purchase) occurring over time, accounting for customers who have not yet had the event by the end of the observation window (right-censoring). This is the only statistically valid method for time-to-event analysis; standard regression would be biased by the large number of customers who have not yet made a second purchase.

The Kaplan-Meier result was unambiguous: among 1,477 customers with a first purchase, only 4 events (second purchases) occurred in the observation window. The survival function never drops to 0.5, meaning fewer than half of all customers ever make a second purchase — and the median time to a second purchase is, by definition, infinite.

Three pre-model hypothesis tests validated the features to be used in the retention prediction model: Mann-Whitney on revenue (repeaters vs. non-repeaters: U=298,741, p<0.0001 — repeaters spend significantly more), Mann-Whitney on acquisition cost (p=0.026 — high-cost acquisitions churn faster), and Chi-Square on loyalty tier (p=0.123 — loyalty tier alone does not predict repeat purchase).

Three models were trained and compared via 5-fold cross-validated AUC: Gradient Boosting (CV AUC 0.746), Random Forest (0.737), Logistic Regression (0.687). Gradient Boosting was selected. Three Multiple Linear Regression models (MLR) were also trained: Model A (Predict Customer LTV, R²=0.851), Model B (Predict Transaction Revenue, R²=0.716), and Model C (Predict Days-to-Convert, R²=−0.010 — failed, documented explicitly).

### The Finding

Base 90-day repeat rate: 24.3%. This means 75.7% of customers who have made one purchase have never made a second purchase within 90 days. NovaMart is operationally a one-time purchase business.

Retention model feature importance (Gradient Boosting): total_revenue is the top predictor (importance 0.240), followed by total_acquisition_cost (0.105), avg_pages_viewed (0.094), age (0.088), and total_sessions (0.070). The dominant signal is revenue — customers who spend more in their first purchase are more likely to return. This aligns directly with MLR Model A's finding: AOV is the dominant LTV predictor (R²=0.851).

Key comparison: repeaters spend $154 on average, non-repeaters $93 (Mann-Whitney p<0.0001). Every marketing initiative that increases first-order AOV also improves 90-day retention probability — these two objectives are not in tension, they are the same objective.

MLR Model A result: R²=0.851 means AOV, order frequency, and product category explain 85.1% of the variance in customer LTV. AOV is the dominant single predictor. A customer moving from Bronze AOV ($53.39) to Platinum AOV ($69.37) is predicted to have substantially higher LTV, independent of all other factors.

MLR Model C (Days-to-Convert) returned R²=−0.010 — a negative R² means the model performs worse than a horizontal mean line. Channel does not predict conversion speed. All channels average approximately 15 days from lead to first purchase. This is an honest failure that we document explicitly to prevent any conversion-speed targeting recommendations from being made.

| Metric | Value |
|--------|-------|
| Base 90-day repeat rate | 24.3% |
| Avg projected 6-month CLV | $141.28 |
| Top 10% CLV threshold | $260.78 |
| Repeater avg revenue | $154.62 |
| Non-repeater avg revenue | $93.26 |
| LTV model R² | 0.851 |
| Retention model CV AUC | 0.746 |

### Business Impact

If NovaMart improves 90-day repeat rate from 24.3% to 27.3% (+3pp), that is 72 additional repeat customers per 2,400-customer cohort. At an average repeater LTV of $154.62 vs. a non-repeater LTV of $93.26, each converted non-repeater adds approximately $61.36 in incremental LTV. 72 additional repeaters × $61.36 = $4,418 in additional LTV per cohort — without acquiring a single new customer.

The AOV lever is equally powerful: if 10% of customers increase first-order basket from $53 (Bronze AOV) to $60 — a $7 increase achievable through bundle recommendations — the MLR model predicts proportionally higher LTV. Given R²=0.851, this $7 AOV improvement translates to an estimated +$8–$12 in predicted LTV per customer (depending on coefficient magnitude). For 240 customers (10% of base), that is $1,920–$2,880 in additional CLV.

### Actions and Implementation

**Action 1: Set 45-Day Win-Back Trigger (Month 1)**
- Step 1: The current default assumption is a 90-day window. Based on the Kaplan-Meier analysis, the intervention must happen earlier — customers who will not return rarely do so after 45 days.
- Step 2: Configure the CRM to trigger a win-back sequence at day 45 post-first-purchase for any customer with no second order.
- Step 3: The sequence: Day 45 email — personalized product recommendations based on first purchase category. Day 52 email — "here's what's new." Day 60 email — final offer: free shipping on next order OR a 10% discount if the customer was originally acquired via Influencer or Affiliate channel (where discounts have positive uplift).
- Step 4: For customers predicted as High CLV by the Gradient Boosting model (projected 6m CLV > $200), escalate the Day 60 email to a personal outreach from a CRM rep — not automated email.
- Owner: CRM Manager + Email Developer + Analytics (for CLV score export)

**Action 2: Launch Starter Kit Bundles (Month 2)**
- Step 1: Design 2–3 "starter kit" product bundles that raise the basket value from single-item purchases. For example: a Personal Care starter kit (cleanser + moisturizer + serum) priced at $65–$75 vs. individual items at $20–$30.
- Step 2: Feature starter kits prominently in top-of-funnel paid ads targeting new customers. The objective is to shift new customers from Bronze-AOV first orders to Silver-AOV first orders.
- Step 3: In the checkout flow, add a "Complete Your Kit" upsell widget offering the bundle at a 10–15% saving over individual items. This increases AOV without deep discounting.
- Step 4: Measure: avg first-order AOV for bundle-offer traffic vs. control. Target: AOV increase of $5+ per first-order customer exposed to the bundle.
- Owner: Product + eCommerce + Pricing Team

**Action 3: CLV-Ranked CRM Investment (Month 2)**
- Step 1: Export the Gradient Boosting model's predicted 6-month CLV for all 2,400 customers.
- Step 2: Segment customers into 4 CLV investment tiers: Top Decile ($260+): manual VIP outreach, dedicated CSM. Upper Quartile ($141–$260): monthly personalized email + loyalty upgrade nudge. Middle Quartile ($70–$141): automated email cadence only. Bottom Quartile (<$70): suppressed from CRM campaigns for 90 days; re-evaluated quarterly.
- Step 3: CRM budget allocation: 50% of CRM spend on Top Decile (10% of customers), 30% on Upper Quartile, 20% on Middle Quartile, 0% on Bottom Quartile until they re-engage organically.
- Owner: CRM + Finance (budget approval) + Analytics

---

## Statistical Methodology Summary

| Analysis | Method Used | Why This Method Was Chosen | Alternative Considered |
|----------|------------|---------------------------|------------------------|
| Channel LTV comparison | Kruskal-Wallis (H=20.39) | LTV is heavily right-skewed. Kruskal-Wallis is robust to non-normality; ANOVA would be misleading. | ANOVA (also run for comparison, confirmed same direction) |
| Segment revenue validation | ANOVA + Kruskal-Wallis (dual) | Running both parametric and non-parametric provides triangulation. If both agree, the difference is robust to distributional assumptions. | Single test — rejected because segments violate normality |
| Discount causal effect | IPTW (ATE = −0.009) | Reps offer discounts to harder leads — selection bias makes raw correlation unreliable. IPTW creates a pseudo-randomized comparison by re-weighting observations. | Regression with discount flag (also run; confirms direction) |
| Time to second purchase | Kaplan-Meier survival analysis | Right-censored data — many customers have not yet had a second purchase by end of observation. Standard regression treats these as "never returned" which biases results downward. | Cox regression (considered for multi-covariate retention analysis) |
| Lead conversion model | 5-model 5-fold CV AUC | CV prevents overfitting to one test split. AUC handles class imbalance (63% non-converters). Comparing 5 models avoids commitment to one architecture before testing. | Single model with test accuracy — rejected due to class imbalance |
| LTV prediction | MLR with 75/25 train/test split (R²=0.851) | MLR provides interpretable coefficients that connect business levers (AOV, order frequency) to outcomes. The high R² confirms the linear structure is appropriate. | Gradient Boosting regression (higher R² but lower interpretability) |
| Budget allocation | Composite scoring (4 KPIs) | Single metrics reward one dimension. Blending ROAS, LCR, LTV, and repeat rate reflects the full value of a customer acquisition channel. | ROAS-only reallocation — rejected because it ignores customer quality |
| Confidence intervals | Bootstrap (2,000 resamples) | No distributional assumption required. Works with the skewed revenue distributions in this dataset. | Parametric CIs — not used due to non-normality of revenue |
| Revenue inequality | Gini coefficient (0.673) | Industry-standard inequality measure directly comparable to macroeconomic benchmarks. 0 = perfect equality, 1 = one customer has all revenue. | Percentile comparisons (also computed: top 1% vs bottom 50%) |
| Cluster validation | Silhouette score + elbow curve | Silhouette directly measures cohesion (intra-cluster similarity) vs. separation (inter-cluster distance). Elbow curve provides a visual check. Both methods agree on k=4. | Gap statistic (tested, confirmed k=4) |

---

## 30/60/90-Day Priority Action Plan

### Next 30 Days — Immediate Fixes (High ROI, Low Complexity)

**1. Contact 6 Champion customers not on email list**
- What: Identify alternative contact channel (SMS, loyalty portal, direct mail) for 6 Champions with no email address.
- Why urgent: Each Champion generates $1,347 avg revenue. Losing one due to uncontactability costs the equivalent of 52 average customers. There is no fallback.
- Owner: CRM Manager

**2. Audit MKT2021 spend anomaly ($999,999 spend, ROAS 0.009)**
- What: Pull raw spend and revenue data for MKT2021. Determine if $999,999 is a real spend or a data entry error.
- Why urgent: If real, this campaign represents $990,000 in unrecovered spend — the largest single budget waste in the analysis. If an error, the budget reallocation model is distorted.
- Owner: Marketing Finance + Media Agency

**3. Implement 1-hour abandoned cart email for 784 Engaged Browsers**
- What: Configure cart abandonment trigger in email automation platform. Email 1 at 1 hour, Email 2 at 24 hours, Email 3 at 72 hours (discount only for Influencer/Affiliate source).
- Why urgent: Expected incremental revenue $11,600–$17,300. Setup time: 1–3 days for a developer. The leads are identified; implementation is a pure engineering task.
- Owner: Email + CRM Developer

**4. Tag all 5,224 leads with priority_tier in CRM**
- What: Export model scores from the analytics pipeline. Write back priority_tier (High / Medium / Low) to CRM. Configure sales rep views to surface High-priority leads first.
- Why urgent: Every day without prioritization, reps are spending time on Low-tier leads (avg conversion probability 15%) instead of High-tier leads (77.9%). The opportunity cost compounds daily.
- Owner: CRM Developer + Analytics + Sales Ops

### Next 60 Days — Structural Changes (Medium Complexity)

**5. Begin Affiliate budget reduction — cap at 30% of total spend**
- What: Stop approving new Affiliate campaign spend above the 30% threshold. Redirect excess to Paid Search test campaigns.
- Implementation: Notify affiliate partners of new performance thresholds ($70 minimum 90-day LTV). Non-compliant partners are not renewed.
- Owner: Paid Media Manager

**6. Launch Paid Search expansion with reallocated funds**
- What: Begin $50K/month incremental Paid Search investment using funds freed from Affiliate reduction. Measure ROAS and LTV at each increment before scaling further.
- Owner: Paid Search + Analytics

**7. Add repeat_rate and 90-day LTV as mandatory campaign KPIs**
- What: Modify campaign reporting templates. All new campaigns must include ROAS, 90-day Repeat Rate, Avg 90-day LTV, and Composite Score columns.
- Implementation: Build an automated lookback view in the CRM that joins campaign_id to customer_id to repeat_purchase_within_90d.
- Owner: Analytics + Campaign Management

**8. Set 45-day CRM win-back trigger**
- What: Configure automated win-back email sequence to fire at day 45 post-first-purchase (not day 90) for customers with no second order.
- Owner: CRM Developer + Email Marketing

### Next 90 Days — Strategic Initiatives (Higher Complexity)

**9. Launch Personal Care first-purchase funnel**
- What: Redesign top-of-funnel paid acquisition campaigns to feature Personal Care as the entry SKU. Track first-category attribution and measure repeat purchase rates against Beverages-first cohort as control.
- Expected outcome: 58% repeat rate vs. 52.7% for Beverages-first acquisition — 5.3pp retention improvement for the acquired cohort.
- Owner: Paid Acquisition + Product Marketing

**10. Pilot VIP program for Champions segment**
- What: Early product access, dedicated account contact, exclusive bundle pricing (no deep discounts). Start with the 12 Champions who are on email; expand when non-email Champions are recontacted.
- Owner: Brand + CRM + Product

**11. Complete budget reallocation to target distribution**
- What: Achieve final allocation — Paid Search 24.8%, Search 18.4%, Display 17.1%, Email 13.7%, Paid Social 14.6%, Affiliate 9.4%, Influencer 2.0%.
- Implementation: Quarter-by-quarter shifts with performance validation at each stage. Do not execute the full 33pp Affiliate reduction in one step — monitor performance impact.
- Owner: CMO + Finance + Paid Media

**12. Review Beverages category positioning**
- What: Determine if Beverages serves as a basket add-on or standalone acquisition vehicle. Pull second-purchase category data for Beverages-first customers. Decision: premiumize the range or eliminate from acquisition campaigns.
- Owner: Category Management + Analytics

---

*NovaMart Analytics Pipeline v2.0 · Data period: 2024–2025 · Prepared by: Analytics Team*
*All findings are statistically validated. Methods and test results are documented in full in the analytical report.*`;

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
