import { ArrowRight, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statPills = [
  { icon: "🔥", label: "Chaos Index™", value: "78", sub: "HIGH", color: "#f59e0b" },
  { icon: "🎯", label: "Penalty Prob", value: "0.42", sub: "21 matches avg", color: "#10b981" },
  { icon: "🟨", label: "Card Strictness", value: "4.8", sub: "Per game avg", color: "#eab308" },
  { icon: "⚡", label: "Ref Impact Score", value: "82", sub: "HIGH", color: "#10b981" },
];

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden" style={{ minHeight: "100vh", background: "#07090f" }}>

      {/* Full background image — right side fade */}
      <div className="absolute inset-0">
        <img
          src="/images/hero.png"
          alt=""
          className="absolute right-0 top-0 h-full w-[65%] object-cover object-top"
          style={{ opacity: 0.55 }}
        />
        {/* Left dark fade so text is readable */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(90deg, #07090f 38%, rgba(7,9,15,0.75) 60%, rgba(7,9,15,0.15) 100%)"
        }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40" style={{
          background: "linear-gradient(to top, #07090f, transparent)"
        }} />
        {/* Green tint overlay */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 50% 60% at 75% 50%, rgba(16,185,129,0.08), transparent)"
        }} />
      </div>

      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 flex flex-col justify-center" style={{ minHeight: "100vh" }}>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 w-fit"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-live" />
          <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
            5+ Seasons of Premier League Data
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-black uppercase text-white mb-6"
          style={{ fontSize: "clamp(52px, 7.5vw, 110px)", lineHeight: 0.88, letterSpacing: "-0.01em", maxWidth: 700 }}>
          Predict<br />Referee<br />
          <span style={{ color: "#10b981", WebkitTextStroke: "0px" }}>Impact.</span>
        </h1>

        <p className="text-lg text-slate-400 leading-relaxed mb-2" style={{ maxWidth: 460 }}>
          Analyse referee behaviour, match context, and decision patterns.
          Predict cards, penalties, and chaos risk —{" "}
          <strong className="text-white">before kickoff.</strong>
        </p>

        <p className="text-xs tracking-[0.4em] text-slate-600 uppercase mb-8">
          Generate shareable stat graphics for any referee
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mb-12">
          <button
            onClick={() => navigate("/matches")}
            className="btn-accent flex items-center gap-2 px-7 py-4 text-sm font-bold uppercase tracking-wider"
          >
            <Zap size={15} /> View Chaos Fixtures <ArrowRight size={15} />
          </button>
          <button
            onClick={() => navigate("/referees")}
            className="flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#94a3b8" }}
          >
            <Target size={15} /> Explore Referees
          </button>
        </div>

        {/* Stat pills — horizontal row */}
        <div className="flex flex-wrap gap-3">
          {statPills.map((s) => (
            <div key={s.label} className="rounded-2xl px-5 py-4 flex items-center gap-4"
              style={{
                background: "rgba(14,18,25,0.85)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                minWidth: 160
              }}>
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="font-display text-2xl font-black leading-none" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[9px] text-slate-600 uppercase tracking-wider mt-0.5">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* bottom label */}
        <p className="mt-10 text-xs text-slate-700 tracking-widest uppercase">
          Data updated weekly · Analysed across 5+ Premier League seasons
        </p>
      </div>
    </section>
  );
}