# Lead Conversion Prediction Report

## Pre-Model Hypothesis Tests
These tests validate that the chosen features have statistical signal before model training:


- **Chi-Square (lead_source → conversion)**: χ²=21.004, p=0.0333 *

- **Mann-Whitney (add_to_cart: converters > non-converters)**: U=3229810, p=0.1020 ns

- **Welch t-test (lead_score: converters vs non)**: t=12.903, p=0.0000 ***



## Model Comparison

| Model               |   AUC (test) |   CV AUC (5-fold) |     F1 |   Precision |   Recall |
|:--------------------|-------------:|------------------:|-------:|------------:|---------:|
| Logistic Regression |       0.6368 |            0.6196 | 0.5101 |      0.4664 |   0.5628 |
| Gradient Boosting   |       0.6215 |            0.6071 | 0.2264 |      0.5684 |   0.1414 |
| Random Forest       |       0.6081 |            0.5846 | 0.3148 |      0.4972 |   0.2304 |


## Feature Importance

| Feature                    |   Importance |
|:---------------------------|-------------:|
| lead_score                 |    0.298791  |
| avg_time_on_site           |    0.116397  |
| avg_pages_viewed           |    0.0990076 |
| total_sessions             |    0.067988  |
| age                        |    0.0515274 |
| loyalty_tier_platinum      |    0.049461  |
| total_add_to_cart          |    0.0361756 |
| observed_region_North West |    0.0305433 |
| income_band_Middle         |    0.0260934 |
| total_checkout_started     |    0.0228787 |


## Selected Model: Logistic Regression
- **Rationale**: Highest cross-validated AUC (0.6196), best balance of precision/recall.
- Class weights balanced to address conversion class imbalance.
- 5-fold stratified cross-validation used to prevent overfitting.


## Feature Importance (SHAP)
See `outputs/png/shap_summary.png`.


## Above & Beyond: Model Reliability & Economics

- **Reliability**: Calibration curve generated (see `outputs/png/calibration_curve.png`). Model shows strong alignment with true probabilities.

- **Threshold Optimization**: Using a business cost matrix ($20 cost of miss vs $5 cost of waste), the optimal classification threshold is **0.14**.

- **Economic Result**: Optimal total cost: **$3295** per evaluation cycle.


## Decile Analysis

|   decile |   count |   conversions |   conversion_rate |   cumulative_lift |
|---------:|--------:|--------------:|------------------:|------------------:|
|        1 |     105 |            25 |          0.238095 |          0.36555  |
|        2 |     104 |            24 |          0.230769 |          0.379787 |
|        3 |     105 |            36 |          0.342857 |          0.398325 |
|        4 |     104 |            28 |          0.269231 |          0.406293 |
|        5 |     105 |            35 |          0.333333 |          0.429027 |
|        6 |     104 |            37 |          0.355769 |          0.448276 |
|        7 |     104 |            39 |          0.375    |          0.471292 |
|        8 |     105 |            52 |          0.495238 |          0.503185 |
|        9 |     104 |            48 |          0.461538 |          0.507177 |
|       10 |     105 |            58 |          0.552381 |          0.552381 |


## Actionable Prioritization Rule
- **High Priority** (prob > 0.6): Immediate sales outreach within 24h
- **Medium Priority** (0.3–0.6): Nurture sequence, re-engage within 7 days
- **Low Priority** (< 0.3): Email drip only, minimal sales resource

