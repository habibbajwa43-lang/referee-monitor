import { Gauge, Tickets, Siren, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FeaturedMatchCard({ match }) {
  const navigate = useNavigate();

  return (
    <section className="py-16" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">🔥 Spotlight</p>
          <h2 className="font-display text-4xl font-black text-white uppercase">Featured Match Insight</h2>
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
                <div className="flex items-center gap-2 mb-5">
                  <span className="rounded-full px-3 py-1 text-xs font-bold text-yellow-400"
                    style={{ background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.2)" }}>
                    ⚠ HIGH IMPORTANCE
                  </span>
                  <span className="rounded-full px-3 py-1 text-xs font-bold text-rose-400"
                    style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)" }}>
                    🔴 CHAOS FIXTURE
                  </span>
                  <span className="rounded-full px-3 py-1 text-xs font-bold text-emerald-400"
                    style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                    CONFIDENCE: 78%
                  </span>
                </div>

                <h3 className="font-display text-4xl font-black text-white">
                  {match ? `${match.home_team} vs ${match.away_team}` : "Arsenal vs Tottenham"}
                </h3>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { icon: Gauge, label: "Ref Impact", val: match ? Number(match.predicted_ref_monitor_score || 0).toFixed(0) : "72", color: "text-emerald-400" },
                    { icon: Tickets, label: "Card Risk", val: match ? Number(match.card_intensity || 0).toFixed(2) : "0.68", color: "text-yellow-400" },
                    { icon: Percent, label: "Penalty", val: match ? Number(match.penalty_influence || 0).toFixed(2) : "0.51", color: "text-rose-400" },
                  ].map(({ icon: Icon, label, val, color }) => (
                    <div key={label} className="rounded-2xl p-4"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Icon size={12} className={color} />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{label}</span>
                      </div>
                      <p className={`font-display text-3xl font-black ${color}`}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="p-8 flex flex-col justify-center"
              style={{ background: "rgba(255,255,255,0.02)", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">Match Analysis</p>
              <p className="text-slate-400 leading-relaxed text-sm mb-6">
                This fixture carries elevated referee impact probability. Based on historical patterns,
                expect increased card activity and potential VAR interventions in key moments.
              </p>
              <button
                className="btn-accent w-full py-3 text-sm font-bold uppercase tracking-wider"
              >
                View Full Insight →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
