import { useEffect, useState } from "react";

const PIPELINE = [
  {
    step: "01",
    label: "Raw Data",
    desc: "Fixtures, events, assignments",
    color: "#64748b",
    glow: "rgba(100,116,139,0.3)",
  },
  {
    step: "02",
    label: "Signal Extraction",
    desc: "Cards, VAR, penalties, fouls",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.35)",
  },
  {
    step: "03",
    label: "Ref Profiling",
    desc: "Chaos, strictness, volatility",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.35)",
  },
  {
    step: "04",
    label: "Fixture Blending",
    desc: "Context + referee interaction",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.35)",
  },
  {
    step: "05",
    label: "RM Score",
    desc: "Weighted composite output",
    color: "#10b981",
    glow: "rgba(16,185,129,0.45)",
  },
];

const SCORE_SEGMENTS = [
  { range: "0–40",  label: "Low Impact",   color: "#10b981", width: "20%" },
  { range: "40–55", label: "Moderate",     color: "#eab308", width: "18%" },
  { range: "55–70", label: "Elevated",     color: "#f59e0b", width: "20%" },
  { range: "70–85", label: "High Impact",  color: "#f43f5e", width: "22%" },
  { range: "85+",   label: "Critical",     color: "#e11d48", width: "20%" },
];

export default function MetricMap() {
  const [active, setActive] = useState(null);
  const [barAnim, setBarAnim] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarAnim(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mb-8">
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">
          Scoring Architecture
        </p>
        <h2 className="font-display text-4xl font-bold text-white">
          From Raw Data to RM Score
        </h2>
        <p className="mt-2 text-slate-500 text-sm max-w-xl leading-6">
          Every referee score follows a deterministic five-stage pipeline — no black box, no guesswork.
        </p>
      </div>

      {/* Pipeline */}
      <div className="rounded-[28px] p-6 mb-5"
        style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-0 overflow-x-auto pb-2">
          {PIPELINE.map((p, i) => (
            <div key={p.step} className="flex items-center flex-shrink-0">
              <button
                onClick={() => setActive(active === i ? null : i)}
                className="flex flex-col items-center gap-2 px-4 transition-all duration-200"
                style={{ outline: "none" }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-display text-xl font-black transition-all duration-300"
                  style={{
                    background: active === i ? p.color : `${p.color}18`,
                    border: `2px solid ${active === i ? p.color : p.color + "44"}`,
                    boxShadow: active === i ? `0 0 20px ${p.glow}` : "none",
                    color: active === i ? "#000" : p.color,
                    transform: active === i ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {p.step}
                </div>
                <span className="text-[11px] font-bold text-center text-slate-400 max-w-[72px] leading-4">
                  {p.label}
                </span>
              </button>
              {i < PIPELINE.length - 1 && (
                <div className="flex-shrink-0 mx-1 h-px w-8 relative" style={{ marginTop: -14 }}>
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                    <div className="text-slate-700 text-xs ml-1">›</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {active !== null && (
          <div
            className="mt-4 rounded-[14px] p-4 transition-all duration-300"
            style={{
              background: `${PIPELINE[active].color}0d`,
              border: `1px solid ${PIPELINE[active].color}33`,
            }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1"
              style={{ color: PIPELINE[active].color }}>
              Stage {PIPELINE[active].step} — {PIPELINE[active].label}
            </p>
            <p className="text-sm text-slate-400 leading-6">{PIPELINE[active].desc}</p>
          </div>
        )}
      </div>

      {/* Score Range Map */}
      <div className="rounded-[28px] p-6"
        style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
          RM Score Band Reference
        </p>
        <div className="flex w-full overflow-hidden rounded-xl h-10">
          {SCORE_SEGMENTS.map((seg, i) => (
            <div
              key={seg.range}
              className="flex items-center justify-center relative transition-all duration-700"
              style={{
                width: barAnim ? seg.width : "0%",
                background: seg.color,
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <span className="text-[10px] font-black text-black/70 hidden sm:block">{seg.range}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {SCORE_SEGMENTS.map((seg) => (
            <div key={seg.range} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
              <span className="text-xs text-slate-500">
                <span className="font-bold text-slate-300">{seg.range}</span> — {seg.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
