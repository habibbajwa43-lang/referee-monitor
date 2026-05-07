import { Database, BarChart3, Target, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const items = [
  { title: "5+ Seasons of Data", desc: "Every card, penalty, and foul analysed across thousands of Premier League matches.", icon: Database, color: "#10b981" },
  { title: "Transparent Model", desc: "Rule-based scoring with no black boxes — every metric is fully explainable and traceable.", icon: BarChart3, color: "#818cf8" },
  { title: "Fixture Context Engine", desc: "Match importance, derby history, and rivalry pressure dynamically adjust each referee's influence score.", icon: Target, color: "#f59e0b" },
];

const metricSummary = [
  { icon: "🔥", key: "Chaos Index", tip: "High = more volatile fixtures", color: "#f59e0b" },
  { icon: "🟨", key: "Strictness",  tip: "High = more cards & fouls",    color: "#eab308" },
  { icon: "🎯", key: "Penalty Risk", tip: "High = increased penalty probability", color: "#f43f5e" },
  { icon: "⚡", key: "VAR Involvement", tip: "High = frequent VAR decisions", color: "#818cf8" },
  { icon: "📊", key: "Ref Impact Score", tip: "Higher = greater match influence, not referee quality", color: "#10b981" },
];

export default function MethodologyPreview() {
  const navigate = useNavigate();
  return (
    <section className="py-20 relative" style={{
      background: "var(--surface)",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      borderBottom: "1px solid rgba(255,255,255,0.05)"
    }}>
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">Our Approach</p>
        <h3 className="font-display text-5xl font-black text-white uppercase mb-4">How Ref Monitor Works</h3>
        <p className="text-slate-500 max-w-xl mx-auto mb-14">
          Built on real match data, combining referee behaviour, match context, and decision patterns across 5+ Premier League seasons.
        </p>

        <div className="grid gap-5 md:grid-cols-3 mb-12">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="card-dark p-6 text-left group">
                <div className="h-11 w-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                  <Icon size={20} style={{ color: item.color }} />
                </div>
                <h4 className="font-display text-xl font-black text-white uppercase mb-2">{item.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Metric quick-reference */}
        <div className="rounded-[20px] p-6 mb-10 text-left"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5 text-center">
            Quick Metric Reference
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {metricSummary.map((m) => (
              <div key={m.key}
                className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${m.color}20` }}>
                <span className="text-xl block mb-2">{m.icon}</span>
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: m.color }}>{m.key}</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">{m.tip}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => navigate("/methodology")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-emerald-400 transition hover:bg-emerald-400/10"
          style={{ border: "1px solid rgba(16,185,129,0.3)" }}>
          Read Full Methodology <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}
