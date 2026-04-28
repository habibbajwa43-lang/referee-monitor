import { BarChart3, Users, Mic, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    img: "/images/au-graph.png",
    icon: BarChart3,
    title: "For Analysts",
    desc: "Analyse referee patterns using Chaos Index™, decision volatility, and historical match control data.",
    cta: "View Referees",
    path: "/referees",
    color: "#10b981",
  },
  {
    img: "/images/fan.png",
    icon: Users,
    title: "For Fans",
    desc: "Know what to expect before kickoff — will your match have a strict ref, penalty drama, or VAR chaos?",
    cta: "Explore Matches",
    path: "/matches",
    color: "#818cf8",
  },
  {
    img: "/images/refree.png",
    icon: Mic,
    title: "For Media",
    desc: "Data-backed referee briefings and shareable stat graphics for match previews and post-game analysis.",
    cta: "Browse Insights",
    path: "/insights",
    color: "#f59e0b",
  },
];

export default function AudienceSection() {
  const navigate = useNavigate();
  return (
    <section className="py-20" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">Who It's For</p>
        <h2 className="font-display text-5xl font-black text-white uppercase mb-4">
          Referee Intelligence for Every Perspective
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto mb-14">
          Understand matches differently — whether you're analysing, watching, or reporting.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <div key={c.title} className="card-dark p-6 text-left group flex flex-col">
              <div className="h-14 w-14 rounded-xl flex items-center justify-center mb-5 flex-shrink-0"
                style={{ background: `${c.color}15`, border: `1px solid ${c.color}25` }}>
                <c.icon size={22} style={{ color: c.color }} />
              </div>
              <h3 className="font-display text-2xl font-black text-white uppercase mb-2">{c.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-1">{c.desc}</p>
              <button
                onClick={() => navigate(c.path)}
                className="mt-5 flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition"
                style={{ color: c.color }}
              >
                {c.cta} <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
