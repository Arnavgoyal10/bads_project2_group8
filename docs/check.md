
## PDF Compliance Checklist

Every line of the project brief, verified:

### Section 1 — Project Context
- [x] NovaMart context understood
- [x] Business question stated: marketing efficiency and customer growth

### Section 2 — Data Assets
- [x] customers (2,418 rows) — loaded, audited
- [x] campaigns (39 rows) — loaded, audited
- [x] leads (5,224 rows) — loaded, audited
- [x] website_sessions (19,045 rows) — loaded, audited
- [x] transactions (2,808 rows) — loaded, audited
- [x] Duplicate IDs in customers — addressed in Phase 1
- [x] Missing demographics, invalid ages — addressed in Phase 1
- [x] Mixed date formats (campaigns) — addressed in Phase 1
- [x] Malformed currency in budget_usd / spend_usd — addressed in Phase 1
- [x] Inconsistent region labels in campaigns — addressed in Phase 1
- [x] Unusual clicks/impressions anomalies — addressed in Phase 1
- [x] Missing keys in leads — addressed in Phase 1
- [x] Inconsistent source labels in leads — addressed in Phase 1
- [x] Text-coded numerics in leads — addressed in Phase 1
- [x] Conversion timing issues in leads — addressed in Phase 1
- [x] Boolean coding issues in website_sessions — addressed in Phase 1
- [x] Session quality anomalies — addressed in Phase 1
- [x] Weak joins to campaign/customer in sessions — addressed in Phase 1
- [x] Date inconsistencies in transactions — addressed in Phase 1
- [x] Impossible values in transactions — addressed in Phase 1
- [x] Discount issues in transactions — addressed in Phase 1
- [x] Last-touch attribution ambiguities — addressed in Phase 1

### Section 2 — Expected Joins
- [x] customers.customer_id ↔ leads.customer_id
- [x] customers.customer_id ↔ website_sessions.customer_id
- [x] customers.customer_id ↔ transactions.customer_id
- [x] campaigns.campaign_id ↔ leads.campaign_id
- [x] campaigns.campaign_id ↔ website_sessions.campaign_id

### Section A — Data Audit & Analytical Base Table
- [x] Build clean, analysis-ready foundation
- [x] Identify and document every major data quality issue
- [x] Treat duplicates — strategy defined
- [x] Treat missing values — strategy defined
- [x] Treat inconsistent categories — normalization
- [x] Treat malformed numerics — stripping/coercion
- [x] Treat invalid dates — multi-format parsing
- [x] Treat outliers — flag and document
- [x] Treat failed joins — match rates documented
- [x] Create business-ready KPIs — KPI table with formulas
- [x] Every metric clearly defined

### Section B — Descriptive & Statistical Diagnosis
- [x] Channels by lead generation, conversion, revenue, repeat buying, ROAS
- [x] Campaign objectives by same dimensions
- [x] Creative types by same dimensions
- [x] Regions by same dimensions
- [x] Devices by same dimensions
- [x] Statistical significance tests (chi-square, t-test, Mann-Whitney)
- [x] Effect sizes assessed — not just p-values
- [x] Discounting vs. conversion analysis
- [x] Discount effect varies by customer type — tested
- [x] Discount effect varies by channel — tested
- [x] Discount effect varies by region — tested
- [x] Discount effect varies by campaign objective — tested
- [x] Discount effect varies by landing page — tested
- [x] Customer value differences by region
- [x] Customer value differences by loyalty tier
- [x] Customer value differences by income band
- [x] Customer value differences by device preference
- [x] Customer value differences by acquisition type
- [x] Website session signals vs. lead conversion
- [x] Website session signals vs. purchasing
- [x] Outlier/anomaly impact on business story highlighted

### Section C — Customer Segmentation
- [x] Distinct customer groups identified using demographic variables
- [x] Distinct customer groups identified using behavioral variables
- [x] Distinct customer groups identified using commercial variables
- [x] Each segment profiled in plain business language (no jargon)
- [x] Who they are
- [x] How they behave
- [x] How valuable they appear
- [x] Which campaigns/channels reach them best
- [x] What management should do next quarter

### Section D — Campaign & Channel Grouping
- [x] Natural groupings of campaigns identified
- [x] Based on spend
- [x] Based on reach
- [x] Based on engagement
- [x] Based on conversion
- [x] Based on commercial value outcomes
- [x] Which groups should be scaled up — explained
- [x] Which groups should be redesigned — explained
- [x] Which groups should be maintained — explained
- [x] Which groups should be stopped — explained
- [x] High-volume campaigns separated from high-quality campaigns

### Section E — Lead Conversion Prediction
- [x] Decision-ready approach to identify leads most likely to convert within 30 days
- [x] More than one predictive approach compared
- [x] Final choice defended on business grounds
- [x] Final choice defended on analytical grounds
- [x] Variables that matter most explained (feature importance / SHAP)
- [x] Model output converted to prioritization rule for business team

### Section F — Customer Growth/Retention Prediction
- [x] One option chosen and solved well (repeat purchase within 90 days)
- [x] Most informative variables explained
- [x] Early warning signs of weak-quality acquisition identified
- [x] Targeting recommendations based on results
- [x] Discounting recommendations based on results
- [x] Channel mix recommendations based on results

### Section G — Executive Reporting Layer
- [x] Non-technical marketing manager can understand what is working
- [x] Can see what is underperforming
- [x] Can see where money is being wasted
- [x] Can see which customer groups deserve more budget
- [x] Can see which channels/campaigns deserve more budget next quarter
- [x] Usable by management, not only analysts

### Section H — Final Decision Memo
- [x] PowerPoint format (max 20 slides)
- [x] Top 5 findings stated
- [x] Top 3 actions for next quarter stated
- [x] Where budget should be increased — stated
- [x] Where budget should be reduced or redesigned — stated
- [x] Risks and data limitations leadership must know — stated

### 8 Management Questions
- [x] Q1: Which channels generate most leads? Most valuable customers?
- [x] Q2: Which campaign types are surface-efficient but weak on conversion/revenue/repeat?
- [x] Q3: Which regions, cities, devices, audiences respond best to which approaches?
- [x] Q4: Does discounting justify margin sacrifice? For whom?
- [x] Q5: Which digital behaviors signal serious intent vs. low-quality traffic?
- [x] Q6: Which segments deserve differentiated messaging, budget, retention treatment?
- [x] Q7: Can leads be prioritized more intelligently?
- [x] Q8: Where should management increase / redesign / stop spending?

### Required Deliverables
- [x] Data audit note — documented issues, treatment choices, assumptions, exclusions, unresolved risks
- [x] Clean analytical dataset / base table — merged, prepared, usable, reproducible
- [x] Analytical report — business findings from descriptive, statistical, segmentation, prediction work
- [x] Executive reporting layer — manager-friendly, easy to interpret
- [x] Final CMO memo — clear, prioritized, commercially sensible

### Guardrails
- [x] Data quality problems NOT ignored or buried
- [x] Metrics NOT presented without definitions
- [x] Data issues separated from business findings
- [x] Assumptions and exclusions explained
- [x] Recommendations defended as financially and operationally sensible
- [x] Model accuracy NOT treated as sole measure of business success
- [x] High lead volume NOT confused with high customer quality

### Suggested Submission Structure
- [x] 1. Data audit and data preparation logic → Phase 1
- [x] 2. Analytical base table or integrated data model → Phase 1
- [x] 3. Exploratory findings and metric definitions → Phase 2
- [x] 4. Statistical findings and interpretation → Phase 2
- [x] 5. Segmentation and managerial implications → Phase 3
- [x] 6. Predictive modeling and operational scoring logic → Phases 5 & 6
- [x] 7. Executive reporting layer → Phase 7
- [x] 8. Final recommendations and limitations → Phase 8

### What Strong Work Looks Like
- [x] Technical rigor combined with business judgment
- [x] Coherent analytical narrative from messy raw data
- [x] Thoughtful choices when data is imperfect (not pretending it's clean)
- [x] Activity distinguished from effectiveness
- [x] Conversion distinguished from customer quality
- [x] Ends with decisions management can act on next quarter

### Appendix — Data Field Coverage
- [x] customers: gender, age, city, region, signup_date, preferred_device, loyalty_tier, income_band — all used
- [x] campaigns: channel, objective, dates, budget, spend, target_region, creative_type, impressions, clicks — all used
- [x] leads: lead_date, lead_source, landing_page, discount_offered_pct, lead_score, converted_30d, acquisition_cost_usd — all used
- [x] website_sessions: session_date, device, channel_group, pages_viewed, time_on_site_sec, bounce, add_to_cart, checkout_started — all used
- [x] transactions: order_date, product_category, units, revenue_usd, discount_pct, payment_type, returned_flag, marketing_channel_last_touch — all used
