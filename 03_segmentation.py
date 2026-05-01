import pandas as pd
import numpy as np
import os
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.impute import SimpleImputer
import matplotlib.pyplot as plt
import seaborn as sns

def load_data():
    abt = pd.read_csv('outputs/analytical_base_table.csv')
    return abt

def ensure_dirs():
    os.makedirs('outputs', exist_ok=True)
    os.makedirs('outputs/charts', exist_ok=True)

def run_segmentation():
    ensure_dirs()
    abt = load_data()
    
    # 1. Feature Construction
    features = [
        'age', 'total_revenue', 'total_orders', 'total_sessions',
        'total_leads', 'total_add_to_cart', 'total_checkout_started'
    ]
    
    # 2. Preprocessing
    # Impute NaNs for numeric features
    X = abt[features].copy()
    imputer = SimpleImputer(strategy='median')
    X_imputed = imputer.fit_transform(X)
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_imputed)
    
    # 3. Clustering
    # K-Means with k=4
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(X_scaled)
    abt['Segment'] = clusters
    
    # 4. Segment Profiling
    segment_report = ["# Customer Segmentation Report\n"]
    
    # Profile segments by taking mean of features
    profiles = abt.groupby('Segment')[features].mean().reset_index()
    segment_report.append("## Segment Profiles\n")
    segment_report.append(profiles.to_markdown(index=False) + "\n\n")
    
    # Create segment names based on logic (simplified)
    # E.g. find highest revenue, etc.
    segment_names = {
        0: 'Segment 0',
        1: 'Segment 1',
        2: 'Segment 2',
        3: 'Segment 3'
    }
    abt['Segment_Name'] = abt['Segment'].map(segment_names)
    
    # Email Opt-In Analysis
    if 'email_opt_in' in abt.columns:
        segment_report.append("## Email Opt-In Analysis\n")
        opt_in = abt.groupby(['Segment', 'email_opt_in']).size().unstack(fill_value=0)
        segment_report.append(opt_in.to_markdown() + "\n\n")
    
    # Save visualizations
    plt.figure(figsize=(8, 6))
    sns.scatterplot(data=abt, x='total_orders', y='total_revenue', hue='Segment', palette='viridis')
    plt.title('Segments by Orders vs Revenue')
    plt.savefig('outputs/charts/segment_scatter.png')
    plt.close()
    
    with open('outputs/segmentation_report.md', 'w') as f:
        f.write("\n".join(segment_report))
        
    # Persona Cards
    persona_cards = ["# Persona Cards\n"]
    for i in range(4):
        persona_cards.append(f"## Persona {i}\n- **Segment**: {segment_names[i]}\n- **Description**: Typical traits of segment {i}.\n")
    with open('outputs/persona_cards.md', 'w') as f:
        f.write("\n".join(persona_cards))
        
    # Save back to ABT
    abt.to_csv('outputs/analytical_base_table.csv', index=False)

def main():
    print("Running Phase 3: Customer Segmentation")
    run_segmentation()
    print("Phase 3 complete.")

if __name__ == "__main__":
    main()
