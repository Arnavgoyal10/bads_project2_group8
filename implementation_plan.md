# NovaMart Marketing Analytics Capstone — Implementation Plan

## Background

**Client**: NovaMart (fictional retailer)
**Business Question**: How should NovaMart improve marketing efficiency and customer growth over the next quarter?
**Ambition level**: Minimum requirements met + significant above-and-beyond work that distinguishes this as a top-tier submission.

We have **5 raw data files** + data dictionary + readme:

| File | Rows | Key Join Field(s) |
|------|------|-------------------|
| customers | 2,418 | customer_id |
| campaigns | 39 | campaign_id |
| leads | 5,224 | lead_id, customer_id, campaign_id |
| website_sessions | 19,045 | session_id, customer_id, campaign_id |
| transactions | 2,808 | order_id, customer_id |

**Expected joins:**
- `customers.customer_id` ↔ `leads / website_sessions / transactions`
- `campaigns.campaign_id` ↔ `leads / website_sessions`

---

## Proposed Changes

### Phase 1 — Data Audit & Analytical Base Table (Section A)

#### [NEW] `01_data_audit.py`

**Goal**: Build a clean, analysis-ready foundation and document every data quality issue.

**Tasks:**

1. **Load all 5 raw CSVs** with encoding handling (BOM-aware)
2. **Document data quality issues per table:**

   **customers (2,418 rows)**
   - Duplicate `customer_id` detection and deduplication strategy
   - Missing values: `age`, `city`, `gender`, `income_band`
   - Invalid ages (negatives, >120, text values)
   - Inconsistent `gender` labels (Male/male/M/MALE → normalize)
   - Inconsistent `region` labels (South West / south west / SW → normalize)
   - `signup_date` mixed formats: `2024-10-10`, `2025/01/03`, `Oct 10, 2024` → parse all to datetime
   - `preferred_device` inconsistent casing
   - `email_opt_in` mixed encodings (Yes/No/True/False/1/0)
   - `loyalty_tier` inconsistent labels

   **campaigns (39 rows)**
   - `start_date` / `end_date` mixed formats → parse to datetime
   - `budget_usd` mixed formats: `"65,494"`, `"$63,041.00"` → strip to float
   - `spend_usd` mixed formats: `25081.0`, `"USD 70,687.00"` → strip to float
   - Spend > Budget anomalies → flag and document (do NOT silently drop)
   - `target_region` inconsistent labels (All / nationwide / all → normalize)
   - `clicks` mixed number formatting and anomalies (clicks > impressions?)
   - `channel` inconsistent labels
   - Compute campaign duration (days)

   **leads (5,224 rows)**
   - Missing `customer_id` (anonymous leads) — keep, flag as anonymous
   - Missing `campaign_id` — keep, flag as unattributed
   - `lead_date` mixed formats → parse to datetime
   - `lead_source` inconsistent labels (Meta/meta/META → normalize)
   - `discount_offered_pct` inconsistent formats (text-coded: "15%", 15, "15 percent")
   - `lead_score` mixed data types (text + numeric) → coerce
   - `converted_30d` mixed encodings (Yes/1/True/No/0/False) → bool
   - `conversion_date` before `lead_date` → flag as impossible, treat as missing
   - `acquisition_cost_usd` mixed formats ("$21.24", "USD 7.06", 6.5) → float
   - Leads with conversion_date but converted_30d=No → document conflict

   **website_sessions (19,045 rows)**
   - `session_date` mixed formats + timestamps → parse to datetime
   - `device` inconsistent labels
   - `channel_group` inconsistent labels
   - `pages_viewed` invalid values (0, negatives, extreme outliers)
   - `time_on_site_sec` invalid values (0, negatives, >24h)
   - `bounce` mixed encodings (True/False/1/0/yes/no) → bool
   - `add_to_cart` mixed encodings → bool
   - `checkout_started` mixed encodings → bool
   - Weak joins to campaign/customer — count match rates, document
   - `geo_region` inconsistent labels

   **transactions (2,808 rows)**
   - `order_date` mixed formats ("Apr 10, 2025", ISO, etc.) → parse to datetime
   - `revenue_usd` mixed formats, impossible values (negative, zero) → flag
   - `discount_pct` mixed formats → float
   - `returned_flag` mixed encodings → bool
   - `units` invalid values (0, negatives) → flag
   - `payment_type` inconsistent labels
   - `product_category` inconsistent labels
   - `marketing_channel_last_touch` inconsistent labels
   - Last-touch attribution ambiguities — document

3. **Write Data Audit Note** (`outputs/data_audit_note.md`):
   - Every issue found, per table
   - Treatment decision for each issue (drop / impute / flag / keep)
   - Assumptions and exclusions
   - Unresolved risks (e.g. anonymous leads, weak joins)
   - Join match rates across all table pairs

4. **Build Analytical Base Table (ABT)** (`outputs/analytical_base_table.csv`):
   - Master record: one row per customer
   - Left-join from customers → leads (aggregated) → sessions (aggregated) → transactions (aggregated)
   - Keep all customers even if no matching leads/sessions/transactions
   - Flag anonymous/unmatched records

5. **Define & compute all KPIs** (clearly named, documented):

   | KPI | Formula | Source |
   |-----|---------|--------|
   | Lead Conversion Rate (LCR) | converted_30d / total leads | leads |
   | Cost Per Lead (CPL) | total spend / total leads | campaigns + leads |
   | Cost Per Acquisition (CPA) | total spend / converted leads | campaigns + leads |
   | Click-Through Rate (CTR) | clicks / impressions | campaigns |
   | Return on Ad Spend (ROAS) | revenue / spend | campaigns + transactions |
   | Average Order Value (AOV) | total revenue / total orders | transactions |
   | Repeat Purchase Rate (RPR) | customers with >1 order / total customers | transactions |
   | Return Rate | returned orders / total orders | transactions |
   | Average Lead Score | mean(lead_score) | leads |
   | Session Engagement Score | pages_viewed + add_to_cart + checkout_started signals | website_sessions |
   | Customer Lifetime Value (CLV) proxy | sum(revenue_usd) per customer | transactions |
   | RFM Score | Recency (days since last order) + Frequency (order count) + Monetary (total spend) — composite score | transactions |
   | Engagement Depth Score | Weighted composite: (checkout_started × 3) + (add_to_cart × 2) + (pages_viewed / 10) − (bounce × 1) | website_sessions |
   | Budget Efficiency Ratio | ROAS / (spend / budget) — how well the campaign used its allocated budget | campaigns |
   | Discount Lift | LCR with discount − LCR without discount, per channel/region | leads |
   | Days to Convert | conversion_date − lead_date, for converted leads | leads |

6. **Above & Beyond — Data Quality Scoring**:
   - Assign each raw table a **Data Quality Score (0–100)** based on: % complete fields, % valid formats, % successful joins, % outlier-free records
   - Publish a one-page **Data Maturity Report** summarizing scores and priority fixes for NovaMart's data team
   - This positions the submission as operationally aware, not just analytically competent

---

### Phase 2 — Descriptive & Statistical Diagnosis (Section B)

#### [NEW] `02_descriptive_stats.py`

**Tasks:**

1. **Channel performance analysis**:
   - Lead volume, LCR, CPL, CPA, ROAS by channel
   - Revenue and repeat buying by acquisition channel
   - Answer: *Which channels generate the most leads? Most valuable customers?*

2. **Campaign objective analysis**:
   - LCR, revenue, repeat purchase by objective (Lead Gen vs Awareness)
   - Identify campaigns efficient on volume but weak on conversion/revenue

3. **Creative type analysis**:
   - Conversion and revenue by creative_type (Video, Carousel, Promo, etc.)

4. **Regional analysis**:
   - LCR, AOV, revenue, repeat buying by region and city
   - Answer: *Which regions respond best to which approaches?*

5. **Device analysis**:
   - Session engagement, conversion, AOV by device

6. **Statistical significance testing**:
   - Chi-square tests for conversion rate differences across channels, regions, devices
   - Mann-Whitney U / t-tests for AOV differences across groups
   - Document effect sizes — not just p-values
   - Answer: *Are observed differences large enough to be meaningful or accidental?*

7. **Discounting analysis**:
   - Does discount_offered_pct improve conversion rate? (regression/correlation)
   - Does the effect vary by customer type, channel, region, campaign objective, landing page?
   - Compare revenue with vs. without discounts (margin impact)
   - Answer: *Does discounting justify margin sacrifice? For whom?*

8. **Customer value differences**:
   - CLV proxy, AOV, RPR by region, loyalty_tier, income_band, preferred_device, acquisition channel
   - Answer: *Meaningful differences in customer value across groups?*

9. **Website session signals**:
   - Correlation of pages_viewed, time_on_site, add_to_cart, checkout_started with lead conversion
   - Logistic regression / correlation matrix
   - Answer: *Which engagement signals predict conversion vs. low-quality traffic?*

10. **Outlier impact analysis**:
    - Recompute key metrics with/without flagged outliers
    - Answer: *Which anomalies materially distort the business story?*

**Outputs**: `outputs/descriptive_report.md`, charts in `outputs/charts/`

11. **Above & Beyond — RFM Analysis**:
    - Build a formal **RFM (Recency, Frequency, Monetary) scoring matrix** per customer
    - Score each dimension 1–5, create composite RFM tier (e.g. Champions, At Risk, Lost Causes, New Customers)
    - Cross-tabulate RFM tier vs. acquisition channel and campaign type
    - Reveal which channels acquire Champions vs. which acquire low-quality, one-time buyers

12. **Above & Beyond — Cohort Retention Curves**:
    - Group customers by acquisition month (signup_date cohort)
    - Track their purchase activity over subsequent months
    - Plot **retention curves** to show which acquisition cohorts retained best
    - Identify which campaigns / channels produced the stickiest cohorts

13. **Above & Beyond — Marketing Attribution Comparison**:
    - Implement **three attribution models** on transactions + sessions:
      - Last-touch (already in data)
      - First-touch (infer from earliest session per customer)
      - Linear (distribute credit equally across touchpoints)
    - Show how channel revenue rankings change under each model
    - Warn management which model inflates or deflates which channel

14. **Above & Beyond — Landing Page Deep-Dive**:
    - Rank all landing pages by LCR, AOV, and bounce rate
    - Identify the 2–3 highest-converting pages and the 2–3 worst drain pages
    - Tie landing page performance back to campaign creative type

**Outputs**: `outputs/descriptive_report.md`, `outputs/rfm_analysis.md`, `outputs/cohort_retention.png`, charts in `outputs/charts/`

---

### Phase 3 — Customer Segmentation (Section C)

#### [NEW] `03_segmentation.py`

**Tasks:**

1. **Feature construction** for clustering:
   - Demographics: age, gender, region, income_band, loyalty_tier
   - Behavioral: avg pages_viewed, avg time_on_site, add_to_cart rate, checkout rate, bounce rate
   - Commercial: CLV proxy, AOV, RPR, return rate, discount sensitivity

2. **Preprocessing**:
   - Encode categoricals (label or one-hot)
   - Scale numerics (StandardScaler)
   - Handle NaNs (customers with no transactions/sessions → impute or flag)

3. **Clustering**:
   - K-Means with elbow method + silhouette scores to choose K
   - Validate with at least one alternative (e.g. hierarchical clustering or DBSCAN)
   - Final: 4–6 interpretable segments

4. **Segment profiling** (in plain business language):
   For each segment answer:
   - **Who they are** (demographics, loyalty tier, income)
   - **How they behave** (sessions, engagement, bounce, cart)
   - **How valuable they appear** (CLV, AOV, RPR, return rate)
   - **Which campaigns/channels reach them best**
   - **What management should do next quarter** (actionable recommendation)

5. **Visualizations**: Radar charts, segment bar charts, heatmaps, t-SNE 2D cluster plot

6. **Above & Beyond — Persona Cards**:
   - For each segment, create a **named marketing persona** (e.g. "Budget-Conscious Browser", "High-Intent Power Buyer")
   - Include: fictional name, key stats, quote representing their mindset, recommended channel, recommended offer type
   - Makes segmentation tangible and memorable for non-technical stakeholders

7. **Above & Beyond — Segment Migration Potential**:
   - Identify which low-value segments are **closest** (in feature space) to high-value segments
   - Recommend the minimum intervention (e.g. a single discount nudge, one email re-engagement) most likely to migrate them

8. **Above & Beyond — Email Opt-In Segment Overlay**:
   - Cross-tabulate segments with `email_opt_in` status
   - Identify which high-value segments are NOT opted in → missed CRM opportunity
   - Quantify the revenue at risk from non-opted high-value customers

**Outputs**: `outputs/segmentation_report.md`, `outputs/persona_cards.md`, segment assignment added to ABT

---

### Phase 4 — Campaign & Channel Grouping (Section D)

#### [NEW] `04_campaign_grouping.py`

**Tasks:**

1. **Feature construction** per campaign:
   - Spend, impressions, clicks, CTR
   - Lead volume, LCR, CPL, CPA
   - Revenue attributed, ROAS
   - Repeat purchase rate of acquired customers

2. **Clustering campaigns**:
   - K-Means or hierarchical on normalized campaign features
   - Identify 3–5 natural groupings

3. **Group labeling** (business language):
   - Separate **high-volume** from **high-quality** campaigns
   - For each group: Scale Up / Redesign / Maintain / Stop recommendation

4. **Specific outputs**:
   - Which campaigns are surface-efficient (high impressions/clicks) but weak on conversion/revenue?
   - Which campaigns deliver genuine commercial value?

5. **Above & Beyond — Efficiency Frontier Plot**:
   - Scatter plot every campaign with **ROAS on Y-axis** vs. **total spend on X-axis**, sized by lead volume
   - Draw a Pareto efficiency frontier — campaigns below the frontier are inefficient for their spend level
   - This is a single chart that tells the CMO instantly which campaigns are wasteful

6. **Above & Beyond — Campaign Lifecycle Analysis**:
   - For each campaign, track weekly/daily CTR and LCR over the campaign's active window
   - Identify campaigns with **decaying performance** (started strong, dropped off)
   - Identify campaigns with **ramp-up lag** (slow start but strong finish)
   - Recommend optimal campaign durations based on empirical performance curves

7. **Above & Beyond — Creative Type × Objective Matrix**:
   - 2D heatmap: Creative Type (rows) × Campaign Objective (columns) → cell value = average LCR
   - Instantly shows which creative format works best for each objective
   - Highly visual, highly actionable for the media planning team

**Outputs**: `outputs/campaign_grouping_report.md`, `outputs/efficiency_frontier.png`

---

### Phase 5 — Lead Conversion Prediction (Section E)

#### [NEW] `05_lead_prediction.py`

**Tasks:**

1. **Target variable**: `converted_30d` (binary: 1=converted, 0=not)

2. **Features**:
   - Lead: lead_source, landing_page, discount_offered_pct, lead_score, observed_region, campaign_id
   - Customer: age, gender, income_band, loyalty_tier, preferred_device
   - Session signals: pages_viewed, time_on_site, add_to_cart, checkout_started (join on customer_id)

3. **Model comparison** (must compare >1):
   - Logistic Regression (interpretable baseline)
   - Random Forest (non-linear, feature importance)
   - XGBoost / Gradient Boosting (performance)
   - Evaluate: AUC-ROC, Precision, Recall, F1, Confusion Matrix

4. **Feature importance**: SHAP values or permutation importance

5. **Business translation**:
   - Convert model output to **lead prioritization tiers** (e.g. High/Medium/Low probability)
   - Provide a rule a business team could actually use (e.g. "Prioritize leads with score >X from Meta channel with add_to_cart=True")
   - Answer: *Can leads be prioritized more intelligently?*

6. **Defend final choice** on business AND analytical grounds — not just accuracy

7. **Above & Beyond — Calibration Curve**:
   - Plot predicted probability vs. actual conversion rate (reliability diagram)
   - Apply Platt scaling or isotonic regression if model is poorly calibrated
   - Calibration matters for business thresholding — an uncalibrated model gives misleading probabilities

8. **Above & Beyond — Threshold Optimization by Business Cost**:
   - Define a business cost matrix: cost of missing a real converter vs. cost of wasting effort on a non-converter
   - Find the optimal classification threshold that minimizes expected business cost (not just maximizes F1)
   - Express the result as: "Set the threshold at X% probability → expected revenue uplift of Y% vs. random calling"

9. **Above & Beyond — Lead Score Decile Analysis**:
   - Bin all leads into 10 deciles by predicted probability
   - Show cumulative lift chart: "Top 20% of scored leads capture X% of all conversions"
   - Translate directly into a sales prioritization policy: work top 3 deciles first

10. **Above & Beyond — SHAP Waterfall Plot per Lead Tier**:
    - Show SHAP waterfall for a representative High / Medium / Low priority lead
    - Makes the model's reasoning transparent to a non-technical sales manager

**Outputs**: `outputs/lead_prediction_report.md`, `outputs/lead_scores.csv`, `outputs/lift_chart.png`

---

### Phase 6 — Customer Retention Prediction (Section F)

#### [NEW] `06_retention_prediction.py`

**Chosen task**: Predict whether a newly acquired customer will make **another purchase within 90 days** (repeat buyer prediction)

**Tasks:**

1. **Target variable**: Binary — did the customer transact again within 90 days of first order?

2. **Features**:
   - Customer: age, gender, income_band, loyalty_tier, region, preferred_device
   - Acquisition: lead_source, channel, discount_offered_pct, acquisition_cost
   - First transaction: product_category, payment_type, revenue_usd, discount_pct, units

3. **Models**:
   - Logistic Regression (baseline)
   - Random Forest / XGBoost (main)
   - Evaluate: AUC-ROC, Precision, Recall

4. **Answer required questions**:
   - Which variables are most informative? (feature importance)
   - What are early warning signs of weak-quality acquisition?
   - How should targeting, discounting, and channel mix change based on results?

5. **Above & Beyond — BG/NBD-style Simplified CLV Projection**:
   - Use transaction recency + frequency to project expected number of future purchases per customer over the next 6 months
   - Rank customers by projected CLV, not just historical spend
   - Flag top 10% projected CLV customers currently NOT in the highest loyalty tier → upgrade candidate list for CRM

6. **Above & Beyond — First-Purchase Category as Retention Predictor**:
   - Test whether a customer's first product category predicts their retention probability
   - Identify "gateway categories" that lead to strong retention vs. "dead-end categories" that produce one-time buyers
   - Directly actionable: retarget first-buyers in dead-end categories with gateway-category offers

7. **Above & Beyond — Acquisition Cost vs. Predicted CLV Matrix**:
   - Plot each customer's acquisition_cost_usd vs. their projected CLV
   - Flag customers where acquisition cost > projected CLV → loss-making acquisitions
   - Quantify the total loss-making acquisition spend and which channels produce the most of them

**Outputs**: `outputs/retention_prediction_report.md`, `outputs/clv_projection.csv`

---

### Phase 7 — Executive Reporting Layer (Section G)

#### [NEW] `07_executive_dashboard.py`

**Goal**: Manager-friendly reporting view — usable by non-technical marketing managers.

**Approach**: Build an interactive HTML dashboard using **Plotly Dash** or export a **self-contained HTML report**.

**Dashboard panels**:

1. **KPI Summary Card Row**: Total Leads, LCR, ROAS, AOV, Repeat Purchase Rate, Total Revenue
2. **Channel Performance**: Bar chart — leads, conversions, revenue, ROAS by channel
3. **Campaign Performance Table**: Sortable — spend, LCR, CPA, ROAS, campaign group label
4. **Regional Heatmap**: Conversion rate and revenue by region
5. **Customer Segment Overview**: Segment sizes, CLV, recommended action
6. **Discount Impact View**: LCR with vs. without discounts by channel/region
7. **Lead Scoring Distribution**: Histogram of lead scores by conversion outcome
8. **Website Engagement Funnel**: sessions → add_to_cart → checkout → conversion
9. **Top Performing vs. Underperforming Campaigns**: Clear visual separation
10. **What is working / What is underperforming / Where money is wasted** — executive summary panel

**Standards**: Easy to interpret, no jargon, clear labels, actionable callouts

**Above & Beyond — Dashboard Design Elevations**:
- **Dark-mode, brand-consistent design** using NovaMart color palette (deep navy + orange accent)
- **Fully self-contained single HTML file** — no server required, email-safe, opens in any browser
- **Interactive filters**: date range picker, channel selector, region selector — all panels respond simultaneously
- **Traffic light indicators** on every KPI card: green (target met), amber (watch), red (underperforming) — threshold defined per KPI
- **Executive summary text panel** auto-generated from data: "Channel X leads on conversion. Region Y is underperforming on revenue by Z%." — written in plain English, updated by code
- **Annotated charts**: key inflection points marked with text callouts (e.g. "Discount campaign launched here")
- **Downloadable data table**: campaign performance table exportable to CSV from within the dashboard
- **Mobile-responsive layout**: readable on tablet for presentations

**Outputs**: `outputs/executive_dashboard.html` (single self-contained file, <5MB)

---

### Phase 8 — Final CMO Memo (Section H)

#### [NEW] `outputs/cmo_memo.pptx` (max 20 slides)

**Required slide structure**:

| Slide | Content |
|-------|---------|
| 1 | Title slide — NovaMart Marketing Analytics Q-Review |
| 2 | Agenda / What this deck answers |
| 3 | Data overview + key quality flags (transparent) |
| 4 | Top Finding #1 — Best acquisition channels |
| 5 | Top Finding #2 — Campaign efficiency vs. quality |
| 6 | Top Finding #3 — Regional & device patterns |
| 7 | Top Finding #4 — Discounting effectiveness |
| 8 | Top Finding #5 — Customer segments & their value |
| 9 | Lead prioritization model — how to use it |
| 10 | Retention model — early warning signals |
| 11 | Top 3 Actions for next quarter |
| 12 | Budget: Where to increase spend |
| 13 | Budget: Where to reduce or redesign |
| 14 | Risks & data limitations leadership must know |
| 15 | Appendix — KPI definitions |
| 16–20 | Supporting charts (as needed) |

**Must answer all 8 management questions:**
1. Which channels generate most leads? Most valuable customers?
2. Which campaign types are surface-efficient but weak after conversion/revenue?
3. Which regions, cities, devices respond best to which approaches?
4. Does discounting justify margin sacrifice? For whom?
5. Which digital behaviors signal intent vs. low-quality traffic?
6. Which segments deserve differentiated messaging, budget, retention treatment?
7. Can leads be prioritized more intelligently?
8. Where should management increase / redesign / stop spending?

**Generated with**: `python-pptx` library

**Above & Beyond — Slide Design Elevations**:
- Each slide uses a consistent, professional dark-navy theme with clear typography hierarchy
- Every data claim on every slide is **directly traceable to a specific output file** (footnoted)
- Finding slides follow a strict **"So what? → Evidence → Action"** structure — not just charts
- Budget recommendation slides use a **2×2 matrix** (Invest More / Optimize / Monitor / Cut) for instant readability
- Risks & Limitations slide is written as **"What we know vs. what we don't know"** — more honest and more impressive than a standard disclaimer
- Include one **"What we'd do with more data"** slide — shows analytical maturity and forward thinking

---

### Phase 9 — Project Structure & Submission

```
bads_project2/
├── data/                         # Raw input files (unchanged)
├── outputs/
│   ├── analytical_base_table.csv
│   ├── data_audit_note.md
│   ├── descriptive_report.md
│   ├── segmentation_report.md
│   ├── campaign_grouping_report.md
│   ├── lead_prediction_report.md
│   ├── retention_prediction_report.md
│   ├── executive_dashboard.html
│   ├── cmo_memo.pptx
│   └── charts/
├── 01_data_audit.py
├── 02_descriptive_stats.py
├── 03_segmentation.py
├── 04_campaign_grouping.py
├── 05_lead_prediction.py
├── 06_retention_prediction.py
├── 07_executive_dashboard.py
├── 08_cmo_memo.py
├── main.py                       # Master runner — runs all phases in order
├── requirements.txt              # Pinned dependencies
└── README.md                     # Project overview and how to reproduce
```

**Above & Beyond — Reproducibility Standards**:
- `requirements.txt` with pinned library versions
- `main.py` accepts `--phase N` flag to run a single phase independently
- All random seeds set (clustering, model training) → results are fully reproducible
- `README.md` with: project context, how to run, output descriptions, known data limitations
- All file paths relative (not hardcoded) → works on any machine

---

## Going Above & Beyond — Summary of Differentiators

> [!TIP]
> These additions are not required by the brief but will materially elevate the submission from "meets requirements" to "best in class".

### Advanced Analytics Layer
| Enhancement | Phase | Business Value |
|-------------|-------|----------------|
| RFM scoring matrix + tier labels | 2 | Identifies champion vs. at-risk customers with zero ambiguity |
| Cohort retention curves by acquisition month | 2 | Shows which campaigns produced lasting customers, not just conversions |
| Three-model attribution comparison (last/first/linear) | 2 | Exposes channel over/under-credit — critical for budget decisions |
| Landing page deep-dive ranking | 2 | Directly actionable for web/content team |
| Named persona cards per segment | 3 | Makes segmentation memorable for non-technical leadership |
| Segment migration analysis | 3 | Identifies cheapest path to upgrading low-value customers |
| Email opt-in gap analysis | 3 | Quantifies missed CRM revenue from non-opted high-value segments |
| ROAS efficiency frontier plot | 4 | Single chart that tells CMO which campaigns are wasteful |
| Campaign lifecycle decay curves | 4 | Reveals optimal campaign durations empirically |
| Creative type × objective performance heatmap | 4 | Directly guides future media planning |
| Data Quality Score per table | 1 | Shows analytical maturity; gives NovaMart a data ops roadmap |

### Advanced Modeling Layer
| Enhancement | Phase | Business Value |
|-------------|-------|----------------|
| Calibration curve + Platt scaling | 5 | Ensures predicted probabilities are trustworthy for thresholding |
| Business cost matrix threshold optimization | 5 | Converts model output to expected revenue uplift — not just accuracy |
| Cumulative lift / decile chart | 5 | Proves the model is 2–3× better than random calling |
| SHAP waterfall per lead tier | 5 | Makes model reasoning transparent to sales managers |
| Simplified CLV projection (6-month) | 6 | Surfaces high-future-value customers before they've spent big |
| First-purchase gateway category analysis | 6 | Identifies which product categories predict long-term retention |
| Acquisition cost vs. projected CLV matrix | 6 | Quantifies which channels are acquiring loss-making customers |

### Presentation & Communication Layer
| Enhancement | Phase | Business Value |
|-------------|-------|----------------|
| Dark-mode, interactive, self-contained HTML dashboard | 7 | Opens in email, on tablet, in boardroom — zero friction for management |
| Traffic-light KPI indicators with defined thresholds | 7 | Instant status comprehension, no number-reading required |
| Auto-generated plain-English executive summary text | 7 | Dashboard tells the story, not just shows the data |
| Annotated chart inflection points | 7 | Contextualizes data spikes for non-analysts |
| "So what → Evidence → Action" slide structure | 8 | Every slide drives a decision, not just shares a finding |
| "What we know vs. what we don't" risk framing | 8 | More credible and impressive than a standard disclaimer |
| "What we'd do with more data" forward-looking slide | 8 | Demonstrates analytical maturity |
| Fully reproducible codebase with README | 9 | Professional standard; shows the work can be trusted and rerun |

---

## Guardrails Compliance

> [!IMPORTANT]
> Every guardrail from the PDF is addressed in the implementation:

| Guardrail | How Addressed |
|-----------|--------------|
| Cannot ignore data quality | Phase 1: Full audit, documented in `data_audit_note.md` |
| Cannot bury issues in appendix | Data issues are in the main findings, not hidden |
| Cannot present metrics without defining them | KPI table with formulas in Phase 1 |
| Must separate data issues from business findings | Phase 1 (data) is separate from Phases 2–6 (business) |
| Must explain assumptions and exclusions | Documented in audit note per table |
| Must defend recommendations as financially sensible | Each phase has business-language justification |
| Must not treat accuracy alone as business success | Phases 5 & 6 include business rule translation |
| Must not confuse lead volume with customer quality | Phases 2 & 4 explicitly separate volume from quality |
