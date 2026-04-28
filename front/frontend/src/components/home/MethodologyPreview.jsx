import { Database, BarChart3, Target, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const items = [
  { title: "5+ Seasons of Data", desc: "Every card, penalty, and foul analysed across thousands of PL matches.", icon: Database, color: "#10b981" },
  { title: "Deterministic Model", desc: "Transparent rule-based scoring — no black boxes, fully explainable.", icon: BarChart3, color: "#818cf8" },
  { title: "Fixture Context Engine", desc: "Match importance and rivalry pressure dynamically adjust predictions.", icon: Target, color: "#f59e0b" },
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
          Built on real match data, combining referee behaviour, match context, and decision patterns.
        </p>

        <div className="grid gap-5 md:grid-cols-3 mb-10">
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

        <button onClick={() => navigate("/methodology")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-emerald-400 transition hover:bg-emerald-400/10"
          style={{ border: "1px solid rgba(16,185,129,0.3)" }}>
          Read Full Methodology <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}
