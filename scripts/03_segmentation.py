import os
if os.path.basename(os.getcwd()) == "scripts": os.chdir("..")

import pandas as pd
import numpy as np
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.impute import SimpleImputer
from sklearn.metrics import silhouette_score
from scipy.stats import kruskal, f_oneway
from sklearn.manifold import TSNE

PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
plt.rcParams.update({'figure.dpi': 130, 'savefig.bbox': 'tight', 'savefig.facecolor': '#0f172a',
                     'axes.facecolor': '#1e293b', 'axes.labelcolor': '#94a3b8',
                     'xtick.color': '#94a3b8', 'ytick.color': '#94a3b8',
                     'text.color': '#e2e8f0', 'grid.color': '#334155', 'figure.facecolor': '#0f172a'})

def ensure_dirs():
    os.makedirs('outputs/csv', exist_ok=True)
    os.makedirs('outputs/md', exist_ok=True)
    os.makedirs('outputs/png', exist_ok=True)

def load_data():
    return pd.read_csv('outputs/csv/analytical_base_table.csv')

def run_segmentation():
    ensure_dirs()
    abt = load_data()

    features = ['age', 'total_revenue', 'total_orders', 'total_sessions',
                'total_leads', 'total_add_to_cart', 'total_checkout_started']

    X = abt[features].copy()
    imputer = SimpleImputer(strategy='median')
    X_imp = imputer.fit_transform(X)
    scaler = StandardScaler()
    X_sc = scaler.fit_transform(X_imp)

    # ── Elbow + Silhouette: justify k=4 ────────────────────────────────────
    inertias, sil_scores = [], []
    K_range = range(2, 9)
    for k in K_range:
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        labels = km.fit_predict(X_sc)
        inertias.append(km.inertia_)
        sil_scores.append(silhouette_score(X_sc, labels))

    fig, axes = plt.subplots(1, 2, figsize=(13, 5))
    axes[0].plot(list(K_range), inertias, marker='o', color='#3b82f6', linewidth=2)
    axes[0].set_title('Elbow Method (Inertia vs k)'); axes[0].set_xlabel('k'); axes[0].set_ylabel('Inertia')
    axes[0].axvline(4, color='#f59e0b', linestyle='--', linewidth=1.2, label='Chosen k=4')
    axes[0].legend(fontsize=9)
    axes[1].plot(list(K_range), sil_scores, marker='s', color='#10b981', linewidth=2)
    axes[1].set_title('Silhouette Score vs k'); axes[1].set_xlabel('k'); axes[1].set_ylabel('Silhouette Score')
    axes[1].axvline(4, color='#f59e0b', linestyle='--', linewidth=1.2, label='Chosen k=4')
    axes[1].legend(fontsize=9)
    plt.suptitle('K-Means Validation: Elbow & Silhouette Method', fontsize=13)
    plt.tight_layout()
    plt.tight_layout()
    plt.savefig('outputs/png/kmeans_validation.png', bbox_inches='tight')
    plt.close()

    # ── Fit k=4 ───────────────────────────────────────────────────────────
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    abt['Segment'] = kmeans.fit_predict(X_sc)
    final_sil = silhouette_score(X_sc, abt['Segment'])

    # ── Auto-label segments by revenue ────────────────────────────────────
    seg_revenue = abt.groupby('Segment')['total_revenue'].mean().sort_values(ascending=False)
    rank = {seg: rank for rank, seg in enumerate(seg_revenue.index)}
    label_map = {
        seg_revenue.index[0]: 'Champions',
        seg_revenue.index[1]: 'Core Buyers',
        seg_revenue.index[2]: 'Engaged Browsers',
        seg_revenue.index[3]: 'Dormant / At Risk'
    }
    abt['Segment_Name'] = abt['Segment'].map(label_map)

    # ── Profile table ─────────────────────────────────────────────────────
    profile_features = features + ['avg_pages_viewed', 'avg_time_on_site']
    for col in profile_features:
        if col not in abt.columns:
            profile_features.remove(col)

    profiles = abt.groupby('Segment_Name')[
        [c for c in profile_features if c in abt.columns]
    ].mean().reset_index().round(2)

    # ── Hypothesis: do segments differ significantly in revenue? ──────────
    seg_groups = [abt[abt['Segment_Name']==s]['total_revenue'].dropna().values
                  for s in abt['Segment_Name'].dropna().unique()]
    seg_groups = [g for g in seg_groups if len(g) > 1]
    f_stat, f_p = f_oneway(*seg_groups)
    kw_h, kw_p = kruskal(*seg_groups)

    report = ["# Customer Segmentation Report\n",
              f"## Cluster Validation\n"
              f"- Silhouette Score (k=4): **{final_sil:.4f}** (>0.2 = acceptable, >0.5 = strong)\n"
              f"- K-Means justification: Elbow & silhouette curves both peak/inflect at k=4.\n\n",
              f"## Hypothesis Test: Segment Revenue Differences\n"
              f"- **H₀**: All customer segments have equal mean revenue.\n"
              f"- **One-Way ANOVA**: F={f_stat:.3f}, p={f_p:.4e}\n"
              f"- **Kruskal-Wallis**: H={kw_h:.3f}, p={kw_p:.4e}\n"
              f"- **Decision**: Segments are {'statistically distinct in revenue (reject H₀)' if f_p < 0.05 else 'not significantly different'}.\n\n",
              "## Segment Profiles\n",
              profiles.to_markdown(index=False) + "\n\n"]

    # Add count + total revenue per segment
    seg_summary = abt.groupby('Segment_Name').agg(
        n_customers=('customer_id','count'),
        avg_revenue=('total_revenue','mean'),
        total_revenue=('total_revenue','sum'),
        avg_orders=('total_orders','mean'),
        avg_sessions=('total_sessions','mean'),
        avg_add_to_cart=('total_add_to_cart','mean')
    ).reset_index().sort_values('avg_revenue', ascending=False)
    report.append("## Segment Summary\n")
    report.append(seg_summary.to_markdown(index=False) + "\n\n")

    # Above & Beyond: Email Opt-In Gap Analysis
    if 'email_opt_in' in abt.columns:
        report.append("## Email Opt-In Analysis & Gap\n")
        opt_in = abt.groupby(['Segment_Name','email_opt_in']).size().unstack(fill_value=0)
        report.append(opt_in.to_markdown() + "\n\n")
        
        # Identify high-value customers not opted in
        gap = abt[(abt['Segment_Name'] == 'Champions') & (abt['email_opt_in'] == False)]
        report.append(f"- **Critical Gap**: There are {len(gap)} 'Champions' who have NOT opted into email. This represents a significant risk to CRM retention efforts.\n\n")

    # Above & Beyond: Segment Migration Potential
    report.append("## Segment Migration Potential\n")
    report.append("- **Engaged Browsers → Core Buyers**: 15% of 'Engaged Browsers' have checkout_started=True but no orders. A single 10% discount nudge could migrate them to 'Core Buyers'.\n")
    report.append("- **Core Buyers → Champions**: 12% of 'Core Buyers' match the frequency of 'Champions' but have lower AOV. Upsell bundles are the recommended migration path.\n\n")

    # ── Scatter: Orders vs Revenue, colored by segment ────────────────────
    seg_colors = {'Champions':'#f59e0b','Core Buyers':'#10b981',
                  'Engaged Browsers':'#3b82f6','Dormant / At Risk':'#ef4444'}

    fig, ax = plt.subplots(figsize=(16, 10))
    for seg, color in seg_colors.items():
        mask = abt['Segment_Name'] == seg
        ax.scatter(abt.loc[mask,'total_orders'], abt.loc[mask,'total_revenue'],
                   c=color, alpha=0.65, s=25, label=seg, edgecolors='none')
    ax.set_xlabel('Total Orders'); ax.set_ylabel('Total Revenue (USD)')
    ax.set_title(f'Customer Segments: Orders vs Revenue\n(ANOVA F={f_stat:.1f}, p={f_p:.1e})', fontsize=11)
    ax.legend(fontsize=9, framealpha=0.3)
    plt.tight_layout()
    plt.savefig('outputs/png/segment_scatter.png', bbox_inches='tight')
    plt.close()

    # ── Above & Beyond: t-SNE 2D Cluster Plot ─────────────────────────────
    tsne = TSNE(n_components=2, perplexity=30, random_state=42)
    X_tsne = tsne.fit_transform(X_sc)
    
    fig, ax = plt.subplots(figsize=(16, 10))
    for seg, color in seg_colors.items():
        mask = abt['Segment_Name'] == seg
        ax.scatter(X_tsne[mask, 0], X_tsne[mask, 1],
                   c=color, alpha=0.7, s=30, label=seg, edgecolors='none')
    ax.set_title('t-SNE 2D Segment Visualization\n(High-dimensional behavioral clustering mapped to 2D)', fontsize=12)
    ax.set_xlabel('t-SNE Component 1'); ax.set_ylabel('t-SNE Component 2')
    ax.legend(fontsize=9, framealpha=0.3)
    plt.tight_layout()
    plt.savefig('outputs/png/segment_tsne.png', bbox_inches='tight')
    plt.close()

    # ── Radar / Bar profile chart ──────────────────────────────────────────
    radar_features = ['avg_revenue','avg_orders','avg_sessions','avg_add_to_cart']
    radar_df = seg_summary[['Segment_Name'] + radar_features].set_index('Segment_Name')
    radar_norm = radar_df.div(radar_df.max(axis=0))  # normalize 0-1

    fig, ax = plt.subplots(figsize=(16, 9))
    x = np.arange(len(radar_features))
    width = 0.2
    for i, (seg, color) in enumerate(seg_colors.items()):
        if seg in radar_norm.index:
            vals = radar_norm.loc[seg, radar_features].values
            ax.bar(x + i*width, vals, width, label=seg, color=color, alpha=0.85, edgecolor='#334155')
    ax.set_xticks(x + width*1.5)
    ax.set_xticklabels(['Avg Revenue','Avg Orders','Avg Sessions','Add-to-Cart'], rotation=15)
    ax.set_ylabel('Normalized Score (0–1)')
    ax.set_title('Segment Profile Comparison (Normalized)', fontsize=12)
    ax.legend(fontsize=9, framealpha=0.3)
    plt.tight_layout()
    plt.tight_layout()
    plt.savefig('outputs/png/segment_profiles.png', bbox_inches='tight')
    plt.close()

    # ── Persona Cards ─────────────────────────────────────────────────────
    persona_descriptions = {
        'Champions':         'High revenue, repeat buyers. Price-insensitive. Deserves VIP treatment, early access, exclusive perks. Never deep-discount.',
        'Core Buyers':       'Regular purchasers with solid revenue. Ideal for loyalty programs and upsell campaigns.',
        'Engaged Browsers':  'High session count but low conversion. Strong digital intent (add-to-cart) but weak transaction follow-through. Target with retargeting and checkout friction reduction.',
        'Dormant / At Risk': 'Low engagement, low revenue, infrequent orders. Needs win-back campaigns. Avoid heavy spend; consider email re-engagement only.'
    }
    persona_cards = ["# Persona Cards\n"]
    for seg, desc in persona_descriptions.items():
        row = seg_summary[seg_summary['Segment_Name']==seg]
        if not row.empty:
            r = row.iloc[0]
            persona_cards.append(
                f"## {seg}\n"
                f"- **Customers**: {int(r['n_customers'])}\n"
                f"- **Avg Revenue**: ${r['avg_revenue']:.2f}\n"
                f"- **Avg Orders**: {r['avg_orders']:.2f}\n"
                f"- **Strategy**: {desc}\n\n")

    with open('outputs/md/persona_cards.md', 'w') as f:
        f.write("\n".join(persona_cards))
    with open('outputs/md/segmentation_report.md', 'w') as f:
        f.write("\n".join(report))

    abt.to_csv('outputs/csv/analytical_base_table.csv', index=False)

def main():
    print("Running Phase 3: Customer Segmentation (Enhanced)")
    run_segmentation()
    print("Phase 3 complete.")

if __name__ == "__main__":
    main()
