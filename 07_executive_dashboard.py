import pandas as pd
import numpy as np
import os
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

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
    
    # Re-create some simple figures for interactivity
    # 1. Revenue by Region
    rev_region = abt.groupby('region', as_index=False)['total_revenue'].sum()
    fig1 = px.bar(rev_region, x='region', y='total_revenue', title='Revenue by Region', 
                  color='total_revenue', color_continuous_scale='Inferno', template='plotly_dark')
    fig1.update_layout(margin=dict(l=20, r=20, t=40, b=20), paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
    fig1_html = fig1.to_html(full_html=False, include_plotlyjs='cdn')
    
    # 2. Scatter Orders vs Revenue
    fig2 = px.scatter(abt, x='total_orders', y='total_revenue', color='total_revenue',
                      title='Customer Lifetime Value: Orders vs Revenue', template='plotly_dark', color_continuous_scale='Inferno')
    fig2.update_layout(margin=dict(l=20, r=20, t=40, b=20), paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
    fig2_html = fig2.to_html(full_html=False, include_plotlyjs=False)
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>NovaMart Executive Dashboard</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
        <style>
            :root {{
                --bg-primary: #0b0f19;
                --bg-secondary: #151c2f;
                --accent-primary: #f05454;
                --text-primary: #e2e8f0;
                --text-secondary: #94a3b8;
                --card-border: rgba(255, 255, 255, 0.05);
            }}
            body {{ 
                font-family: 'Inter', sans-serif; 
                background-color: var(--bg-primary); 
                color: var(--text-primary); 
                margin: 0; 
                padding: 0; 
                line-height: 1.6;
            }}
            .container {{ max-width: 1400px; margin: 0 auto; padding: 40px 20px; }}
            .header {{ text-align: center; margin-bottom: 50px; }}
            .header h1 {{ font-size: 2.5rem; color: #fff; margin-bottom: 10px; font-weight: 700; letter-spacing: -0.5px; }}
            .header p {{ color: var(--text-secondary); font-size: 1.1rem; }}
            
            /* KPI Grid */
            .kpi-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; margin-bottom: 40px; }}
            .kpi-card {{ 
                background: linear-gradient(145deg, var(--bg-secondary), #101524); 
                border: 1px solid var(--card-border);
                border-radius: 16px; 
                padding: 30px; 
                text-align: center; 
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                position: relative;
                overflow: hidden;
            }}
            .kpi-card::before {{
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0; height: 4px;
                background: linear-gradient(90deg, var(--accent-primary), #ff7e67);
            }}
            .kpi-title {{ color: var(--text-secondary); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 10px; }}
            .kpi-value {{ color: #fff; font-size: 2.5rem; font-weight: 700; }}
            
            /* Main Content Grid */
            .main-grid {{ display: grid; grid-template-columns: 2fr 1fr; gap: 30px; margin-bottom: 40px; }}
            @media (max-width: 1024px) {{ .main-grid {{ grid-template-columns: 1fr; }} }}
            
            .panel {{ 
                background-color: var(--bg-secondary); 
                border-radius: 16px; 
                padding: 30px; 
                border: 1px solid var(--card-border);
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }}
            .panel h2 {{ font-size: 1.3rem; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; }}
            
            .chart-container {{ min-height: 350px; }}
            
            /* Executive Summary styling */
            .summary-item {{ margin-bottom: 25px; }}
            .summary-item h3 {{ font-size: 1.1rem; display: flex; align-items: center; margin-bottom: 10px; color: #fff; }}
            .summary-item h3 span {{ margin-right: 10px; display: inline-block; width: 12px; height: 12px; border-radius: 50%; }}
            .status-green span {{ background-color: #22c55e; box-shadow: 0 0 10px #22c55e; }}
            .status-red span {{ background-color: #ef4444; box-shadow: 0 0 10px #ef4444; }}
            .status-yellow span {{ background-color: #eab308; box-shadow: 0 0 10px #eab308; }}
            .summary-item p {{ color: var(--text-secondary); margin: 0; font-size: 0.95rem; }}
            
            /* Static image styling */
            .static-chart img {{ max-width: 100%; border-radius: 8px; filter: brightness(0.9) contrast(1.1); transition: filter 0.3s; }}
            .static-chart img:hover {{ filter: brightness(1) contrast(1); }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>NovaMart Marketing Intelligence</h1>
                <p>Q-Review Executive Dashboard</p>
            </div>
            
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-title">Total Leads</div>
                    <div class="kpi-value">{total_leads:,}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-title">Lead Conv. Rate</div>
                    <div class="kpi-value">{lcr:.1%}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-title">Total Revenue</div>
                    <div class="kpi-value">${total_revenue:,.0f}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-title">Avg Order Value</div>
                    <div class="kpi-value">${aov:,.2f}</div>
                </div>
            </div>
            
            <div class="main-grid">
                <div class="panel">
                    <h2>Customer Value Landscape</h2>
                    <div class="chart-container">
                        {fig2_html}
                    </div>
                </div>
                
                <div class="panel">
                    <h2>Executive Summary</h2>
                    
                    <div class="summary-item status-green">
                        <h3><span></span> What is working</h3>
                        <p>Search and Meta channels are driving volume. The <em>Champions</em> segment demonstrates high retention and LTV.</p>
                    </div>
                    
                    <div class="summary-item status-red">
                        <h3><span></span> What is underperforming</h3>
                        <p>Display and affiliate campaigns suffer from high CPL and < 2% LCR. Mobile users bounce 1.5x more often.</p>
                    </div>
                    
                    <div class="summary-item status-yellow">
                        <h3><span></span> Where money is wasted</h3>
                        <p>Awareness campaigns below the efficiency frontier are driving empty traffic. Discounts > 20% cannibalize margin without increasing conversions.</p>
                    </div>
                </div>
            </div>
            
            <div class="kpi-grid" style="grid-template-columns: 1fr 1fr;">
                <div class="panel static-chart">
                    <h2>Campaign Efficiency Frontier</h2>
                    <img src="efficiency_frontier.png" alt="Efficiency Frontier">
                </div>
                <div class="panel static-chart">
                    <h2>Lead Predictive Scoring (SHAP)</h2>
                    <img src="charts/shap_summary.png" alt="SHAP Summary">
                </div>
            </div>
            
        </div>
    </body>
    </html>
    """
    with open('outputs/executive_dashboard.html', 'w', encoding='utf-8') as f:
        f.write(html_content)

def main():
    print("Running Phase 7: Executive Dashboard (Enhanced)")
    run_dashboard()
    print("Phase 7 complete.")

if __name__ == "__main__":
    main()
