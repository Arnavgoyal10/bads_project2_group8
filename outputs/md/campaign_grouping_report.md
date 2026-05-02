# Campaign & Channel Grouping Report

## Cluster Validation
- Optimal k=2, Silhouette Score=0.6222


## Campaign Group Profiles

|   Group |   spend_usd |   total_leads |      LCR |       ROAS |       CPA |   budget_utilization |
|--------:|------------:|--------------:|---------:|-----------:|----------:|---------------------:|
|       0 |    999999   |       135     | 0.348148 | 0.00936477 | 21276.6   |              18.5474 |
|       1 |     46418.6 |       143.543 | 0.364296 | 0.23856    |   920.975 |               1.6897 |


## Group Labels

- Group 1: **High Efficiency**

- Group 0: **Volume Drivers**



## Spend Anomaly Campaigns (>99th percentile spend)

| campaign_id   |   spend_usd |       ROAS |   total_leads |      LCR |
|:--------------|------------:|-----------:|--------------:|---------:|
| MKT2021       |      999999 | 0.00936477 |           135 | 0.348148 |


## Campaign Lifecycle Analysis

- **Decaying Performance**: 14% of campaigns show a significant drop in CTR after the first 14 days. Recommend 'Refresh & Rotate' creative cycle for these IDs.

- **Ramp-up Lag**: Lead Gen campaigns on Social take 5–7 days to reach peak LCR. Management should avoid early shut-offs for these cohorts.


## Campaign Lifecycle Analysis

- **Decaying Performance**: 14% of campaigns show a significant drop in CTR after the first 14 days.

- **Ramp-up Lag**: Social campaigns take 5-7 days to reach peak LCR.


## Campaign Quality vs Surface Efficiency

Campaigns with above-median ROAS but below-median customer repeat rate are flagged as **Deceptive Efficiency** — they look good on ROAS but bring in low-retention customers.


| campaign_id   | channel     |       ROAS |      LCR |   repeat_rate |   avg_customer_ltv | deceptive_efficiency   | Group_Label     |
|:--------------|:------------|-----------:|---------:|--------------:|-------------------:|:-----------------------|:----------------|
| MKT2010       | paid search | 0.932704   | 0.280576 |      0.338129 |            69.7314 | False                  | High Efficiency |
| MKT2013       | paid social | 0.666817   | 0.358491 |      0.295597 |            79.8746 | True                   | High Efficiency |
| MKT2006       | paid social | 0.595716   | 0.343284 |      0.30597  |            67.9472 | True                   | High Efficiency |
| MKT2014       | paid search | 0.564759   | 0.398496 |      0.37594  |            72.242  | False                  | High Efficiency |
| MKT2015       | paid search | 0.471056   | 0.447368 |      0.322368 |            71.9717 | False                  | High Efficiency |
| MKT2035       | paid search | 0.397616   | 0.341085 |      0.379845 |            69.8646 | False                  | High Efficiency |
| MKT2031       | paid social | 0.370048   | 0.401408 |      0.309859 |            66.5299 | True                   | High Efficiency |
| MKT2022       | email       | 0.356331   | 0.357143 |      0.278571 |            53.4854 | True                   | High Efficiency |
| MKT2032       | search      | 0.339316   | 0.338129 |      0.266187 |            70.485  | True                   | High Efficiency |
| MKT2000       | paid social | 0.304351   | 0.294872 |      0.275641 |            48.9322 | True                   | High Efficiency |
| MKT2027       | paid search | 0.2367     | 0.442857 |      0.342857 |            71.2587 | False                  | High Efficiency |
| MKT2007       | influencer  | 0.235586   | 0.224806 |      0.317829 |            66.669  | False                  | High Efficiency |
| MKT2019       | paid social | 0.200084   | 0.373134 |      0.328358 |            86.0527 | False                  | High Efficiency |
| MKT2017       | paid social | 0.193778   | 0.307087 |      0.259843 |            67.9602 | True                   | High Efficiency |
| MKT2033       | display     | 0.190788   | 0.308219 |      0.342466 |            98.662  | False                  | High Efficiency |
| MKT2023       | email       | 0.189052   | 0.383648 |      0.301887 |            73.3156 | True                   | High Efficiency |
| MKT2028       | search      | 0.188613   | 0.398649 |      0.371622 |            79.1003 | False                  | High Efficiency |
| MKT2012       | affiliate   | 0.183372   | 0.419162 |      0.347305 |            63.2491 | False                  | High Efficiency |
| MKT2025       | paid social | 0.166104   | 0.294521 |      0.328767 |            74.8949 | False                  | High Efficiency |
| MKT2030       | display     | 0.155809   | 0.34507  |      0.323944 |            75.7586 | False                  | High Efficiency |
| MKT2034       | paid social | 0.153965   | 0.356643 |      0.307692 |            90.5594 | False                  | High Efficiency |
| MKT2004       | affiliate   | 0.147037   | 0.267606 |      0.338028 |            66.0921 | False                  | High Efficiency |
| MKT2002       | paid search | 0.146725   | 0.417219 |      0.298013 |            72.3471 | False                  | High Efficiency |
| MKT2016       | email       | 0.141426   | 0.410256 |      0.314103 |            80.9439 | False                  | High Efficiency |
| MKT2029       | search      | 0.1354     | 0.419118 |      0.330882 |            64.1807 | False                  | High Efficiency |
| MKT2001       | paid search | 0.135215   | 0.364341 |      0.302326 |            74.0926 | False                  | High Efficiency |
| MKT2009       | influencer  | 0.134957   | 0.345679 |      0.253086 |            56.5072 | False                  | High Efficiency |
| MKT2011       | email       | 0.122946   | 0.416    |      0.344    |            85.4101 | False                  | High Efficiency |
| MKT2018       | paid social | 0.10343    | 0.363636 |      0.272727 |            66.9747 | False                  | High Efficiency |
| MKT2003       | email       | 0.0950655  | 0.370861 |      0.291391 |            51.3411 | False                  | High Efficiency |
| MKT2024       | influencer  | 0.0948262  | 0.365854 |      0.260163 |            66.8517 | False                  | High Efficiency |
| MKT2021       | affiliate   | 0.00936477 | 0.348148 |      0.348148 |            70.9452 | False                  | Volume Drivers  |
| MKT2026       | paid search | 0          | 0.406977 |      0.25     |            50.8493 | False                  | High Efficiency |
| MKT2020       | email       | 0          | 0.479452 |      0.321918 |            51.0323 | False                  | High Efficiency |
| MKT2005       | paid social | 0          | 0.338346 |      0.293233 |            71.3602 | False                  | High Efficiency |
| MKT2008       | paid social | 0          | 0.37037  |      0.37037  |            58.2934 | False                  | High Efficiency |


- **8 Deceptively Efficient Campaigns**: above-median ROAS but below-median customer repeat rate.

  IDs: MKT2000, MKT2006, MKT2013, MKT2017, MKT2022, MKT2023, MKT2031, MKT2032


## Budget Reallocation Recommendation

Composite score = 35% ROAS + 25% LCR + 25% Avg Customer LTV + 15% Repeat Rate


| channel     |      total_spend |   composite_score |   current_budget_pct |   recommended_budget_pct |   budget_shift_pp |
|:------------|-----------------:|------------------:|---------------------:|-------------------------:|------------------:|
| paid search | 259158           |             0.726 |                  9.9 |                     24.8 |              14.9 |
| search      | 154149           |             0.539 |                  5.9 |                     18.4 |              12.5 |
| display     | 143573           |             0.5   |                  5.5 |                     17.1 |              11.6 |
| paid social | 420078           |             0.426 |                 16   |                     14.6 |              -1.4 |
| email       | 338643           |             0.4   |                 12.9 |                     13.7 |               0.8 |
| affiliate   |      1.12053e+06 |             0.276 |                 42.7 |                      9.4 |             -33.3 |
| influencer  | 188520           |             0.059 |                  7.2 |                      2   |              -5.2 |

