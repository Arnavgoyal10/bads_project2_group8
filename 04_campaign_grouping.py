import pandas as pd
import numpy as np
import os
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import seaborn as sns

def load_data():
    data_dir = 'data'
    campaigns = pd.read_csv(os.path.join(data_dir, 'Project 2_campaigns.csv'), encoding='utf-8-sig')
    leads = pd.read_csv(os.path.join(data_dir, 'Project 2_leads.csv'), encoding='utf-8-sig')
    transactions = pd.read_csv(os.path.join(data_dir, 'Project 2_transactions.csv'), encoding='utf-8-sig')
    return campaigns, leads, transactions

def ensure_dirs():
    os.makedirs('outputs', exist_ok=True)
    os.makedirs('outputs/charts', exist_ok=True)

def run_campaign_grouping():
    ensure_dirs()
    campaigns, leads, transactions = load_data()
    
    # Pre-clean campaigns and leads
    campaigns['spend_usd'] = campaigns['spend_usd'].replace('[\$,]', '', regex=True).replace('USD', '', regex=True).astype(float)
    leads['converted_30d'] = leads['converted_30d'].astype(str).str.lower().isin(['yes', 'true', '1', '1.0'])
    
    # Transactions to get revenue
    transactions['revenue_usd'] = transactions['revenue_usd'].replace('[\$,]', '', regex=True).replace('USD', '', regex=True).astype(float)
    
    # Match leads to customers, then transactions
    leads_cust = leads[leads['customer_id'].notna()]
    cust_rev = transactions.groupby('customer_id')['revenue_usd'].sum().reset_index()
    leads_rev = leads_cust.merge(cust_rev, on='customer_id', how='left')
    leads_rev['revenue_usd'] = leads_rev['revenue_usd'].fillna(0)
    
    # 1. Feature construction per campaign
    camp_agg = leads_rev.groupby('campaign_id').agg(
        total_leads=('lead_id', 'count'),
        converted_leads=('converted_30d', 'sum'),
        total_revenue=('revenue_usd', 'sum')
    ).reset_index()
    
    camp_features = campaigns.merge(camp_agg, on='campaign_id', how='left').fillna(0)
    camp_features['LCR'] = np.where(camp_features['total_leads']>0, camp_features['converted_leads'] / camp_features['total_leads'], 0)
    camp_features['CPA'] = np.where(camp_features['converted_leads']>0, camp_features['spend_usd'] / camp_features['converted_leads'], 0)
    camp_features['ROAS'] = np.where(camp_features['spend_usd']>0, camp_features['total_revenue'] / camp_features['spend_usd'], 0)
    
    # 2. Clustering campaigns
    features = ['spend_usd', 'total_leads', 'LCR', 'ROAS']
    X = camp_features[features].copy()
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    camp_features['Group'] = kmeans.fit_predict(X_scaled)
    
    # 3. Group Labeling
    group_profiles = camp_features.groupby('Group')[features].mean().reset_index()
    
    report = ["# Campaign & Channel Grouping Report\n"]
    report.append("## Campaign Group Profiles\n")
    report.append(group_profiles.to_markdown(index=False) + "\n\n")
    
    # 4. Efficiency Frontier Plot
    plt.figure(figsize=(10, 6))
    sns.scatterplot(data=camp_features, x='spend_usd', y='ROAS', size='total_leads', hue='Group', sizes=(50, 500), alpha=0.7)
    plt.title('Campaign Efficiency Frontier (Spend vs ROAS)')
    plt.xlabel('Total Spend (USD)')
    plt.ylabel('ROAS')
    plt.savefig('outputs/efficiency_frontier.png')
    plt.close()
    
    # Creative Type x Objective Matrix
    matrix = camp_features.pivot_table(values='LCR', index='creative_type', columns='objective', aggfunc='mean')
    plt.figure(figsize=(8, 6))
    sns.heatmap(matrix, annot=True, fmt=".2f", cmap='Blues')
    plt.title('Creative Type x Objective Matrix (Mean LCR)')
    plt.savefig('outputs/charts/creative_objective_matrix.png')
    plt.close()
    
    with open('outputs/campaign_grouping_report.md', 'w') as f:
        f.write("\n".join(report))

def main():
    print("Running Phase 4: Campaign Grouping")
    run_campaign_grouping()
    print("Phase 4 complete.")

if __name__ == "__main__":
    main()
