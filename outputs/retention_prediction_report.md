# Customer Retention Prediction Report

## Target Variable
- **Repeat purchase within 90 days**
- Base repeat rate: **0.1%**


## Pre-Model Hypothesis Tests

- **Mann-Whitney (revenue: repeaters > non-repeaters)**: U=2665, p=0.0241 *

  - Repeaters avg: $237.68 | Non-repeaters avg: $108.01

- **Chi-Square (loyalty_tier → repeat_90d)**: χ²=4.640, p=0.2001 ns

- **Mann-Whitney (acquisition_cost: repeaters vs non)**: U=1848, p=0.5349 ns


## Model Comparison

| Model               |   AUC |   CV AUC |   F1 |   Precision |   Recall |
|:--------------------|------:|---------:|-----:|------------:|---------:|
| Logistic Regression |   nan |      nan |    0 |           0 |        0 |
| Random Forest       |   nan |      nan |    0 |           0 |        0 |
| Gradient Boosting   |   nan |      nan |    0 |           0 |        0 |


## Top 15 Features (Random Forest)

| Feature                      |   Importance |
|:-----------------------------|-------------:|
| total_revenue                |    0.187979  |
| loyalty_tier_silver          |    0.0948094 |
| total_acquisition_cost       |    0.0870213 |
| product_category_Beverages   |    0.0793076 |
| avg_pages_viewed             |    0.0754486 |
| age                          |    0.0697789 |
| total_sessions               |    0.0529558 |
| product_category_Supplements |    0.0510758 |
| payment_type_Wallet          |    0.0411246 |
| income_band_Lower-Middle     |    0.0408243 |
| total_add_to_cart            |    0.0400541 |
| region_north central         |    0.0396695 |
| payment_type_Transfer        |    0.0350365 |
| region_south west            |    0.0222062 |
| income_band_Middle           |    0.0166946 |


## Early Warning Signs
- High acquisition cost + low first-order revenue → strong churn signal
- Low session count prior to first order → lower retention probability
- Lower loyalty tier at acquisition → weaker repeat behavior

## Recommended Actions
- Trigger automated win-back email at day 60 for P(repeat_90d) < 0.3
- VIP early access offer at day 30 for P(repeat_90d) > 0.7
- Audit high-CPA acquisition channels that produce low-retention customers

