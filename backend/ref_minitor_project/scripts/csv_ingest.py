import os
import pandas as pd
from sqlalchemy import create_engine

# Current file location (scripts folder)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Project root (one level up)
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))

# Correct absolute paths
DB_PATH = os.path.join(PROJECT_ROOT, "database", "ref_monitor_poc.db")
DATA_FOLDER = os.path.join(PROJECT_ROOT, "data")

engine = create_engine(f"sqlite:///{DB_PATH}")

CSV_FILES = {
    "referees": "referees.csv",
    "fixtures": "fixtures.csv",
    "referee_assignments": "referee_assignments.csv",
    "match_events": "match_events.csv"
}

def load_csv_to_db(table_name, filename):
    path = os.path.join(DATA_FOLDER, filename)

    if not os.path.exists(path):
        print(f"File not found: {path}")
        return

    try:
        df = pd.read_csv(path)

        if df.empty:
            print(f"CSV is empty: {path}")
            return

        df.to_sql(table_name, engine, if_exists="replace", index=False)
        print(f"Loaded {table_name} from {filename} ({len(df)} rows)")

    except Exception as e:
        print(f"Error during CSV ingestion for {filename}: {e}")


def main():
    print("Using database at:", DB_PATH)
    for table, file in CSV_FILES.items():
        load_csv_to_db(table, file)


if __name__ == "__main__":
    main()