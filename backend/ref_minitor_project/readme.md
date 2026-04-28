# Ref Monitor – Referee Performance Analytics System

## 1. Project Overview

Ref Monitor is a data-driven backend system designed to analyse football referee behaviour and generate advanced metrics such as Ref Monitor Score, Strictness Index, Chaos Index, and fixture-level risk insights.

The system processes historical match data and produces structured outputs for use in dashboards, APIs, and analytics platforms.


## 2. Project Structure

ref-monitor/
│
├── data/                      # Raw CSV input files
│   ├── referees.csv
│   ├── fixtures.csv
│   ├── referee_assignments.csv
│   └── match_events.csv
│
├── clean/                     # Cleaned CSVs (after ingestion)
│   ├── referees_clean.csv
│   ├── fixtures_clean.csv
│   ├── referee_assignments_clean.csv
│   └── match_events_clean.csv
│
├── config/
│   └── model_config.json     # Model configuration & weights
│
├── database/
│   └── ref_monitor_poc.db    # SQLite database
│
├── scripts/
│   ├── csv_ingest.py         # CSV ingestion & validation
│   ├── ref_monitor_main.py   # Main scoring pipeline
│   └── app.py                # FastAPI backend
│
├── outputs/                  # Generated outputs
│   ├── ref_profiles.csv
│   ├── fixture_scores.csv
│   ├── top_referees.csv
│   ├── most_volatile_refs.csv
│   └── var_heavy_refs.csv
│
└── README.md


## 3. Setup Instructions

### 1. Install Dependencies

```bash
pip install pandas numpy sqlalchemy fastapi uvicorn matplotlib
```

Ensure Python 3.10+ (recommended 3.11 or above).


## 4. CSV Ingestion & Validation

Run the ingestion script:

```bash
python scripts/csv_ingest.py
```

This step:

* Reads raw CSV files from `data/`
* Validates required columns and missing values
* Cleans and standardises schema
* Saves cleaned files into `clean/`

---

## 5. Running the Scoring Pipeline

After ingestion:

```bash
python scripts/ref_monitor_main.py
```

### The pipeline performs:

* Data loading and preprocessing
* Feature engineering across multiple seasons
* Calculation of referee metrics:

  * Strictness Index
  * Decision Volatility
  * Pressure Sensitivity
  * Fixture Context Alignment
  * VAR Interaction Score
  * Referee Chaos Index
* Computation of:

  * Ref Monitor Score
  * Ref Impact Score
  * Penalty Probability
* Fixture-level predictions and risk classification

## 6. Outputs

Generated outputs are stored in the `outputs/` folder:

* **ref_profiles.csv**
  Historical referee profiles with all computed metrics

* **fixture_scores.csv**
  Fixture-level predictions including:

  * Predicted Ref Monitor Score
  * Risk Band (GREEN / AMBER / RED)
  * Impact Label

* Additional ranking files:

  * top_referees.csv
  * most_volatile_refs.csv
  * var_heavy_refs.csv


## 7. Output Metadata

All outputs include:

* `score_version` → model version used for scoring
* `generated_at` → timestamp of pipeline execution

This ensures traceability and reproducibility.

## 8. Database

SQLite database location:

database/ref_monitor_poc.db


Tables generated:

* referee_metrics
* ref_profiles
* fixture_scores


## 9. Running the API

Start the FastAPI server:

```bash
uvicorn scripts.app:app --reload
```

### Available Endpoints

* `/health` → API status check
* `/run_pipeline?api_key=secret123` → trigger pipeline (protected)
* `/ref_profiles` → limited referee data
* `/ref_profile?ref_id=...` → specific referee
* `/fixture_predictions` → limited fixture data
* `/fixture_score?fixture_id=...` → specific fixture


## 10. Example Database Queries

import sqlite3
import pandas as pd

conn = sqlite3.connect("database/ref_monitor_poc.db")

fixture_scores = pd.read_sql("SELECT * FROM fixture_scores", conn)
referee_metrics = pd.read_sql("SELECT * FROM referee_metrics", conn)

print("\nTop 5 Fixture Scores")
print(fixture_scores.sort_values("predicted_ref_monitor_score", ascending=False).head())

print("\nTop 5 Referees")
print(referee_metrics.sort_values("ref_monitor_score", ascending=False).head())

print("\nRisk Band Distribution")
print(fixture_scores["risk_band"].value_counts())

conn.close()


## 11. Key Design Principles

* All scoring logic is handled server-side
* API exposes only derived metrics (not raw datasets)
* No full dataset endpoints are exposed
* Outputs are versioned and timestamped
* Pipeline is deterministic and reproducible


## 12. Future Improvements

* Frontend dashboard (React + Tailwind)
* Advanced visualisations (charts, trends)
* Team vs Referee analysis
* Cloud deployment (Cloudflare Pages / Workers)
* API authentication and rate limiting enhancements


## 13. Notes

* Always run ingestion before pipeline on new datasets
* Use full datasets for accurate scoring
* Avoid modifying output CSVs manually
* Configuration is controlled via `config/model_config.json`


## 14. Ownership

Ref Monitor scoring methodology and derived metrics are proprietary to the project and are intended for internal analysis and controlled distribution.
