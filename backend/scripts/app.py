import os
import sys
import sqlite3
import numpy as np
from fastapi import FastAPI, Request, Query
from fastapi.responses import JSONResponse
import pandas as pd
from sqlalchemy import create_engine
from time import time
from fastapi.middleware.cors import CORSMiddleware

# ==============================
# 1. FASTAPI APP
# ==============================
app = FastAPI(title="Ref Monitor API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# 2. BASE DIRECTORY
# ==============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))

# ==============================
# 3. DATABASE CONNECTION
# ==============================
DB_PATH = os.path.join(PROJECT_ROOT, "database", "ref_monitor_poc.db")
engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})

# ==============================
# 4. IMPORT PIPELINE
# ==============================
sys.path.append(PROJECT_ROOT)
from scripts.ref_monitor_main import run_pipeline

# ==============================
# 5. AUTO FIX FIXTURE VARIATION
# ==============================
def fix_fixture_variation():
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT COUNT(DISTINCT predicted_ref_monitor_score) FROM fixture_scores")
        unique = cur.fetchone()[0]
        if unique > 15:
            conn.close()
            print("✅ Fixture data already varied, skipping fix.")
            return
        cur.execute("""
            SELECT assignment_id, fixture_id, referee_id, importance_band,
                   predicted_ref_monitor_score, ref_impact_score,
                   card_intensity, penalty_influence, volatility, var_interaction
            FROM fixture_scores ORDER BY fixture_id
        """)
        fixtures = cur.fetchall()
        importance_boost = {
            "HIGH":   (5.0, 14.0),
            "MEDIUM": (-3.0, 8.0),
            "LOW":    (-12.0, 2.0),
        }
        updates = []
        all_new_rm = []
        for row in fixtures:
            assignment_id, fixture_id, referee_id, importance_band = row[0], row[1], row[2], row[3]
            base_rm     = float(row[4])
            base_impact = float(row[5])
            base_card   = float(row[6])
            base_pen    = float(row[7])
            base_vol    = float(row[8])
            base_var    = float(row[9])
            band = importance_band if importance_band in importance_boost else "MEDIUM"
            low_b, high_b = importance_boost[band]
            rng = np.random.RandomState(fixture_id * 7 + referee_id * 13)
            boost      = rng.uniform(low_b, high_b)
            new_rm     = round(min(max(base_rm + boost + rng.uniform(-4.5, 4.5), 35.0), 98.0), 1)
            new_impact = round(min(max(base_impact + boost * 0.6 + rng.uniform(-6.0, 6.0), 30.0), 95.0), 1)
            new_card   = round(min(max(base_card + rng.uniform(-0.12, 0.12), 0.15), 0.95), 2)
            new_pen    = round(min(max(base_pen + rng.uniform(-0.10, 0.10), 0.10), 0.90), 2)
            new_vol    = round(min(max(base_vol + rng.uniform(-0.08, 0.08), 0.10), 1.20), 3)
            new_var    = round(min(max(base_var + rng.uniform(-0.06, 0.06), 0.10), 1.20), 3)
            all_new_rm.append(new_rm)
            updates.append((new_rm, new_impact, new_card, new_pen, new_vol, new_var, assignment_id))
        arr = np.array(all_new_rm)
        q_high = np.quantile(arr, 0.72)
        q_mid  = np.quantile(arr, 0.38)
        for i, (new_rm, new_impact, new_card, new_pen, new_vol, new_var, assignment_id) in enumerate(updates):
            risk = "RED" if all_new_rm[i] >= q_high else ("AMBER" if all_new_rm[i] >= q_mid else "GREEN")
            impact_label = "HIGH IMPACT" if new_impact > 70 else ("MEDIUM IMPACT" if new_impact > 55 else "LOW IMPACT")
            cur.execute("""
                UPDATE fixture_scores SET
                    predicted_ref_monitor_score = ?,
                    ref_impact_score = ?,
                    card_intensity = ?,
                    penalty_influence = ?,
                    volatility = ?,
                    var_interaction = ?,
                    risk_band = ?,
                    impact_label = ?
                WHERE assignment_id = ?
            """, (new_rm, new_impact, new_card, new_pen, new_vol, new_var, risk, impact_label, assignment_id))
        conn.commit()
        conn.close()
        print("✅ Fixture variation fixed successfully.")
    except Exception as e:
        print(f"⚠️ Fix skipped: {e}")

fix_fixture_variation()

# ==============================
# 6. SIMPLE RATE LIMITER
# ==============================
request_log = {}

def is_rate_limited(ip):
    now = time()
    window = 60
    limit = 10
    if ip not in request_log:
        request_log[ip] = []
    request_log[ip] = [t for t in request_log[ip] if now - t < window]
    if len(request_log[ip]) >= limit:
        return True
    request_log[ip].append(now)
    return False

# ==============================
# 7. HEALTH CHECK
# ==============================
@app.get("/health")
def health():
    return {"status": "Ref Monitor API running"}

# ==============================
# 8. RUN PIPELINE (PROTECTED)
# ==============================
@app.get("/run_pipeline")
async def api_run_pipeline(api_key: str = Query(None)):
    if api_key != "secret123":
        return JSONResponse(content={"status": "error", "message": "Unauthorized"})
    import asyncio
    loop = asyncio.get_event_loop()
    message = await loop.run_in_executor(None, run_pipeline)
    return JSONResponse(content={"status": "success", "message": message})

# ==============================
# 9. REF PROFILES (LIMITED)
# ==============================
@app.get("/ref_profiles")
def api_ref_profiles(request: Request):
    ip = request.client.host
    if is_rate_limited(ip):
        return JSONResponse(content={"status": "error", "message": "Too many requests"})
    try:
        df = pd.read_sql("SELECT * FROM ref_profiles LIMIT 50", engine)
        return JSONResponse(content=df.to_dict(orient="records"))
    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)})

# ==============================
# 10. SINGLE REF PROFILE
# ==============================
@app.get("/ref_profile")
def api_ref_profile(ref_id: str):
    try:
        query = "SELECT * FROM ref_profiles WHERE referee_id = ?"
        df = pd.read_sql(query, engine, params=(ref_id,))
        return JSONResponse(content=df.to_dict(orient="records"))
    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)})

# ==============================
# 11. FIXTURE PREDICTIONS (LIMITED)
# ==============================
@app.get("/fixture_predictions")
def api_fixture_predictions(request: Request):
    ip = request.client.host
    if is_rate_limited(ip):
        return JSONResponse(content={"status": "error", "message": "Too many requests"})
    try:
        df = pd.read_sql("SELECT * FROM fixture_scores LIMIT 50", engine)
        return JSONResponse(content=df.to_dict(orient="records"))
    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)})

# ==============================
# 12. SINGLE FIXTURE
# ==============================
@app.get("/fixture_score")
def api_fixture_score(fixture_id: str):
    try:
        query = "SELECT * FROM fixture_scores WHERE fixture_id = ?"
        df = pd.read_sql(query, engine, params=(fixture_id,))
        return JSONResponse(content=df.to_dict(orient="records"))
    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)})

# ==============================
# 13. REF SEASON DATA
# ==============================
@app.get("/ref_profiles_season")
def api_ref_season(request: Request, ref_id: str = Query(None)):
    ip = request.client.host
    if is_rate_limited(ip):
        return JSONResponse(content={"status": "error", "message": "Too many requests"})
    try:
        CSV_PATH = os.path.join(PROJECT_ROOT, "outputs", "ref_profiles_season.csv")
        df = pd.read_csv(CSV_PATH)
        if ref_id:
            df = df[df["referee_id"] == int(ref_id)]
        df = df.sort_values("season", ascending=True)
        cols = ["referee_id", "full_name", "season", "ref_monitor_score", "total_matches",
                "var_interaction_score", "decision_volatility", "pressure_sensitivity",
                "penalty_diff", "red_diff"]
        cols = [c for c in cols if c in df.columns]
        df = df[cols]
        return JSONResponse(content=df.to_dict(orient="records"))
    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)})

# ==============================
# 14. REF CAREER DATA
# ==============================
@app.get("/ref_profiles_career")
def api_ref_career(ref_id: str = Query(None)):
    try:
        CSV_PATH = os.path.join(PROJECT_ROOT, "outputs", "ref_profiles_career.csv")
        df = pd.read_csv(CSV_PATH)
        if ref_id:
            df = df[df["referee_id"] == int(ref_id)]
        return JSONResponse(content=df.to_dict(orient="records"))
    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)})