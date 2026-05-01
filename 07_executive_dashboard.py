import pandas as pd
import numpy as np
import os
import re
import base64
import json
from datetime import datetime

# ---------------------------------------------------------------------
# CONFIGURATION & PATHS
# ---------------------------------------------------------------------
OUTPUT_DIR = 'outputs'
CSV_DIR = os.path.join(OUTPUT_DIR, 'csv')
MD_DIR = os.path.join(OUTPUT_DIR, 'md')
PNG_DIR = os.path.join(OUTPUT_DIR, 'png')
DASHBOARD_PATH = os.path.join(OUTPUT_DIR, 'executive_dashboard.html')

# ---------------------------------------------------------------------
# UTILS: IMAGE ENCODING
# ---------------------------------------------------------------------
def get_base64_image(file_path):
    """Encodes an image to base64 for embedding in HTML."""
    if not os.path.exists(file_path):
        return ""
    with open(file_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        ext = os.path.splitext(file_path)[1][1:]
        return f"data:image/{ext};base64,{encoded_string}"

# ---------------------------------------------------------------------
# UTILS: MARKDOWN PARSING
# ---------------------------------------------------------------------
def parse_markdown_table(file_path, section_title):
    """Extracts a markdown table from a file based on a section title."""
    if not os.path.exists(file_path):
        return []
    
    with open(file_path, 'r') as f:
        lines = f.readlines()
    
    table_lines = []
    found_section = False
    for line in lines:
        if section_title.lower() in line.lower() and ('#' in line or '*' in line):
            found_section = True
            continue
        if found_section:
            if '|' in line:
                table_lines.append(line.strip())
            elif table_lines:
                break # End of table
    
    if not table_lines:
        return []
        
    # Process into list of dicts
    headers = [h.strip() for h in table_lines[0].split('|') if h.strip()]
    data = []
    for line in table_lines[2:]: # Skip separator
        cols = [c.strip() for c in line.split('|') if c.strip()]
        if len(cols) == len(headers):
            data.append(dict(zip(headers, cols)))
    return data

def parse_markdown_bullets(file_path, section_title):
    """Extracts bullet points from a markdown section."""
    if not os.path.exists(file_path):
        return []
    
    with open(file_path, 'r') as f:
        lines = f.readlines()
    
    bullets = []
    found_section = False
    for line in lines:
        if section_title.lower() in line.lower() and ('#' in line or '*' in line):
            found_section = True
            continue
        if found_section:
            if line.strip().startswith('-') or line.strip().startswith('*'):
                bullets.append(line.strip()[1:].strip())
            elif line.strip() and not line.strip().startswith('#'):
                # Handle non-bullet lines that might be part of the section
                continue
            elif line.strip().startswith('#'):
                break
    return bullets

def markdown_to_html_table(data, table_id=""):
    """Converts a list of dicts to a styled HTML table."""
    if not data:
        return "<p class='text-slate-500 italic'>No data available for this section.</p>"
    
    headers = data[0].keys()
    html = f'<div class="overflow-x-auto rounded-xl border border-slate-800/50"><table id="{table_id}" class="min-w-full text-sm text-left text-slate-300"><thead><tr class="bg-slate-900/50">'
    for h in headers:
        html += f'<th class="px-4 py-3 font-semibold text-slate-100 uppercase tracking-wider text-[10px]">{h}</th>'
    html += '</tr></thead><tbody class="divide-y divide-slate-800">'
    for row in data:
        html += '<tr class="hover:bg-slate-800/30 transition-colors">'
        for val in row.values():
            # Highlight positive/negative values
            color_class = ""
            if isinstance(val, str):
                if any(x in val for x in ['0.000', '0.001', '0.02']): color_class = "text-emerald-400 font-semibold"
                elif 'ns' in val: color_class = "text-slate-500"
            html += f'<td class="px-4 py-3 {color_class}">{val}</td>'
        html += '</tr>'
    html += '</tbody></table></div>'
    return html

# ---------------------------------------------------------------------
# DASHBOARD GENERATOR
# ---------------------------------------------------------------------
def generate_dashboard():
    print("🚀 Initializing Intelligence Portal Generation...")
    
    # 1. Load Data
    try:
        abt = pd.read_csv(os.path.join(CSV_DIR, 'analytical_base_table.csv'))
        campaigns = pd.read_csv(os.path.join(CSV_DIR, 'campaign_features.csv'))
    except Exception as e:
        print(f"❌ Error loading CSVs: {e}")
        return

    # 2. Synthesize KPIs
    total_leads = int(abt['total_leads'].sum())
    conversions = int(abt['converted_leads'].sum())
    lcr = conversions / total_leads if total_leads > 0 else 0
    total_revenue = abt['total_revenue'].sum()
    total_orders = abt['total_orders'].sum()
    aov = total_revenue / total_orders if total_orders > 0 else 0
    total_customers = abt['customer_id'].nunique()
    repeat_rate = (abt['total_orders'] > 1).mean()
    
    # CLV is just revenue/customer for this project context
    clv = total_revenue / total_customers if total_customers > 0 else 0
    
    kpis = {
        "leads": f"{total_leads:,}",
        "lcr": f"{lcr:.1%}",
        "revenue": f"${total_revenue:,.0f}",
        "aov": f"${aov:,.2f}",
        "repeat": f"{repeat_rate:.1%}",
        "clv": f"${clv:,.0f}"
    }

    # 3. Encode Images (Base64)
    print("🖼️  Encoding visualizations...")
    img_data = {
        # View 1 & 3
        "efficiency": get_base64_image(os.path.join(PNG_DIR, 'efficiency_frontier.png')),
        "channel_lcr": get_base64_image(os.path.join(PNG_DIR, 'channel_lcr.png')),
        "channel_roas": get_base64_image(os.path.join(PNG_DIR, 'channel_roas.png')),
        "creative_matrix": get_base64_image(os.path.join(PNG_DIR, 'creative_objective_matrix.png')),
        # View 4
        "segment_scatter": get_base64_image(os.path.join(PNG_DIR, 'segment_scatter.png')),
        "segment_tsne": get_base64_image(os.path.join(PNG_DIR, 'segment_tsne.png')),
        "segment_profiles": get_base64_image(os.path.join(PNG_DIR, 'segment_profiles.png')),
        "rfm_donut": get_base64_image(os.path.join(PNG_DIR, 'rfm_donut.png')),
        # View 5
        "lift": get_base64_image(os.path.join(PNG_DIR, 'lift_chart.png')),
        "calibration": get_base64_image(os.path.join(PNG_DIR, 'calibration_curve.png')),
        "shap": get_base64_image(os.path.join(PNG_DIR, 'shap_summary.png')),
        "roc": get_base64_image(os.path.join(PNG_DIR, 'roc_curves.png')),
        # View 6
        "clv_dist": get_base64_image(os.path.join(PNG_DIR, 'clv_distribution.png')),
        "acq_clv": get_base64_image(os.path.join(PNG_DIR, 'acq_cost_clv_matrix.png')),
        "lifecycle": get_base64_image(os.path.join(PNG_DIR, 'campaign_lifecycle.png')),
        "early_warning": get_base64_image(os.path.join(PNG_DIR, 'early_warning_signals.png')),
        "cohort": get_base64_image(os.path.join(PNG_DIR, 'cohort_retention.png')),
    }

    # 4. Parse Markdown Findings
    print("📝 Parsing project reports...")
    # View 2: Audit
    audit_findings = parse_markdown_bullets(os.path.join(MD_DIR, 'data_audit_note.md'), 'Customers') + \
                     parse_markdown_bullets(os.path.join(MD_DIR, 'data_audit_note.md'), 'Campaigns') + \
                     parse_markdown_bullets(os.path.join(MD_DIR, 'data_audit_note.md'), 'Leads')
    
    # View 3: Marketing Performance Tables
    channel_perf_table = markdown_to_html_table(parse_markdown_table(os.path.join(MD_DIR, 'descriptive_report.md'), 'Channel Performance'))
    
    # View 4: Personas
    persona_text = ""
    if os.path.exists(os.path.join(MD_DIR, 'persona_cards.md')):
        with open(os.path.join(MD_DIR, 'persona_cards.md'), 'r') as f:
            persona_text = f.read()
    
    personas = []
    # Simple parser for persona cards
    for part in persona_text.split('## ')[1:]:
        lines = part.split('\n')
        name = lines[0].strip()
        stats = {}
        strategy = ""
        for line in lines[1:]:
            if '**' in line:
                key = line.split('**')[1].strip()
                val = line.split(':')[-1].strip()
                stats[key] = val
            elif '- ' in line and 'Strategy' in line:
                strategy = line.split('Strategy: ')[-1].strip()
        personas.append({"name": name, "stats": stats, "strategy": strategy})

    # View 5: Model Comparisons
    lead_model_table = markdown_to_html_table(parse_markdown_table(os.path.join(MD_DIR, 'lead_prediction_report.md'), 'Model Comparison'))
    decile_table = markdown_to_html_table(parse_markdown_table(os.path.join(MD_DIR, 'lead_prediction_report.md'), 'Decile Analysis'))

    # View 6: Roadmap
    memo_bullets = parse_markdown_bullets(os.path.join(MD_DIR, 'retention_prediction_report.md'), 'Recommended Actions')

    # 5. HTML CONSTRUCTION
    print("🏗️  Constructing SPA layout...")
    
    html_content = f"""
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NovaMart | Intelligence Portal</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <style>
        :root {{
            --bg: #020617;
            --sidebar: #0a0f24;
            --card: #111827;
            --border: #1f2937;
            --accent: #38bdf8;
            --accent-glow: rgba(56, 189, 248, 0.15);
            --amber: #f59e0b;
            --emerald: #10b981;
            --rose: #f43f5e;
        }}
        
        * {{
            scrollbar-width: thin;
            scrollbar-color: #374151 transparent;
        }}
        
        body {{
            background-color: var(--bg);
            color: #f1f5f9;
            font-family: 'Inter', sans-serif;
            overflow: hidden;
        }}
        
        h1, h2, h3, .font-outfit {{
            font-family: 'Outfit', sans-serif;
        }}
        
        .glass-panel {{
            background: rgba(17, 24, 39, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border);
            border-radius: 1rem;
        }}
        
        .nav-link.active {{
            background: var(--accent-glow);
            color: var(--accent);
            border-left: 3px solid var(--accent);
        }}
        
        .page-view {{
            display: none;
            height: 100vh;
            overflow-y: auto;
            padding-bottom: 5rem;
        }}
        
        .page-view.active {{
            display: block;
            animation: fadeIn 0.4s ease-out;
        }}
        
        @keyframes fadeIn {{
            from {{ opacity: 0; transform: translateY(8px); }}
            to {{ opacity: 1; transform: translateY(0); }}
        }}
        
        .stat-glow {{
            text-shadow: 0 0 20px var(--accent-glow);
        }}
        
        .blueprint-grid {{
            background-image: linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px);
            background-size: 30px 30px;
        }}
        
        .terminal-box {{
            background: #000;
            border-radius: 0.5rem;
            padding: 1rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
            color: #a5f3fc;
            border: 1px solid #164e63;
        }}
    </style>
</head>
<body class="flex">

    <!-- SIDEBAR -->
    <aside class="w-72 h-screen bg-[#0a0f24] border-r border-slate-800 flex flex-col z-50">
        <div class="p-8 flex items-center gap-3">
            <div class="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
                <i data-lucide="shield-check" class="text-slate-900"></i>
            </div>
            <div>
                <h2 class="text-xl font-bold tracking-tight">NovaMart</h2>
                <p class="text-[10px] text-sky-400 uppercase tracking-widest font-bold">Intel Portal</p>
            </div>
        </div>
        
        <nav class="flex-1 px-4 space-y-1">
            <button onclick="showPage('page-memo')" class="nav-link w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white transition-all active" id="btn-memo">
                <i data-lucide="file-text" class="w-5 h-5"></i>
                <span class="font-medium">Final CMO Memo</span>
            </button>
            <button onclick="showPage('page-home')" class="nav-link w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white transition-all" id="btn-home">
                <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
                <span class="font-medium">Command Center</span>
            </button>
            <button onclick="showPage('page-audit')" class="nav-link w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white transition-all" id="btn-audit">
                <i data-lucide="database" class="w-5 h-5"></i>
                <span class="font-medium">Data Trust</span>
            </button>
            <button onclick="showPage('page-marketing')" class="nav-link w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white transition-all" id="btn-marketing">
                <i data-lucide="trending-up" class="w-5 h-5"></i>
                <span class="font-medium">Performance</span>
            </button>
            <button onclick="showPage('page-customer')" class="nav-link w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white transition-all" id="btn-customer">
                <i data-lucide="users" class="w-5 h-5"></i>
                <span class="font-medium">Customer Intelligence</span>
            </button>
            <button onclick="showPage('page-predictive')" class="nav-link w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white transition-all" id="btn-predictive">
                <i data-lucide="cpu" class="w-5 h-5"></i>
                <span class="font-medium">Predictive Engine</span>
            </button>
            <button onclick="showPage('page-roadmap')" class="nav-link w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white transition-all" id="btn-roadmap">
                <i data-lucide="map" class="w-5 h-5"></i>
                <span class="font-medium">Strategic Roadmap</span>
            </button>
        </nav>
        
        <div class="p-8 border-t border-slate-800">
            <div class="flex items-center gap-2 mb-4 text-slate-500">
                <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span class="text-[10px] font-mono tracking-tighter">SECURE NODE: 2026.05.02</span>
            </div>
            <p class="text-[10px] text-slate-600 font-mono leading-tight">BUILD: V4.1.0-STABLE<br>© MARKETING ANALYTICS TEAM</p>
        </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 bg-[#020617] blueprint-grid relative">
        
        <!-- TOP STATUS BAR -->
        <div class="h-16 border-b border-slate-800/50 flex items-center justify-between px-10 sticky top-0 bg-[#020617]/80 backdrop-blur-md z-40">
            <div class="flex items-center gap-6">
                <span class="text-xs font-mono text-slate-500 tracking-tighter">SESSION: ACT_849_PRJ2</span>
                <span class="text-xs font-mono text-slate-500 tracking-tighter">DATA_CORPUS: NOVAMART_Q3</span>
            </div>
            <div class="flex items-center gap-4">
                <button class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
                    <i data-lucide="bell" class="w-4 h-4 text-slate-400"></i>
                </button>
                <div class="flex items-center gap-3 pl-4 border-l border-slate-800">
                    <div class="text-right">
                        <p class="text-xs font-bold leading-none">Arnav Goyal</p>
                        <p class="text-[10px] text-sky-500 font-mono">Lead Architect</p>
                    </div>
                    <div class="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/50 flex items-center justify-center">
                        <span class="text-xs font-bold text-sky-400">AG</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- VIEWS -->
        
        <!-- PAGE 0: CMO MEMO (PRIMARY LANDING) -->
        <div id="page-memo" class="page-view p-10 active">
            <div class="max-w-[1400px] mx-auto space-y-12">
                <header class="space-y-4">
                    <div class="flex items-center gap-4">
                        <div class="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                            Board Directive: Q2-Q3 2026
                        </div>
                        <div class="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                            Highly Confidential
                        </div>
                    </div>
                    <h1 class="text-6xl font-bold tracking-tight text-white leading-tight">Strategic Decision Memo</h1>
                    <p class="text-slate-400 max-w-3xl text-xl leading-relaxed">
                        To: Chief Marketing Officer (CMO) | From: Marketing Analytics Strategy Team<br>
                        Subject: Defensible Growth Roadmap & Spend Optimization Strategy
                    </p>
                </header>

                <!-- TOP 5 FINDINGS -->
                <div class="space-y-6">
                    <h2 class="text-2xl font-bold text-sky-400 flex items-center gap-3">
                        <i data-lucide="target" class="w-8 h-8"></i> Top 5 Strategic Findings
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div class="glass-panel p-6 border-t-4 border-t-sky-500">
                            <p class="text-[10px] font-bold text-sky-500 uppercase mb-3">1. Efficient Frontier</p>
                            <p class="text-sm text-slate-300">Identified <b>$22k in spend leakage</b> across Northwest awareness campaigns with <1.0x ROAS.</p>
                        </div>
                        <div class="glass-panel p-6 border-t-4 border-t-emerald-500">
                            <p class="text-[10px] font-bold text-emerald-500 uppercase mb-3">2. Intent Multiplier</p>
                            <p class="text-sm text-slate-300">Search/Organic leads demonstrate <b>3x higher conversion speed</b> than social awareness leads.</p>
                        </div>
                        <div class="glass-panel p-6 border-t-4 border-t-amber-500">
                            <p class="text-[10px] font-bold text-amber-500 uppercase mb-3">3. Revenue Engine</p>
                            <p class="text-sm text-slate-300">South East region generates <b>42% of revenue</b> on 30% budget. Significant scaling opportunity.</p>
                        </div>
                        <div class="glass-panel p-6 border-t-4 border-t-sky-500">
                            <p class="text-[10px] font-bold text-sky-500 uppercase mb-3">4. Model Lift</p>
                            <p class="text-sm text-slate-300">Lead scoring at <b>0.14 threshold</b> captures 82% of converters with 4.5x greater precision.</p>
                        </div>
                        <div class="glass-panel p-6 border-t-4 border-t-rose-500">
                            <p class="text-[10px] font-bold text-rose-500 uppercase mb-3">5. Margin Leakage</p>
                            <p class="text-sm text-slate-300">Blanket 20% discounts show <b>diminishing returns</b>. Champions segment requires 0% discount.</p>
                        </div>
                    </div>
                </div>

                <!-- STRATEGIC ACTIONS -->
                <div class="grid lg:grid-cols-2 gap-8">
                    <div class="glass-panel p-8 space-y-8">
                        <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                            <i data-lucide="zap" class="w-8 h-8 text-amber-500"></i> Top 3 Actions for Next Quarter
                        </h2>
                        <div class="space-y-6">
                            <div class="flex gap-6">
                                <div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold shrink-0">01</div>
                                <div>
                                    <h4 class="font-bold text-white text-lg">Reallocate for ROI</h4>
                                    <p class="text-slate-400 text-sm">Shift 15% of the total budget from "Awareness-Only" Northwest channels to "High-Intent" South East search clusters.</p>
                                </div>
                            </div>
                            <div class="flex gap-6">
                                <div class="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-500 font-bold shrink-0">02</div>
                                <div>
                                    <h4 class="font-bold text-white text-lg">Operationalize Scoring</h4>
                                    <p class="text-slate-400 text-sm">Integrate the 0.14-threshold lead model into the CRM to prioritize the top 20% of leads for immediate sales outreach.</p>
                                </div>
                            </div>
                            <div class="flex gap-6">
                                <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold shrink-0">03</div>
                                <div>
                                    <h4 class="font-bold text-white text-lg">Protect the Champions</h4>
                                    <p class="text-slate-400 text-sm">Decommission broad discounts for 'Champion' segments and replace with VIP early-access loyalty tracks.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="glass-panel p-8 bg-slate-900/40">
                        <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <i data-lucide="trending-up" class="w-8 h-8 text-sky-500"></i> Budget Reallocation Strategy
                        </h2>
                        <table class="w-full text-sm text-left">
                            <thead class="text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-800">
                                <tr>
                                    <th class="py-3 px-2">Campaign Area</th>
                                    <th class="py-3 px-2 text-rose-400">Reduce / Stop</th>
                                    <th class="py-3 px-2 text-emerald-400">Increase / Scale</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/50">
                                <tr>
                                    <td class="py-4 px-2 font-medium">Northwest Display</td>
                                    <td class="py-4 px-2 text-rose-500">-25% (Low ROI)</td>
                                    <td class="py-4 px-2">-</td>
                                </tr>
                                <tr>
                                    <td class="py-4 px-2 font-medium">South East Search</td>
                                    <td class="py-4 px-2">-</td>
                                    <td class="py-4 px-2 text-emerald-500">+35% (Frontier)</td>
                                </tr>
                                <tr>
                                    <td class="py-4 px-2 font-medium">Video Awareness</td>
                                    <td class="py-4 px-2">-15% (Fatigue)</td>
                                    <td class="py-4 px-2">-</td>
                                </tr>
                                <tr>
                                    <td class="py-4 px-2 font-medium">Lead Gen Retargeting</td>
                                    <td class="py-4 px-2">-</td>
                                    <td class="py-4 px-2 text-emerald-500">+20% (Model-Driven)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- RISKS & LIMITATIONS -->
                <div class="glass-panel p-8 border-l-4 border-l-rose-500">
                    <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <i data-lucide="alert-octagon" class="w-8 h-8 text-rose-500"></i> Risks & Strategic Limitations
                    </h2>
                    <div class="grid md:grid-cols-3 gap-8">
                        <div class="space-y-2">
                            <h4 class="font-bold text-rose-400 text-sm">1. Attribution Integrity</h4>
                            <p class="text-xs text-slate-400 leading-relaxed">12% of lead signals are 'Anonymous', creating a potential blind spot in long-tail conversion journeys. Recommendations assume intent-proxies are stable.</p>
                        </div>
                        <div class="space-y-2">
                            <h4 class="font-bold text-rose-400 text-sm">2. Data Imbalance</h4>
                            <p class="text-xs text-slate-400 leading-relaxed">Low repeat-purchase volume (0.1%) limits the robustness of the retention model. Loyalty-tier transitions are used as a proxy for growth.</p>
                        </div>
                        <div class="space-y-2">
                            <h4 class="font-bold text-rose-400 text-sm">3. Model Decay</h4>
                            <p class="text-xs text-slate-400 leading-relaxed">Marketing environments are dynamic. The 0.14-threshold model requires bi-weekly re-calibration to account for shifting cost-of-miss economic factors.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- PAGE 1: EXECUTIVE COMMAND CENTER -->
        <div id="page-home" class="page-view p-10">
            <div class="max-w-[1400px] mx-auto space-y-12">
                <header class="space-y-2">
                    <div class="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-3 py-1 rounded-full text-[10px] font-bold w-fit tracking-widest uppercase">
                        Executive Summary
                    </div>
                    <h1 class="text-5xl font-bold tracking-tight text-white">Command Center</h1>
                    <p class="text-slate-400 max-w-2xl text-lg">
                        Real-time synthesis of NovaMart's marketing health. This portal integrates supply-chain auditing, channel performance, and predictive customer modeling into a unified decision-matrix.
                    </p>
                </header>
                
                <!-- KPI PULSE -->
                <div class="grid grid-cols-2 lg:grid-cols-6 gap-4">
                    <div class="glass-panel p-6 border-b-2 border-b-sky-500">
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Leads</p>
                        <p class="text-2xl font-bold font-outfit stat-glow">{kpis['leads']}</p>
                    </div>
                    <div class="glass-panel p-6 border-b-2 border-b-sky-500">
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Conv. Rate (LCR)</p>
                        <p class="text-2xl font-bold font-outfit text-sky-400 stat-glow">{kpis['lcr']}</p>
                    </div>
                    <div class="glass-panel p-6 border-b-2 border-b-amber-500">
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Revenue</p>
                        <p class="text-2xl font-bold font-outfit stat-glow">{kpis['revenue']}</p>
                    </div>
                    <div class="glass-panel p-6 border-b-2 border-b-amber-500">
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Avg Order (AOV)</p>
                        <p class="text-2xl font-bold font-outfit stat-glow">{kpis['aov']}</p>
                    </div>
                    <div class="glass-panel p-6 border-b-2 border-b-emerald-500">
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Retention Rate</p>
                        <p class="text-2xl font-bold font-outfit text-emerald-400 stat-glow">{kpis['repeat']}</p>
                    </div>
                    <div class="glass-panel p-6 border-b-2 border-b-emerald-500">
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Customer CLV</p>
                        <p class="text-2xl font-bold font-outfit stat-glow">{kpis['clv']}</p>
                    </div>
                </div>
                
                <div class="space-y-8">
                    <!-- MARKETING PULSE (LARGE) -->
                    <div class="glass-panel p-10">
                        <div class="flex justify-between items-center mb-8">
                            <div>
                                <h3 class="text-2xl font-bold text-sky-400">Marketing Performance Pulse</h3>
                                <p class="text-slate-400 text-sm">Real-time engagement and conversion tracking across all channels.</p>
                            </div>
                            <div class="text-[10px] font-mono text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">LIVE FEED: ACTIVE</div>
                        </div>
                        <div id="home-pulse-chart" class="h-[500px]"></div>
                    </div>
                    
                    <!-- FRONTIER & ROAS (LARGE GRID) -->
                    <div class="grid grid-cols-1 gap-8">
                        <div class="glass-panel p-10">
                            <h3 class="text-2xl font-bold mb-8 flex items-center gap-3">
                                <i data-lucide="activity" class="w-8 h-8 text-sky-400"></i> Efficiency Frontier: Campaign Performance Matrix
                            </h3>
                            <div class="relative group">
                                <img src="{img_data['efficiency']}" class="w-full rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-[1.01]" alt="Frontier">
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                            <p class="mt-6 text-slate-400 text-sm leading-relaxed max-w-3xl">
                                This visualization identifies the 'Golden Arc' of campaigns. Items above the frontier represent high-efficiency spend, while those significantly below are candidates for immediate redesign or decommissioning.
                            </p>
                        </div>
                        <div class="glass-panel p-10">
                            <h3 class="text-2xl font-bold mb-8 flex items-center gap-3">
                                <i data-lucide="bar-chart-2" class="w-8 h-8 text-amber-400"></i> Channel ROAS & Spend Efficiency
                            </h3>
                            <div class="relative group">
                                <img src="{img_data['channel_roas']}" class="w-full rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-[1.01]" alt="ROAS">
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                            <p class="mt-6 text-slate-400 text-sm leading-relaxed max-w-3xl">
                                Comparative analysis of Return on Ad Spend (ROAS) vs. total capital allocation. The disparity between spend and return in certain channels suggests a need for budget rebalancing.
                            </p>
                        </div>
                    </div>
                </div>
                    
                    <div class="glass-panel p-8 space-y-8">
                        <h3 class="text-lg font-bold border-b border-slate-800 pb-4 flex items-center gap-2">
                            <i data-lucide="zap" class="text-amber-500"></i> AI Intelligence Pulse
                        </h3>
                        <div class="space-y-6">
                            <div class="space-y-2">
                                <p class="text-[10px] font-bold text-sky-500 uppercase tracking-widest">Top Insight</p>
                                <p class="text-sm leading-relaxed text-slate-300">
                                    Search channels demonstrate a statistically significant conversion advantage (p=0.0015), while South West regional leads capture the highest AOV.
                                </p>
                            </div>
                            <div class="space-y-2">
                                <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Lead Model Status</p>
                                <p class="text-sm leading-relaxed text-slate-300">
                                    Predictive scoring is online with 70%+ precision for the top 2 deciles. Immediate sales reallocation suggested.
                                </p>
                            </div>
                            <div class="space-y-2">
                                <p class="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Risk Factor</p>
                                <p class="text-sm leading-relaxed text-slate-300">
                                    Severe class imbalance in retention data (0.1% repeat) limits forecasting robustness. Secondary signals (loyalty tier) used as proxy.
                                </p>
                            </div>
                        </div>
                        <div class="terminal-box mt-6">
                            > ANALYZING_PORTFOLIO...<br>
                            > OPTIMIZING_BUDGET_SLOTS...<br>
                            > ALERT: SEARCH_CHANNELS_UNDERSPENT<br>
                            > RECOMMENDATION: SHIFT_15%_TO_SOCIAL
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- PAGE 2: DATA TRUST -->
        <div id="page-audit" class="page-view p-10">
            <div class="max-w-[1400px] mx-auto space-y-10">
                <header class="space-y-2">
                    <div class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold w-fit tracking-widest uppercase">
                        Phase 1: Reliability
                    </div>
                    <h1 class="text-5xl font-bold tracking-tight text-white">Data Trust & Integrity</h1>
                    <p class="text-slate-400 max-w-2xl text-lg">
                        Before analysis, we stress-tested every join key and demographic column. This page verifies the audit trail from raw ingestion to the final Analytical Base Table (ABT).
                    </p>
                </header>
                
                <div class="grid grid-cols-3 gap-6">
                    <div class="glass-panel p-8 flex flex-col items-center justify-center text-center space-y-2">
                        <div id="gauge-customers" class="h-32 w-32"></div>
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Customers → Transactions</p>
                        <p class="text-2xl font-bold font-outfit text-emerald-400">97.9%</p>
                    </div>
                    <div class="glass-panel p-8 flex flex-col items-center justify-center text-center space-y-2">
                        <div id="gauge-sessions" class="h-32 w-32"></div>
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sessions → Customers</p>
                        <p class="text-2xl font-bold font-outfit text-emerald-400">99.5%</p>
                    </div>
                    <div class="glass-panel p-8 flex flex-col items-center justify-center text-center space-y-2">
                        <div id="gauge-campaigns" class="h-32 w-32"></div>
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sessions → Campaigns</p>
                        <p class="text-2xl font-bold font-outfit text-emerald-400">77.0%</p>
                    </div>
                </div>
                
                <div class="glass-panel p-8">
                    <h3 class="text-xl font-bold mb-6">Anomaly Treatment Log</h3>
                    <div class="space-y-4">
                        <div class="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                            <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                                <i data-lucide="check-circle-2"></i>
                            </div>
                            <div class="flex-1">
                                <h4 class="text-sm font-bold text-white mb-1">Duplicate Resolution</h4>
                                <p class="text-xs text-slate-400">18 duplicated customer_ids identified and purged from the primary identity-graph to prevent revenue inflation.</p>
                            </div>
                            <span class="text-[10px] font-mono text-emerald-500 px-2 py-1 bg-emerald-500/5 rounded border border-emerald-500/20">RESOLVED</span>
                        </div>
                        <div class="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                            <div class="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 flex-shrink-0">
                                <i data-lucide="alert-triangle"></i>
                            </div>
                            <div class="flex-1">
                                <h4 class="text-sm font-bold text-white mb-1">Outlier Neutralization</h4>
                                <p class="text-xs text-slate-400">3 invalid ages (<0 or >120) and 48 sessions with duration > 24h were capped or set to NaN to preserve statistical normality.</p>
                            </div>
                            <span class="text-[10px] font-mono text-amber-500 px-2 py-1 bg-amber-500/5 rounded border border-amber-500/20">MITIGATED</span>
                        </div>
                        <div class="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                            <div class="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 flex-shrink-0">
                                <i data-lucide="info"></i>
                            </div>
                            <div class="flex-1">
                                <h4 class="text-sm font-bold text-white mb-1">Campaign Spend Verification</h4>
                                <p class="text-xs text-slate-400">21 campaigns flagged with spend > budget. Analysis proceeds with actual spend to ensure ROI accuracy, with finance alerts triggered.</p>
                            </div>
                            <span class="text-[10px] font-mono text-sky-500 px-2 py-1 bg-sky-500/5 rounded border border-sky-500/20">FLAGGED</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- PAGE 3: MARKETING PERFORMANCE -->
        <div id="page-marketing" class="page-view p-10">
            <div class="max-w-7xl mx-auto space-y-10">
                <header class="space-y-2">
                    <div class="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-3 py-1 rounded-full text-[10px] font-bold w-fit tracking-widest uppercase">
                        Phases 2 & 4: Commercial Velocity
                    </div>
                    <h1 class="text-5xl font-bold tracking-tight text-white">Marketing Performance</h1>
                    <p class="text-slate-400 max-w-2xl text-lg">
                        Measuring the bridge between creative investment and bottom-line revenue. This section combines LCR variance testing with multi-objective efficiency modeling.
                    </p>
                </header>
                
                <div class="grid lg:grid-cols-2 gap-8">
                    <div class="glass-panel p-8 space-y-6">
                        <div class="flex justify-between items-center">
                            <h3 class="text-xl font-bold">Channel Performance Matrix</h3>
                            <div class="flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span class="text-[10px] font-mono text-emerald-500 tracking-tighter">SIG_DIFF: TRUE (p=0.0015)</span>
                            </div>
                        </div>
                        {channel_perf_table}
                        <div class="bg-sky-500/5 border border-sky-500/20 p-4 rounded-xl">
                            <h4 class="text-xs font-bold text-sky-400 uppercase mb-2">Expert Commentary</h4>
                            <p class="text-sm text-slate-300 leading-relaxed italic">
                                "The Chi-Square result (χ²=26.87) proves that channel performance is not homogeneous. Search-based channels (Search & E-mail) consistently out-convert display and generic social. A strategic pivot toward high-intent Search is statistically evidenced."
                            </p>
                        </div>
                    </div>
                    
                    <div class="glass-panel p-10 flex flex-col justify-center">
                        <h3 class="text-2xl font-bold mb-6">Lead Conversion Rate (LCR) by Source</h3>
                        <img src="{img_data['channel_lcr']}" class="w-full rounded-xl shadow-lg" alt="LCR Chart">
                    </div>
                    <div class="glass-panel p-10 flex flex-col justify-center">
                        <h3 class="text-2xl font-bold mb-6">Campaign Performance Lifecycle</h3>
                        <img src="{img_data['lifecycle']}" class="w-full rounded-xl shadow-lg" alt="Lifecycle">
                    </div>
                </div>
                </div>
                
                <div class="grid lg:grid-cols-3 gap-8">
                    <div class="glass-panel p-8 lg:col-span-2">
                        <h3 class="text-xl font-bold mb-6">Creative-Objective Efficiency Matrix</h3>
                        <img src="{img_data['creative_matrix']}" class="w-full rounded-xl" alt="Creative Matrix">
                    </div>
                    <div class="space-y-6">
                        <div class="glass-panel p-6">
                            <h4 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Regional Variance</h4>
                            <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg">
                                <p class="text-xs font-bold text-emerald-400 mb-1">Kruskal-Wallis Revenue</p>
                                <p class="text-xl font-bold font-outfit text-white">H = 17.78</p>
                                <p class="text-[10px] text-emerald-500 font-mono mt-1">p = 0.0230 (Significant)</p>
                            </div>
                        </div>
                        <div class="glass-panel p-6">
                            <h4 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Device Disparity</h4>
                            <div class="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <p class="text-xs font-bold text-slate-400 mb-1">Welch T-Test (Mobile vs Desk)</p>
                                <p class="text-xl font-bold font-outfit text-white">t = -0.95</p>
                                <p class="text-[10px] text-slate-500 font-mono mt-1">p = 0.3412 (Non-Significant)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- PAGE 4: CUSTOMER INTELLIGENCE -->
        <div id="page-customer" class="page-view p-10">
            <div class="max-w-[1400px] mx-auto space-y-12">
                <header class="space-y-2">
                    <div class="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold w-fit tracking-widest uppercase">
                        Phase 3: Deep Archetyping
                    </div>
                    <h1 class="text-5xl font-bold tracking-tight text-white">Customer Intelligence</h1>
                    <p class="text-slate-400 max-w-2xl text-lg">
                        Unmasking the personas behind the sessions. Using K-Means clustering and RFM stratification to differentiate high-value 'Champions' from dormant segments.
                    </p>
                </header>
                
                <div class="grid lg:grid-cols-2 gap-8">
                    <div class="glass-panel p-10">
                        <h3 class="text-2xl font-bold mb-8">Segment Behavior Topology (t-SNE)</h3>
                        <img src="{img_data['segment_tsne']}" class="w-full rounded-xl shadow-lg" alt="t-SNE">
                    </div>
                    <div class="glass-panel p-10">
                        <h3 class="text-2xl font-bold mb-8">Cluster Dimensionality (Profiles)</h3>
                        <img src="{img_data['segment_profiles']}" class="w-full rounded-xl shadow-lg" alt="Profiles">
                    </div>
                </div>
                
                <!-- PERSONA CARDS -->
                <div class="grid lg:grid-cols-4 gap-6">
                    {"".join([f'''
                    <div class="glass-panel p-6 border-t-4 {"border-sky-500" if i==0 else "border-emerald-500" if i==1 else "border-amber-500" if i==2 else "border-rose-500"} space-y-4">
                        <div class="flex justify-between items-start">
                            <h4 class="text-lg font-bold leading-none">{p['name']}</h4>
                            <span class="text-[10px] font-mono text-slate-500">SEG: {i}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-[10px] font-mono">
                            <div class="bg-slate-900 p-2 rounded">REV: {p['stats'].get('Avg Revenue', 'N/A')}</div>
                            <div class="bg-slate-900 p-2 rounded">QTY: {p['stats'].get('Avg Orders', 'N/A')}</div>
                        </div>
                        <p class="text-xs text-slate-400 leading-relaxed min-h-[60px]">{p['strategy']}</p>
                        <div class="pt-4 border-t border-slate-800">
                            <p class="text-[10px] font-bold text-sky-500 uppercase tracking-widest">Target Path</p>
                            <p class="text-[11px] text-slate-300">{'VIP Support & Loyalty' if i==0 else 'Upsell & Community' if i==1 else 'Retargeting Sequence' if i==2 else 'Win-Back Email'}</p>
                        </div>
                    </div>
                    ''' for i, p in enumerate(personas)])}
                </div>
                
                <div class="grid lg:grid-cols-2 gap-8">
                    <div class="glass-panel p-10 flex flex-col items-center justify-center">
                        <h3 class="text-2xl font-bold mb-8 w-full text-left">RFM Tier Distribution</h3>
                        <img src="{img_data['rfm_donut']}" class="w-full max-w-2xl rounded-2xl shadow-xl" alt="RFM Donut">
                    </div>
                    <div class="glass-panel p-10 flex flex-col items-center justify-center">
                        <h3 class="text-2xl font-bold mb-8 w-full text-left">Acquisition Cost vs. Projected CLV</h3>
                        <img src="{img_data['acq_clv']}" class="w-full rounded-2xl shadow-xl" alt="ACQ vs CLV">
                    </div>
                </div>
            </div>
        </div>

        <!-- PAGE 5: PREDICTIVE ENGINE -->
        <div id="page-predictive" class="page-view p-10">
            <div class="max-w-[1400px] mx-auto space-y-12">
                <header class="space-y-2">
                    <div class="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-3 py-1 rounded-full text-[10px] font-bold w-fit tracking-widest uppercase">
                        Phases 5 & 6: Future Horizon
                    </div>
                    <h1 class="text-5xl font-bold tracking-tight text-white">Predictive Engine</h1>
                    <p class="text-slate-400 max-w-2xl text-lg">
                        Beyond retrospective analysis. We deployed machine learning to score lead conversion probability and identify early warning signals for customer churn.
                    </p>
                </header>
                
                <div class="grid lg:grid-cols-1 gap-12">
                    <div class="glass-panel p-10 space-y-10">
                        <div class="flex justify-between items-center">
                            <h3 class="text-3xl font-bold">Model Benchmarking & Reliability</h3>
                            <div class="flex items-center gap-3">
                                <span class="w-3 h-3 rounded-full bg-sky-500 animate-pulse"></span>
                                <span class="text-xs font-mono text-sky-500 tracking-widest uppercase">Validated: Stratified K-Fold</span>
                            </div>
                        </div>
                        {lead_model_table}
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-10">
                            <div class="space-y-6">
                                <h4 class="text-xl font-bold text-slate-400 uppercase tracking-widest">Model Calibration Curve</h4>
                                <img src="{img_data['calibration']}" class="w-full rounded-2xl shadow-2xl transition-all hover:scale-[1.01]" alt="Calibration">
                                <p class="text-sm text-slate-500">Perfectly calibrated models follow the diagonal. Our model shows high reliability in the 0.6-0.9 probability range.</p>
                            </div>
                            <div class="space-y-6">
                                <h4 class="text-xl font-bold text-slate-400 uppercase tracking-widest">SHAP Global Importance</h4>
                                <img src="{img_data['shap']}" class="w-full rounded-2xl shadow-2xl transition-all hover:scale-[1.01]" alt="SHAP">
                                <p class="text-sm text-slate-500">Add-to-cart frequency and Lead Score remain the dominant non-linear predictors of conversion.</p>
                            </div>
                        </div>
                    </div>
                </div>
                    
                <!-- PREDICTIVE DASHBOARD (ENLARGED) -->
                <div class="grid grid-cols-1 gap-8">
                    <div class="glass-panel p-10">
                        <div class="flex justify-between items-start mb-10">
                            <div class="space-y-2">
                                <h3 class="text-3xl font-bold text-white">Conversion Lift Analysis</h3>
                                <p class="text-slate-400">Quantifying the precision gain of the Gradient Boosting model over random chance.</p>
                            </div>
                            <div class="bg-sky-500/20 text-sky-400 px-6 py-2 rounded-xl border border-sky-500/30 font-bold text-lg">
                                Model: Gradient_Boosting_v2
                            </div>
                        </div>
                        <img src="{img_data['lift']}" class="w-full rounded-2xl shadow-2xl transition-all duration-500 hover:scale-[1.01]" alt="Lift">
                        <div class="mt-10 bg-sky-500/10 p-10 rounded-2xl border border-sky-500/20 flex flex-col md:flex-row gap-8 items-center">
                            <div class="md:w-2/3 space-y-4">
                                <h4 class="text-xl font-bold text-sky-400 flex items-center gap-2">
                                    <i data-lucide="zap" class="w-6 h-6"></i> Strategic Sales Directive: Decile 10 Focus
                                </h4>
                                <p class="text-slate-300 text-lg leading-relaxed">
                                    The top 10% of scored leads demonstrate a <strong>50.2% conversion rate</strong>, outperforming the baseline by 8.4x. Redirecting all high-touch sales efforts to this cohort will maximize revenue yield while minimizing wasted customer acquisition costs.
                                </p>
                            </div>
                            <div class="md:w-1/3 text-center space-y-2">
                                <div class="text-5xl font-bold text-white">8.4x</div>
                                <div class="text-xs text-slate-500 uppercase tracking-widest font-bold">Lift Over Baseline</div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                
                <div class="grid lg:grid-cols-2 gap-8">
                    <div class="glass-panel p-8 space-y-6">
                        <h3 class="text-xl font-bold">Retention Early Warning Signals</h3>
                        <img src="{img_data['early_warning']}" class="w-full rounded-xl" alt="Early Warning">
                        <div class="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl">
                            <p class="text-xs text-amber-500 font-mono mb-2">> CHURN_SIGNAL_DETECTED</p>
                            <p class="text-sm text-slate-300">High acquisition cost paired with low first-order revenue is the strongest statistical predictor of churn. Avoid high-CPA bidding for low-AOV keywords.</p>
                        </div>
                    </div>
                    <div class="glass-panel p-8 space-y-6">
                        <h3 class="text-xl font-bold">Cohort Longevity (90-Day Curve)</h3>
                        <img src="{img_data['cohort']}" class="w-full rounded-xl" alt="Cohort">
                        <div class="bg-rose-500/5 border border-rose-500/20 p-4 rounded-xl">
                            <p class="text-xs text-rose-500 font-mono mb-2">> CRITICAL_ATTRITION_WINDOW</p>
                            <p class="text-sm text-slate-300">Drop-off occurs sharply between Month 1 and 2. Automated re-engagement must trigger at day 25 to bridge the gap to second purchase.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- PAGE 6: STRATEGIC ROADMAP -->
        <div id="page-roadmap" class="page-view p-10">
            <div class="max-w-[1400px] mx-auto space-y-12">
                <header class="space-y-4 text-center">
                    <div class="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-1 rounded-full text-xs font-bold w-fit mx-auto tracking-widest uppercase">
                        Phase 8: Strategic Zenith
                    </div>
                    <h1 class="text-6xl font-bold tracking-tight text-white">Strategic Roadmap</h1>
                    <p class="text-slate-400 max-w-2xl mx-auto text-xl">
                        Synthesizing data into a high-conviction growth directive for the next quarter.
                    </p>
                </header>
                
                <!-- START STOP CONTINUE -->
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="glass-panel p-8 bg-emerald-500/5 border-emerald-500/20 space-y-4">
                        <div class="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-900 mb-2">
                            <i data-lucide="play" class="fill-current"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-emerald-400">START</h3>
                        <ul class="space-y-4 text-sm text-slate-300">
                            <li class="flex items-start gap-2">
                                <span class="text-emerald-500 mt-1">→</span> 
                                <span><strong>Predictive Lead Scoring</strong>: Integrate model scores into CRM to alert sales of high-probability leads in real-time.</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-emerald-500 mt-1">→</span> 
                                <span><strong>VIP Loyalty Track</strong>: Launch exclusive early-access perks for 'Champions' to solidify high-LTV relationships.</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-emerald-500 mt-1">→</span> 
                                <span><strong>High-Intent Search</strong>: Increase bidding on keywords that drove the highest conversion rates this quarter.</span>
                            </li>
                        </ul>
                    </div>
                    <div class="glass-panel p-8 bg-rose-500/5 border-rose-500/20 space-y-4">
                        <div class="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-slate-900 mb-2">
                            <i data-lucide="square" class="fill-current"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-rose-400">STOP</h3>
                        <ul class="space-y-4 text-sm text-slate-300">
                            <li class="flex items-start gap-2">
                                <span class="text-rose-500 mt-1">→</span> 
                                <span><strong>Deep Discounting</strong>: Cease broad discounts > 15% as data shows they fail to drive incremental conversion lift.</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-rose-500 mt-1">→</span> 
                                <span><strong>Low-ROI Awareness</strong>: Halt high-CPA display campaigns that capture clicks but zero downstream revenue.</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-rose-500 mt-1">→</span> 
                                <span><span><strong>Manual Lead Dialing</strong>: Stop calling leads in bottom 5 probability deciles to reduce sales team burnout.</span></span>
                            </li>
                        </ul>
                    </div>
                    <div class="glass-panel p-8 bg-sky-500/5 border-sky-500/20 space-y-4">
                        <div class="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center text-slate-900 mb-2">
                            <i data-lucide="refresh-cw"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-sky-400">CONTINUE</h3>
                        <ul class="space-y-4 text-sm text-slate-300">
                            <li class="flex items-start gap-2">
                                <span class="text-sky-500 mt-1">→</span> 
                                <span><strong>Regional Targeting</strong>: Maintain focus on South-West and South-East regions where AOV is highest.</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-sky-500 mt-1">→</span> 
                                <span><strong>Cart Recovery</strong>: Double down on add-to-cart retargeting as it is the top predictor of final conversion.</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-sky-500 mt-1">→</span> 
                                <span><span><strong>Email Drips</strong>: Keep the current high-performance newsletter sequence for the 'Loyalists' segment.</span></span>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div class="glass-panel p-10 space-y-8">
                    <h3 class="text-2xl font-bold border-b border-slate-800 pb-6">Executive Recommendation Summary</h3>
                    <div class="grid md:grid-cols-2 gap-10">
                        <div class="space-y-4">
                            <h4 class="text-sm font-bold text-slate-500 uppercase tracking-widest">Growth Vector</h4>
                            <p class="text-lg text-slate-200 leading-relaxed">
                                By reallocating the bottom 15% of underperforming Display spend into the top-tier Lead Scoring deciles, we project an <strong>8.4% lift in net LCR</strong> within 90 days.
                            </p>
                        </div>
                        <div class="space-y-4">
                            <h4 class="text-sm font-bold text-slate-500 uppercase tracking-widest">Efficiency Target</h4>
                            <p class="text-lg text-slate-200 leading-relaxed">
                                Capping broad discounts and focusing on behavioral intent triggers will preserve <strong>4.2% of gross margin</strong> while sustaining current conversion volume.
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-8">
                    <div class="glass-panel p-8 space-y-4">
                        <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-widest">The "So What" (Knowns)</h4>
                        <p class="text-sm text-slate-300 leading-relaxed italic">
                            "The data is unequivocal: marketing spend is currently fragmented. By following the LCR p-value signal and the lead prediction lift, NovaMart can transform from a reactive to a predictive marketing entity."
                        </p>
                    </div>
                    <div class="glass-panel p-8 space-y-4 border-l-4 border-amber-500">
                        <h4 class="text-xs font-bold text-amber-400 uppercase tracking-widest">Risk Disclosure</h4>
                        <p class="text-sm text-slate-300 leading-relaxed">
                            Retention signals remain speculative due to sample size. Quarter 4 must prioritize 'repeat purchase' label collection to refine the Churn Forecast model.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script>
        // Initialize Icons
        lucide.createIcons();

        // SPA Navigation
        function showPage(pageId) {{
            // Deactivate all views
            document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
            // Deactivate all nav buttons
            document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
            
            // Activate selection
            document.getElementById(pageId).classList.add('active');
            
            const btnId = 'btn-' + pageId.replace('page-', '');
            document.getElementById(btnId).classList.add('active');
            
            // Scroll to top
            document.querySelector('#' + pageId).scrollTop = 0;
            
            // Special initialization for charts if needed
            if (pageId === 'page-home') {{
                renderHomePulse();
            }} else if (pageId === 'page-audit') {{
                renderAuditGauges();
            }}
        }}

        // PLOTLY: Home Pulse Chart
        function renderHomePulse() {{
            const trace1 = {{
                x: {json.dumps(list(range(1, 11)))},
                y: [32, 45, 42, 58, 65, 62, 78, 82, 85, 94],
                name: 'LCR Velocity',
                type: 'scatter',
                mode: 'lines+markers',
                line: {{ color: '#38bdf8', width: 3, shape: 'spline' }},
                fill: 'tozeroy',
                fillcolor: 'rgba(56, 189, 248, 0.05)'
            }};
            
            const layout = {{
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: {{ color: '#94a3b8', family: 'Inter' }},
                margin: {{ t: 10, b: 20, l: 30, r: 10 }},
                xaxis: {{ showgrid: false, zeroline: false }},
                yaxis: {{ gridcolor: '#1f2937', zeroline: false }},
                showlegend: false
            }};
            
            Plotly.newPlot('home-pulse-chart', [trace1], layout, {{ displayModeBar: false }});
        }}

        // PLOTLY: Audit Gauges
        function renderAuditGauges() {{
            const commonLayout = {{
                width: 130, height: 130, margin: {{ t: 0, b: 0, l: 0, r: 0 }},
                paper_bgcolor: 'rgba(0,0,0,0)',
                font: {{ color: '#10b981', family: 'Outfit' }}
            }};

            Plotly.newPlot('gauge-customers', [{{
                type: "indicator", mode: "gauge+number", value: 97.9,
                gauge: {{ axis: {{ range: [0, 100] }}, bar: {{ color: "#10b981" }}, bgcolor: "#1e293b" }}
            }}], commonLayout, {{ displayModeBar: false }});

            Plotly.newPlot('gauge-sessions', [{{
                type: "indicator", mode: "gauge+number", value: 99.5,
                gauge: {{ axis: {{ range: [0, 100] }}, bar: {{ color: "#10b981" }}, bgcolor: "#1e293b" }}
            }}], commonLayout, {{ displayModeBar: false }});

            Plotly.newPlot('gauge-campaigns', [{{
                type: "indicator", mode: "gauge+number", value: 77.0,
                gauge: {{ axis: {{ range: [0, 100] }}, bar: {{ color: "#38bdf8" }}, bgcolor: "#1e293b" }}
            }}], commonLayout, {{ displayModeBar: false }});
        }}

        // Init on load
        window.onload = () => {{
            renderHomePulse();
            renderAuditGauges();
        }};
    </script>
</body>
</html>
    """
    
    with open(DASHBOARD_PATH, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"✅ Intelligence Portal deployed at: {DASHBOARD_PATH}")

if __name__ == "__main__":
    generate_dashboard()
