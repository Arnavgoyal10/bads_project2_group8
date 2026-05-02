# Descriptive & Statistical Diagnosis Report

## 1. Channel Performance Analysis

| channel     |   leads |   conversions |      LCR |      CPL |
|:------------|--------:|--------------:|---------:|---------:|
| email       |     882 |           356 | 0.403628 |  67762.5 |
| paid search |    1147 |           447 | 0.389712 |  31649.5 |
| search      |     426 |           164 | 0.384977 |  51490   |
| affiliate   |     446 |           157 | 0.352018 | 346666   |
| paid social |    1572 |           545 | 0.346692 |  46055   |
| display     |     292 |            95 | 0.325342 |  71837.4 |
| influencer  |     419 |           133 | 0.317422 |  62952.6 |


### Hypothesis Test: Channel Conversion Rates
- **H₀**: Conversion rate is identical across all acquisition channels.
- **Test**: Pearson Chi-Square (df=6)
- **χ² = 18.066, p = 0.0061** **
- **Decision**: Reject H₀ — channels convert at statistically different rates. Budget reallocation is evidenced.


- **Kruskal-Wallis H = 18.062, p = 0.0061** ** (non-parametric confirmation)


## 2. Campaign Objective Analysis

| objective   |   leads |   conversions |      LCR |
|:------------|--------:|--------------:|---------:|
| Awareness   |    1446 |           539 | 0.372752 |
| Conversion  |     970 |           335 | 0.345361 |
| Lead Gen    |    1766 |           658 | 0.372593 |
| Retention   |    1002 |           365 | 0.364271 |


- **Chi-Square across Objectives**: χ²=2.409, p=0.4920 ns


## 3. Creative Type Analysis

| creative_type   |   leads |   conversions |      LCR |
|:----------------|--------:|--------------:|---------:|
| Carousel        |    1262 |           473 | 0.374802 |
| Promo           |     439 |           163 | 0.371298 |
| Static          |    1041 |           377 | 0.362152 |
| Testimonial     |     583 |           197 | 0.337907 |
| UGC             |    1266 |           470 | 0.371248 |
| Video           |     593 |           217 | 0.365936 |


## 4. Regional Analysis

| region        |   customers |   avg_revenue |   avg_LCR |   total_revenue |
|:--------------|------------:|--------------:|----------:|----------------:|
| south west    |         791 |       71.4679 |  0.396975 |        56531.1  |
| south south   |         559 |       69.0317 |  0.394057 |        38588.7  |
| north central |         441 |       67.5871 |  0.366191 |        29805.9  |
| north west    |         396 |       50.1046 |  0.289296 |        19841.4  |
| south east    |         186 |       69.7906 |  0.335673 |        12981    |
| north cntrl   |          12 |       79.6258 |  0.386364 |          955.51 |
| n central     |           5 |      112.954  |  0.366667 |          564.77 |
| s/south       |           4 |       68.445  |  0.291667 |          273.78 |
| south-west    |           6 |       23.34   |  0.416667 |          140.04 |


- **Kruskal-Wallis Revenue across Regions**: H=17.778, p=0.0230 *


## 5. Device Analysis

| preferred_device   |   customers |   avg_revenue |   avg_engagement |
|:-------------------|------------:|--------------:|-----------------:|
| desktop            |         559 |       71.4966 |          1.6469  |
| mobile             |        1621 |       64.8776 |          1.57384 |
| phone              |          12 |       54.8192 |          1.77683 |
| tab                |           6 |       66.8833 |          1.17667 |
| tablet             |         202 |       66.7825 |          1.58272 |


### Hypothesis Test: Mobile vs Desktop Revenue
- **H₀**: Median revenue is equal for mobile and desktop users.
- **Mann-Whitney U = 441410, p = 0.3488** ns
- **Welch t = -0.952, p = 0.3412** ns
- **Decision**: No significant revenue difference.
- Mobile avg: $64.88 | Desktop avg: $71.50


## 6. Hypothesis Testing Battery


### 6a. Revenue by Loyalty Tier
- **One-Way ANOVA**: F=6.754, p=0.0002 ***
- **Kruskal-Wallis**: H=25.291, p=0.0000 ***
- **Conclusion**: Loyalty tiers generate statistically different revenue — supports tiered marketing.


### 6b. Add-to-Cart → Purchase (Digital Intent Signal)
- **Point-Biserial r = -0.0269, p = 0.1885** ns
- Customers who add to cart are not significantly more likely to purchase.


### 6c. Session Count vs Revenue (Spearman)
- **ρ = -0.0266, p = 0.1920** ns
- No significant correlation.


## 7. Discounting Analysis

- **Spearman ρ (discount % ↔ conversion)**: 0.0111, p=0.4230 ns
- **Point-Biserial r**: 0.0074, p=0.5923 ns
- **Conclusion**: Discount percentage has no statistically significant impact on conversion. Blanket discounting is **NOT justified** by the data — margin sacrifice is wasteful.


### Discount Bracket LCR

| disc_bracket   |    n |   conversions |      LCR |
|:---------------|-----:|--------------:|---------:|
| 0%             | 1417 |           517 | 0.364855 |
| 1-10%          | 2301 |           838 | 0.364189 |
| 11-15%         |  754 |           287 | 0.380637 |
| 16-20%         |  727 |           262 | 0.360385 |
| >20%           |   16 |             3 | 0.1875   |


- **Kruskal-Wallis across brackets**: H=3.031, p=0.5527 ns


## 8. Digital Behavior Intent Signals

- **avg_pages_viewed**: r=-0.0358, p=0.0796 ns → Not significant

- **avg_time_on_site**: r=-0.0151, p=0.4594 ns → Not significant

- **total_add_to_cart**: r=-0.0269, p=0.1885 ns → Not significant

- **total_checkout_started**: r=-0.0287, p=0.1598 ns → Not significant



## 11. Acquisition Channel → Customer Quality

| acquisition_channel   |   n_customers |   avg_ltv |   median_ltv |   avg_aov |   repeat_rate |   avg_acq_cost |   ltv_per_acq_cost |
|:----------------------|--------------:|----------:|-------------:|----------:|--------------:|---------------:|-------------------:|
| influencer            |           172 |     76.22 |        39.94 |     67.7  |          0.3  |          38.36 |              1.987 |
| search                |            64 |     74.84 |        24.66 |     62.21 |          0.36 |          32.34 |              2.314 |
| display               |           172 |     74.59 |        44.5  |     66.4  |          0.35 |          32.71 |              2.28  |
| paid social           |           495 |     67.93 |        29.99 |     68.21 |          0.29 |          33.54 |              2.025 |
| paid search           |           454 |     66.55 |        38.96 |     55.68 |          0.32 |          39.22 |              1.697 |
| (unattributed)        |           276 |     65.06 |        32.61 |     51.22 |          0.36 |           0.35 |            185.886 |
| affiliate             |           305 |     64.81 |        36.53 |     55.62 |          0.33 |          31.93 |              2.03  |
| email                 |           462 |     59.28 |        27.88 |     52.12 |          0.3  |          27.31 |              2.171 |


- **Kruskal-Wallis LTV across acquisition channels**: H=6.284, p=0.3921 ns
- **Decision**: No significant LTV difference across channels.


## 12. Product Category Analysis

| product_category   |   n_transactions |   total_revenue |   avg_revenue |   return_rate |   avg_discount |   first_purchase_repeat_rate |
|:-------------------|-----------------:|----------------:|--------------:|--------------:|---------------:|-----------------------------:|
| baby               |              474 |         39902.9 |         84.72 |          0.07 |           8.43 |                        0.524 |
| home care          |              488 |         32015   |         65.6  |          0.08 |           8.21 |                        0.475 |
| supplements        |              458 |         31197.7 |         68.87 |          0.09 |           8.9  |                        0.477 |
| personal care      |              463 |         26872.6 |         58.17 |          0.08 |           8.06 |                        0.58  |
| snacks             |              489 |         19533.3 |         40.27 |          0.08 |           8.47 |                        0.516 |
| beverages          |              436 |         14287.2 |         33.07 |          0.08 |           8.86 |                        0.527 |


## 13. Return Rate Analysis

### Return Rate by Marketing Channel (Last Touch)

| marketing_channel   |   n_transactions |   return_rate |   total_returns |   avg_revenue |
|:--------------------|-----------------:|--------------:|----------------:|--------------:|
| email               |              406 |         0.089 |              36 |        61.734 |
| paid search         |              396 |         0.088 |              35 |        61.154 |
| affiliate           |              395 |         0.084 |              33 |        50.936 |
| paid social         |              402 |         0.082 |              33 |        68.21  |
| direct              |              392 |         0.079 |              31 |        62.225 |
| organic             |              391 |         0.077 |              30 |        54.492 |
| influencer          |              407 |         0.066 |              27 |        52.872 |
| search              |               19 |         0     |               0 |        39.214 |


### Return Rate by Product Category

| product_category   |   n |   return_rate |
|:-------------------|----:|--------------:|
| supplements        | 458 |         0.085 |
| personal care      | 463 |         0.084 |
| beverages          | 436 |         0.083 |
| snacks             | 489 |         0.08  |
| home care          | 488 |         0.076 |
| baby               | 474 |         0.074 |

