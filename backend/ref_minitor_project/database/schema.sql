PRAGMA foreign_keys = ON;

-- ==============================
-- REFEREES
-- ==============================
CREATE TABLE IF NOT EXISTS referees (
    referee_id INTEGER PRIMARY KEY,
    full_name TEXT NOT NULL,
    nationality TEXT
);

-- ==============================
-- FIXTURES
-- ==============================
CREATE TABLE IF NOT EXISTS fixtures (
    fixture_id INTEGER PRIMARY KEY,
    season TEXT NOT NULL,
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    importance_band TEXT
);

-- ==============================
-- REFEREE ASSIGNMENTS
-- ==============================
CREATE TABLE IF NOT EXISTS referee_assignments (
    assignment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    fixture_id INTEGER NOT NULL,
    referee_id INTEGER NOT NULL,
    FOREIGN KEY (fixture_id) REFERENCES fixtures(fixture_id),
    FOREIGN KEY (referee_id) REFERENCES referees(referee_id)
);

-- ==============================
-- MATCH EVENTS
-- ==============================
CREATE TABLE IF NOT EXISTS match_events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    fixture_id INTEGER NOT NULL,
    referee_id INTEGER NOT NULL,
    season TEXT NOT NULL,
    minute INTEGER,
    cards INTEGER,
    penalty_for INTEGER,
    red_for INTEGER,
    foul_for INTEGER,
    var_review INTEGER,
    FOREIGN KEY (fixture_id) REFERENCES fixtures(fixture_id),
    FOREIGN KEY (referee_id) REFERENCES referees(referee_id)
);

-- ==============================
-- REFEREE METRICS
-- ==============================
CREATE TABLE IF NOT EXISTS referee_metrics (
    metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
    referee_id INTEGER NOT NULL,
    season TEXT NOT NULL,

    -- EXISTING METRICS
    historical_bias_index REAL,
    decision_volatility REAL,
    pressure_sensitivity REAL,
    game_control_profile REAL,
    var_interaction_score REAL,
    fixture_context_alignment REAL,

    -- NEW ANALYTICAL METRICS
    home_bias_index REAL,
    referee_chaos_index REAL,
    referee_penalty_probability REAL,

    -- MATCH IMPACT PROFILE
    card_intensity REAL,
    penalty_influence REAL,
    volatility_index REAL,
    var_interaction_level REAL,
    ref_impact_score REAL,

    -- FRONTEND STYLE LABEL
    referee_style TEXT,

    -- FINAL SCORE
    ref_monitor_score INTEGER,

    -- MODEL VERSIONING
    score_version TEXT,
    generated_at TEXT,

    FOREIGN KEY (referee_id) REFERENCES referees(referee_id)
);

-- ==============================
-- REFEREE SCORES
-- ==============================
CREATE TABLE IF NOT EXISTS referee_scores (
    score_id INTEGER PRIMARY KEY AUTOINCREMENT,
    referee_id INTEGER NOT NULL,
    season TEXT NOT NULL,
    ref_monitor_score INTEGER,
    score_version TEXT,
    generated_at TEXT,
    FOREIGN KEY (referee_id) REFERENCES referees(referee_id)
);

-- ==============================
-- FIXTURE PREDICTIONS / SCORES
-- ==============================
CREATE TABLE IF NOT EXISTS fixture_scores (
    prediction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    fixture_id INTEGER NOT NULL,
    referee_id INTEGER NOT NULL,
    season TEXT NOT NULL,

    predicted_ref_monitor_score INTEGER,
    risk_band TEXT,

    -- REFEREE IMPACT LAYER
    ref_impact_score REAL,
    card_intensity REAL,
    penalty_influence REAL,
    volatility REAL,
    var_interaction REAL,
    impact_label TEXT,

    score_version TEXT,
    generated_at TEXT,

    FOREIGN KEY (fixture_id) REFERENCES fixtures(fixture_id),
    FOREIGN KEY (referee_id) REFERENCES referees(referee_id)
);

-- ==============================
-- REFEREE PROFILES (API READY)
-- ==============================
CREATE TABLE IF NOT EXISTS ref_profiles (
    profile_id INTEGER PRIMARY KEY AUTOINCREMENT,
    referee_id INTEGER,
    full_name TEXT,
    nationality TEXT,

    season TEXT,

    ref_monitor_score INTEGER,
    referee_style TEXT,

    home_bias_index REAL,
    referee_chaos_index REAL,
    referee_penalty_probability REAL,
    ref_impact_score REAL,

    score_version TEXT,
    generated_at TEXT,

    FOREIGN KEY (referee_id) REFERENCES referees(referee_id)
);

-- ==============================
-- REFEREE RANKINGS
-- ==============================
CREATE TABLE IF NOT EXISTS referee_rankings (
    ranking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    referee_id INTEGER,
    season TEXT,

    ref_monitor_rank INTEGER,
    volatility_rank INTEGER,
    var_interaction_rank INTEGER,

    score_version TEXT,
    generated_at TEXT,

    FOREIGN KEY (referee_id) REFERENCES referees(referee_id)
);