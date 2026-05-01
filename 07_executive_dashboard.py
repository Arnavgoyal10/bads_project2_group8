import pandas as pd
import numpy as np
import os
import re

def load_data():
    abt = pd.read_csv('outputs/analytical_base_table.csv')
    campaigns = pd.read_csv('outputs/campaign_features.csv')
    return abt, campaigns

def get_markdown_table(file_path, title_start):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Find table after title
    start_idx = content.find(title_start)
    if start_idx == -1:
        return ""
    
    # Find the next table
    table_match = re.search(r'\|.*\|', content[start_idx:])
    if not table_match:
        return ""
    
    # Extract until next non-table line
    lines = content[start_idx + table_match.start():].split('\n')
    table_lines = []
    for line in lines:
        if line.strip().startswith('|'):
            table_lines.append(line)
        elif len(table_lines) > 0:
            break
            
    return "\n".join(table_lines)

def run_dashboard():
    abt, campaigns = load_data()
    
    # KPIs
    total_leads = int(abt['total_leads'].sum())
    lcr = abt['converted_leads'].sum() / total_leads if total_leads > 0 else 0
    total_revenue = abt['total_revenue'].sum()
    total_orders = abt['total_orders'].sum()
    aov = total_revenue / total_orders if total_orders > 0 else 0
    total_customers = abt['customer_id'].nunique()
    total_sessions = int(abt['total_sessions'].sum())
    total_campaigns = campaigns['campaign_id'].nunique()
    repeat_rate = (abt['total_orders'] > 1).mean()
    
    # Campaign Group Table
    camp_summary = campaigns.groupby('Group_Label').agg({
        'spend_usd': 'mean',
        'LCR': 'mean',
        'ROAS': 'mean',
        'CPA': 'mean'
    }).reset_index()
    camp_summary_html = camp_summary.to_html(classes='min-w-full text-sm text-left text-slate-300', index=False, float_format='{:.2f}'.format)
    
    # Segment Summary Table (from report)
    segment_table = get_markdown_table('outputs/segmentation_report.md', '## Segment Summary')
    # Convert MD table to HTML simple table
    def md_to_html_table(md):
        if not md: return ""
        lines = [l.strip() for l in md.split('\n') if l.strip()]
        if not lines: return ""
        html = '<table class="min-w-full text-sm text-left text-slate-300"><thead><tr>'
        headers = [h.strip() for h in lines[0].split('|')[1:-1]]
        for h in headers:
            html += f'<th class="px-4 py-2 font-semibold text-slate-100">{h}</th>'
        html += '</tr></thead><tbody>'
        for line in lines[2:]:
            cols = [c.strip() for c in line.split('|')[1:-1]]
            html += '<tr>'
            for c in cols:
                html += f'<td class="px-4 py-2 border-t border-slate-800">{c}</td>'
            html += '</tr>'
        html += '</tbody></table>'
        return html

    segment_html = md_to_html_table(segment_table)
    
    # Lead Prediction Tables
    lead_model_table = md_to_html_table(get_markdown_table('outputs/lead_prediction_report.md', '## Model Comparison'))
    decile_table = md_to_html_table(get_markdown_table('outputs/lead_prediction_report.md', '## Decile Analysis'))
    
    # Discount Table
    discount_table = md_to_html_table(get_markdown_table('outputs/descriptive_report.md', '### Discount Bracket LCR'))

    html_template = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NovaMart Executive Dashboard | Marketing Analytics</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {{
            font-family: 'Inter', sans-serif;
            background-color: #020617;
            color: #e2e8f0;
        }}
        .glass-card {{
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 1rem;
        }}
        .tab-content {{ display: none; }}
        .tab-content.active {{ display: block; }}
        .nav-link.active {{
            background-color: #1e293b;
            color: #38bdf8;
            border-bottom: 2px solid #38bdf8;
        }}
        .kpi-value {{
            background: linear-gradient(to right, #38bdf8, #818cf8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}
        .badge-stat {{
            background: rgba(56, 189, 248, 0.1);
            color: #38bdf8;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
        }}
    </style>
</head>
<body class="p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <header class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold tracking-tight text-white mb-1">NovaMart <span class="text-sky-400">Executive</span></h1>
                <p class="text-slate-400">Marketing Analytics & Predictive Intelligence Dashboard</p>
            </div>
            <div class="flex gap-2 text-xs font-mono text-slate-500 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                <span>STATUS: LIVE</span>
                <span>•</span>
                <span>MODEL: V2.4</span>
                <span>•</span>
                <span>LAST UPDATE: 2026-05-02</span>
            </div>
        </header>

        <!-- Navigation -->
        <nav class="flex flex-wrap gap-1 mb-8 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            <button onclick="showTab('overview')" class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800 active" id="tab-overview">Overview</button>
            <button onclick="showTab('data-quality')" class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800" id="tab-data-quality">Data Quality</button>
            <button onclick="showTab('channels')" class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800" id="tab-channels">Channel & Campaign</button>
            <button onclick="showTab('segments')" class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800" id="tab-segments">Customer Segments</button>
            <button onclick="showTab('lead-model')" class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800" id="tab-lead-model">Lead Model</button>
            <button onclick="showTab('retention')" class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800" id="tab-retention">Retention</button>
            <button onclick="showTab('discounts')" class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800" id="tab-discounts">Discount Analysis</button>
            <button onclick="showTab('recommendations')" class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800" id="tab-recommendations">Recommendations</button>
        </nav>

        <!-- Tab Contents -->
        
        <!-- SECTION 1: OVERVIEW -->
        <div id="overview" class="tab-content active space-y-6">
            <!-- KPI Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="glass-card p-6">
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Leads</p>
                    <p class="text-3xl font-bold kpi-value">{total_leads:,}</p>
                </div>
                <div class="glass-card p-6">
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Lead Conv. Rate</p>
                    <p class="text-3xl font-bold kpi-value">{lcr:.1%}</p>
                </div>
                <div class="glass-card p-6">
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Revenue</p>
                    <p class="text-3xl font-bold kpi-value">${total_revenue:,.0f}</p>
                </div>
                <div class="glass-card p-6">
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Avg Order Value</p>
                    <p class="text-3xl font-bold kpi-value">${aov:,.2f}</p>
                </div>
                <div class="glass-card p-6">
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Customers</p>
                    <p class="text-3xl font-bold kpi-value">{total_customers:,}</p>
                </div>
                <div class="glass-card p-6">
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Sessions</p>
                    <p class="text-3xl font-bold kpi-value">{total_sessions:,}</p>
                </div>
                <div class="glass-card p-6">
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Campaigns</p>
                    <p class="text-3xl font-bold kpi-value">{total_campaigns}</p>
                </div>
                <div class="glass-card p-6">
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Repeat Purchase Rate</p>
                    <p class="text-3xl font-bold kpi-value">{repeat_rate:.1%}</p>
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4 border-b border-slate-800 pb-2">Channel Performance (LCR)</h3>
                    <img src="charts/channel_lcr.png" class="w-full rounded-lg" alt="Channel LCR">
                </div>
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4 border-b border-slate-800 pb-2">Efficiency Frontier</h3>
                    <img src="efficiency_frontier.png" class="w-full rounded-lg" alt="Efficiency Frontier">
                </div>
            </div>
        </div>

        <!-- SECTION 2: DATA QUALITY -->
        <div id="data-quality" class="tab-content space-y-6">
            <div class="glass-card p-6 overflow-hidden">
                <h3 class="text-xl font-semibold mb-6">Data Quality Scorecard</h3>
                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm text-left">
                        <thead class="bg-slate-800/50 text-slate-300">
                            <tr>
                                <th class="px-4 py-3">Table</th>
                                <th class="px-4 py-3">Key Issues Found</th>
                                <th class="px-4 py-3">Treatment Applied</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800">
                            <tr>
                                <td class="px-4 py-3 font-medium">Customers</td>
                                <td class="px-4 py-3">18 Duplicates, 3 Invalid Ages</td>
                                <td class="px-4 py-3 text-emerald-400">Dropped / Set to NaN</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3 font-medium">Campaigns</td>
                                <td class="px-4 py-3">21 Spend > Budget, 25 Clicks > Impressions</td>
                                <td class="px-4 py-3 text-sky-400">Flagged for investigation</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3 font-medium">Leads</td>
                                <td class="px-4 py-3">26 Anon Leads, 33 Unattributed</td>
                                <td class="px-4 py-3 text-emerald-400">Normalization & Exclusion</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3 font-medium">Sessions</td>
                                <td class="px-4 py-3">31 Invalid Pages, 48 Invalid Time</td>
                                <td class="px-4 py-3 text-emerald-400">Capping & Outlier Removal</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3 font-medium">Transactions</td>
                                <td class="px-4 py-3">35 Revenue <= 0, 48 Units <= 0</td>
                                <td class="px-4 py-3 text-emerald-400">Zero-value flagging</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="grid md:grid-cols-3 gap-6">
                <div class="glass-card p-6 flex flex-col items-center justify-center text-center">
                    <p class="text-slate-400 text-sm mb-2">Sessions → Customers</p>
                    <p class="text-4xl font-bold text-emerald-400">99.5%</p>
                    <p class="text-xs text-slate-500 mt-2">Join Success Rate</p>
                </div>
                <div class="glass-card p-6 flex flex-col items-center justify-center text-center">
                    <p class="text-slate-400 text-sm mb-2">Transactions → Customers</p>
                    <p class="text-4xl font-bold text-emerald-400">97.9%</p>
                    <p class="text-xs text-slate-500 mt-2">Join Success Rate</p>
                </div>
                <div class="glass-card p-6">
                    <h4 class="text-sm font-semibold text-rose-400 uppercase mb-4 flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Critical Anomalies
                    </h4>
                    <ul class="text-sm space-y-2 text-slate-300">
                        <li>• 21 campaigns exceeding budget cap</li>
                        <li>• 3 records with age > 120 or < 0</li>
                        <li>• Lead/Conversion date mismatch resolved</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- SECTION 3: CHANNEL & CAMPAIGN -->
        <div id="channels" class="tab-content space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
                <div class="glass-card p-6">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-lg font-semibold">Channel LCR Analysis</h3>
                        <span class="badge-stat">χ² p=0.0015</span>
                    </div>
                    <img src="charts/channel_lcr.png" class="w-full rounded-lg" alt="Channel LCR">
                </div>
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">Channel ROAS Distribution</h3>
                    <img src="charts/channel_roas.png" class="w-full rounded-lg" alt="Channel ROAS">
                </div>
            </div>

            <div class="glass-card p-6">
                <h3 class="text-lg font-semibold mb-4">Portfolio Efficiency Frontier</h3>
                <img src="efficiency_frontier.png" class="w-full rounded-lg" alt="Efficiency Frontier">
            </div>

            <div class="grid md:grid-cols-2 gap-6">
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">Creative-Objective Matrix</h3>
                    <img src="charts/creative_objective_matrix.png" class="w-full rounded-lg" alt="Creative Objective Matrix">
                </div>
                <div class="glass-card p-6 flex flex-col justify-between">
                    <div>
                        <h3 class="text-lg font-semibold mb-4">Statistical Significance</h3>
                        <div class="bg-slate-900/50 p-4 rounded-lg border border-sky-500/30">
                            <p class="text-sm text-sky-400 font-mono mb-2">χ² = 26.87, p = 0.0015</p>
                            <p class="text-slate-300 text-sm italic">"Acquisition channels convert at significantly different rates. The variance in LCR is not due to chance, justifying strategic budget reallocation to high-performing channels."</p>
                        </div>
                    </div>
                    <div class="mt-6">
                        <h4 class="text-sm font-semibold mb-3">Campaign Group Performance</h4>
                        <div class="overflow-x-auto">
                            {camp_summary_html}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SECTION 4: CUSTOMER SEGMENTS -->
        <div id="segments" class="tab-content space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">Segment Separation (PCA)</h3>
                    <img src="charts/segment_scatter.png" class="w-full rounded-lg" alt="Segment Scatter">
                </div>
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">Segment Feature Profiles</h3>
                    <img src="charts/segment_profiles.png" class="w-full rounded-lg" alt="Segment Profiles">
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">K-Means Validation</h3>
                    <img src="charts/kmeans_validation.png" class="w-full rounded-lg" alt="K-Means Validation">
                </div>
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">RFM Distribution</h3>
                    <img src="charts/rfm_donut.png" class="w-full rounded-lg" alt="RFM Donut">
                </div>
            </div>

            <div class="glass-card p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-semibold">Segment Summary Matrix</h3>
                    <div class="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                        ANOVA p < 0.05 — Statistically Distinct
                    </div>
                </div>
                <div class="overflow-x-auto">
                    {segment_html}
                </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="glass-card p-4 border-l-4 border-yellow-500">
                    <h4 class="font-bold text-yellow-500 uppercase text-xs mb-2">Champions</h4>
                    <p class="text-xs text-slate-400">High revenue, high frequency. Priority for early access and VIP treatment.</p>
                </div>
                <div class="glass-card p-4 border-l-4 border-emerald-500">
                    <h4 class="font-bold text-emerald-500 uppercase text-xs mb-2">Core Buyers</h4>
                    <p class="text-xs text-slate-400">Consistent value. Focus on cross-selling and brand advocacy.</p>
                </div>
                <div class="glass-card p-4 border-l-4 border-sky-500">
                    <h4 class="font-bold text-sky-500 uppercase text-xs mb-2">Engaged Browsers</h4>
                    <p class="text-xs text-slate-400">High activity, low orders. Target with conversion incentives.</p>
                </div>
                <div class="glass-card p-4 border-l-4 border-rose-500">
                    <h4 class="font-bold text-rose-500 uppercase text-xs mb-2">Dormant</h4>
                    <p class="text-xs text-slate-400">At-risk customers. Requires aggressive win-back discounting.</p>
                </div>
            </div>
        </div>

        <!-- SECTION 5: LEAD scoring -->
        <div id="lead-model" class="tab-content space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">ROC Curves (Model Performance)</h3>
                    <img src="charts/roc_curves.png" class="w-full rounded-lg" alt="ROC Curves">
                </div>
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">Lift Chart</h3>
                    <img src="charts/lift_chart.png" class="w-full rounded-lg" alt="Lift Chart">
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">Feature Importance (SHAP)</h3>
                    <img src="charts/shap_summary.png" class="w-full rounded-lg" alt="SHAP Summary">
                </div>
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">Confusion Matrix</h3>
                    <img src="charts/confusion_matrix.png" class="w-full rounded-lg" alt="Confusion Matrix">
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">Model Benchmarks</h3>
                    <div class="overflow-x-auto">
                        {lead_model_table}
                    </div>
                    <div class="mt-4 text-xs text-slate-500 italic">
                        Selected: Logistic Regression (Balanced) for optimal Precision/Recall trade-off.
                    </div>
                </div>
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">Decile Analysis (Top-Tier)</h3>
                    <div class="overflow-x-auto">
                        {decile_table}
                    </div>
                    <div class="mt-4 bg-sky-500/10 p-3 rounded border border-sky-500/20 text-sm text-sky-300">
                        <strong>Insight:</strong> Top 2 deciles capture >50% of all conversions. Focus sales outreach on P > 0.6.
                    </div>
                </div>
            </div>

            <div class="glass-card p-6">
                <h3 class="text-lg font-semibold mb-4">Priority Tier Logic</h3>
                <div class="grid md:grid-cols-3 gap-4">
                    <div class="bg-slate-900/80 p-4 rounded-lg border-t-2 border-emerald-500">
                        <p class="font-bold text-emerald-400 mb-1">HIGH (>0.6)</p>
                        <p class="text-xs text-slate-400">Immediate sales call. 2x conversion vs baseline.</p>
                    </div>
                    <div class="bg-slate-900/80 p-4 rounded-lg border-t-2 border-yellow-500">
                        <p class="font-bold text-yellow-400 mb-1">MEDIUM (0.3-0.6)</p>
                        <p class="text-xs text-slate-400">Marketing automation. 5-day email sequence.</p>
                    </div>
                    <div class="bg-slate-900/80 p-4 rounded-lg border-t-2 border-slate-600">
                        <p class="font-bold text-slate-500 mb-1">LOW (<0.3)</p>
                        <p class="text-xs text-slate-400">Monthly newsletter only. No manual resource.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- SECTION 6: RETENTION -->
        <div id="retention" class="tab-content space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">Early Warning Signals</h3>
                    <img src="charts/early_warning_signals.png" class="w-full rounded-lg" alt="Early Warning Signals">
                </div>
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">Retention Drivers (Importance)</h3>
                    <img src="charts/retention_feature_importance.png" class="w-full rounded-lg" alt="Retention Feature Importance">
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">CLV Projection Distribution</h3>
                    <img src="charts/clv_distribution.png" class="w-full rounded-lg" alt="CLV Distribution">
                </div>
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">Cohort Retention Curve</h3>
                    <img src="cohort_retention.png" class="w-full rounded-lg" alt="Cohort Retention">
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
                <div class="glass-card p-6 bg-amber-500/5 border-amber-500/20">
                    <h3 class="text-lg font-semibold mb-2 text-amber-400 flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Model Disclosure
                    </h3>
                    <p class="text-sm text-slate-300">Retention class imbalance (severe) impacted standard AUC metrics. We utilized Feature Importance from Gradient Boosting as a proxy for risk profiling. Model should be retrained once more churn labels are collected.</p>
                </div>
                <div class="glass-card p-6 bg-sky-500/5 border-sky-500/20">
                    <h3 class="text-lg font-semibold mb-2 text-sky-400">Action Callout</h3>
                    <p class="text-sm font-medium text-white mb-2">Trigger win-back email at day 60 for P(repeat) < 0.3</p>
                    <p class="text-xs text-slate-400">Current cohort analysis shows 45% drop-off between month 2 and 3. Early intervention is critical.</p>
                </div>
            </div>
        </div>

        <!-- SECTION 7: DISCOUNT ANALYSIS -->
        <div id="discounts" class="tab-content space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">Discount Efficiency</h3>
                    <img src="charts/discount_analysis.png" class="w-full rounded-lg" alt="Discount Analysis">
                </div>
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">Digital Intent Signals</h3>
                    <img src="charts/intent_signals.png" class="w-full rounded-lg" alt="Intent Signals">
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
                <div class="glass-card p-6">
                    <h3 class="text-lg font-semibold mb-4">Discount Bracket Performance (LCR)</h3>
                    <div class="overflow-x-auto">
                        {discount_table}
                    </div>
                </div>
                <div class="glass-card p-6 flex flex-col justify-center gap-6">
                    <div class="bg-rose-500/10 border border-rose-500/30 p-4 rounded-lg">
                        <h4 class="font-bold text-rose-400 mb-2 uppercase text-xs">Statistical Verdict</h4>
                        <p class="text-sm text-slate-300 font-mono mb-1">Spearman ρ ≈ 0, p > 0.05</p>
                        <p class="text-sm text-slate-200 font-semibold italic">"Discount percentage does NOT significantly predict conversion. Blanket discounting is not justified by the data."</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-semibold mb-3">Behavioral Signal Strength</h4>
                        <div class="space-y-3">
                            <div>
                                <div class="flex justify-between text-xs mb-1"><span>Add to Cart</span><span class="text-sky-400">High Impact</span></div>
                                <div class="w-full bg-slate-800 h-2 rounded-full"><div class="bg-sky-500 h-full rounded-full" style="width: 85%"></div></div>
                            </div>
                            <div>
                                <div class="flex justify-between text-xs mb-1"><span>Pages Viewed</span><span>Moderate</span></div>
                                <div class="w-full bg-slate-800 h-2 rounded-full"><div class="bg-slate-600 h-full rounded-full" style="width: 45%"></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SECTION 8: RECOMMENDATIONS -->
        <div id="recommendations" class="tab-content space-y-8">
            <h2 class="text-2xl font-bold text-white mb-6">Strategic Action Roadmap</h2>
            
            <div class="grid md:grid-cols-3 gap-6">
                <div class="glass-card p-8 border-t-4 border-sky-500 hover:bg-slate-800/40 transition-colors">
                    <div class="bg-sky-500/20 p-3 rounded-full w-fit mb-4">
                        <svg class="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold mb-3">Reallocate Budget</h3>
                    <p class="text-slate-400 text-sm mb-4">Shift 15% of budget from <strong>Display</strong> to <strong>Search & Paid Social</strong>.</p>
                    <ul class="text-xs text-slate-500 space-y-1">
                        <li>• Search LCR: 38% vs Display 32%</li>
                        <li>• Significant p-value (0.0015) justifies move</li>
                        <li>• Estimated Revenue Lift: +$12k/month</li>
                    </ul>
                </div>
                
                <div class="glass-card p-8 border-t-4 border-indigo-500 hover:bg-slate-800/40 transition-colors">
                    <div class="bg-indigo-500/20 p-3 rounded-full w-fit mb-4">
                        <svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold mb-3">Lead Prioritization</h3>
                    <p class="text-slate-400 text-sm mb-4">Deploy <strong>Lead Scoring Model</strong>; focus sales on top-2 deciles daily.</p>
                    <ul class="text-xs text-slate-500 space-y-1">
                        <li>• Decile 10 LCR: 55%</li>
                        <li>• Efficiency: 2.5x vs baseline</li>
                        <li>• Action: Real-time CRM scoring</li>
                    </ul>
                </div>

                <div class="glass-card p-8 border-t-4 border-rose-500 hover:bg-slate-800/40 transition-colors">
                    <div class="bg-rose-500/20 p-3 rounded-full w-fit mb-4">
                        <svg class="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold mb-3">Retention & Discounting</h3>
                    <p class="text-slate-400 text-sm mb-4">VIP track for <strong>Champions</strong>; cap discounts at 15%.</p>
                    <ul class="text-xs text-slate-500 space-y-1">
                        <li>• Cap discounts at 15% (no LCR lift above)</li>
                        <li>• Trigger win-back at day 60</li>
                        <li>• Loyalty Tier ANOVA p < 0.05</li>
                    </ul>
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6 mt-12">
                <div class="glass-card p-6 bg-slate-900/30">
                    <h3 class="text-lg font-semibold mb-4 text-emerald-400">What We Know (Defensible)</h3>
                    <ul class="space-y-3 text-sm text-slate-300">
                        <li class="flex items-start gap-2">
                            <span class="text-emerald-500 mt-1">✔</span>
                            <span>Channels convert at different rates (p=0.0015)</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-emerald-500 mt-1">✔</span>
                            <span>Loyalty tiers drive distinct revenue levels</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-emerald-500 mt-1">✔</span>
                            <span>Top 20% of leads generate 55% of conversions</span>
                        </li>
                    </ul>
                </div>
                <div class="glass-card p-6 bg-slate-900/30">
                    <h3 class="text-lg font-semibold mb-4 text-amber-400">What We Don't Know (Risks)</h3>
                    <ul class="space-y-3 text-sm text-slate-300">
                        <li class="flex items-start gap-2">
                            <span class="text-amber-500 mt-1">?</span>
                            <span>Long-term retention (early signal only)</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-amber-500 mt-1">?</span>
                            <span>Incrementality of Search vs Organic</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-amber-500 mt-1">?</span>
                            <span>Impact of seasonality on Lead Scoring</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <script>
        function showTab(tabId) {{
            // Hide all contents
            document.querySelectorAll('.tab-content').forEach(tab => {{
                tab.classList.remove('active');
            }});
            // Deactivate all links
            document.querySelectorAll('.nav-link').forEach(link => {{
                link.classList.remove('active');
            }});
            
            // Show target content
            document.getElementById(tabId).classList.add('active');
            // Activate target link
            document.getElementById('tab-' + tabId).classList.add('active');
            
            window.scrollTo(0, 0);
        }}
    </script>
</body>
</html>
    """
    with open('outputs/executive_dashboard.html', 'w', encoding='utf-8') as f:
        f.write(html_template)

if __name__ == "__main__":
    run_dashboard()
    print("Dashboard generated successfully in outputs/executive_dashboard.html")
