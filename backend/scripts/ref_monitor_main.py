import os
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sqlalchemy import create_engine
from datetime import datetime, UTC

def run_pipeline():
    # =====================================================
    # 1. PROJECT PATHS
    # =====================================================
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))

    CONFIG_PATH = os.path.join(PROJECT_ROOT, "config", "model_config.json")
    with open(CONFIG_PATH) as f:
        config = json.load(f)

    DATA_DIR = os.path.join(PROJECT_ROOT, config["paths"]["data_dir"])
    OUTPUT_DIR = os.path.join(PROJECT_ROOT, config["paths"]["output_dir"])
    DB_PATH = os.path.join(PROJECT_ROOT, config["paths"]["database"])

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    engine = create_engine(f"sqlite:///{DB_PATH}")

    GENERATED_AT = datetime.now(UTC).isoformat()

    # =====================================================
    # 2. LOAD MODEL CONFIG
    # =====================================================
    MODEL_VERSION = config["model_version"]
    SCORE_VERSION = config["score_version"]

    score_weights = config["ref_monitor_score_weights"]
    impact_weights = config["impact_score_weights"]
    chaos_weights = config["chaos_index_weights"]

    RISK_HIGH = config["risk_bands"]["high_quantile"]
    RISK_MEDIUM = config["risk_bands"]["medium_quantile"]

    IMPACT_HIGH = config["impact_labels"]["high"]
    IMPACT_MEDIUM = config["impact_labels"]["medium"]

    # =====================================================
    # 3. LOAD DATA
    # =====================================================
    refs = pd.read_csv(os.path.join(DATA_DIR, "referees.csv"), sep="\t", engine="python")
    fixtures = pd.read_csv(os.path.join(DATA_DIR, "fixtures.csv"), sep="\t", engine="python")
    assignments = pd.read_csv(os.path.join(DATA_DIR, "referee_assignments.csv"), sep="\t", engine="python")
    events = pd.read_csv(os.path.join(DATA_DIR, "match_events.csv"), sep=r"\s+", engine="python")

    for df in [refs, fixtures, assignments, events]:
        df.columns = df.columns.str.strip().str.lower()

    # =====================================================
    # 4. ENSURE SEASON & FIXTURE IMPORTANCE
    # =====================================================
    if "season" not in events.columns:
        events = events.merge(fixtures[["fixture_id","season"]], on="fixture_id", how="left")

    BIG_6 = ["Manchester City","Manchester United","Liverpool","Chelsea","Arsenal","Tottenham"]
    if "importance_band" not in fixtures.columns:
        fixtures["importance_band"] = np.where(
            fixtures["home_team"].isin(BIG_6) | fixtures["away_team"].isin(BIG_6),
            "HIGH", "NORMAL"
        )

    events = events.merge(fixtures[["fixture_id","importance_band"]], on="fixture_id", how="left")

    # =====================================================
    # 5. BASE AGGREGATIONS
    # =====================================================
    season_metrics = events.groupby(["referee_id","season"]).agg(
        cards_per_match=("cards","mean"),
        penalties_per_match=("penalty_for","mean"),
        reds_per_match=("red_for","mean"),
        fouls_per_match=("foul_for","mean"),
        var_per_match=("var_review","mean"),
        matches=("fixture_id","nunique")
    ).reset_index()

    career_metrics = events.groupby("referee_id").agg(
        cards_per_match=("cards","mean"),
        penalties_per_match=("penalty_for","mean"),
        reds_per_match=("red_for","mean"),
        fouls_per_match=("foul_for","mean"),
        var_per_match=("var_review","mean"),
        matches=("fixture_id","nunique")
    ).reset_index()

    # =====================================================
    # 6. STRICTNESS INDEX
    # =====================================================
    def zscore(series):
        return (series - series.mean()) / (series.std() + 1e-6)

    pen_z = zscore(career_metrics["penalties_per_match"])
    red_z = zscore(career_metrics["reds_per_match"])
    foul_z = zscore(career_metrics["fouls_per_match"])

    career_metrics["strictness_index"] = pen_z + red_z + foul_z
    career_metrics["strictness_index"] = (
        (career_metrics["strictness_index"] - career_metrics["strictness_index"].min()) /
        (career_metrics["strictness_index"].max() - career_metrics["strictness_index"].min() + 1e-6)
    ).clip(0,1)

    # =====================================================
    # 7. DECISION VOLATILITY
    # =====================================================
    volatility = events.groupby("referee_id")["cards"].std().fillna(0)
    volatility = (volatility / volatility.quantile(0.95)).clip(0,1)
    career_metrics = career_metrics.merge(volatility.reset_index(name="decision_volatility"), on="referee_id")

    # =====================================================
    # 8. PRESSURE SENSITIVITY
    # =====================================================
    high_cards = events[events["importance_band"]=="HIGH"].groupby("referee_id")["cards"].mean()
    total_cards = events.groupby("referee_id")["cards"].mean()
    pressure_ratio = (high_cards/total_cards).fillna(0).reset_index(name="pressure_ratio")
    pressure_ratio["pressure_sensitivity"] = np.select(
        [pressure_ratio["pressure_ratio"]>1.3, pressure_ratio["pressure_ratio"]>1.1],
        [1, 0.7], default=0.4
    )
    career_metrics = career_metrics.merge(
        pressure_ratio[["referee_id","pressure_sensitivity"]],
        on="referee_id", how="left"
    )

    # =====================================================
    # 9. FIXTURE CONTEXT ALIGNMENT
    # =====================================================
    high_cards = events[events["importance_band"]=="HIGH"].groupby("referee_id")["cards"].mean()
    normal_cards = events[events["importance_band"]!="HIGH"].groupby("referee_id")["cards"].mean()
    context = pd.concat([high_cards, normal_cards], axis=1)
    context.columns = ["high_cards","normal_cards"]
    context["fixture_context_alignment"] = (
        1 - abs(context["high_cards"] - context["normal_cards"]) /
        (context["high_cards"] + context["normal_cards"] + 1)
    ).clip(0,1)
    context = context.reset_index()
    career_metrics = career_metrics.merge(context, on="referee_id")

    # =====================================================
    # 10. VAR INTERACTION
    # =====================================================
    career_metrics["var_interaction_score"] = career_metrics["var_per_match"].clip(0,1)

    # =====================================================
    # 11. HOME BIAS INDEX
    # =====================================================
    bias_norm = (career_metrics["penalties_per_match"] - career_metrics["fouls_per_match"])
    bias_norm = bias_norm / bias_norm.abs().max()
    career_metrics["home_bias_index"] = 50 + (bias_norm * 50)

    # =====================================================
    # 12. CHAOS INDEX
    # =====================================================
    career_metrics["referee_chaos_index"] = (
        career_metrics["cards_per_match"] * chaos_weights["cards_per_match"] +
        career_metrics["reds_per_match"] * chaos_weights["red_cards_per_match"] +
        career_metrics["penalties_per_match"] * chaos_weights["penalties_per_match"] +
        career_metrics["var_per_match"] * chaos_weights["var_reviews_per_match"] +
        career_metrics["decision_volatility"] * chaos_weights["decision_volatility"]
    )
    career_metrics["referee_chaos_index"] = (
        career_metrics["referee_chaos_index"] /
        career_metrics["referee_chaos_index"].max()
    ) * 100

    # =====================================================
    # 13. PENALTY PROBABILITY
    # =====================================================
    career_metrics["referee_penalty_probability"] = (
        1 - np.exp(-career_metrics["penalties_per_match"])
    ) * 100

    # =====================================================
    # 14. FINAL SCORE
    # =====================================================
    career_metrics["ref_monitor_score"] = (
        career_metrics["strictness_index"] * score_weights.get("strictness_index",0) +
        career_metrics["decision_volatility"] * score_weights.get("decision_volatility",0) +
        career_metrics["pressure_sensitivity"] * score_weights.get("pressure_sensitivity",0) +
        career_metrics["fixture_context_alignment"] * score_weights.get("fixture_context_alignment",0) +
        career_metrics["var_interaction_score"] * score_weights.get("var_interaction_score",0) +
        (career_metrics["referee_chaos_index"]/100) * score_weights.get("referee_chaos_index",0)
    ) * 100

    # =====================================================
    # 15. REFEREE STYLE
    # =====================================================
    league_cards = career_metrics["cards_per_match"].mean()
    def referee_style(row):
        if row["cards_per_match"] > league_cards*1.4:
            return "Card Heavy Referee"
        if row["var_per_match"] > 0.5:
            return "VAR Heavy Referee"
        if row["pressure_sensitivity"] > 0.8:
            return "Big Game Specialist"
        return "Balanced Referee"
    career_metrics["referee_style"] = career_metrics.apply(referee_style, axis=1)

    # =====================================================
    # 16. IMPACT LAYER
    # =====================================================
    league_cards = max(events["cards"].mean(), 0.01)
    league_pen = max(events["penalty_for"].mean(), 0.01)
    impact = career_metrics[[
        "referee_id","cards_per_match","penalties_per_match",
        "decision_volatility","var_per_match"
    ]].copy()
    impact["card_intensity"] = (impact["cards_per_match"]/league_cards).clip(0,2)/2
    impact["penalty_influence"] = (impact["penalties_per_match"]/league_pen).clip(0,2)/2
    impact["volatility"] = impact["decision_volatility"]
    impact["var_interaction"] = impact["var_per_match"].clip(0,1)
    impact["ref_impact_score"] = (
        impact["card_intensity"] * impact_weights["card_intensity"] +
        impact["penalty_influence"] * impact_weights["penalty_influence"] +
        impact["volatility"] * impact_weights["volatility"] +
        impact["var_interaction"] * impact_weights["var_interaction"]
    ) * 100
    impact["ref_impact_score"] = impact["ref_impact_score"].round(1)

    # =====================================================
    # 17. FIXTURE PREDICTIONS
    # =====================================================
    fixture_scores = assignments.merge(fixtures, on="fixture_id").merge(career_metrics, on="referee_id")
    impact_cols = ["referee_id","card_intensity","penalty_influence","volatility","var_interaction","ref_impact_score"]
    fixture_scores = fixture_scores.merge(impact[impact_cols], on="referee_id")
    fixture_scores["predicted_ref_monitor_score"] = fixture_scores["ref_monitor_score"]
    q_high = fixture_scores["predicted_ref_monitor_score"].quantile(RISK_HIGH)
    q_mid = fixture_scores["predicted_ref_monitor_score"].quantile(RISK_MEDIUM)
    fixture_scores["risk_band"] = np.where(
        fixture_scores["predicted_ref_monitor_score"] >= q_high, "RED",
        np.where(fixture_scores["predicted_ref_monitor_score"] >= q_mid, "AMBER", "GREEN")
    )
    fixture_scores["impact_label"] = np.select(
        [fixture_scores["ref_impact_score"] > IMPACT_HIGH,
         fixture_scores["ref_impact_score"] > IMPACT_MEDIUM],
        ["HIGH IMPACT","MEDIUM IMPACT"],
        default="LOW IMPACT"
    )
    fixture_scores["score_version"] = SCORE_VERSION
    fixture_scores["generated_at"] = GENERATED_AT

    # =====================================================
    # 18. REF PROFILES
    # =====================================================
    ref_profiles = refs.merge(career_metrics, on="referee_id", how="left")
    ref_profiles["score_version"] = SCORE_VERSION
    ref_profiles["generated_at"] = GENERATED_AT

    # =====================================================
    # 19. SAVE CSVs + SQLITE
    # =====================================================
    ref_profiles.to_csv(os.path.join(OUTPUT_DIR, "ref_profiles.csv"), index=False)
    fixture_scores.to_csv(os.path.join(OUTPUT_DIR, "fixture_scores.csv"), index=False)
    career_metrics.to_sql("referee_metrics", engine, if_exists="replace", index=False)
    fixture_scores.to_sql("fixture_scores", engine, if_exists="replace", index=False)
    ref_profiles.to_sql("ref_profiles", engine, if_exists="replace", index=False)

    # Rankings
    career_metrics.sort_values("ref_monitor_score", ascending=False).head(20).to_csv(
        os.path.join(OUTPUT_DIR, "top_referees.csv"), index=False
    )
    career_metrics.sort_values("decision_volatility", ascending=False).head(20).to_csv(
        os.path.join(OUTPUT_DIR, "most_volatile_refs.csv"), index=False
    )
    career_metrics.sort_values("var_interaction_score", ascending=False).head(20).to_csv(
        os.path.join(OUTPUT_DIR, "var_heavy_refs.csv"), index=False
    )

    # =====================================================
    # 20. HISTOGRAM
    # =====================================================
    scores = career_metrics["ref_monitor_score"]
    plt.figure(figsize=(8,5))
    plt.hist(scores, bins=10, color='skyblue', edgecolor='black')
    plt.title("Ref Monitor Score Distribution")
    plt.xlabel("Ref Monitor Score")
    plt.ylabel("Number of Referees")
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "ref_monitor_score_distribution.png"))
    plt.close()

    print("Pipeline completed successfully. All CSVs and histogram saved.")

    return "Pipeline completed successfully"


if __name__ == "__main__":
    run_pipeline()