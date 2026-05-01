# Additional Analysis Summary

## Bootstrap CIs
- Mean AOV (per-customer): 58.87 (95% CI 54.67 – 63.85)
- Mean ROAS (campaign-level): 0.24 (95% CI 0.18 – 0.31)

## ANOVA: Channel AOV
ANOVA error: Library Error: deprecate_kwarg() missing 1 required positional argument: 'new_arg_name'. Fallback to descriptive comparison.

## Tukey HSD (saved to outputs/tukey_channel_aov.csv)

## Kaplan–Meier: Time to Second Purchase
{'error': "No module named 'lifelines'"}

## Campaign Spend & Margin ROAS
- Mean cleaned ROAS: 0.269 
- Mean margin ROAS (assumed margin 30%): 0.081 
- Campaign anomalies flagged: 4 (see outputs/campaigns_cleaned.csv)

## Causal Check: Discount Effect on Conversion
- Logit discount coef: nan, p=nan
- IPTW ATE (discount >0): -0.0089 (absolute conversion rate difference)
