# Lead Conversion Prediction Report

## Pre-Model Hypothesis Tests
These tests validate that the chosen features have statistical signal before model training:


- **Chi-Square (lead_source → conversion)**: χ²=21.004, p=0.0333 *

- **Mann-Whitney (add_to_cart: converters > non-converters)**: U=3229810, p=0.1020 ns

- **Welch t-test (lead_score: converters vs non)**: t=12.903, p=0.0000 ***



## Model Comparison

| Model               |   AUC (test) |   CV AUC (5-fold) |     F1 |   Precision |   Recall |
|:--------------------|-------------:|------------------:|-------:|------------:|---------:|
| Logistic Regression |       0.6367 |            0.6191 | 0.5077 |      0.4642 |   0.5602 |
| Gradient Boosting   |       0.6215 |            0.6071 | 0.2264 |      0.5684 |   0.1414 |
| Random Forest       |       0.6081 |            0.5846 | 0.3148 |      0.4972 |   0.2304 |


## Selected Model: Logistic Regression
- **Rationale**: Highest cross-validated AUC (0.6191), best balance of precision/recall.
- Class weights balanced to address conversion class imbalance.
- 5-fold stratified cross-validation used to prevent overfitting.


## Feature Importance (SHAP)
See `outputs/charts/shap_summary.png`.


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

