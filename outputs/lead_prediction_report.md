# Lead Conversion Prediction Report

## Model Comparison

| Model               |      AUC |       F1 |
|:--------------------|---------:|---------:|
| Logistic Regression | 0.616028 | 0.343693 |
| Random Forest       | 0.587043 | 0.293233 |
| Gradient Boosting   | 0.609575 | 0.188437 |


## Feature Importance (SHAP)

See `outputs/charts/shap_summary.png`.


## Decile Analysis

|   decile |   count |   conversions |   conversion_rate |
|---------:|--------:|--------------:|------------------:|
|        0 |     105 |            21 |          0.2      |
|        1 |     104 |            25 |          0.240385 |
|        2 |     105 |            33 |          0.314286 |
|        3 |     104 |            42 |          0.403846 |
|        4 |     105 |            34 |          0.32381  |
|        5 |     104 |            34 |          0.326923 |
|        6 |     104 |            36 |          0.346154 |
|        7 |     105 |            46 |          0.438095 |
|        8 |     104 |            55 |          0.528846 |
|        9 |     105 |            51 |          0.485714 |
