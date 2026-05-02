# Additional Analysis Summary

## Bootstrap CIs
- Mean AOV (per-customer): 58.87 (95% CI 54.67 – 63.85)
- Mean ROAS (campaign-level): 0.23 (95% CI 0.17 – 0.30)

## ANOVA: Channel AOV
|                  |   H-Statistic |   p-value |
|:-----------------|--------------:|----------:|
| Channel-AOV-Test |       20.3919 | 0.0402468 |

## Tukey HSD (saved to outputs/tukey_channel_aov.csv)

## Kaplan–Meier: Time to Second Purchase
{'median_days_to_second': np.float64(inf), 'n_customers': 1477, 'n_events': 4}

## Campaign Spend & Margin ROAS
- Mean cleaned ROAS: 0.261 
- Mean margin ROAS (assumed margin 30%): 0.078 
- Campaign anomalies flagged: 1 (see outputs/csv/campaigns_cleaned.csv)

## Causal Check: Discount Effect on Conversion
- Logit discount coef: -0.0127, p=0.001
- IPTW ATE (discount >0): -0.0089 (absolute conversion rate difference)

## Simple Linear Regressions (8 Models)
| Model                      |    n |   slope |    intercept |       r |     R2 |        p |
|:---------------------------|-----:|--------:|-------------:|--------:|-------:|---------:|
| Campaign Spend → Leads     |   39 | -0      |     145.922  | -0.1385 | 0.0192 | 0.400279 |
| Lead Score → Revenue       | 2129 |  0.8307 |      35.4597 |  0.0831 | 0.0069 | 0.000124 |
| Time on Site → Conversion  | 2131 |  0.0001 |       0.3378 |  0.0329 | 0.0011 | 0.128394 |
| Pages Viewed → Add-to-Cart | 2400 |  0.4799 |       0.3622 |  0.233  | 0.0543 | 0        |
| Discount % → Revenue       | 2698 | -0.5032 |      54.6381 | -0.1219 | 0.0148 | 0        |
| Acquisition Cost → LTV     | 2400 |  0.1627 |      61.7101 |  0.0267 | 0.0007 | 0.191503 |
| Impressions → Clicks       |   28 |  0.2618 | -130614      |  0.3318 | 0.1101 | 0.084584 |
| Session Quality → Repeat   | 2400 | -0.0099 |       0.3328 | -0.0176 | 0.0003 | 0.387908 |

## Multiple Linear Regressions (3 Models)
| Model                          |     R2 |   Adj_R2 |   n_train |   n_test | Top_Predictor   |
|:-------------------------------|-------:|---------:|----------:|---------:|:----------------|
| A: Predict Customer LTV        |  0.851 |    0.846 |       971 |      324 | AOV             |
| B: Predict Revenue/Transaction |  0.716 |    0.706 |      2048 |      683 | units           |
| C: Predict Days-to-Convert     | -0.01  |   -0.107 |       723 |      242 | src_Google      |

> **Note**: MLR Model C (Days-to-Convert) has R²<0 — the predictors explain no meaningful variance in conversion speed. Do NOT use this model for actionable recommendations; channel effects on conversion timing are not statistically separable in this dataset.

## Additional Hypothesis Tests
- Gini Coefficient (LTV): 0.673
- Full details: outputs/md/additional_hypothesis_tests.md
