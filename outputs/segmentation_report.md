# Customer Segmentation Report

## Cluster Validation
- Silhouette Score (k=4): **0.1935** (>0.2 = acceptable, >0.5 = strong)
- K-Means justification: Elbow & silhouette curves both peak/inflect at k=4.


## Hypothesis Test: Segment Revenue Differences
- **H₀**: All customer segments have equal mean revenue.
- **One-Way ANOVA**: F=3669.301, p=0.0000e+00
- **Kruskal-Wallis**: H=1044.521, p=3.9528e-226
- **Decision**: Segments are statistically distinct in revenue (reject H₀).


## Segment Profiles

| Segment_Name      |   age |   total_revenue |   total_orders |   total_sessions |   total_leads |   total_add_to_cart |   total_checkout_started |   avg_pages_viewed |   avg_time_on_site |
|:------------------|------:|----------------:|---------------:|-----------------:|--------------:|--------------------:|-------------------------:|-------------------:|-------------------:|
| Champions         | 33.33 |         1346.85 |           2.11 |             7.61 |          2.83 |                2.78 |                     1.56 |               5.15 |             265.28 |
| Core Buyers       | 32.81 |          146.62 |           2.87 |             7.55 |          2.08 |                2.62 |                     1.19 |               5.47 |             227.91 |
| Dormant / At Risk | 32.95 |           26.24 |           0.55 |             6.34 |          2.18 |                1.93 |                     0.78 |               5.43 |             225.4  |
| Engaged Browsers  | 33.96 |           37.58 |           0.77 |            10.26 |          2.15 |                4.72 |                     2.58 |               5.62 |             230.58 |


## Segment Summary

| Segment_Name      |   n_customers |   avg_revenue |   total_revenue |   avg_orders |   avg_sessions |   avg_add_to_cart |
|:------------------|--------------:|--------------:|----------------:|-------------:|---------------:|------------------:|
| Champions         |            18 |     1346.85   |         24243.2 |     2.11111  |        7.61111 |           2.77778 |
| Core Buyers       |           532 |      146.624  |         78004.2 |     2.86842  |        7.54699 |           2.62406 |
| Engaged Browsers  |           784 |       37.5829 |         29465   |     0.765306 |       10.2564  |           4.71811 |
| Dormant / At Risk |          1066 |       26.2381 |         27969.9 |     0.547842 |        6.34334 |           1.93058 |


## Email Opt-In Analysis

| Segment_Name      |   False |   True |
|:------------------|--------:|-------:|
| Champions         |       6 |     12 |
| Core Buyers       |     134 |    398 |
| Dormant / At Risk |     310 |    756 |
| Engaged Browsers  |     250 |    534 |

