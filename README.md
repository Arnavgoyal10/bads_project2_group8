# NovaMart Marketing Intelligence Portal
**Undergraduate Data Science Capstone | Final Submission**

This repository contains the complete analytical pipeline and executive reporting layer for the NovaMart Marketing Analytics project. The project transitions from raw, noisy retail data to a defensible, board-ready strategic roadmap.

## 🚀 The Primary Deliverable
For an immediate review of the analytical findings, strategic recommendations, and statistical rigor, open the following file in any modern web browser:

👉 **[executive_dashboard.html](executive_dashboard.html)**

This interactive portal contains:
*   **Scope H**: Final Strategic Decision Memo to the CMO.
*   **Scope G**: Executive Command Center (KPI Pulse).
*   **Scope E**: Predictive Lead Scoring Engine.
*   **Scope D**: Marketing Performance & Channel Analysis.
*   **Scope C & F**: Customer Intelligence & Retention Analytics.
*   **Scope B**: Statistical Diagnosis & Variance Testing.
*   **Scope A**: Data Trust Audit & Analytical Base Table (ABT).
*   **Analytical Foundation**: Comprehensive Statistical Appendix.

---

## 📂 Project Architecture

```
bads_project2/
├── scripts/                      # Analysis & Pipeline Scripts
│   ├── 01_data_audit.py          # Data Audit & ABT Foundation (Scope A)
│   ├── 02_descriptive_analysis.py # Statistical Diagnosis & Benchmarking (Scope B)
│   ├── 03_segmentation.py        # Customer Intelligence & Personas (Scope C/F)
│   ├── 04_lead_prediction.py     # ML Engine: Lead Conversion Scoring (Scope E)
│   ├── 05_campaign_grouping.py   # Marketing Performance Analytics (Scope D)
│   ├── 07_executive_dashboard.py # Reporting Layer Synthesis
│   └── 08_additional_analysis.py # Statistical Appendix Generation
├── outputs/                      # Analytical Artifacts
│   ├── csv/                      # Cleaned Data & ABT (Required Scope A)
│   ├── md/                       # Detailed Methodology & Audit Reports
│   └── png/                      # High-Resolution Visualization Exports
├── executive_dashboard.html      # MASTER DELIVERABLE (Interactive Report)
├── data/                         # Raw Input Data (Customers, Sessions, Trans, Campaigns)
├── main.py                       # Master Pipeline Orchestrator
├── requirements.txt              # Project Dependencies
└── README.md                     # Submission Overview
```

---

## 🛠 How to Reproduce the Analysis

1. **Environment Setup**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Full Pipeline**:
   Execute the master script to process raw data, generate the ABT, run models, and rebuild the dashboard:
   ```bash
   python main.py
   ```

3. **Verify Data Integrity**:
   Check `outputs/md/data_audit_note.md` for a complete log of anomaly treatment (duplicates, outliers, and malformed currency).

---

## 📊 Analytical Highlights
*   **Data Trust**: 98%+ join integrity achieved after purging malformed currency strings and purged identity duplicates.
*   **Predictive Lift**: The Gradient Boosting model achieved an **8.4x lift** over random selection for lead prioritization.
*   **Causal Insight**: Causal inference (IPTW) revealed that discounts have **zero impact** on 'Champion' customer conversion, allowing for immediate margin recovery.
*   **Efficiency Frontier**: Identified **$22k in budget leakage** in Northwest awareness channels.

---
**Lead Architect:** Arnav Goyal
**Course:** Data Science Capstone | NovaMart Intelligence Portal
