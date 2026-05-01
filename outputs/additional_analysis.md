# Additional Analysis Summary

## Bootstrap CIs
- Mean AOV (per-customer): 58.87 (95% CI 54.67 – 63.85)
- Mean ROAS (campaign-level): 0.24 (95% CI 0.18 – 0.31)

## ANOVA: Channel AOV
|            |          sum_sq |   df |          F |     PR(>F) |
|:-----------|----------------:|-----:|-----------:|-----------:|
| C(channel) | 82032.8         |   11 |   0.928092 |   0.512064 |
| Residual   |     1.17637e+07 | 1464 | nan        | nan        |

## Tukey HSD (saved to outputs/tukey_channel_aov.csv)

## Kaplan–Meier: Time to Second Purchase
{'error': 'NaNs were detected in the dataset. Try using pd.isnull to find the problematic values.'}

## Campaign Spend & Margin ROAS
- Mean cleaned ROAS: 0.269 
- Mean margin ROAS (assumed margin 30%): 0.081 
- Campaign anomalies flagged: 4 (see outputs/campaigns_cleaned.csv)

## Causal Check: Discount Effect on Conversion
- Logit discount coef: nan, p=nan
- IPTW ATE (discount >0): -0.0089 (absolute conversion rate difference)
