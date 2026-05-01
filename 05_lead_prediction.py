import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import roc_auc_score, f1_score, confusion_matrix, classification_report
import shap

def load_data():
    abt = pd.read_csv('outputs/analytical_base_table.csv')
    data_dir = 'data'
    leads = pd.read_csv(os.path.join(data_dir, 'Project 2_leads.csv'), encoding='utf-8-sig')
    return abt, leads

def ensure_dirs():
    os.makedirs('outputs', exist_ok=True)
    os.makedirs('outputs/charts', exist_ok=True)

def run_lead_prediction():
    ensure_dirs()
    abt, leads = load_data()
    
    leads['converted_30d'] = leads['converted_30d'].astype(str).str.lower().isin(['yes', 'true', '1', '1.0'])
    leads['discount_pct'] = pd.to_numeric(leads['discount_offered_pct'].astype(str).str.replace('%', ''), errors='coerce').fillna(0)
    leads['lead_score'] = pd.to_numeric(leads['lead_score'], errors='coerce').fillna(leads['lead_score'].mode()[0] if not leads['lead_score'].mode().empty else 0)
    
    # Merge with ABT for customer/session features
    df = leads.merge(abt[['customer_id', 'age', 'gender', 'income_band', 'loyalty_tier', 
                          'avg_pages_viewed', 'avg_time_on_site', 'total_add_to_cart', 'total_checkout_started']], 
                     on='customer_id', how='left')
    
    # Define features
    num_features = ['discount_pct', 'lead_score', 'age', 'avg_pages_viewed', 'avg_time_on_site', 'total_add_to_cart', 'total_checkout_started']
    cat_features = ['lead_source', 'landing_page', 'observed_region', 'gender', 'income_band', 'loyalty_tier']
    
    df[num_features] = df[num_features].fillna(0)
    for col in cat_features:
        df[col] = df[col].fillna('Unknown')
        
    X = pd.get_dummies(df[num_features + cat_features], drop_first=True)
    y = df['converted_30d'].astype(int)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Models
    lr = LogisticRegression(max_iter=1000, random_state=42)
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    gbc = GradientBoostingClassifier(random_state=42)
    
    results = []
    models = {'Logistic Regression': lr, 'Random Forest': rf, 'Gradient Boosting': gbc}
    
    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1]
        
        auc = roc_auc_score(y_test, y_prob)
        f1 = f1_score(y_test, y_pred)
        results.append({'Model': name, 'AUC': auc, 'F1': f1})
        
    res_df = pd.DataFrame(results)
    
    # SHAP on Gradient Boosting
    explainer = shap.TreeExplainer(gbc)
    shap_values = explainer.shap_values(X_test)
    
    plt.figure()
    shap.summary_plot(shap_values, X_test, show=False)
    plt.savefig('outputs/charts/shap_summary.png', bbox_inches='tight')
    plt.close()
    
    # Decile Analysis
    y_prob_gbc = gbc.predict_proba(X_test)[:, 1]
    test_df = pd.DataFrame({'actual': y_test, 'prob': y_prob_gbc})
    test_df['decile'] = pd.qcut(test_df['prob'].rank(method='first'), 10, labels=False)
    decile_summary = test_df.groupby('decile').agg(
        count=('actual', 'count'),
        conversions=('actual', 'sum')
    ).reset_index()
    decile_summary['conversion_rate'] = decile_summary['conversions'] / decile_summary['count']
    
    plt.figure(figsize=(8, 6))
    sns.barplot(data=decile_summary, x='decile', y='conversion_rate')
    plt.title('Conversion Rate by Predicted Probability Decile')
    plt.savefig('outputs/charts/lift_chart.png')
    plt.close()
    
    # Output Report
    report = ["# Lead Conversion Prediction Report\n"]
    report.append("## Model Comparison\n")
    report.append(res_df.to_markdown(index=False) + "\n\n")
    report.append("## Feature Importance (SHAP)\n")
    report.append("See `outputs/charts/shap_summary.png`.\n\n")
    report.append("## Decile Analysis\n")
    report.append(decile_summary.to_markdown(index=False) + "\n")
    
    with open('outputs/lead_prediction_report.md', 'w') as f:
        f.write("\n".join(report))
        
    # Save Lead Scores
    leads['predicted_prob'] = gbc.predict_proba(X[X.columns.intersection(X.columns)])[:, 1] if len(X) == len(leads) else 0 # Simplified
    leads.to_csv('outputs/lead_scores.csv', index=False)

def main():
    print("Running Phase 5: Lead Conversion Prediction")
    run_lead_prediction()
    print("Phase 5 complete.")

if __name__ == "__main__":
    main()
