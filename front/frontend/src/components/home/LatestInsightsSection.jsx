import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { AlertTriangle, Percent, Activity } from "lucide-react";

function scaleMetric(v) { return Math.max(0, Math.min(100, (Number(v) || 0) * 100)); }

export default function LatestInsightsSection({ matchData }) {
  const navigate = useNavigate();

  const chartPoints = useMemo(() => {
    const data = matchData || { strictness_index: 0.7, decision_volatility: 0.8, pressure_sensitivity: 0.6, var_interaction_score: 0.9, fixture_context_alignment: 0.75 };
    const metrics = [scaleMetric(data.strictness_index), scaleMetric(data.decision_volatility), scaleMetric(data.pressure_sensitivity), scaleMetric(data.var_interaction_score), scaleMetric(data.fixture_context_alignment)];
    const cx = 120, cy = 120, r = 78, step = (Math.PI * 2) / 5, start = -Math.PI / 2;
    return metrics.map((m, i) => { const a = start + i * step; return `${cx + Math.cos(a) * r * (m/100)},${cy + Math.sin(a) * r * (m/100)}`; }).join(" ");
  }, [matchData]);

  const cards = [
    {
      badge: "⚠ CHAOS SIGNAL", badgeColor: "#f59e0b", badgeBg: "rgba(234,179,8,0.12)", badgeBorder: "rgba(234,179,8,0.2)",
      title: "High Chaos Risk Detected", sub: "Multiple fixtures show elevated volatility this week",
      accent: "#f59e0b",
      body: (
        <div className="space-y-2 mt-4">
          {[["Chelsea vs Man United","🇬🇧"],["Napoli vs Inter Milan","🇮🇹"]].map(([m, f]) => (
            <div key={m} className="flex justify-between items-center px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-sm text-slate-300">{f} {m}</span>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: "rgba(234,179,8,0.12)", color: "#eab308" }}>HIGH RISK</span>
            </div>
          ))}
        </div>
      ),
      cta: "Explore Chaos Fixtures →", path: "/matches",
    },
    {
      badge: "🚨 PENALTY SIGNAL", badgeColor: "#f43f5e", badgeBg: "rgba(244,63,94,0.12)", badgeBorder: "rgba(244,63,94,0.2)",
      title: "Penalty Probability Spike", sub: "Referee profile indicates elevated penalty likelihood",
      accent: "#f43f5e",
      body: (
        <div className="mt-4">
          <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.12)" }}>
            <p className="font-display text-5xl font-black text-rose-400">39%</p>
            <p className="text-xs text-slate-600 uppercase tracking-wider mt-1">Avg Penalty Probability</p>
          </div>
          <div className="space-y-2">
            {[["Dortmund vs Leverkusen","🇩🇪"],["Tottenham vs Liverpool","🇬🇧"]].map(([m, f]) => (
              <div key={m} className="flex justify-between items-center px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-sm text-slate-300">{f} {m}</span>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: "rgba(244,63,94,0.12)", color: "#f43f5e" }}>WATCH</span>
              </div>
            ))}
          </div>
        </div>
      ),
      cta: "View Penalty Signals →", path: "/insights",
    },
    {
      badge: "⚡ MATCH INSIGHT", badgeColor: "#10b981", badgeBg: "rgba(16,185,129,0.12)", badgeBorder: "rgba(16,185,129,0.2)",
      title: "PSG vs Marseille", sub: "Referee profile suggests elevated match volatility",
      accent: "#10b981",
      body: (
        <div className="mt-4">
          <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}>
            <p className="font-display text-5xl font-black text-emerald-400">62%</p>
            <p className="text-xs text-slate-600 uppercase tracking-wider mt-1">Match Risk Index</p>
          </div>
          <svg viewBox="0 0 240 240" className="h-44 w-full">
            {["120,42 194,94 165,182 75,182 46,94","120,62 176,102 154,169 86,169 64,102","120,82 158,110 143,156 97,156 82,110"].map((pts,i) => (
              <polygon key={i} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            ))}
            <polygon points={chartPoints} fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="2" />
            {[["120","24","Strictness"],["212","92","Volatility"],["173","202","Pressure"],["67","202","VAR"],["28","92","Context"]].map(([x,y,l]) => (
              <text key={l} x={x} y={y} textAnchor="middle" fontSize="10" fill="#475569">{l}</text>
            ))}
          </svg>
        </div>
      ),
      cta: "View Full Breakdown →", path: "/matches/1",
    },
  ];

  return (
    <section className="py-20 relative" style={{ background: "var(--surface)" }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img src="/images/stadium.jpeg" alt="" className="w-full h-full object-cover opacity-[0.04]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">Weekly Signals</p>
          <h2 className="font-display text-5xl font-black text-white uppercase">This Week's Referee Signals</h2>
          <p className="mt-2 text-slate-500">Data-driven signals based on referee behaviour, match context, and historical patterns.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {cards.map((c) => (
            <div key={c.title} className="card-dark p-6 flex flex-col relative pt-8">
              {/* Badge */}
              <div className="absolute -top-3.5 left-6">
                <span className="rounded-full px-3 py-1 text-xs font-bold"
                  style={{ background: c.badgeBg, color: c.badgeColor, border: `1px solid ${c.badgeBorder}` }}>
                  {c.badge}
                </span>
              </div>

              <h3 className="font-display text-2xl font-black text-white uppercase">{c.title}</h3>
              <p className="text-sm text-slate-500 mt-1 mb-2">{c.sub}</p>

              {c.body}

              <button
                onClick={() => navigate(c.path)}
                className="mt-5 w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5"
                style={{ background: `${c.accent}18`, color: c.accent, border: `1px solid ${c.accent}30` }}
                onMouseEnter={(e) => e.currentTarget.style.background = `${c.accent}25`}
                onMouseLeave={(e) => e.currentTarget.style.background = `${c.accent}18`}
              >
                {c.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
