# NovaMart Marketing Analytics Capstone

This project contains the complete data pipeline and analysis for the NovaMart Marketing Analytics Capstone.

## Project Structure

```
bads_project2/
├── data/                         # Raw input files (unchanged)
├── outputs/                      # Generated reports, charts, and final presentations
├── venv/                         # Python virtual environment (if created)
├── 01_data_audit.py              # Phase 1: Data Audit & Analytical Base Table
├── 02_descriptive_stats.py       # Phase 2: Descriptive & Statistical Diagnosis
├── 03_segmentation.py            # Phase 3: Customer Segmentation
├── 04_campaign_grouping.py       # Phase 4: Campaign & Channel Grouping
├── 05_lead_prediction.py         # Phase 5: Lead Conversion Prediction
├── 06_retention_prediction.py    # Phase 6: Customer Retention Prediction
├── 07_executive_dashboard.py     # Phase 7: Executive Reporting Layer
├── 08_cmo_memo.py                # Phase 8: Final CMO Memo
├── main.py                       # Master runner
├── requirements.txt              # Pinned dependencies
└── README.md                     # Project overview and how to reproduce
```

## How to Reproduce

1. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the entire pipeline:
   ```bash
   python main.py
   ```

3. Run a specific phase (e.g., Phase 1):
   ```bash
   python main.py --phase 1
   ```

## Output Descriptions

All outputs are saved to the `outputs/` directory.
- `analytical_base_table.csv`: The clean, combined dataset used for modeling.
- `data_audit_note.md`: Full audit of data quality issues and treatments.
- `descriptive_report.md`: Statistical findings and tests.
- `segmentation_report.md` & `persona_cards.md`: K-Means customer segmentation profiles.
- `campaign_grouping_report.md`: Campaign clusters and efficiency metrics.
- `lead_prediction_report.md`: Gradient Boosting model evaluation for lead scoring.
- `retention_prediction_report.md`: Model evaluation for repeat customer prediction.
- `executive_dashboard.html`: Offline HTML dashboard of KPIs.
- `cmo_memo.pptx`: 13-slide executive presentation covering findings and recommendations.
- `charts/`: Directory containing all visual plots (SHAP, ROI frontiers, etc.).

## Known Data Limitations
- Missing demographic information for a significant subset of customers.
- Potential tracking issues resulting in unattributed leads and unlinked sessions.
- Anomalies in campaign spend metrics (spend > budget in some cases).
- Approximated logic for 'conversion' where timestamps were conflicted.
