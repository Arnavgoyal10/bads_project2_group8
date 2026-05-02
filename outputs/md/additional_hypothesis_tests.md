# Additional Hypothesis Tests & Analysis

### Chi-Square: Income Band × Loyalty Tier
- χ²=16.114, df=12, p=0.1861 ns, Cramér's V=0.047
- **Decision**: No significant association.

### Chi-Square: Landing Page × Conversion
- χ²=10.221, df=5, p=0.0692 ns, Cramér's V=0.044
- **Decision**: No significant landing page effect.

| landing_page   |   n |   conversions |      LCR |
|:---------------|----:|--------------:|---------:|
| /landing-b     | 891 |           353 | 0.396184 |
| /bundle-offer  | 895 |           344 | 0.384358 |
| /new-arrivals  | 859 |           321 | 0.37369  |
| /quiz          | 873 |           308 | 0.352806 |
| /landing-a     | 832 |           289 | 0.347356 |
| /promo-summer  | 874 |           294 | 0.336384 |

### Chi-Square: Discount Flag × Conversion
- χ²=0.011, df=1, p=0.9177 ns, Cramér's V=0.001
- **Decision**: No significant effect of discount flag on conversion.

### Chi-Square: Device × Conversion
- χ²=4.578, df=4, p=0.3334 ns, Cramér's V=0.030
- **Decision**: Device type does NOT significantly affect conversion (p > 0.05).

### ANOVA: LTV (CLV_proxy) across Loyalty Tiers
- One-Way ANOVA: F=6.754, p=0.0002 ***
- Kruskal-Wallis: H=25.291, p=0.0000 ***
- **Decision**: LTV differs significantly across loyalty tiers — tiered investment is justified.

| loyalty_tier   |   mean_ltv |   median_ltv |    n |
|:---------------|-----------:|-------------:|-----:|
| bronze         |    54.0726 |       26.21  | 1052 |
| gold           |    82.0388 |       46.365 |  502 |
| platinum       |    88.6946 |       38.845 |  142 |
| silver         |    69.6304 |       37.26  |  704 |

### ANOVA: Days-to-Convert across Channels
- One-Way ANOVA: F=0.602, p=0.7290 ns
- Kruskal-Wallis: H=3.635, p=0.7259 ns
- **Decision**: No significant difference in days-to-convert across channels.

| channel     |   mean_days |   median_days |   n |
|:------------|------------:|--------------:|----:|
| affiliate   |     14.4694 |            15 |  98 |
| influencer  |     14.6173 |            14 |  81 |
| search      |     15.0707 |            15 |  99 |
| paid social |     15.0898 |            15 | 334 |
| email       |     15.1489 |            15 | 235 |
| paid search |     15.7314 |            16 | 283 |
| display     |     16.5846 |            17 |  65 |

### Gini Coefficient: Customer LTV Inequality
- **Gini = 0.673** (0 = perfect equality, 1 = maximum inequality)
- **Interpretation**: High LTV inequality — top customers drive disproportionate revenue. Protect Champions.

### Discount Uplift by Channel (percentage point lift in conversion rate)
| channel     |   no_discount |   discounted_lcr |   uplift_pp |
|:------------|--------------:|-----------------:|------------:|
| influencer  |      0.280992 |         0.332215 |     5.1223  |
| affiliate   |      0.316239 |         0.364742 |     4.85023 |
| paid search |      0.370492 |         0.396675 |     2.61828 |
| email       |      0.392157 |         0.408293 |     1.61366 |
| paid social |      0.367542 |         0.339115 |    -2.84264 |
| display     |      0.367089 |         0.309859 |    -5.72295 |
| search      |      0.435897 |         0.365696 |    -7.02016 |

### Discount Uplift by Loyalty Tier
| loyalty_tier   |   no_discount |   discounted_lcr |   uplift_pp |
|:---------------|--------------:|-----------------:|------------:|
| silver         |      0.335    |         0.369444 |     3.44444 |
| platinum       |      0.521277 |         0.536481 |     1.52041 |
| bronze         |      0.325123 |         0.312901 |    -1.22218 |
| gold           |      0.440789 |         0.421341 |    -1.94488 |

