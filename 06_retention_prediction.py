import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import roc_auc_score, f1_score

def load_data():
    abt = pd.read_csv('outputs/analytical_base_table.csv')
    data_dir = 'data'
    transactions = pd.read_csv(os.path.join(data_dir, 'Project 2_transactions.csv'), encoding='utf-8-sig')
    return abt, transactions

def ensure_dirs():
    os.makedirs('outputs', exist_ok=True)
    os.makedirs('outputs/charts', exist_ok=True)

def run_retention_prediction():
    ensure_dirs()
    abt, transactions = load_data()
    
    # Pre-clean transactions dates
    transactions['order_date'] = pd.to_datetime(transactions['order_date'], errors='coerce')
    
    # 1. Target Construction
    # Order by date
    tx_sorted = transactions.sort_values(['customer_id', 'order_date'])
    # First order
    first_orders = tx_sorted.drop_duplicates('customer_id', keep='first').copy()
    first_orders.rename(columns={'order_date': 'first_order_date'}, inplace=True)
    
    # Second order
    second_orders = tx_sorted[tx_sorted.duplicated('customer_id', keep='first')].drop_duplicates('customer_id', keep='first').copy()
    second_orders.rename(columns={'order_date': 'second_order_date'}, inplace=True)
    
    # Merge back to get target
    target_df = first_orders[['customer_id', 'first_order_date', 'product_category', 'payment_type']].merge(
        second_orders[['customer_id', 'second_order_date']], on='customer_id', how='left'
    )
    target_df['days_to_second'] = (target_df['second_order_date'] - target_df['first_order_date']).dt.days
    target_df['repeat_90d'] = ((target_df['days_to_second'] <= 90) & (target_df['days_to_second'] >= 0)).astype(int)
    
    # Merge with ABT
    df = abt.merge(target_df, on='customer_id', how='inner')
    
    # 2. Features
    num_features = ['age', 'total_acquisition_cost', 'total_revenue']
    cat_features = ['gender', 'income_band', 'loyalty_tier', 'region', 'product_category', 'payment_type']
    
    df[num_features] = df[num_features].fillna(0)
    for col in cat_features:
        df[col] = df[col].fillna('Unknown')
        
    X = pd.get_dummies(df[num_features + cat_features], drop_first=True)
    y = df['repeat_90d']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 3. Models
    lr = LogisticRegression(max_iter=1000, random_state=42)
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    gbc = GradientBoostingClassifier(random_state=42)
    
    results = []
    models = {'Logistic Regression': lr, 'Random Forest': rf, 'Gradient Boosting': gbc}
    
    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else model.predict(X_test)
        
        auc = roc_auc_score(y_test, y_prob)
        f1 = f1_score(y_test, y_pred)
        results.append({'Model': name, 'AUC': auc, 'F1': f1})
        
    res_df = pd.DataFrame(results)
    
    # Feature Importance (Random Forest)
    importances = rf.feature_importances_
    fi_df = pd.DataFrame({'Feature': X.columns, 'Importance': importances}).sort_values('Importance', ascending=False).head(10)
    
    # 4. CLV Projection (Simplified)
    # Average revenue per order * expected future orders (proxy based on repeat_90d prob * 4 quarters)
    df['prob_repeat_90d'] = gbc.predict_proba(X)[:, 1]
    df['projected_orders_6m'] = df['prob_repeat_90d'] * 2
    df['projected_clv_6m'] = df['total_revenue'] + (df['total_revenue'] / df['total_orders'].replace(0, 1)) * df['projected_orders_6m']
    
    df[['customer_id', 'projected_orders_6m', 'projected_clv_6m']].to_csv('outputs/clv_projection.csv', index=False)
    
    # Report
    report = ["# Customer Retention Prediction Report\n"]
    report.append("## Model Comparison\n")
    report.append(res_df.to_markdown(index=False) + "\n\n")
    report.append("## Top 10 Features (Random Forest)\n")
    report.append(fi_df.to_markdown(index=False) + "\n\n")
    
    with open('outputs/retention_prediction_report.md', 'w') as f:
        f.write("\n".join(report))

def main():
    print("Running Phase 6: Customer Retention Prediction")
    run_retention_prediction()
    print("Phase 6 complete.")

if __name__ == "__main__":
    main()
