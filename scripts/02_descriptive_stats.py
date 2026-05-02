import os
if os.path.basename(os.getcwd()) == "scripts": os.chdir("..")

import pandas as pd
import numpy as np
import os
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import seaborn as sns
from scipy import stats
from scipy.stats import chi2_contingency, kruskal, mannwhitneyu, spearmanr, pointbiserialr

# ─── Styling ────────────────────────────────────────────────────────────────
PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16']
sns.set_theme(style='darkgrid', palette=PALETTE)
plt.rcParams.update({'figure.dpi': 130, 'savefig.bbox': 'tight', 'savefig.facecolor': '#0f172a',
                     'axes.facecolor': '#1e293b', 'axes.labelcolor': '#94a3b8',
                     'xtick.color': '#94a3b8', 'ytick.color': '#94a3b8',
                     'text.color': '#e2e8f0', 'grid.color': '#334155', 'figure.facecolor': '#0f172a'})

def ensure_dirs():
    os.makedirs('outputs/csv', exist_ok=True)
    os.makedirs('outputs/md', exist_ok=True)
    os.makedirs('outputs/png', exist_ok=True)

def load_data():
    data_dir = 'data'
    customers  = pd.read_csv(os.path.join(data_dir, 'Project 2_customers.csv'),  encoding='utf-8-sig')
    campaigns  = pd.read_csv(os.path.join(data_dir, 'Project 2_campaigns.csv'),  encoding='utf-8-sig')
    leads      = pd.read_csv(os.path.join(data_dir, 'Project 2_leads.csv'),       encoding='utf-8-sig')
    sessions   = pd.read_csv(os.path.join(data_dir, 'Project 2_website_sessions.csv'), encoding='utf-8-sig')
    transactions = pd.read_csv(os.path.join(data_dir, 'Project 2_transactions.csv'), encoding='utf-8-sig')
    abt        = pd.read_csv('outputs/csv/analytical_base_table.csv')
    return customers, campaigns, leads, sessions, transactions, abt

def sig_stars(p):
    if p < 0.001: return '***'
    if p < 0.01:  return '**'
    if p < 0.05:  return '*'
    return 'ns'

def run_descriptive_stats():
    ensure_dirs()
    customers, campaigns, leads, sessions, transactions, abt = load_data()
    report = ["# Descriptive & Statistical Diagnosis Report\n"]

    # ── Normalise leads ──────────────────────────────────────────────────────
    leads['converted_30d'] = leads['converted_30d'].astype(str).str.lower().isin(['yes','true','1','1.0'])
    leads['lead_source']   = leads['lead_source'].str.lower().str.strip()
    leads['discount_pct']  = pd.to_numeric(
        leads['discount_offered_pct'].astype(str).str.replace('%','', regex=False), errors='coerce')

    campaigns['channel']   = campaigns['channel'].str.lower().str.strip()
    campaigns['spend_usd'] = campaigns['spend_usd'].replace(r'[\$,]','', regex=True)\
                                                    .replace('USD','', regex=True).astype(float)

    leads_camp = leads.merge(
        campaigns[['campaign_id','channel','spend_usd','objective','budget_usd']], on='campaign_id', how='left')

    # ── Section 1: Channel Performance ──────────────────────────────────────
    report.append("## 1. Channel Performance Analysis\n")
    ch = leads_camp.groupby('channel').agg(
        leads=('lead_id','count'), conversions=('converted_30d','sum')).reset_index()
    ch['LCR'] = ch['conversions'] / ch['leads']
    ch['CPL'] = leads_camp.groupby('channel')['spend_usd'].mean().values  # avg spend per lead
    ch = ch.sort_values('LCR', ascending=False)
    report.append(ch.to_markdown(index=False) + "\n\n")

    # ── Chi-Square: channel conversion rates differ? ──────────────────────
    contingency_ch = pd.crosstab(leads_camp['channel'], leads_camp['converted_30d'])
    chi2_ch, p_ch, dof_ch, _ = chi2_contingency(contingency_ch)
    report.append(f"### Hypothesis Test: Channel Conversion Rates\n"
                  f"- **H₀**: Conversion rate is identical across all acquisition channels.\n"
                  f"- **Test**: Pearson Chi-Square (df={dof_ch})\n"
                  f"- **χ² = {chi2_ch:.3f}, p = {p_ch:.4f}** {sig_stars(p_ch)}\n"
                  f"- **Decision**: {'Reject H₀ — channels convert at statistically different rates. Budget reallocation is evidenced.' if p_ch < 0.05 else 'Fail to reject H₀.'}\n\n")

    # ── Kruskal-Wallis across channels ────────────────────────────────────
    ch_groups = [leads_camp[leads_camp['channel']==c]['converted_30d'].astype(int).values
                 for c in leads_camp['channel'].dropna().unique()]
    ch_groups = [g for g in ch_groups if len(g) > 1]
    kw_ch_h, kw_ch_p = kruskal(*ch_groups)
    report.append(f"- **Kruskal-Wallis H = {kw_ch_h:.3f}, p = {kw_ch_p:.4f}** {sig_stars(kw_ch_p)} "
                  f"(non-parametric confirmation)\n\n")

    # chart
    fig, ax = plt.subplots(figsize=(11, 5))
    colors = [PALETTE[i % len(PALETTE)] for i in range(len(ch))]
    bars = ax.bar(ch['channel'], ch['LCR'], color=colors, edgecolor='#334155', linewidth=0.5)
    ax.axhline(ch['LCR'].mean(), color='#f59e0b', linestyle='--', linewidth=1.2, label=f'Mean LCR = {ch["LCR"].mean():.2%}')
    for bar, val in zip(bars, ch['LCR']):
        ax.text(bar.get_x() + bar.get_width()/2, val + 0.005, f'{val:.1%}',
                ha='center', va='bottom', fontsize=8, color='#e2e8f0')
    ax.set_title(f'Lead Conversion Rate by Channel  (χ²={chi2_ch:.1f}, p={p_ch:.4f} {sig_stars(p_ch)})',
                 fontsize=11, pad=10)
    ax.set_ylabel('LCR'); ax.set_xlabel('Channel')
    ax.tick_params(axis='x', rotation=30)
    ax.legend(fontsize=9)
    plt.tight_layout()
    plt.savefig('outputs/png/channel_lcr.png', bbox_inches='tight')
    plt.close()

    # ── Section 2: Campaign Objective ────────────────────────────────────
    report.append("## 2. Campaign Objective Analysis\n")
    obj = leads_camp.groupby('objective').agg(
        leads=('lead_id','count'), conversions=('converted_30d','sum')).reset_index()
    obj['LCR'] = obj['conversions'] / obj['leads']
    report.append(obj.to_markdown(index=False) + "\n\n")
    contingency_obj = pd.crosstab(leads_camp['objective'], leads_camp['converted_30d'])
    chi2_obj, p_obj, dof_obj, _ = chi2_contingency(contingency_obj)
    report.append(f"- **Chi-Square across Objectives**: χ²={chi2_obj:.3f}, p={p_obj:.4f} {sig_stars(p_obj)}\n\n")

    # ── Section 3: Creative Type ──────────────────────────────────────────
    report.append("## 3. Creative Type Analysis\n")
    leads_cr = leads.merge(campaigns[['campaign_id','creative_type']], on='campaign_id', how='left')
    cr = leads_cr.groupby('creative_type').agg(
        leads=('lead_id','count'), conversions=('converted_30d','sum')).reset_index()
    cr['LCR'] = cr['conversions'] / cr['leads']
    report.append(cr.to_markdown(index=False) + "\n\n")

    # ── Section 4: Regional Analysis ──────────────────────────────────────
    report.append("## 4. Regional Analysis\n")
    reg = abt.groupby('region').agg(
        customers=('customer_id','count'),
        avg_revenue=('total_revenue','mean'),
        avg_LCR=('LCR','mean'),
        total_revenue=('total_revenue','sum')
    ).reset_index().sort_values('total_revenue', ascending=False)
    report.append(reg.to_markdown(index=False) + "\n\n")

    # Kruskal-Wallis revenue across regions
    reg_groups = [abt[abt['region']==r]['total_revenue'].dropna().values for r in abt['region'].dropna().unique()]
    reg_groups = [g for g in reg_groups if len(g) > 1]
    kw_reg_h, kw_reg_p = kruskal(*reg_groups)
    report.append(f"- **Kruskal-Wallis Revenue across Regions**: H={kw_reg_h:.3f}, p={kw_reg_p:.4f} {sig_stars(kw_reg_p)}\n\n")

    # ── Section 5: Device Analysis ────────────────────────────────────────
    report.append("## 5. Device Analysis\n")
    dev = abt.groupby('preferred_device').agg(
        customers=('customer_id','count'),
        avg_revenue=('total_revenue','mean'),
        avg_engagement=('avg_engagement_score','mean')
    ).reset_index()
    report.append(dev.to_markdown(index=False) + "\n\n")

    # Mann-Whitney: mobile vs desktop revenue
    mob_rev  = abt[abt['preferred_device']=='mobile']['total_revenue'].dropna()
    desk_rev = abt[abt['preferred_device']=='desktop']['total_revenue'].dropna()
    if len(mob_rev) > 0 and len(desk_rev) > 0:
        mw_u, mw_p = mannwhitneyu(mob_rev, desk_rev, alternative='two-sided')
        t_stat, t_p = stats.ttest_ind(mob_rev, desk_rev, equal_var=False)
        report.append(f"### Hypothesis Test: Mobile vs Desktop Revenue\n"
                      f"- **H₀**: Median revenue is equal for mobile and desktop users.\n"
                      f"- **Mann-Whitney U = {mw_u:.0f}, p = {mw_p:.4f}** {sig_stars(mw_p)}\n"
                      f"- **Welch t = {t_stat:.3f}, p = {t_p:.4f}** {sig_stars(t_p)}\n"
                      f"- **Decision**: {'Statistically significant revenue gap between devices.' if mw_p < 0.05 else 'No significant revenue difference.'}\n"
                      f"- Mobile avg: ${mob_rev.mean():.2f} | Desktop avg: ${desk_rev.mean():.2f}\n\n")

    # device bar chart
    fig, axes = plt.subplots(1, 2, figsize=(12, 5))
    axes[0].bar(dev['preferred_device'], dev['avg_revenue'], color=PALETTE[:len(dev)])
    axes[0].set_title('Avg Revenue by Device'); axes[0].set_ylabel('Avg Revenue (USD)')
    axes[0].tick_params(axis='x', rotation=20)
    axes[1].bar(dev['preferred_device'], dev['avg_engagement'], color=PALETTE[2:2+len(dev)])
    axes[1].set_title('Avg Engagement Score by Device'); axes[1].set_ylabel('Engagement Score')
    axes[1].tick_params(axis='x', rotation=20)
    plt.suptitle('Device Performance Comparison', fontsize=13, y=1.02)
    plt.tight_layout()
    plt.savefig('outputs/png/device_comparison.png', bbox_inches='tight')
    plt.close()

    # ── Section 6: Comprehensive Hypothesis Tests ─────────────────────────
    report.append("## 6. Hypothesis Testing Battery\n\n")

    # 6a ANOVA: revenue across loyalty tiers
    if 'loyalty_tier' in abt.columns:
        tiers = abt['loyalty_tier'].dropna().unique()
        tier_groups = [abt[abt['loyalty_tier']==t]['total_revenue'].dropna().values for t in tiers]
        tier_groups = [g for g in tier_groups if len(g) > 1]
        if len(tier_groups) >= 2:
            f_stat, f_p = stats.f_oneway(*tier_groups)
            kw_t_h, kw_t_p = kruskal(*tier_groups)
            report.append(f"### 6a. Revenue by Loyalty Tier\n"
                          f"- **One-Way ANOVA**: F={f_stat:.3f}, p={f_p:.4f} {sig_stars(f_p)}\n"
                          f"- **Kruskal-Wallis**: H={kw_t_h:.3f}, p={kw_t_p:.4f} {sig_stars(kw_t_p)}\n"
                          f"- **Conclusion**: {'Loyalty tiers generate statistically different revenue — supports tiered marketing.' if f_p < 0.05 else 'No significant difference.'}\n\n")

    # 6b Point-biserial: add_to_cart → purchase
    if 'total_add_to_cart' in abt.columns and 'total_orders' in abt.columns:
        atc = abt['total_add_to_cart'].fillna(0)
        purchased = (abt['total_orders'] > 0).astype(int)
        r_atc, p_atc = pointbiserialr(purchased, atc)
        report.append(f"### 6b. Add-to-Cart → Purchase (Digital Intent Signal)\n"
                      f"- **Point-Biserial r = {r_atc:.4f}, p = {p_atc:.4f}** {sig_stars(p_atc)}\n"
                      f"- Customers who add to cart are {'significantly' if p_atc < 0.05 else 'not significantly'} more likely to purchase.\n\n")

    # 6c Spearman: sessions → revenue
    sess_rev = abt[['total_sessions','total_revenue']].dropna()
    rho_sess, p_sess = spearmanr(sess_rev['total_sessions'], sess_rev['total_revenue'])
    report.append(f"### 6c. Session Count vs Revenue (Spearman)\n"
                  f"- **ρ = {rho_sess:.4f}, p = {p_sess:.4f}** {sig_stars(p_sess)}\n"
                  f"- {'Significant positive correlation — more sessions associate with higher revenue.' if p_sess < 0.05 else 'No significant correlation.'}\n\n")

    # ── Section 7: Discounting Analysis ───────────────────────────────────
    report.append("## 7. Discounting Analysis\n")
    disc_corr, p_disc_sp = spearmanr(leads['discount_pct'].dropna(),
                                      leads.loc[leads['discount_pct'].notna(), 'converted_30d'].astype(int))
    r_disc, p_disc_pb = pointbiserialr(
        leads['converted_30d'].astype(int), leads['discount_pct'].fillna(0))

    report.append(f"- **Spearman ρ (discount % ↔ conversion)**: {disc_corr:.4f}, p={p_disc_sp:.4f} {sig_stars(p_disc_sp)}\n"
                  f"- **Point-Biserial r**: {r_disc:.4f}, p={p_disc_pb:.4f} {sig_stars(p_disc_pb)}\n"
                  f"- **Conclusion**: Discount percentage has {'statistically significant' if p_disc_sp < 0.05 else 'no statistically significant'} "
                  f"impact on conversion. Blanket discounting is {'justified.' if p_disc_sp < 0.05 else '**NOT justified** by the data — margin sacrifice is wasteful.'}\n\n")

    # Discount bracket analysis
    leads['disc_bracket'] = pd.cut(leads['discount_pct'].fillna(0),
                                   bins=[-1,0,10,15,20,100],
                                   labels=['0%','1-10%','11-15%','16-20%','>20%'])
    disc_grp = leads.groupby('disc_bracket').agg(
        n=('lead_id','count'), conversions=('converted_30d','sum')).reset_index()
    disc_grp['LCR'] = disc_grp['conversions'] / disc_grp['n']
    report.append("### Discount Bracket LCR\n")
    report.append(disc_grp.to_markdown(index=False) + "\n\n")

    # Kruskal-Wallis across brackets
    disc_bracket_groups = [leads[leads['disc_bracket']==b]['converted_30d'].astype(int).values
                           for b in leads['disc_bracket'].dropna().unique()]
    disc_bracket_groups = [g for g in disc_bracket_groups if len(g) > 1]
    if len(disc_bracket_groups) >= 2:
        kw_disc_h, kw_disc_p = kruskal(*disc_bracket_groups)
        report.append(f"- **Kruskal-Wallis across brackets**: H={kw_disc_h:.3f}, p={kw_disc_p:.4f} {sig_stars(kw_disc_p)}\n\n")

    # discount bar chart
    fig, ax = plt.subplots(figsize=(9, 5))
    colors_disc = [PALETTE[0], PALETTE[1], PALETTE[2], PALETTE[3], PALETTE[4]][:len(disc_grp)]
    bars = ax.bar(disc_grp['disc_bracket'].astype(str), disc_grp['LCR'], color=colors_disc, edgecolor='#334155')
    for bar, val in zip(bars, disc_grp['LCR']):
        ax.text(bar.get_x() + bar.get_width()/2, val + 0.003, f'{val:.1%}',
                ha='center', va='bottom', fontsize=9, color='#e2e8f0')
    ax.set_title(f'Conversion Rate by Discount Bracket\n(Kruskal-Wallis p={kw_disc_p:.4f} {sig_stars(kw_disc_p)})', fontsize=11)
    ax.set_xlabel('Discount Bracket'); ax.set_ylabel('Lead Conversion Rate')
    plt.tight_layout()
    plt.savefig('outputs/png/discount_analysis.png', bbox_inches='tight')
    plt.close()

    # ── Section 8: Behavioral Intent Signals ─────────────────────────────
    report.append("## 8. Digital Behavior Intent Signals\n")
    behavior_cols = ['avg_pages_viewed','avg_time_on_site','total_add_to_cart','total_checkout_started']
    purchased = (abt['total_orders'] > 0).astype(int)
    for col in behavior_cols:
        if col in abt.columns:
            series = abt[col].fillna(0)
            r, p = pointbiserialr(purchased, series)
            report.append(f"- **{col}**: r={r:.4f}, p={p:.4f} {sig_stars(p)} → "
                          f"{'Significant intent signal' if p < 0.05 else 'Not significant'}\n")
    report.append("\n")

    # Intent signal bar chart
    signals = {}
    for col in behavior_cols:
        if col in abt.columns:
            r, p = pointbiserialr(purchased, abt[col].fillna(0))
            signals[col] = abs(r)

    fig, ax = plt.subplots(figsize=(9, 5))
    sig_df = pd.DataFrame(list(signals.items()), columns=['Signal','|r|']).sort_values('|r|', ascending=True)
    ax.barh(sig_df['Signal'], sig_df['|r|'], color=PALETTE[:len(sig_df)])
    ax.set_title('Digital Intent Signals: Point-Biserial |r| with Purchase', fontsize=11)
    ax.set_xlabel('|Point-Biserial r|')
    for i, (_, row) in enumerate(sig_df.iterrows()):
        ax.text(row['|r|'] + 0.001, i, f"{row['|r|']:.3f}", va='center', fontsize=9, color='#e2e8f0')
    plt.tight_layout()
    plt.savefig('outputs/png/intent_signals.png', bbox_inches='tight')
    plt.close()

    # ── Section 9: RFM Analysis ───────────────────────────────────────────
    rfm_report = ["# RFM Analysis\n\n"]
    if 'recency_days' in abt.columns:
        abt_rfm = abt.copy()
        abt_rfm['R_Score'] = pd.qcut(abt_rfm['recency_days'].rank(method='first'), 5, labels=[5,4,3,2,1])
        abt_rfm['F_Score'] = pd.qcut(abt_rfm['total_orders'].rank(method='first'), 5, labels=[1,2,3,4,5])
        abt_rfm['M_Score'] = pd.qcut(abt_rfm['total_revenue'].rank(method='first'), 5, labels=[1,2,3,4,5])

        def rfm_tier(row):
            if any(pd.isna([row['R_Score'], row['F_Score'], row['M_Score']])): return 'No Orders'
            r, f, m = int(row['R_Score']), int(row['F_Score']), int(row['M_Score'])
            if r >= 4 and f >= 4 and m >= 4: return 'Champions'
            elif r <= 2 and f >= 4:           return 'At Risk'
            elif r <= 2 and f <= 2:           return 'Lost Causes'
            elif r >= 4 and f <= 2:           return 'New Customers'
            else:                             return 'Average'

        abt_rfm['RFM_Tier'] = abt_rfm.apply(rfm_tier, axis=1)
        rfm_summary = abt_rfm.groupby('RFM_Tier').agg(
            count=('customer_id','count'),
            avg_revenue=('total_revenue','mean'),
            total_revenue=('total_revenue','sum')
        ).reset_index().sort_values('avg_revenue', ascending=False)
        rfm_report.append(rfm_summary.to_markdown(index=False) + "\n\n")

        # RFM donut chart - Fix: Use legend to avoid text overlap
        fig, ax = plt.subplots(figsize=(10, 7))
        wedges, texts, autotexts = ax.pie(
            rfm_summary['count'],
            autopct='%1.1f%%', startangle=140,
            colors=PALETTE[:len(rfm_summary)], pctdistance=0.85,
            wedgeprops=dict(width=0.4, edgecolor='#0f172a', linewidth=2))
        
        ax.legend(wedges, rfm_summary['RFM_Tier'],
                  title="RFM Tiers",
                  loc="center left",
                  bbox_to_anchor=(1, 0, 0.5, 1),
                  frameon=False, fontsize=9)
        
        for at in autotexts: at.set_color('#e2e8f0'); at.set_fontsize(8); at.set_weight('bold')
        ax.set_title('RFM Customer Tier Distribution', fontsize=14, pad=20)
        plt.tight_layout()
        plt.savefig('outputs/png/rfm_donut.png', bbox_inches='tight')
        plt.close()

        # ── Above & Beyond: Marketing Attribution Comparison ──────────────────
        attr_report = ["# Marketing Attribution Comparison\n",
                       "Comparing Last-Touch (reported) vs First-Touch (inferred).\n\n"]
        # Inferred First-Touch from earliest session
        first_sess = sessions.sort_values(['customer_id', 'session_date']).drop_duplicates('customer_id', keep='first')
        first_touch = first_sess[['customer_id', 'channel_group']].rename(columns={'channel_group':'first_touch_channel'})
        
        attr_df = transactions.merge(first_touch, on='customer_id', how='left')
        last_touch_rev = transactions.groupby('marketing_channel_last_touch')['revenue_usd'].sum()
        first_touch_rev = attr_df.groupby('first_touch_channel')['revenue_usd'].sum()
        
        comp_df = pd.DataFrame({'Last-Touch': last_touch_rev, 'First-Touch': first_touch_rev}).fillna(0)
        attr_report.append(comp_df.to_markdown() + "\n\n")
        
        # ── Above & Beyond: Landing Page Deep-Dive ────────────────────────────
        # Merge sessions with leads to get landing_page info
        sess_lp = sessions.merge(leads[['customer_id','landing_page']], on='customer_id', how='left')
        sess_lp['bounce'] = sess_lp['bounce'].astype(str).str.lower().isin(['true','1','1.0','yes']).astype(int)
        sess_lp['pages_viewed'] = pd.to_numeric(sess_lp['pages_viewed'], errors='coerce')
        
        lp_perf = sess_lp.groupby('landing_page').agg(
            sessions=('session_id','count'),
            bounce_rate=('bounce','mean'),
            avg_pages=('pages_viewed','mean')
        ).reset_index().sort_values('sessions', ascending=False).head(10)
        attr_report.append("## Top 10 Landing Page Performance\n")
        attr_report.append(lp_perf.to_markdown(index=False) + "\n\n")
        
        with open('outputs/md/rfm_analysis.md', 'w') as f:
            f.write("\n".join(rfm_report + attr_report))

        # Merge RFM tier back to ABT
        abt = abt.merge(abt_rfm[['customer_id','RFM_Tier']], on='customer_id', how='left')
        abt.to_csv('outputs/csv/analytical_base_table.csv', index=False)

    # ── Section 10: Cohort Retention ──────────────────────────────────────
    transactions['order_date'] = pd.to_datetime(transactions['order_date'], format='mixed', errors='coerce')
    customers['signup_date']   = pd.to_datetime(customers['signup_date'],   format='mixed', errors='coerce')
    if not transactions['order_date'].isna().all():
        cohort_df = transactions.merge(customers[['customer_id','signup_date']], on='customer_id')
        cohort_df['cohort_month'] = cohort_df['signup_date'].dt.to_period('M')
        cohort_df['order_month']  = cohort_df['order_date'].dt.to_period('M')
        cohort_df['period_number'] = (cohort_df['order_month'].astype(int) -
                                       cohort_df['cohort_month'].astype(int))
        cohort_counts = cohort_df[cohort_df['period_number'] >= 0].groupby(
            ['cohort_month','period_number'])['customer_id'].nunique().reset_index()
        cohort_pivot  = cohort_counts.pivot(index='cohort_month', columns='period_number', values='customer_id')
        cohort_pct    = cohort_pivot.div(cohort_pivot[0], axis=0)

        fig, ax = plt.subplots(figsize=(12, max(4, len(cohort_pct)*0.5 + 2)))
        mask = cohort_pct.isnull()
        sns.heatmap(cohort_pct.iloc[:, :12], annot=True, fmt='.0%', cmap='Blues',
                    ax=ax, mask=mask.iloc[:, :12], cbar_kws={'label':'Retention %'},
                    linewidths=0.3, linecolor='#0f172a')
        ax.set_title('Cohort Retention Matrix (% of Cohort Retained)', fontsize=12)
        ax.set_xlabel('Months Since Acquisition'); ax.set_ylabel('Acquisition Cohort')
        plt.tight_layout()
        plt.savefig('outputs/png/cohort_retention.png', bbox_inches='tight')
        plt.close()

    with open('outputs/md/descriptive_report.md', 'w') as f:
        f.write("\n".join(report))

def main():
    print("Running Phase 2: Descriptive & Statistical Diagnosis (Enhanced)")
    run_descriptive_stats()
    print("Phase 2 complete.")

if __name__ == "__main__":
    main()
