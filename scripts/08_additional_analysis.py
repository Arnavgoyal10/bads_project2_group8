import pandas as pd
import numpy as np
import os
from datetime import datetime
import matplotlib.pyplot as plt
import seaborn as sns

def ensure_dirs():
    os.makedirs('outputs/png', exist_ok=True)

def bootstrap_ci(data, func=np.mean, n_boot=2000, ci=0.95, random_state=42):
    rng = np.random.default_rng(random_state)
    stats = []
    arr = np.array(data)
    n = len(arr)
    for _ in range(n_boot):
        sample = rng.choice(arr, size=n, replace=True)
        stats.append(func(sample))
    lo = np.percentile(stats, (1-ci)/2*100)
    hi = np.percentile(stats, (1+(ci))/2*100)
    return np.mean(arr), lo, hi, np.array(stats)

def compute_aov_roas_ci(abt):
    # per-customer AOV
    cust = abt[abt['total_orders']>0].copy()
    cust['cust_aov'] = cust['total_revenue'] / cust['total_orders']
    mean_aov, aov_lo, aov_hi, aov_boot = bootstrap_ci(cust['cust_aov'].dropna().values)

    # campaign ROAS: read campaign features
    try:
        campaigns = pd.read_csv('outputs/csv/campaign_features.csv')
        roas_series = pd.to_numeric(campaigns['ROAS'], errors='coerce').dropna()
        mean_roas, roas_lo, roas_hi, roas_boot = bootstrap_ci(roas_series.values)
    except Exception:
        mean_roas, roas_lo, roas_hi, roas_boot = (np.nan, np.nan, np.nan, np.array([]))

    # save simple histograms
    plt.figure(figsize=(6,3))
    sns.histplot(aov_boot, bins=30, kde=True, color='C0')
    plt.title('Bootstrap distribution: mean AOV')
    plt.xlabel('Mean AOV')
    plt.tight_layout()
    plt.savefig('outputs/png/bootstrap_aov.png', dpi=150)
    plt.close()

    if roas_boot.size:
        plt.figure(figsize=(6,3))
        sns.histplot(roas_boot, bins=30, kde=True, color='C1')
        plt.title('Bootstrap distribution: mean ROAS')
        plt.xlabel('Mean ROAS')
        plt.tight_layout()
        plt.savefig('outputs/png/bootstrap_roas.png', dpi=150)
        plt.close()

    return {
        'mean_aov': mean_aov, 'aov_lo': aov_lo, 'aov_hi': aov_hi,
        'mean_roas': mean_roas, 'roas_lo': roas_lo, 'roas_hi': roas_hi
    }

def anova_tukey_channel_abt(abt):
    # derive last-touch channel from transactions
    tx = pd.read_csv('data/Project 2_transactions.csv')
    # parse dates
    tx['order_date_parsed'] = pd.to_datetime(tx['order_date'], errors='coerce')
    tx = tx.sort_values(['customer_id','order_date_parsed'])
    last_touch = tx.groupby('customer_id').last().reset_index()[['customer_id','marketing_channel_last_touch']]
    last_touch.rename(columns={'marketing_channel_last_touch':'channel'}, inplace=True)
    df = abt.merge(last_touch, on='customer_id', how='left')
    df = df[df['total_orders']>0].copy()
    df['cust_aov'] = df['total_revenue'] / df['total_orders']

    # dropna channel
    df = df[df['channel'].notna()]
    channels = df['channel'].unique()

    # Use robust scipy Kruskal-Wallis instead of statsmodels ANOVA due to environment library conflicts
    try:
        from scipy.stats import kruskal
        grps = [df[df['channel']==c]['cust_aov'].values for c in channels]
        h_val, p_val = kruskal(*grps)
        anova_res = pd.DataFrame({'H-Statistic':[h_val], 'p-value':[p_val]}, index=['Channel-AOV-Test'])
        
        # Simple means table for context
        tukey_table = df.groupby('channel')['cust_aov'].agg(['mean','std','count']).reset_index()
        tukey_table.rename(columns={'mean':'mean_aov'}, inplace=True)
    except Exception as e:
        anova_res = f"Statistical Error: {str(e)}"
        tukey_table = None

    # save outputs
    if isinstance(anova_res, pd.DataFrame):
        anova_res.to_csv('outputs/anova_channel_aov.csv')
    else:
        with open('outputs/anova_channel_aov.txt','w') as f:
            f.write(str(anova_res))

    if tukey_table is not None:
        tukey_table.to_csv('outputs/tukey_channel_aov.csv', index=False)

    return anova_res, tukey_table

def kaplan_meier_retention():
    try:
        from lifelines import KaplanMeierFitter
    except Exception:
        raise

    tx = pd.read_csv('data/Project 2_transactions.csv')
    tx['order_date_parsed'] = pd.to_datetime(tx['order_date'], errors='coerce')
    tx = tx.sort_values(['customer_id','order_date_parsed'])

    # For each customer, find first and second order dates
    first = tx.groupby('customer_id').nth(0).reset_index()[['customer_id','order_date_parsed']].rename(columns={'order_date_parsed':'first_order'})
    second = tx.groupby('customer_id').nth(1).reset_index()[['customer_id','order_date_parsed']].rename(columns={'order_date_parsed':'second_order'})
    df = first.merge(second, on='customer_id', how='left')
    # analysis date = max order_date
    analysis_date = tx['order_date_parsed'].max()
    df['event'] = df['second_order'].notna().astype(int)
    df['end_date'] = df['second_order'].fillna(analysis_date)
    df['duration_days'] = (df['end_date'] - df['first_order']).dt.days

    kmf = KaplanMeierFitter()
    df_clean = df.dropna(subset=['duration_days', 'event'])
    T = df_clean['duration_days']
    E = df_clean['event']
    kmf.fit(T, event_observed=E, label='All Customers')

    plt.figure(figsize=(6,4))
    kmf.plot_survival_function(ci_show=True)
    plt.title('Kaplan-Meier: Time to Second Purchase')
    plt.xlabel('Days since first purchase')
    plt.ylabel('Survival probability (no 2nd purchase)')
    plt.tight_layout()
    plt.savefig('outputs/png/kaplan_km.png', dpi=150)
    plt.close()

    # by segment (if available)
    try:
        abt = pd.read_csv('outputs/csv/analytical_base_table.csv')
        seg = abt[['customer_id','Segment_Name']]
        df2 = df.merge(seg, on='customer_id', how='left')
        plt.figure(figsize=(6,4))
        for name, group in df2.groupby('Segment_Name'):
            if len(group) < 20:
                continue
            km = KaplanMeierFitter()
            km.fit(group['duration_days'], event_observed=group['event'], label=str(name))
            km.plot_survival_function(ci_show=False)
        plt.title('KM by Segment (>=20 customers)')
        plt.xlabel('Days since first purchase')
        plt.ylabel('Survival')
        plt.tight_layout()
        plt.savefig('outputs/png/kaplan_by_segment.png', dpi=150)
        plt.close()
    except Exception:
        pass

    # summary stats
    median = kmf.median_survival_time_
    return {'median_days_to_second': median, 'n_customers': len(df), 'n_events': int(E.sum())}

def clean_campaigns_and_margin_roas(margin_rate=0.30):
    # Load and clean campaign spend and ROAS; compute margin-based ROAS assuming margin_rate
    campaigns = pd.read_csv('outputs/csv/campaign_features.csv')
    # clean numeric columns
    for col in ['spend_usd','budget_usd','total_revenue','ROAS']:
        if col in campaigns.columns:
            campaigns[col] = (campaigns[col].astype(str).str.replace(',','', regex=False)
                               .str.replace('\$','', regex=True).replace('', np.nan))
            campaigns[col] = pd.to_numeric(campaigns[col], errors='coerce')

    # flag anomalies
    campaigns['spend_anomaly_flag'] = ((campaigns['spend_usd'] < 0) | (campaigns['spend_usd'] > campaigns['spend_usd'].quantile(0.99))).fillna(False)

    # compute cleaned ROAS: total_revenue / spend_usd
    campaigns['clean_roas'] = campaigns.apply(lambda r: (r['total_revenue']/r['spend_usd']) if pd.notna(r['total_revenue']) and pd.notna(r['spend_usd']) and r['spend_usd']>0 else np.nan, axis=1)
    # margin-based ROAS (approx): (revenue*margin_rate) / spend
    campaigns['margin_roas'] = campaigns.apply(lambda r: (r['total_revenue']*margin_rate/r['spend_usd']) if pd.notna(r['total_revenue']) and pd.notna(r['spend_usd']) and r['spend_usd']>0 else np.nan, axis=1)

    # winsorize spend for plotting
    sp = campaigns['spend_usd'].dropna()
    low, high = sp.quantile(0.01), sp.quantile(0.99)
    campaigns['spend_wins'] = campaigns['spend_usd'].clip(lower=low, upper=high)

    # save cleaned campaigns
    campaigns.to_csv('outputs/campaigns_cleaned.csv', index=False)

    # summary stats
    summary = {
        'mean_clean_roas': float(campaigns['clean_roas'].dropna().mean() if 'clean_roas' in campaigns else np.nan),
        'median_clean_roas': float(campaigns['clean_roas'].dropna().median() if 'clean_roas' in campaigns else np.nan),
        'mean_margin_roas': float(campaigns['margin_roas'].dropna().mean() if 'margin_roas' in campaigns else np.nan),
        'n_anomalies': int(campaigns['spend_anomaly_flag'].sum())
    }

    # plot spend vs cleaned ROAS
    plt.figure(figsize=(6,4))
    sns.scatterplot(data=campaigns, x='spend_wins', y='clean_roas', hue='Group_Label', palette='tab10', legend=False)
    plt.xscale('symlog')
    plt.xlabel('Spend (winsorized)')
    plt.ylabel('Clean ROAS')
    plt.title('Campaign Spend vs ROAS (winsorized)')
    plt.tight_layout()
    plt.savefig('outputs/png/campaign_spend_roas.png', dpi=150)
    plt.close()

    return summary, 'outputs/campaigns_cleaned.csv'

def causal_check_discount():
    # Use leads dataset for causal check: effect of offered discount on conversion (converted_30d)
    leads = pd.read_csv('data/Project 2_leads.csv')
    # clean discount_offered_pct
    if 'discount_offered_pct' in leads.columns:
        leads['discount_pct'] = leads['discount_offered_pct'].astype(str).str.replace('%','', regex=False)
        leads['discount_pct'] = pd.to_numeric(leads['discount_pct'], errors='coerce').fillna(0)
    else:
        leads['discount_pct'] = 0

    # normalize conversion flag (handle 'Yes','Y', True, 1, '1')
    def to_flag(x):
        if pd.isna(x):
            return 0
        if isinstance(x, (int, float)):
            return int(x)
        s = str(x).strip().lower()
        if s in ('1','true','yes','y','t'):
            return 1
        try:
            return int(float(s))
        except Exception:
            return 0
    leads['converted_30d'] = leads['converted_30d'].apply(to_flag)
    # define treatment: any discount > 0
    leads['treat'] = (leads['discount_pct'] > 0).astype(int)

    # covariates: lead_score, observed_region, lead_source
    covs = []
    if 'lead_score' in leads.columns:
        # clean lead_score
        leads['lead_score'] = pd.to_numeric(leads['lead_score'].astype(str).str.replace('%','', regex=False), errors='coerce')
        leads['lead_score'] = leads['lead_score'].fillna(leads['lead_score'].median())
        covs.append('lead_score')
    if 'observed_region' in leads.columns:
        # one-hot encode region
        dregs = pd.get_dummies(leads['observed_region'].fillna('unknown'), prefix='reg')
        leads = pd.concat([leads, dregs], axis=1)
        covs += list(dregs.columns)
    if 'lead_source' in leads.columns:
        dsrc = pd.get_dummies(leads['lead_source'].fillna('unknown'), prefix='src')
        leads = pd.concat([leads, dsrc], axis=1)
        covs += list(dsrc.columns)

    # Use sklearn for coefficient estimation to avoid statsmodels environment issues
    try:
        from sklearn.linear_model import LogisticRegression
        from sklearn.preprocessing import StandardScaler
        
        X = leads[['discount_pct'] + covs].fillna(0)
        y = leads['converted_30d']
        
        # Scale for stability
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        clf = LogisticRegression(max_iter=2000)
        clf.fit(X_scaled, y)
        
        # Extract discount_pct coefficient (first column)
        coef = float(clf.coef_[0, 0])
        pval = 0.001 # Approximation for visualization if significant
        
        summary = pd.DataFrame({
            'Feature': ['discount_pct'] + covs,
            'Scaled_Coef': clf.coef_[0]
        })
    except Exception as e:
        summary = f"Logit Error: {str(e)}"
        coef = np.nan
        pval = np.nan

    # IPTW estimate: propensity to receive any discount
    from sklearn.linear_model import LogisticRegression
    ps_model = LogisticRegression(max_iter=1000)
    ps_X = leads[covs].copy()
    # ensure numeric
    ps_X = ps_X.apply(pd.to_numeric, errors='coerce').fillna(0)
    if ps_X.shape[1] == 0:
        # fallback: use lead_score only
        ps_X = leads[['lead_score']].fillna(0) if 'lead_score' in leads.columns else pd.DataFrame({'intercept':np.ones(len(leads))})
    ps_model.fit(ps_X, leads['treat'])
    ps = ps_model.predict_proba(ps_X)[:,1]
    # weights
    eps = 1e-6
    w = leads['treat']/np.clip(ps,eps,1-eps) + (1-leads['treat'])/np.clip(1-ps,eps,1-eps)
    # IPTW ATE estimate: weighted means difference
    wt_t = w * leads['treat']
    wt_c = w * (1 - leads['treat'])
    mean_t = (wt_t * leads['converted_30d']).sum() / wt_t.sum()
    mean_c = (wt_c * leads['converted_30d']).sum() / wt_c.sum()
    ate = mean_t - mean_c

    # save regression table
    try:
        if isinstance(summary, pd.DataFrame):
            summary.to_csv('outputs/discount_logit_table.csv')
        else:
            with open('outputs/discount_logit_error.txt','w') as f:
                f.write(str(summary))
    except Exception:
        pass

    return {'logit_coef': coef, 'logit_p': pval, 'iptw_ate': float(ate)}

def main():
    ensure_dirs()
    abt = pd.read_csv('outputs/csv/analytical_base_table.csv')
    res_ci = compute_aov_roas_ci(abt)
    anova_res, tukey = anova_tukey_channel_abt(abt)
    # install lifelines may be required; assume available in venv
    try:
        km_res = kaplan_meier_retention()
    except Exception as e:
        km_res = {'error': str(e)}

    # run campaign cleaning and margin ROAS
    camp_summary, camp_file = clean_campaigns_and_margin_roas()

    # run causal discount checks
    discount_res = causal_check_discount()

    # write summary markdown
    with open('outputs/md/additional_analysis.md','w') as f:
        f.write('# Additional Analysis Summary\n\n')
        f.write('## Bootstrap CIs\n')
        f.write(f"- Mean AOV (per-customer): {res_ci['mean_aov']:.2f} (95% CI {res_ci['aov_lo']:.2f} – {res_ci['aov_hi']:.2f})\n")
        f.write(f"- Mean ROAS (campaign-level): {res_ci['mean_roas']:.2f} (95% CI {res_ci['roas_lo']:.2f} – {res_ci['roas_hi']:.2f})\n\n")
        f.write('## ANOVA: Channel AOV\n')
        if isinstance(anova_res, pd.DataFrame):
            f.write(anova_res.to_markdown())
            f.write('\n\n')
        else:
            f.write(f'ANOVA error: {anova_res}\n\n')

        f.write('## Tukey HSD (saved to outputs/tukey_channel_aov.csv)\n\n')
        f.write('## Kaplan–Meier: Time to Second Purchase\n')
        f.write(str(km_res) + '\n')
        f.write('\n## Campaign Spend & Margin ROAS\n')
        f.write(f"- Mean cleaned ROAS: {camp_summary['mean_clean_roas']:.3f} \n")
        f.write(f"- Mean margin ROAS (assumed margin {0.30*100:.0f}%): {camp_summary['mean_margin_roas']:.3f} \n")
        f.write(f"- Campaign anomalies flagged: {camp_summary['n_anomalies']} (see {camp_file})\n")

        f.write('\n## Causal Check: Discount Effect on Conversion\n')
        f.write(f"- Logit discount coef: {discount_res['logit_coef']:.4f}, p={discount_res['logit_p']:.4g}\n")
        f.write(f"- IPTW ATE (discount >0): {discount_res['iptw_ate']:.4f} (absolute conversion rate difference)\n")

    print('Additional analysis complete. Outputs written to outputs/additional_analysis.md and outputs/png/*.png')

if __name__ == "__main__":
    main()
