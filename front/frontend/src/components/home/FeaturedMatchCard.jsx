import { Gauge, Zap, Target, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getMatchVerdict,
  getFPLImplications,
  getActionableTags,
  getConfidenceLevel,
  getMetricLabel,
} from "../../utils/refereeIntelligence";

export default function FeaturedMatchCard({ match }) {
  const navigate  = useNavigate();
  const verdict   = getMatchVerdict(match || {});
  const fplTips   = getFPLImplications(match || {}).slice(0, 3);
  const tags      = getActionableTags(match || {}).slice(0, 3);
  const conf      = getConfidenceLevel(match || {});

  const risk = match?.risk_band || "RED";
  const riskColor =
    risk === "RED"   ? { text: "#f43f5e", bg: "rgba(244,63,94,0.08)",  border: "rgba(244,63,94,0.2)"  } :
    risk === "AMBER" ? { text: "#eab308", bg: "rgba(234,179,8,0.08)",  border: "rgba(234,179,8,0.2)"  } :
                       { text: "#10b981", bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.15)" };

  const dominantLabel =
    risk === "RED"   ? "HIGH CHAOS FIXTURE" :
    risk === "AMBER" ? "ELEVATED RISK FIXTURE" : "CLEAN FIXTURE";

  return (
    <section className="py-16" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">🔥 Spotlight</p>
          <h2 className="font-display text-4xl font-black text-white uppercase">Featured Match Intelligence</h2>
          <p className="text-slate-500 text-sm mt-1">Highest referee impact fixture this week</p>
        </div>

        <div
          className="rounded-[28px] overflow-hidden cursor-pointer group transition-all duration-500 hover:-translate-y-1"
          onClick={() => navigate(`/matches/${match?.fixture_id || ""}`)}
          style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 0 60px rgba(16,185,129,0.1)"}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
        >
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            {/* Left panel */}
            <div className="p-8 relative">
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at top left, rgba(16,185,129,0.04), transparent 70%)" }} />
              <div className="relative">

                {/* Dominant label — ONE clear takeaway */}
                <div className="inline-block rounded-xl px-4 py-2 mb-5"
                  style={{ background: riskColor.bg, border: `1px solid ${riskColor.border}` }}>
                  <p className="font-display text-xl font-black uppercase tracking-tight"
                    style={{ color: riskColor.text }}>{dominantLabel}</p>
                </div>

                {/* Fixture title */}
                <h3 className="font-display text-4xl font-black text-white mb-4">
                  {match ? `${match.home_team} vs ${match.away_team}` : "Arsenal vs Tottenham"}
                </h3>

                {/* Actionable tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {tags.map((t) => (
                      <span key={t.label} className="rounded-full px-2.5 py-1 text-[10px] font-bold"
                        style={{ color: t.color, background: t.bg, border: `1px solid ${t.color}33` }}>
                        {t.label}
                      </span>
                    ))}
                    <span className="rounded-full px-2.5 py-1 text-[10px] font-bold text-emerald-400"
                      style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                      Confidence: {conf.label} · {conf.pct}%
                    </span>
                  </div>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { icon: Gauge,  label: getMetricLabel("RM Score"),         val: match ? Number(match.predicted_ref_monitor_score || 0).toFixed(0) : "72", color: "text-emerald-400" },
                    { icon: Target, label: getMetricLabel("Card Intensity"),    val: match ? Number(match.card_intensity || 0).toFixed(2) : "0.68",            color: "text-yellow-400" },
                    { icon: Zap,    label: getMetricLabel("Penalty Influence"), val: match ? Number(match.penalty_influence || 0).toFixed(2) : "0.51",          color: "text-rose-400"   },
                  ].map(({ icon: Icon, label, val, color }) => (
                    <div key={label} className="rounded-2xl p-4"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Icon size={12} className={color} />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">{label}</span>
                      </div>
                      <p className={`font-display text-3xl font-black ${color}`}>{val}</p>
                    </div>
                  ))}
                </div>

                {/* Verdict */}
                <div className="rounded-[14px] px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 flex items-center gap-1">
                    <Zap size={9} className="text-amber-400" /> Intelligence Verdict
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed italic">"{verdict}"</p>
                </div>
              </div>
            </div>

            {/* Right panel: FPL + CTA */}
            <div className="p-8 flex flex-col justify-between"
              style={{ background: "rgba(255,255,255,0.02)", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Users size={13} className="text-slate-500" />
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">FPL Intelligence</p>
                </div>
                <div className="space-y-2 mb-6">
                  {fplTips.length > 0 ? fplTips.map((tip, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2"
                      style={{
                        background: tip.positive ? "rgba(16,185,129,0.05)" : "rgba(244,63,94,0.05)",
                        border: `1px solid ${tip.positive ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.12)"}`,
                      }}>
                      <span className="text-sm">{tip.icon}</span>
                      <span className="text-xs font-semibold" style={{ color: tip.positive ? "#10b981" : "#f87171" }}>
                        {tip.text}
                      </span>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-400 leading-relaxed">
                      This fixture carries elevated referee impact probability based on historical patterns and current model signals.
                    </p>
                  )}
                </div>
              </div>
              <button className="btn-accent w-full py-3 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                Full Intelligence Report <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
