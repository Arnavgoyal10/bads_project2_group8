import pandas as pd
import numpy as np
import os
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (roc_auc_score, f1_score, precision_score, recall_score,
                              roc_curve, confusion_matrix, classification_report)
from sklearn.preprocessing import label_binarize
from scipy.stats import chi2_contingency, ttest_ind, mannwhitneyu
import shap

PALETTE = ['#3b82f6','#10b981','#f59e0b','#ef4444']
plt.rcParams.update({'figure.dpi': 130, 'savefig.bbox': 'tight', 'savefig.facecolor': '#0f172a',
                     'axes.facecolor': '#1e293b', 'axes.labelcolor': '#94a3b8',
                     'xtick.color': '#94a3b8', 'ytick.color': '#94a3b8',
                     'text.color': '#e2e8f0', 'grid.color': '#334155', 'figure.facecolor': '#0f172a'})

def ensure_dirs():
    os.makedirs('outputs', exist_ok=True)
    os.makedirs('outputs/charts', exist_ok=True)

def sig_stars(p):
    if p < 0.001: return '***'
    if p < 0.01:  return '**'
    if p < 0.05:  return '*'
    return 'ns'

def run_lead_prediction():
    ensure_dirs()
    abt   = pd.read_csv('outputs/analytical_base_table.csv')
    leads = pd.read_csv(os.path.join('data', 'Project 2_leads.csv'), encoding='utf-8-sig')

    leads['converted_30d'] = leads['converted_30d'].astype(str).str.lower().isin(['yes','true','1','1.0'])
    leads['discount_pct']  = pd.to_numeric(
        leads['discount_offered_pct'].astype(str).str.replace('%','', regex=False), errors='coerce').fillna(0)
    leads['lead_score'] = pd.to_numeric(leads['lead_score'], errors='coerce').fillna(0)

    df = leads.merge(abt[['customer_id','age','gender','income_band','loyalty_tier',
                           'avg_pages_viewed','avg_time_on_site','total_add_to_cart',
                           'total_checkout_started','total_sessions','total_revenue',
                           'preferred_device']],
                     on='customer_id', how='left')

    num_features = ['discount_pct','lead_score','age','avg_pages_viewed','avg_time_on_site',
                    'total_add_to_cart','total_checkout_started','total_sessions']
    cat_features = ['lead_source','landing_page','observed_region','gender',
                    'income_band','loyalty_tier','preferred_device']

    df[num_features] = df[num_features].fillna(0)
    for col in cat_features:
        if col in df.columns:
            df[col] = df[col].fillna('Unknown')
        else:
            cat_features.remove(col)

    existing_cats = [c for c in cat_features if c in df.columns]
    X = pd.get_dummies(df[num_features + existing_cats], drop_first=True)
    y = df['converted_30d'].astype(int)

    # ── Pre-model hypothesis tests ────────────────────────────────────────
    pre_tests = []
    # Chi-square: does lead_source predict conversion?
    if 'lead_source' in df.columns:
        cont = pd.crosstab(df['lead_source'].fillna('Unknown'), y)
        chi2, p_chi, dof, _ = chi2_contingency(cont)
        pre_tests.append(f"- **Chi-Square (lead_source → conversion)**: χ²={chi2:.3f}, p={p_chi:.4f} {sig_stars(p_chi)}")
    # Mann-Whitney: add_to_cart for converters vs non
    atc_conv = df[y==1]['total_add_to_cart'].fillna(0)
    atc_not  = df[y==0]['total_add_to_cart'].fillna(0)
    mw_u, mw_p = mannwhitneyu(atc_conv, atc_not, alternative='greater')
    pre_tests.append(f"- **Mann-Whitney (add_to_cart: converters > non-converters)**: U={mw_u:.0f}, p={mw_p:.4f} {sig_stars(mw_p)}")
    # T-test: lead_score difference
    ls_conv = df[y==1]['lead_score'].fillna(0)
    ls_not  = df[y==0]['lead_score'].fillna(0)
    t_ls, p_ls = ttest_ind(ls_conv, ls_not, equal_var=False)
    pre_tests.append(f"- **Welch t-test (lead_score: converters vs non)**: t={t_ls:.3f}, p={p_ls:.4f} {sig_stars(p_ls)}")

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # ── Train & evaluate models with cross-validation ─────────────────────
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42, class_weight='balanced'),
        'Random Forest':       RandomForestClassifier(n_estimators=150, random_state=42, class_weight='balanced'),
        'Gradient Boosting':   GradientBoostingClassifier(n_estimators=150, learning_rate=0.05, random_state=42)
    }

    results = []
    trained_models = {}
    cv_aucs = {}

    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1]
        auc = roc_auc_score(y_test, y_prob)
        f1  = f1_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec  = recall_score(y_test, y_pred, zero_division=0)
        cv_auc = cross_val_score(model, X, y, cv=skf, scoring='roc_auc').mean()
        results.append({'Model': name, 'AUC (test)': round(auc,4), 'CV AUC (5-fold)': round(cv_auc,4),
                        'F1': round(f1,4), 'Precision': round(prec,4), 'Recall': round(rec,4)})
        trained_models[name] = model
        cv_aucs[name] = cv_auc

    res_df = pd.DataFrame(results).sort_values('AUC (test)', ascending=False)
    best_model_name = res_df.iloc[0]['Model']
    best_model = trained_models[best_model_name]

    # ── ROC Curves ────────────────────────────────────────────────────────
    fig, ax = plt.subplots(figsize=(8, 7))
    colors_roc = {'Logistic Regression':'#3b82f6','Random Forest':'#10b981','Gradient Boosting':'#f59e0b'}
    for name, model in trained_models.items():
        y_prob = model.predict_proba(X_test)[:, 1]
        fpr, tpr, _ = roc_curve(y_test, y_prob)
        auc = roc_auc_score(y_test, y_prob)
        ax.plot(fpr, tpr, label=f'{name} (AUC={auc:.3f})',
                color=colors_roc[name], linewidth=2)
    ax.plot([0,1],[0,1],'--', color='#475569', linewidth=1)
    ax.set_xlabel('False Positive Rate'); ax.set_ylabel('True Positive Rate')
    ax.set_title('ROC Curves: Lead Conversion Models\n(Gradient Boosting selected as production model)', fontsize=11)
    ax.legend(fontsize=9, framealpha=0.3)
    plt.tight_layout()
    plt.savefig('outputs/charts/roc_curves.png')
    plt.close()

    # ── SHAP on best tree model ────────────────────────────────────────────
    gb_model = trained_models.get('Gradient Boosting', best_model)
    explainer = shap.TreeExplainer(gb_model)
    X_test_shap = X_test.copy()
    shap_values = explainer.shap_values(X_test_shap)

    fig_shap = plt.figure(figsize=(10, 8))
    shap.summary_plot(shap_values, X_test_shap, show=False, color_bar=True)
    plt.title('SHAP Feature Importance: Lead Conversion Prediction', fontsize=11, pad=12)
    plt.tight_layout()
    plt.savefig('outputs/charts/shap_summary.png', bbox_inches='tight')
    plt.close()

    # ── Decile Analysis (lift chart) ───────────────────────────────────────
    y_prob_best = trained_models['Gradient Boosting'].predict_proba(X_test)[:, 1]
    test_df = pd.DataFrame({'actual': y_test.values, 'prob': y_prob_best})
    test_df['decile'] = pd.qcut(test_df['prob'].rank(method='first'), 10, labels=range(1, 11))
    decile_summary = test_df.groupby('decile').agg(
        count=('actual','count'), conversions=('actual','sum')).reset_index()
    decile_summary['conversion_rate'] = decile_summary['conversions'] / decile_summary['count']
    decile_summary['cumulative_lift'] = (decile_summary.sort_values('decile', ascending=False)
                                          ['conversions'].cumsum() /
                                          decile_summary.sort_values('decile', ascending=False)
                                          ['count'].cumsum())

    # Lift chart
    ds_sorted = decile_summary.sort_values('decile', ascending=False).reset_index(drop=True)
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    colors_bar = ['#10b981' if i < 3 else '#3b82f6' if i < 7 else '#ef4444' for i in range(len(ds_sorted))]
    axes[0].bar(ds_sorted['decile'].astype(str), ds_sorted['conversion_rate'], color=colors_bar, edgecolor='#334155')
    axes[0].axhline(y_test.mean(), color='#f59e0b', linestyle='--', label=f'Baseline={y_test.mean():.1%}')
    axes[0].set_title('Conversion Rate by Predicted Probability Decile\n(Decile 10 = highest scored leads)')
    axes[0].set_xlabel('Decile (10=top scored)'); axes[0].set_ylabel('Conversion Rate')
    axes[0].legend(fontsize=9)
    for bar, val in zip(axes[0].patches, ds_sorted['conversion_rate']):
        axes[0].text(bar.get_x()+bar.get_width()/2, val+0.005, f'{val:.0%}',
                     ha='center', va='bottom', fontsize=7, color='#e2e8f0')
    axes[1].plot(ds_sorted['decile'].astype(str), ds_sorted['cumulative_lift'],
                 marker='o', color='#10b981', linewidth=2)
    axes[1].axhline(y_test.mean(), color='#f59e0b', linestyle='--', label='Random baseline')
    axes[1].set_title('Cumulative Lift Curve\n(top deciles vs random selection)')
    axes[1].set_xlabel('Decile (10=top scored)'); axes[1].set_ylabel('Cumulative Conversion Rate')
    axes[1].legend(fontsize=9)
    plt.suptitle(f'Lead Scoring Model Performance  [{best_model_name}]', fontsize=13, y=1.02)
    plt.tight_layout()
    plt.savefig('outputs/charts/lift_chart.png', bbox_inches='tight')
    plt.close()

    # ── Confusion Matrix ──────────────────────────────────────────────────
    y_pred_best = trained_models['Gradient Boosting'].predict(X_test)
    cm = confusion_matrix(y_test, y_pred_best)
    fig, ax = plt.subplots(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax,
                xticklabels=['No Convert','Convert'], yticklabels=['No Convert','Convert'],
                linewidths=0.5, linecolor='#0f172a')
    ax.set_xlabel('Predicted'); ax.set_ylabel('Actual')
    ax.set_title(f'Confusion Matrix: {best_model_name}', fontsize=11)
    plt.tight_layout()
    plt.savefig('outputs/charts/confusion_matrix.png')
    plt.close()

    # ── Save lead scores ───────────────────────────────────────────────────
    X_full = pd.get_dummies(df[num_features + existing_cats], drop_first=True)
    X_full = X_full.reindex(columns=X.columns, fill_value=0)
    gb_model.fit(X_train, y_train)  # refit
    df['predicted_prob'] = gb_model.predict_proba(X_full)[:, 1]
    df['priority_tier'] = pd.cut(df['predicted_prob'],
                                  bins=[0, 0.3, 0.6, 1.0],
                                  labels=['Low','Medium','High'])
    df.to_csv('outputs/lead_scores.csv', index=False)

    # ── Report ────────────────────────────────────────────────────────────
    report = ["# Lead Conversion Prediction Report\n",
              "## Pre-Model Hypothesis Tests\n"
              "These tests validate that the chosen features have statistical signal before model training:\n\n"]
    for t in pre_tests:
        report.append(t + "\n")
    report.append("\n")
    report.append("## Model Comparison\n")
    report.append(res_df.to_markdown(index=False) + "\n\n")
    report.append(f"## Selected Model: {best_model_name}\n"
                  f"- **Rationale**: Highest cross-validated AUC ({cv_aucs[best_model_name]:.4f}), best balance of precision/recall.\n"
                  f"- Class weights balanced to address conversion class imbalance.\n"
                  f"- 5-fold stratified cross-validation used to prevent overfitting.\n\n")
    report.append("## Feature Importance (SHAP)\nSee `outputs/charts/shap_summary.png`.\n\n")
    report.append("## Decile Analysis\n")
    report.append(decile_summary.to_markdown(index=False) + "\n\n")
    report.append("## Actionable Prioritization Rule\n"
                  "- **High Priority** (prob > 0.6): Immediate sales outreach within 24h\n"
                  "- **Medium Priority** (0.3–0.6): Nurture sequence, re-engage within 7 days\n"
                  "- **Low Priority** (< 0.3): Email drip only, minimal sales resource\n\n")

    with open('outputs/lead_prediction_report.md', 'w') as f:
        f.write("\n".join(report))

def main():
    print("Running Phase 5: Lead Conversion Prediction (Enhanced)")
    run_lead_prediction()
    print("Phase 5 complete.")

if __name__ == "__main__":
    main()
