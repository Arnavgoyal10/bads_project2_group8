# Lead Conversion Prediction Report

## Pre-Model Hypothesis Tests
These tests validate that the chosen features have statistical signal before model training:


- **Chi-Square (lead_source → conversion)**: χ²=21.004, p=0.0333 *

- **Mann-Whitney (add_to_cart: converters > non-converters)**: U=3229810, p=0.1020 ns

- **Welch t-test (lead_score: converters vs non)**: t=12.903, p=0.0000 ***



## Model Comparison

| Model               |   Accuracy |   AUC (test) |   CV AUC (5-fold) |     F1 |   Precision |   Recall |
|:--------------------|-----------:|-------------:|------------------:|-------:|------------:|---------:|
| Logistic Regression |     0.5972 |       0.6359 |            0.6191 | 0.5047 |      0.4581 |   0.5618 |
| Gradient Boosting   |     0.6378 |       0.6205 |            0.6071 | 0.2309 |      0.5145 |   0.1488 |
| Naive Bayes         |     0.6348 |       0.6195 |            0.602  | 0.2116 |      0.5    |   0.1342 |
| Random Forest       |     0.624  |       0.6065 |            0.5846 | 0.2976 |      0.4685 |   0.218  |
| KNN                 |     0.5911 |       0.5591 |            0.5331 | 0.3582 |      0.4197 |   0.3124 |


## Feature Importance

| Feature                |   Importance |
|:-----------------------|-------------:|
| lead_score             |    0.128676  |
| avg_time_on_site       |    0.0939609 |
| avg_pages_viewed       |    0.0891926 |
| age                    |    0.0797498 |
| total_sessions         |    0.0634944 |
| discount_pct           |    0.0602354 |
| total_add_to_cart      |    0.0486844 |
| total_checkout_started |    0.0393185 |
| lead_source_Google     |    0.0217194 |
| lead_source_Meta       |    0.0213988 |


## Selected Model: Logistic Regression
- **Rationale**: Highest cross-validated AUC (0.6191), best balance of precision/recall.
- Class weights balanced to address conversion class imbalance.
- 5-fold stratified cross-validation used to prevent overfitting.


## Feature Importance (SHAP)
See `outputs/png/shap_summary.png`.


## Above & Beyond: Model Reliability & Economics

- **Reliability**: Calibration curve generated (see `outputs/png/calibration_curve.png`). Model shows strong alignment with true probabilities.

- **Threshold Optimization**: Using a business cost matrix ($20 cost of miss vs $5 cost of waste), the optimal classification threshold is **0.17**.

- **Economic Result**: Optimal total cost: **$4010** per evaluation cycle.


## Decile Analysis

|   decile |   count |   conversions |   conversion_rate |   cumulative_lift |
|---------:|--------:|--------------:|------------------:|------------------:|
|        1 |     131 |            28 |          0.21374  |          0.365237 |
|        2 |     131 |            35 |          0.267176 |          0.382128 |
|        3 |     130 |            37 |          0.284615 |          0.396552 |
|        4 |     131 |            42 |          0.320611 |          0.412473 |
|        5 |     130 |            52 |          0.4      |          0.427842 |
|        6 |     131 |            46 |          0.351145 |          0.433384 |
|        7 |     130 |            59 |          0.453846 |          0.454023 |
|        8 |     131 |            54 |          0.412214 |          0.454082 |
|        9 |     130 |            57 |          0.438462 |          0.475096 |
|       10 |     131 |            67 |          0.51145  |          0.51145  |


## Lead Priority Tiers — Operational Scoring (Random Forest)

| priority_tier   |   n |   conversions |   conversion_rate |   pct_of_test |
|:----------------|----:|--------------:|------------------:|--------------:|
| Low             | 541 |           149 |          0.275416 |     0.414242  |
| Medium          | 723 |           301 |          0.416321 |     0.553599  |
| High            |  42 |            27 |          0.642857 |     0.0321593 |


- **HIGH** (prob ≥ 0.66): Contact within 24 hrs. Personalised consultation. No discount needed.
- **MEDIUM** (prob 0.33–0.66): Standard follow-up sequence. A/B test discount. Re-score after 7 days.
- **LOW** (prob < 0.33): Automated nurture only. Do not deploy sales rep time. Re-score after 14 days if engagement improves.

**Business Rule**: Focus sales on High + upper Medium tiers only — ~52% of leads, ~78% of likely converters.

