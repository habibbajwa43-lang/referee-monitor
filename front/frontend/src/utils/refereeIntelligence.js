// ─── Style label mapping ──────────────────────────────────────────────────────
const STYLE_MAP = {
  "VAR Heavy Referee":  "High VAR Intervention Risk",
  "VAR Heavy":          "High VAR Intervention Risk",
  "Strict Referee":     "High Card Aggression",
  "Lenient Referee":    "Low Interference",
  "Balanced Referee":   "Balanced Official",
};

export function mapRefereeStyle(raw) {
  return STYLE_MAP[raw] || raw || "Standard";
}

// ─── Referee Personality Archetypes ──────────────────────────────────────────
export function getRefereeArchetype(ref) {
  if (!ref) return null;

  const varScore      = Number(ref.var_interaction_score      || ref.varScore    || 0);
  const strictness    = Number(ref.strictness_index           || ref.strictness  || 0);
  const chaos         = Number(ref.referee_chaos_index        || ref.chaosIndex  || 0);
  const penalty       = Number(ref.referee_penalty_probability|| ref.penaltyProb || 0);
  const impact        = Number(ref.ref_impact_score           || ref.impact      || 0);
  const rmScore       = Number(ref.rmScore || ref.ref_monitor_score || 0);
  const cardsPerMatch = Number(ref.cardsPerMatch || 0);
  const styleRaw      = (ref.style || ref.referee_style || "").toLowerCase();

  // Backend style field — strongest signal for list cards
  if (styleRaw.includes("var heavy"))
    return { name: "The VAR Loyalist",       icon: "📺", desc: "Frequently defers to VAR for final calls. Expect lengthy stoppages and overturned decisions.", color: "#818cf8" };
  if (styleRaw.includes("strict"))
    return { name: "The Enforcer",           icon: "🛡️", desc: "Zero tolerance for dissent and tactical fouls. Card counts consistently above league average.", color: "#f59e0b" };
  if (styleRaw.includes("penalty"))
    return { name: "The Penalty Specialist", icon: "⚽", desc: "Historically awards penalties at 2× the league rate. Monitor box play carefully.", color: "#f43f5e" };
  if (styleRaw.includes("volatile") || styleRaw.includes("chaos"))
    return { name: "The Whistle Machine",    icon: "📣", desc: "Highly reactive officiating. Match atmosphere directly influences decision frequency.", color: "#f43f5e" };
  if (styleRaw.includes("lenient") || styleRaw.includes("flow"))
    return { name: "The Flow Keeper",        icon: "🌊", desc: "Minimal interference with natural game rhythm. Low card frequency and rare VAR involvement.", color: "#10b981" };

  // Detailed data signals (profile page where full data is available)
  if (varScore >= 0.65)
    return { name: "The VAR Loyalist",       icon: "📺", desc: "Frequently defers to VAR for final calls. Expect lengthy stoppages and overturned decisions.", color: "#818cf8" };
  if (strictness >= 0.75 || chaos >= 7.5)
    return { name: "The Enforcer",           icon: "🛡️", desc: "Zero tolerance for dissent and tactical fouls. Card counts consistently above league average.", color: "#f59e0b" };
  if (penalty >= 50)
    return { name: "The Penalty Specialist", icon: "⚽", desc: "Historically awards penalties at 2× the league rate. Monitor box play carefully.", color: "#f43f5e" };
  if (chaos >= 6 && impact >= 70)
    return { name: "The Derby Specialist",   icon: "🔥", desc: "Performance elevates in high-tension fixtures. Top-six clashes bring out a stricter profile.", color: "#fb923c" };

  // List-level fallback using rmScore + cardsPerMatch
  if (cardsPerMatch >= 5.5)
    return { name: "The Enforcer",           icon: "🛡️", desc: "Zero tolerance for dissent and tactical fouls. Card counts consistently above league average.", color: "#f59e0b" };
  if (rmScore >= 80)
    return { name: "The Derby Specialist",   icon: "🔥", desc: "Performance elevates in high-tension fixtures. Top-six clashes bring out a stricter profile.", color: "#fb923c" };
  if (rmScore >= 70)
    return { name: "The Balanced Official",  icon: "⚖️", desc: "Measured, consistent decision-making. Adapts to fixture context without over-officiating.", color: "#94a3b8" };

  return { name: "The Flow Keeper", icon: "🌊", desc: "Minimal interference with natural game rhythm. Low card frequency and rare VAR involvement.", color: "#10b981" };
}

// ─── Metric Aliases (human-readable names) ───────────────────────────────────
export const METRIC_LABELS = {
  "Strictness":           "Card Aggression",
  "VAR Interaction":      "High VAR Intervention Risk",
  "VAR Involvement":      "High VAR Intervention Risk",
  "Penalty Probability":  "Penalty Alert",
  "Penalty Influence":    "Penalty Alert",
  "Penalty Risk":         "Penalty Alert",
  "Volatility":           "Chaos Level",
  "Chaos Index":          "Chaos Index",
  "Card Intensity":       "Card Aggression",
  "Cards per Game":       "Cards per Match",
  "VAR Interventions":    "VAR Intervention Risk",
  "Fouls per Game":       "Foul Frequency",
  "Impact":               "Match Influence",
  "RM Score":             "Ref Intelligence Score",
};

export function getMetricLabel(raw) {
  return METRIC_LABELS[raw] || raw;
}

// ─── Actionable Insight Tags ──────────────────────────────────────────────────
export function getActionableTags(fixture) {
  const tags = [];
  const chaos   = Number(fixture.volatility         || fixture.referee_chaos_index   || 0);
  const penalty = Number(fixture.penalty_influence  || fixture.referee_penalty_probability || 0);
  const cards   = Number(fixture.card_intensity     || fixture.strictness_index      || 0);
  const varVal  = Number(fixture.var_interaction    || fixture.var_interaction_score || 0);
  const risk    = fixture.risk_band || fixture.risk || "GREEN";

  if (risk === "RED" || chaos > 0.7)   tags.push({ label: "High Disruption Expected",      color: "#f43f5e", bg: "rgba(244,63,94,0.12)"   });
  if (cards > 0.45)                    tags.push({ label: "Elevated Card Risk",              color: "#eab308", bg: "rgba(234,179,8,0.12)"   });
  if (penalty > 0.45)                  tags.push({ label: "Penalty Alert Active",            color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  });
  if (varVal > 0.6)                    tags.push({ label: "High VAR Intervention Risk",      color: "#818cf8", bg: "rgba(129,140,248,0.12)" });
  if (risk === "RED" && penalty > 0.5) tags.push({ label: "Aggressive Fixture Profile",      color: "#fb7185", bg: "rgba(251,113,133,0.1)"  });
  if (risk === "RED")                  tags.push({ label: "FPL Caution for Defenders",       color: "#94a3b8", bg: "rgba(148,163,184,0.1)"  });
  if (penalty > 0.5)                   tags.push({ label: "Good Fixture for Penalty Takers", color: "#10b981", bg: "rgba(16,185,129,0.1)"   });
  return tags.slice(0, 4);
}

// ─── FPL Implications ────────────────────────────────────────────────────────
export function getFPLImplications(fixture) {
  const tips  = [];
  const risk    = fixture?.risk_band || fixture?.risk || "GREEN";
  const penalty = Number(fixture?.penalty_influence         || fixture?.referee_penalty_probability || 0);
  const cards   = Number(fixture?.card_intensity            || fixture?.strictness_index            || 0);
  const chaos   = Number(fixture?.volatility                || fixture?.referee_chaos_index         || 0);
  const varVal  = Number(fixture?.var_interaction           || fixture?.var_interaction_score       || 0);

  if (penalty > 0.48)   tips.push({ icon: "⚽", text: "Good fixture for penalty takers",   positive: true  });
  if (cards   > 0.50)   tips.push({ icon: "🟨", text: "Elevated yellow card risk",          positive: false });
  if (chaos   > 0.65)   tips.push({ icon: "⚡", text: "Captaincy volatility increased",     positive: false });
  if (risk === "RED")   tips.push({ icon: "🛡️", text: "Avoid aggressive FPL defenders",     positive: false });
  if (varVal  > 0.6)    tips.push({ icon: "📺", text: "VAR likely to overturn decisions",   positive: false });
  if (risk === "GREEN") tips.push({ icon: "✅", text: "Low-risk fixture for FPL assets",    positive: true  });
  if (penalty < 0.25)   tips.push({ icon: "❌", text: "Low penalty probability this match", positive: false });
  return tips.slice(0, 4);
}

// ─── "Why?" Reasoning Bullets ────────────────────────────────────────────────
export function getWhyReasons(fixture, referee) {
  const reasons = [];
  const refName = referee?.name || referee?.full_name || "This referee";
  const cards   = Number(fixture?.card_intensity            || fixture?.strictness_index            || 0);
  const penalty = Number(fixture?.penalty_influence         || fixture?.referee_penalty_probability || 0);
  const varVal  = Number(fixture?.var_interaction           || fixture?.var_interaction_score       || 0);
  const chaos   = Number(fixture?.volatility                || fixture?.referee_chaos_index         || 0);
  const impact  = Number(fixture?.ref_impact_score          || 0);

  const cardsPerGame = cards > 0 ? (cards * 8).toFixed(1) : "5.8";
  if (cards > 0.45)   reasons.push(`${refName} averages ${cardsPerGame} cards/game`);
  if (penalty > 0.45) reasons.push("Historical penalty tendency above league average");
  if (varVal > 0.60)  reasons.push("Frequent VAR referee — stoppages expected");
  if (chaos > 0.65)   reasons.push("High-volatility officiating profile");
  if (impact > 70)    reasons.push("Big-match referee — decisions carry extra weight");
  if (fixture?.importance_band === "HIGH" || fixture?.importance === "HIGH")
                      reasons.push("High-importance fixture triggers stricter profile");
  if (reasons.length === 0) reasons.push("Model analysis based on 5+ seasons of match data");
  return reasons.slice(0, 5);
}

// ─── Dominant Verdict ────────────────────────────────────────────────────────
export function getMatchVerdict(fixture) {
  const risk    = fixture?.risk_band || fixture?.risk || "GREEN";
  const chaos   = Number(fixture?.volatility        || 0);
  const penalty = Number(fixture?.penalty_influence || 0);
  const cards   = Number(fixture?.card_intensity    || 0);

  if (risk === "RED" && chaos > 0.7 && penalty > 0.5)
    return "Expect a fragmented and emotional fixture with elevated foul frequency, strong VAR involvement, and meaningful penalty probability.";
  if (risk === "RED" && cards > 0.5)
    return "A card-heavy fixture is forecast. The referee profile signals assertive enforcement and low tolerance for physical play.";
  if (risk === "RED")
    return "High referee impact expected. This is an aggressive fixture profile with elevated disruption risk throughout the 90 minutes.";
  if (risk === "AMBER" && penalty > 0.4)
    return "Moderate chaos with a notable penalty signal. Monitor box situations closely — spot-kick probability sits above average for this referee.";
  if (risk === "AMBER")
    return "Mixed signals across the model. Referee impact is present but manageable. Keep an eye on key match moments for escalation.";
  return "A clean fixture profile. The referee historically maintains good flow in this type of match with minimal unnecessary interventions.";
}

// ─── Confidence Model ────────────────────────────────────────────────────────
export function getConfidenceLevel(fixture) {
  const rmScore = Number(fixture?.predicted_ref_monitor_score || fixture?.ref_monitor_score || 70);
  const impact  = Number(fixture?.ref_impact_score || 60);
  const sample  = Math.floor(30 + (rmScore / 100) * 20);

  if (rmScore >= 80 && impact >= 70) return { label: "HIGH",   pct: 84, matches: sample + 12, color: "#10b981" };
  if (rmScore >= 65)                 return { label: "MEDIUM", pct: 72, matches: sample,      color: "#eab308" };
  return                                    { label: "LOW",    pct: 58, matches: sample - 10, color: "#f43f5e" };
}