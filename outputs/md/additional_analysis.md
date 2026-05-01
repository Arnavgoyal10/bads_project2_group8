# Additional Analysis Summary

## Bootstrap CIs
- Mean AOV (per-customer): 58.87 (95% CI 54.67 – 63.85)
- Mean ROAS (campaign-level): 0.24 (95% CI 0.18 – 0.31)

## ANOVA: Channel AOV
|                  |   H-Statistic |   p-value |
|:-----------------|--------------:|----------:|
| Channel-AOV-Test |       20.3919 | 0.0402468 |

## Tukey HSD (saved to outputs/tukey_channel_aov.csv)

## Kaplan–Meier: Time to Second Purchase
{'error': "No module named 'lifelines'"}

## Campaign Spend & Margin ROAS
- Mean cleaned ROAS: 0.269 
- Mean margin ROAS (assumed margin 30%): 0.081 
- Campaign anomalies flagged: 4 (see outputs/csv/campaigns_cleaned.csv)

## Causal Check: Discount Effect on Conversion
- Logit discount coef: -0.0127, p=0.001
- IPTW ATE (discount >0): -0.0089 (absolute conversion rate difference)
