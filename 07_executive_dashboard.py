import pandas as pd
import numpy as np
import os
import plotly.express as px
import plotly.graph_objects as go
from plotly.offline import plot

def load_data():
    abt = pd.read_csv('outputs/analytical_base_table.csv')
    return abt

def run_dashboard():
    abt = load_data()
    
    # KPIs
    total_leads = int(abt['total_leads'].sum())
    lcr = abt['converted_leads'].sum() / total_leads if total_leads > 0 else 0
    total_revenue = abt['total_revenue'].sum()
    total_orders = abt['total_orders'].sum()
    aov = total_revenue / total_orders if total_orders > 0 else 0
    
    html_content = f"""
    <html>
    <head>
        <title>NovaMart Executive Dashboard</title>
        <style>
            body {{ font-family: Arial, sans-serif; background-color: #1a1a2e; color: #ffffff; margin: 0; padding: 20px; }}
            .kpi-row {{ display: flex; justify-content: space-around; padding: 20px 0; }}
            .kpi-card {{ background-color: #16213e; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #e94560; }}
            h1, h2 {{ color: #e94560; }}
            .panel {{ background-color: #16213e; padding: 20px; margin: 20px 0; border-radius: 8px; }}
        </style>
    </head>
    <body>
        <h1>NovaMart Marketing Analytics Executive Dashboard</h1>
        
        <div class="kpi-row">
            <div class="kpi-card">
                <h3>Total Leads</h3>
                <p>{total_leads:,}</p>
            </div>
            <div class="kpi-card">
                <h3>Lead Conv. Rate</h3>
                <p>{lcr:.1%}</p>
            </div>
            <div class="kpi-card">
                <h3>Total Revenue</h3>
                <p>${total_revenue:,.2f}</p>
            </div>
            <div class="kpi-card">
                <h3>Avg Order Value</h3>
                <p>${aov:,.2f}</p>
            </div>
        </div>
        
        <div class="panel">
            <h2>Channel Performance</h2>
            <img src="charts/channel_lcr.png" alt="Channel LCR" style="max-width: 100%;">
        </div>
        
        <div class="panel">
            <h2>Campaign Efficiency Frontier</h2>
            <img src="efficiency_frontier.png" alt="Efficiency Frontier" style="max-width: 100%;">
        </div>
        
        <div class="panel">
            <h2>Lead Predictive Scoring (SHAP)</h2>
            <img src="charts/shap_summary.png" alt="SHAP Summary" style="max-width: 100%;">
        </div>
        
        <div class="panel">
            <h2>Executive Summary</h2>
            <p><strong>What is working:</strong> Meta and Search channels are driving the highest volume of leads. The Champions segment shows highest retention.</p>
            <p><strong>What is underperforming:</strong> Display and affiliate channels have high CPL and low LCR. Consider reducing spend here.</p>
            <p><strong>Where money is wasted:</strong> Campaigns below the efficiency frontier are driving traffic but no revenue.</p>
        </div>
        
    </body>
    </html>
    """
    with open('outputs/executive_dashboard.html', 'w') as f:
        f.write(html_content)

def main():
    print("Running Phase 7: Executive Dashboard")
    run_dashboard()
    print("Phase 7 complete.")

if __name__ == "__main__":
    main()
