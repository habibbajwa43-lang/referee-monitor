import { Gauge, ShieldAlert, Tickets, Percent, ArrowUpRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

function riskColors(band) {
  if (band === "RED") return { bg: "rgba(244,63,94,0.08)", border: "rgba(244,63,94,0.2)", badge: { bg: "rgba(244,63,94,0.12)", color: "#f43f5e" } };
  if (band === "AMBER") return { bg: "rgba(234,179,8,0.06)", border: "rgba(234,179,8,0.2)", badge: { bg: "rgba(234,179,8,0.12)", color: "#eab308" } };
  return { bg: "rgba(16,185,129,0.05)", border: "rgba(16,185,129,0.2)", badge: { bg: "rgba(16,185,129,0.1)", color: "#10b981" } };
}

function generateInsight(fixture) {
  const rmScore = Number(fixture.predicted_ref_monitor_score || 0);
  const penalty = Number(fixture.penalty_influence || 0);
  const cards = Number(fixture.card_intensity || 0);
  const risk = fixture.risk_band;

  if (risk === "RED" && penalty > 0.5) return "🚨 High volatility fixture — elevated VAR and penalty probability.";
  if (risk === "RED" && cards > 0.5) return "🟨 Card-heavy fixture expected — strictness signals are elevated.";
  if (risk === "RED") return "🔥 High chaos referee assigned — expect unpredictable match dynamics.";
  if (risk === "AMBER" && penalty > 0.4) return "⚠️ Moderate penalty risk — referee shows above-average spot-kick tendency.";
  if (risk === "AMBER") return "📊 Mixed signals — referee impact is moderate with some volatility indicators.";
  if (rmScore > 75) return "🎯 High-scoring referee — strong game-flow control expected in this fixture.";
  return "✅ Low interference expected — referee profile aligns with balanced fixture control.";
}

const REFEREE_NAMES = {
  1: "Michael Oliver",  2: "Anthony Taylor",  3: "Martin Atkinson",
  4: "Craig Pawson",    5: "Paul Tierney",     6: "Chris Kavanagh",
  7: "Andre Marriner",  8: "Jonathan Moss",    9: "Mike Dean",    10: "Stuart Attwell",
};

export default function MatchCard({ fixture }) {
  const navigate = useNavigate();
  const c = riskColors(fixture.risk_band);
  const refName = REFEREE_NAMES[fixture.referee_id] || `Referee ${fixture.referee_id}`;

  return (
    <button
      onClick={() => navigate(`/matches/${fixture.fixture_id}`)}
      className="card-dark w-full p-5 text-left group"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Fixture</p>
          <h3 className="font-display text-2xl font-black text-white">
            {fixture.home_team} <span className="text-slate-600">vs</span> {fixture.away_team}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full px-2.5 py-1 text-[10px] font-bold text-slate-500"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {fixture.season}
            </span>
            <span className="rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{ background: c.badge.bg, color: c.badge.color, border: `1px solid ${c.border}` }}>
              {fixture.risk_band}
            </span>
          </div>
        </div>
        <span className="rounded-xl px-3 py-1.5 text-xs font-bold flex-shrink-0"
          style={{ background: c.badge.bg, color: c.badge.color }}>
          {fixture.impact_label}
        </span>
      </div>

      <div className="rounded-[16px] p-4" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: Gauge, label: "RM Score", val: Number(fixture.predicted_ref_monitor_score || 0).toFixed(1), col: "text-emerald-400" },
            { icon: ShieldAlert, label: "Impact", val: Number(fixture.ref_impact_score || 0).toFixed(1), col: "text-slate-300" },
            { icon: Tickets, label: "Card Intensity", val: Number(fixture.card_intensity || 0).toFixed(2), col: "text-yellow-400" },
            { icon: Percent, label: "Penalty Influence", val: Number(fixture.penalty_influence || 0).toFixed(2), col: "text-rose-400" },
          ].map(({ icon: Icon, label, val, col }) => (
            <div key={label}>
              <div className="flex items-center gap-1.5 mb-2">
                <Icon size={12} className={col} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{label}</span>
              </div>
              <p className={`font-display text-2xl font-black ${col}`}>{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      <div className="mt-3 rounded-[12px] px-3 py-2 flex items-start gap-2"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <Zap size={11} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-500 leading-relaxed">{generateInsight(fixture)}</p>
      </div>

      <div className="mt-4 pt-4 flex items-center justify-between text-xs"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <span className="text-slate-600">{refName}</span>
        <span className="font-bold text-emerald-400 flex items-center gap-1 group-hover:gap-2 transition-all">
          View Insight <ArrowUpRight size={12} />
        </span>
      </div>
    </button>
  );
}
