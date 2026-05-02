# NovaMart Data Science Project: Detailed Project Brief
**Campaign ROI, Customer Segmentation, Lead Conversion, and Customer Growth**

| Feature | Details |
| :--- | :--- |
| **Client** | **NovaMart**, a consumer retail brand operating across multiple product categories and digital channels |
| **Role** | You are the analytics team asked to convert messy operational data into decision-ready recommendations |
| **Core Theme** | Marketing efficiency, customer growth, campaign effectiveness, and the quality of acquired customers |
| **Submission** | Management wants defensible analysis, not dashboards without judgment |

> **Note:** This is an open-ended business problem. There is no single correct route, but there must be a defensible one. Prepared for undergraduate data science students.

---

## Executive Mandate
**How should NovaMart improve marketing efficiency and customer growth over the next quarter using evidence from campaign, lead, digital behavior, and transaction data?**

Senior management believes three things may be happening at the same time:
1. Marketing spend is not being allocated efficiently across channels, regions, and campaign types.
2. Different customer groups respond very differently to promotions, content, devices, and campaign journeys.
3. The company is generating many leads, but too few become high-value repeat buyers.

**Your mission:** Build a trustworthy analytical foundation, discover what the data is actually saying, and recommend where management should act.

---

## 1. Business Context
NovaMart is a consumer retail brand with a digital acquisition engine and a multi-category transaction business. The company runs campaigns across paid and owned channels, collects leads, observes website behavior, and records transactions after conversion.

Management questions whether current spending produces the right kind of growth. Some campaigns may generate volume but not value; some audiences may be cheap to acquire but weak in long-term contribution. You have been provided raw operational data containing inconsistencies, broken keys, duplicate values, and category coding problems.

---

## 2. Data Assets Provided

| File | Rows | Primary Business Role | Important Join Fields | Potential Issues |
| :--- | :--- | :--- | :--- | :--- |
| **customers** | 2,418 | Profile and master data | `customer_id` | Duplicate IDs, missing demographics, invalid ages |
| **campaigns** | 39 | Setup, spend, and creative | `campaign_id` | Mixed date formats, malformed currency, region labels |
| **leads** | 5,224 | Lead gen and short-term conversion | `lead_id`, `customer_id`, `campaign_id` | Missing keys, text-coded numerics, timing issues |
| **website_sessions** | 19,045 | Behavioral engagement | `session_id`, `customer_id`, `campaign_id` | Boolean coding issues, quality anomalies, weak joins |
| **transactions** | 2,808 | Commercial outcome and revenue | `order_id`, `customer_id` | Impossible values, discount issues, last-touch ambiguity |

### Expected Relationships
*   `customers.customer_id` ↔ `leads.customer_id`
*   `customers.customer_id` ↔ `website_sessions.customer_id`
*   `customers.customer_id` ↔ `transactions.customer_id`
*   `campaigns.campaign_id` ↔ `leads.campaign_id`
*   `campaigns.campaign_id` ↔ `website_sessions.campaign_id`

---

## 3. Scope of Work

### A. Data Audit and Analytical Base Table
*   Build a clean, analysis-ready foundation.
*   Document every major data quality issue and justify your treatment of duplicates, outliers, and failed joins.
*   Create business-ready KPIs (Key Performance Indicators) that management can trust.

### B. Descriptive and Statistical Diagnosis
*   Identify which channels and regions are strongest on lead generation and ROI.
*   Assess if differences in order value or revenue are statistically meaningful.
*   Examine the impact of discounting on conversion across different customer types.
*   Investigate which website engagement signals (e.g., pages viewed) associate most with purchasing.

### C. Customer Segmentation
*   Identify distinct customer groups using demographic and behavioral variables.
*   Profile each segment: Who are they? How valuable are they? What should management do next?

### D. Campaign and Channel Grouping
*   Group campaigns based on spend, engagement, and conversion.
*   Differentiate between "high-volume" and "high-quality" campaigns.
*   Recommend which campaigns to scale up, redesign, or stop.

### E. Lead Conversion Prediction
*   Develop a model to identify leads likely to convert within 30 days.
*   Defend your choice of predictive approach and convert output into a prioritization rule for the sales/marketing team.

### F. Customer Growth or Retention Prediction
*   **Pick one:** Predict if a new customer will repeat-purchase within 90 days **OR** predict if a customer will become "high value."
*   Identify early warning signs of weak-quality acquisition.

### G. Executive Reporting Layer
*   Create a solution for non-technical managers to monitor performance, wasted spend, and budget priorities.

### H. Final Decision Memo
*   A PowerPoint (max 20 slides) for the CMO stating top 5 findings, top 3 actions, budget shifts, and risks.

---

## 4. Key Management Questions to Answer
*   Which acquisition channels generate the most **valuable** customers (not just the most leads)?
*   Which campaigns look efficient on the surface but fail at conversion or repeat purchase?
*   Does discounting justify the margin sacrifice?
*   Which digital behaviors signal "serious intent"?
*   How can leads be prioritized to focus commercial effort?

---

## 5. Required Deliverables

*   **Data Audit Note:** Documentation of issues and assumptions.
*   **Clean Analytical Dataset:** The merged foundation used for analysis.
*   **Analytical Report/Deck:** Decision-oriented findings from all modeling and stats.
*   **Executive Reporting Layer:** Manager-friendly view for performance monitoring.
*   **Final CMO Memo:** Clear, prioritized, and commercially sensible recommendations.

---

## 6. Guardrails
1.  **Do not ignore data quality:** Do not bury problems in the appendix.
2.  **Define metrics:** Never present a number without explaining its calculation.
3.  **Business Logic > Model Accuracy:** A high AUC/Accuracy score is useless if the recommendation doesn't make managerial sense.
4.  **Value over Volume:** Do not confuse high lead counts with high customer quality.

---

## 7. Appendix: Data Field Examples

| Table | Illustrative Fields | Why They Matter |
| :--- | :--- | :--- |
| **customers** | `gender`, `age`, `city`, `loyalty_tier` | Defines segments and value analysis. |
| **campaigns** | `channel`, `objective`, `spend`, `clicks` | Supports ROI and efficiency analysis. |
| **leads** | `lead_source`, `discount_offered_pct`, `converted_30d` | Supports conversion diagnosis. |
| **website_sessions** | `pages_viewed`, `bounce`, `add_to_cart` | Captures digital intent. |
| **transactions** | `revenue_usd`, `units`, `returned_flag` | Captures realized value and downstream quality. |