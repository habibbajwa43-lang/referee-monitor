import os
import sys
from fastapi import FastAPI, Request, Query
from fastapi.responses import JSONResponse
import pandas as pd
from sqlalchemy import create_engine
from time import time

# ==============================
# 1. FASTAPI APP
# ==============================
app = FastAPI(title="Ref Monitor API")

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
# 5. SIMPLE RATE LIMITER
# ==============================
request_log = {}

def is_rate_limited(ip):
    now = time()
    window = 60   # seconds
    limit = 10    # max requests per minute

    if ip not in request_log:
        request_log[ip] = []

    # keep only recent requests
    request_log[ip] = [t for t in request_log[ip] if now - t < window]

    if len(request_log[ip]) >= limit:
        return True

    request_log[ip].append(now)
    return False

# ==============================
# 6. HEALTH CHECK
# ==============================
@app.get("/health")
def health():
    return {"status": "Ref Monitor API running"}

# ==============================
# 7. RUN PIPELINE (PROTECTED)
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
# 8. REF PROFILES (LIMITED)
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
# 9. SINGLE REF PROFILE (CLIENT REQUIREMENT)
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
# 10. FIXTURE PREDICTIONS (LIMITED)
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
# 11. SINGLE FIXTURE (SAFE ACCESS)
# ==============================
@app.get("/fixture_score")
def api_fixture_score(fixture_id: str):
    try:
        query = "SELECT * FROM fixture_scores WHERE fixture_id = ?"
        df = pd.read_sql(query, engine, params=(fixture_id,))
        return JSONResponse(content=df.to_dict(orient="records"))
    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)})