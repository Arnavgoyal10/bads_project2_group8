# Descriptive & Statistical Diagnosis Report

## 1. Channel Performance Analysis

| channel     |   leads |   conversions |      LCR |      CPL |
|:------------|--------:|--------------:|---------:|---------:|
| e-mail      |     308 |           132 | 0.428571 |  29237.6 |
| email       |     574 |           224 | 0.390244 |  69800.1 |
| paid search |    1147 |           447 | 0.389712 |  31649.5 |
| search      |     575 |           224 | 0.389565 |  53905.1 |
| affiliate   |     614 |           228 | 0.371336 | 267573   |
| paid-social |     132 |            48 | 0.363636 |  85475   |
| influencer  |     289 |           104 | 0.359862 |  74976.3 |
| paid social |    1599 |           554 | 0.346467 |  30652.1 |
| display     |     292 |            95 | 0.325342 |  71837.4 |
| influencers |     130 |            29 | 0.223077 |  36223   |


### Hypothesis Test: Channel Conversion Rates
- **H₀**: Conversion rate is identical across all acquisition channels.
- **Test**: Pearson Chi-Square (df=9)
- **χ² = 26.874, p = 0.0015** **
- **Decision**: Reject H₀ — channels convert at statistically different rates. Budget reallocation is evidenced.


- **Kruskal-Wallis H = 26.870, p = 0.0015** ** (non-parametric confirmation)


## 2. Campaign Objective Analysis

| objective   |   leads |   conversions |      LCR |
|:------------|--------:|--------------:|---------:|
| Awareness   |    1595 |           599 | 0.375549 |
| Conversion  |     970 |           335 | 0.345361 |
| Lead Gen    |    1934 |           729 | 0.376939 |
| Retention   |    1161 |           422 | 0.36348  |


- **Chi-Square across Objectives**: χ²=3.290, p=0.3490 ns


## 3. Creative Type Analysis

| creative_type   |   leads |   conversions |      LCR |
|:----------------|--------:|--------------:|---------:|
| Carousel        |    1262 |           473 | 0.374802 |
| Promo           |     439 |           163 | 0.371298 |
| Static          |    1209 |           448 | 0.370554 |
| Testimonial     |     583 |           197 | 0.337907 |
| UGC             |    1574 |           587 | 0.372935 |
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


