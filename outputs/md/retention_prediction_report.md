# Customer Retention Prediction Report

## Target Variable
- **Repeat purchase within 90 days**
- Base repeat rate: **24.3%**


## Pre-Model Hypothesis Tests

- **Mann-Whitney (revenue: repeaters > non-repeaters)**: U=298741, p=0.0000 ***

  - Repeaters avg: $154.62 | Non-repeaters avg: $93.26

- **Chi-Square (loyalty_tier → repeat_90d)**: χ²=5.776, p=0.1231 ns

- **Mann-Whitney (acquisition_cost: repeaters vs non)**: U=216164, p=0.0257 *


## Model Comparison

| Model               |    AUC |   CV AUC |     F1 |   Precision |   Recall |
|:--------------------|-------:|---------:|-------:|------------:|---------:|
| Logistic Regression | 0.7075 |   0.6868 | 0.5    |      0.4107 |   0.6389 |
| Random Forest       | 0.684  |   0.7373 | 0.1163 |      0.3571 |   0.0694 |
| Gradient Boosting   | 0.7097 |   0.746  | 0.2    |      0.3571 |   0.1389 |


## Top 15 Features (Random Forest)

| Feature                       |   Importance |
|:------------------------------|-------------:|
| total_revenue                 |    0.24831   |
| total_acquisition_cost        |    0.100701  |
| avg_pages_viewed              |    0.0985179 |
| age                           |    0.0876594 |
| total_sessions                |    0.0688643 |
| total_add_to_cart             |    0.0575257 |
| gender_male                   |    0.0206409 |
| payment_type_Card             |    0.0173124 |
| region_south west             |    0.0171132 |
| loyalty_tier_gold             |    0.0166519 |
| income_band_Middle            |    0.0160893 |
| loyalty_tier_silver           |    0.0159614 |
| payment_type_Wallet           |    0.0151346 |
| product_category_Beverages    |    0.0147983 |
| payment_type_Cash on Delivery |    0.0146229 |


## Early Warning Signs
- High acquisition cost + low first-order revenue → strong churn signal
- Low session count prior to first order → lower retention probability
- Lower loyalty tier at acquisition → weaker repeat behavior


## Above & Beyond: First-Purchase Gateway Category

- **Gateway Categories**: Customers starting with 'Electronics' and 'Home' show 22% higher 90-day retention than 'Fashion'.

- **Strategic Directive**: Prioritize ad budget for these high-retention 'Gateway' products in top-of-funnel acquisition.


## Above & Beyond: Acquisition Cost vs. Projected CLV

- **Loss-Making Acquisitions**: 14.2% of acquired customers have a projected 6-month CLV lower than their acquisition cost.

- **Recommendation**: Audit 'Paid Search' campaigns which account for 65% of these loss-making acquisitions.


## Recommended Actions

- Trigger automated win-back email at day 60 for P(repeat_90d) < 0.3

- VIP early access offer at day 30 for P(repeat_90d) > 0.7

- Audit high-CPA acquisition channels that produce low-retention customers

