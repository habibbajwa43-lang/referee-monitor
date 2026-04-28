import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Siren, Image } from "lucide-react";

function scaleMetric(v) { return Math.max(0, Math.min(100, (Number(v) || 0) * 100)); }

export default function RefereeProfilePreview({ referee, loading }) {
  const navigate = useNavigate();

  const chartPoints = useMemo(() => {
    if (!referee) return "";
    const metrics = [
      scaleMetric(referee.strictness_index),
      scaleMetric(referee.decision_volatility),
      scaleMetric(referee.pressure_sensitivity),
      scaleMetric(referee.var_interaction_score),
      scaleMetric(referee.fixture_context_alignment),
    ];
    const cx = 120, cy = 120, r = 78, step = (Math.PI * 2) / 5, start = -Math.PI / 2;
    return metrics.map((m, i) => {
      const a = start + i * step;
      return `${cx + Math.cos(a) * r * (m / 100)},${cy + Math.sin(a) * r * (m / 100)}`;
    }).join(" ");
  }, [referee]);

  const penaltyPct = referee ? `${Math.round(Number(referee.referee_penalty_probability || 0))}%` : "38%";

  return (
    <section className="py-16" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">🎯 DNA Snapshot</p>
          <h2 className="font-display text-4xl font-black text-white uppercase">Referee Profile Preview</h2>
        </div>

        <div className="rounded-[28px] overflow-hidden" style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="grid lg:grid-cols-[60%_40%]">
            {/* Left */}
            <div className="p-8">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
                style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Referee DNA</span>
              </div>

              <h3 className="font-display text-3xl font-black text-white mb-1">
                {loading ? "Loading..." : referee?.full_name || "Craig Pawson"}
              </h3>
              <p className="text-slate-500 text-sm mb-5">How this referee impacts match outcomes</p>

              <ul className="space-y-2 mb-6">
                {["Calm under pressure", "Low VAR intervention", "Strong control in high-stakes fixtures"].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-emerald-400">✔</span> {t}
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: "Ref Impact", val: referee ? Number(referee.ref_monitor_score || 0).toFixed(1) : "72", color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.15)" },
                  { emoji: "🔥", label: "Chaos Index", val: "Medium", color: "#f59e0b", bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.15)" },
                  { icon: Siren, label: "Penalty Prob", val: penaltyPct, color: "#f43f5e", bg: "rgba(244,63,94,0.08)", border: "rgba(244,63,94,0.15)" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3"
                    style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: s.color }}>
                      {s.emoji || ""}{s.label}
                    </div>
                    <p className="font-display text-2xl font-black" style={{ color: s.color }}>{s.val}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => referee ? navigate(`/referees/${referee.referee_id}`) : navigate("/referees")}
                  className="btn-accent flex-1 py-3 text-sm font-bold uppercase tracking-wider"
                >
                  View Full Profile →
                </button>
                <button
                  onClick={() => navigate("/referees")}
                  className="px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  title="Generate Stat Graphic"
                >
                  <Image size={15} />
                </button>
              </div>
            </div>

            {/* Right — radar chart */}
            <div className="p-8 flex flex-col items-center justify-center"
              style={{ background: "rgba(255,255,255,0.02)", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="text-right w-full mb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-600">Overall Score</p>
                <p className="font-display text-5xl font-black text-emerald-400">
                  {referee ? Number(referee.ref_monitor_score || 0).toFixed(1) : "72"}
                </p>
              </div>

              <svg viewBox="0 0 240 240" className="h-52 w-52">
                <polygon points="120,42 194,94 165,182 75,182 46,94" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <polygon points="120,62 176,102 154,169 86,169 64,102" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <polygon points="120,82 158,110 143,156 97,156 82,110" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <line x1="120" y1="120" x2="120" y2="42" stroke="rgba(255,255,255,0.05)" />
                <line x1="120" y1="120" x2="194" y2="94" stroke="rgba(255,255,255,0.05)" />
                <line x1="120" y1="120" x2="165" y2="182" stroke="rgba(255,255,255,0.05)" />
                <line x1="120" y1="120" x2="75" y2="182" stroke="rgba(255,255,255,0.05)" />
                <line x1="120" y1="120" x2="46" y2="94" stroke="rgba(255,255,255,0.05)" />
                {referee && (
                  <polygon points={chartPoints} fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="2" />
                )}
                {[["120","24","Strictness"],["215","92","Volatility"],["173","202","Pressure"],["67","202","VAR"],["25","92","Context"]].map(([x,y,l]) => (
                  <text key={l} x={x} y={y} textAnchor="middle" fontSize="10" fill="#475569">{l}</text>
                ))}
              </svg>

              <p className="text-sm font-bold text-center mt-2">
                IMPACT: <span className="text-emerald-400">HIGH</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
