import { Gauge, ShieldAlert, ArrowUpRight, Zap, Target, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getActionableTags, getFPLImplications, getMetricLabel, getMatchVerdict } from "../../utils/refereeIntelligence";

function riskColors(band) {
  if (band === "RED")   return { bg: "rgba(244,63,94,0.08)",  border: "rgba(244,63,94,0.2)",  badge: { bg: "rgba(244,63,94,0.12)",  color: "#f43f5e" } };
  if (band === "AMBER") return { bg: "rgba(234,179,8,0.06)",  border: "rgba(234,179,8,0.2)",  badge: { bg: "rgba(234,179,8,0.12)",  color: "#eab308" } };
  return                       { bg: "rgba(16,185,129,0.05)", border: "rgba(16,185,129,0.2)", badge: { bg: "rgba(16,185,129,0.10)", color: "#10b981" } };
}

const REFEREE_NAMES = {
  1: "Michael Oliver", 2: "Anthony Taylor", 3: "Martin Atkinson",
  4: "Craig Pawson",   5: "Paul Tierney",   6: "Chris Kavanagh",
  7: "Andre Marriner", 8: "Jonathan Moss",  9: "Mike Dean", 10: "Stuart Attwell",
};

export default function MatchCard({ fixture }) {
  const navigate  = useNavigate();
  const c         = riskColors(fixture.risk_band);
  const refName   = REFEREE_NAMES[fixture.referee_id] || `Referee ${fixture.referee_id}`;
  const tags      = getActionableTags(fixture);
  const fplTips   = getFPLImplications(fixture).slice(0, 2);
  const verdict   = getMatchVerdict(fixture);

  // Dominant chaos label
  const dominantLabel =
    fixture.risk_band === "RED"   ? "HIGH CHAOS" :
    fixture.risk_band === "AMBER" ? "ELEVATED RISK" : "CLEAN FIXTURE";

  return (
    <button
      onClick={() => navigate(`/matches/${fixture.fixture_id}`)}
      className="card-dark w-full p-5 text-left group"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Fixture</p>
          <h3 className="font-display text-2xl font-black text-white">
            {fixture.home_team} <span className="text-slate-600">vs</span> {fixture.away_team}
          </h3>
        </div>
        {/* Dominant label badge */}
        <span className="rounded-xl px-3 py-1.5 text-xs font-black flex-shrink-0 uppercase tracking-wide"
          style={{ background: c.badge.bg, color: c.badge.color }}>
          {dominantLabel}
        </span>
      </div>

      {/* Season + risk chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="rounded-full px-2.5 py-1 text-[10px] font-bold text-slate-500"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {fixture.season}
        </span>
        <span className="rounded-full px-2.5 py-1 text-[10px] font-bold"
          style={{ background: c.badge.bg, color: c.badge.color, border: `1px solid ${c.border}` }}>
          {fixture.risk_band} RISK
        </span>
      </div>

      {/* Metrics grid */}
      <div className="rounded-[16px] p-4 mb-3" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: Gauge,      label: getMetricLabel("RM Score"),          val: Number(fixture.predicted_ref_monitor_score || 0).toFixed(1), col: "text-emerald-400" },
            { icon: ShieldAlert,label: getMetricLabel("Impact"),             val: Number(fixture.ref_impact_score || 0).toFixed(1),            col: "text-slate-300"  },
            { icon: Target,     label: getMetricLabel("Card Intensity"),     val: Number(fixture.card_intensity || 0).toFixed(2),              col: "text-yellow-400" },
            { icon: ArrowUpRight,label: getMetricLabel("Penalty Influence"), val: Number(fixture.penalty_influence || 0).toFixed(2),           col: "text-rose-400"   },
          ].map(({ icon: Icon, label, val, col }) => (
            <div key={label}>
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={12} className={col} />
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">{label}</span>
              </div>
              <p className={`font-display text-2xl font-black ${col}`}>{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((t) => (
            <span key={t.label} className="rounded-full px-2 py-0.5 text-[9px] font-bold"
              style={{ color: t.color, background: t.bg, border: `1px solid ${t.color}33` }}>
              {t.label}
            </span>
          ))}
        </div>
      )}

      {/* AI verdict */}
      <div className="rounded-[12px] px-3 py-2 flex items-start gap-2 mb-3"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <Zap size={11} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-500 leading-relaxed italic">{verdict}</p>
      </div>

      {/* FPL mini layer */}
      {fplTips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {fplTips.map((tip, i) => (
            <span key={i} className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold"
              style={{
                color: tip.positive ? "#10b981" : "#f87171",
                background: tip.positive ? "rgba(16,185,129,0.06)" : "rgba(244,63,94,0.06)",
                border: `1px solid ${tip.positive ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)"}`,
              }}>
              <Users size={8} />{tip.text}
            </span>
          ))}
        </div>
      )}

      <div className="pt-3 flex items-center justify-between text-xs"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <span className="text-slate-600">{refName}</span>
        <span className="font-bold text-emerald-400 flex items-center gap-1 group-hover:gap-2 transition-all">
          View Intelligence <ArrowUpRight size={12} />
        </span>
      </div>
    </button>
  );
}
