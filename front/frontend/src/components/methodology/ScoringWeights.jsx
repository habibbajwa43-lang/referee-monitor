import { useEffect, useState } from "react";

const weights = [
  { label: "Strictness Index", value: "20%", num: 20 },
  { label: "Decision Volatility", value: "20%", num: 20 },
  { label: "Pressure Sensitivity", value: "15%", num: 15 },
  { label: "Fixture Context Alignment", value: "15%", num: 15 },
  { label: "VAR Interaction Score", value: "10%", num: 10 },
  { label: "Referee Chaos Index", value: "15%", num: 15 },
];

export default function ScoringWeights() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 120);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mb-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">

      {/* Left panel */}
      <div className="rounded-[28px] p-8"
        style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}>
        <h2 className="font-display text-4xl font-bold text-white mb-4">
          Weighted Score Model
        </h2>
        <p className="text-base leading-8 text-slate-400">
          Ref Monitor Score is built using a deterministic weighted model. This
          keeps the system interpretable and avoids black-box outputs.
        </p>

        <div className="mt-8 space-y-5">
          {weights.map((item, index) => (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-slate-300 text-sm">{item.label}</span>
                <span className="font-bold text-emerald-400 text-sm">{item.value}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                <div
                  className="h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: animate ? item.value : "0%",
                    transitionDelay: `${index * 120}ms`,
                    background: "linear-gradient(90deg, #10b981, #34d399)",
                    boxShadow: "0 0 8px rgba(16,185,129,0.4)"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="rounded-[28px] p-8"
        style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h3 className="font-display text-3xl font-bold text-white mb-6">
          What the Score Represents
        </h3>

        <div className="space-y-4">
          {[
            {
              title: "Ref Monitor Score",
              text: "Overall referee performance score balancing discipline, volatility, consistency, context fit, and control quality.",
              color: "#10b981"
            },
            {
              title: "Ref Impact Score",
              text: "Match-level signal estimating how strongly a referee is likely to shape the dynamics of a particular fixture.",
              color: "#818cf8"
            },
            {
              title: "Risk Bands",
              text: "Fixtures are classified into GREEN, AMBER, or RED bands based on combined referee impact and volatility characteristics.",
              color: "#f59e0b"
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[18px] p-5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h4 className="font-display text-xl font-bold mb-2"
                style={{ color: item.color }}>
                {item.title}
              </h4>
              <p className="text-sm leading-7 text-slate-400">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}