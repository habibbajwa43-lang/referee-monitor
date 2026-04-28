# init_db.py
import os
import sqlite3

# ==============================
# 1. BASE DIRECTORY
# ==============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ==============================
# 2. DATABASE & SCHEMA PATHS
# ==============================
DB_PATH = os.path.join(BASE_DIR, "ref_monitor_poc.db")
SCHEMA_PATH = os.path.join(BASE_DIR, "schema.sql")

# ==============================
# 3. CONNECT & CREATE DATABASE
# ==============================
try:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # PRAGMA for foreign keys
    cursor.execute("PRAGMA foreign_keys = ON;")

    # Read schema file
    with open(SCHEMA_PATH, "r") as f:
        schema_sql = f.read()

    # Split statements manually on semicolon
    statements = [s.strip() for s in schema_sql.split(";") if s.strip()]

    for stmt in statements:
        cursor.execute(stmt)

    conn.commit()
    print(f"✅ Database created successfully: {DB_PATH}")

except Exception as e:
    print("❌ Error creating database:", e)

finally:
    conn.close()