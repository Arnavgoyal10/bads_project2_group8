# Data Audit Note


## Customers

- **Duplicates**: 18 duplicated customer_ids found and dropped.

- **Missing**: `age` has 0 missing values. Kept as NaN.

- **Missing**: `city` has 10 missing values. Kept as NaN.

- **Missing**: `gender` has 0 missing values. Kept as NaN.

- **Missing**: `income_band` has 0 missing values. Kept as NaN.

- **Invalid ages**: 3 ages < 0 or > 120 found and set to NaN.

- **Gender**: Normalized labels to 'male', 'female'.

- **Region**: Normalized region labels.


## Campaigns

- **Anomalies**: 21 campaigns have spend > budget. Flagged but kept.

- **Duplicates**: 3 duplicated campaign_ids found and dropped.

- **Negative spend**: 3 campaigns have spend_usd < 0. Set to NaN.

- **Anomalies**: 23 campaigns have clicks > impressions. Kept as is, but noted.


## Leads

- **Missing Keys**: 26 anonymous leads (missing customer_id), 33 unattributed leads (missing campaign_id).

- **Impossible Dates**: 0 leads with conversion_date < lead_date. Set conversion_date to NaN.

- **Conflict**: 12 leads have a conversion_date but converted_30d is False.


## Website Sessions

- **Invalid**: 31 sessions with pages_viewed <= 0. Set to NaN.

- **Invalid**: 48 sessions with time_on_site_sec <= 0 or > 24h. Set to NaN.

- **Join Rates**: 99.5% of sessions match a customer, 77.0% match a campaign.


## Transactions

- **Invalid**: 35 transactions with revenue <= 0. Flagged.

- **Invalid**: 48 transactions with units <= 0. Flagged.

- **Join Rates**: 97.9% of transactions match a customer.


--- 

# Data Maturity Report


## Table Scores

- **Customers**: 99.7/100 (✅ Healthy)

- **Campaigns**: 68.1/100 (🚨 Critical)

- **Leads**: 89.8/100 (⚠️ Warning)


## Strategic Fixes

- **Identity Resolution**: 22% of sessions are anonymous; implement server-side tracking.

- **Field Validation**: Campaign spend often exceeds budget; sync marketing spend data via API.
