import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

/**
 * Metric definitions — one source of truth for the whole app.
 */
export const METRIC_DEFINITIONS = {
  chaos_index: {
    name: "Chaos Index",
    short: "Predicts how volatile a match may become based on referee behaviour, cards, penalties and VAR involvement.",
    detail: "Scored 0–100. A score above 70 signals a high-volatility fixture where cards, disputed decisions and VAR interventions are more likely.",
    color: "#f59e0b",
  },
  rm_score: {
    name: "Ref Impact Score",
    short: "Measures how significantly a referee influences the outcome and flow of a match — not referee quality.",
    detail: "Higher score = greater match influence. A high score means the referee's decisions materially shaped the game, not that they are a better or worse referee.",
    color: "#10b981",
  },
  strictness: {
    name: "Strictness",
    short: "How frequently a referee issues cards and awards free kicks relative to the Premier League average.",
    detail: "Scored 0–100. Above 70 = strict enforcement with more cards per game. Below 40 = lenient, game-flow-focused style.",
    color: "#eab308",
  },
  penalty_risk: {
    name: "Penalty Risk",
    short: "The probability that this referee will award at least one penalty during a match, based on historical patterns.",
    detail: "Expressed as a percentage. Referees above 50% have historically awarded penalties at more than twice the base rate.",
    color: "#f43f5e",
  },
  var_heavy: {
    name: "VAR Involvement",
    short: "How frequently VAR is used when this referee officiates — covering reviews, overturns and upheld decisions.",
    detail: "Scored 0–100. A high score means VAR is regularly consulted and decisions are frequently reviewed in matches this referee officiates.",
    color: "#818cf8",
  },
};

export default function MetricTooltip({ metric, children, size = 13, className = "" }) {
  const def = METRIC_DEFINITIONS[metric] || {};
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState("top"); // "top" | "bottom"
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Flip tooltip if near bottom of viewport
  const toggle = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos(rect.top > window.innerHeight / 2 ? "top" : "bottom");
    }
    setOpen((v) => !v);
  };

  return (
    <span
      ref={ref}
      className={`relative inline-flex items-center gap-1 ${className}`}
      style={{ cursor: "help" }}
    >
      {children}
      <button
        onClick={toggle}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-100 opacity-50"
        style={{ lineHeight: 1 }}
        aria-label={`What is ${def.name}?`}
      >
        <Info size={size} style={{ color: def.color || "#64748b" }} />
      </button>

      {open && (
        <span
          className="absolute z-50 rounded-xl p-3 w-64 text-left pointer-events-none"
          style={{
            background: "#0e1219",
            border: `1px solid ${def.color || "#334155"}40`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)`,
            ...(pos === "top"
              ? { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" }
              : { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" }),
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: def.color || "#10b981" }}>
            {def.name}
          </p>
          <p className="text-xs text-slate-300 leading-relaxed mb-1.5">{def.short}</p>
          {def.detail && (
            <p className="text-[10px] text-slate-500 leading-relaxed">{def.detail}</p>
          )}
        </span>
      )}
    </span>
  );
}
