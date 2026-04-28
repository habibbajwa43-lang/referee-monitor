import { useEffect, useState } from "react";

const BAR_COLORS = {
  "Volatility":         { gradient: "linear-gradient(90deg,#f43f5e,#fb7185)", glow: "rgba(244,63,94,0.35)" },
  "VAR Interaction":    { gradient: "linear-gradient(90deg,#818cf8,#a5b4fc)", glow: "rgba(129,140,248,0.35)" },
  "Penalty Influence":  { gradient: "linear-gradient(90deg,#f59e0b,#fbbf24)", glow: "rgba(245,158,11,0.35)" },
  "Card Intensity":     { gradient: "linear-gradient(90deg,#eab308,#fde047)", glow: "rgba(234,179,8,0.35)" },
};

function getBarStyle(label, value, animate, index) {
  const meta = BAR_COLORS[label] || { gradient: "linear-gradient(90deg,#10b981,#34d399)", glow: "rgba(16,185,129,0.3)" };
  return {
    width: animate ? `${Math.min(100, Number(value || 0) * 100)}%` : "0%",
    background: meta.gradient,
    boxShadow: animate ? `0 0 10px ${meta.glow}` : "none",
    transition: `width 900ms ease-out ${index * 120}ms, box-shadow 900ms ease-out ${index * 120}ms`,
  };
}

function getRiskLabel(value) {
  const v = Number(value || 0);
  if (v >= 0.85) return { text: "CRITICAL", color: "#f43f5e" };
  if (v >= 0.65) return { text: "HIGH", color: "#f59e0b" };
  if (v >= 0.45) return { text: "MODERATE", color: "#eab308" };
  return { text: "LOW", color: "#10b981" };
}

export default function MatchRiskBreakdown({ detail, loading }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 80);
    return () => clearTimeout(t);
  }, [detail]);

  if (loading || !detail) {
    return (
      <div className="mt-6 rounded-[24px] border border-white/6 bg-transparent p-6 text-center text-slate-500 ">
        Loading risk breakdown...
      </div>
    );
  }

  const bars = detail?.bars || [
    { label: "Volatility", value: 0.64 },
    { label: "VAR Interaction", value: 0.58 },
    { label: "Penalty Influence", value: 0.54 },
    { label: "Card Intensity", value: 0.48 },
  ];

  // Risk Assessment summary
  const riskBand = detail.risk || "RED";
  const riskPanelColor = riskBand === "RED" ? { bg: "rgba(244,63,94,0.07)", border: "rgba(244,63,94,0.2)", text: "#f43f5e" }
    : riskBand === "AMBER" ? { bg: "rgba(234,179,8,0.07)", border: "rgba(234,179,8,0.2)", text: "#eab308" }
    : { bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.2)", text: "#10b981" };

  const riskBullets = riskBand === "RED"
    ? ["High volatility detected", "Elevated VAR interaction", "Increased penalty chance", "Card-heavy officiating likely"]
    : riskBand === "AMBER"
    ? ["Moderate volatility", "Some VAR interaction expected", "Moderate penalty risk", "Standard card frequency"]
    : ["Low volatility", "Minimal VAR interference", "Below-average penalty risk", "Clean officiating expected"];

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
      {/* Bar Chart */}
      <div className="rounded-[24px] border border-white/6 bg-transparent p-6">
        <h3 className="font-display text-2xl font-bold text-white">Risk Breakdown</h3>
        <p className="mt-2 text-sm text-slate-500">Model signals driving this fixture insight.</p>

        <div className="mt-6 space-y-6">
          {bars.map((item, index) => {
            const pct = Math.min(100, Number(item?.value || 0) * 100);
            const risk = getRiskLabel(item?.value);
            return (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-slate-300 text-sm">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ color: risk.color, background: `${risk.color}18`, border: `1px solid ${risk.color}44` }}>
                      {risk.text}
                    </span>
                    <span className="text-sm font-bold text-slate-400">{Number(item?.value || 0).toFixed(2)}</span>
                  </div>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-3 rounded-full" style={getBarStyle(item.label, item.value, animate, index)} />
                </div>
                <div className="mt-1 flex justify-end">
                  <span className="text-[10px] text-slate-600">{Math.round(pct)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk Assessment Card */}
      <div className="rounded-[24px] p-6 flex flex-col justify-between"
        style={{ background: riskPanelColor.bg, border: `1px solid ${riskPanelColor.border}` }}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Risk Assessment</p>
          <div className="inline-flex items-center gap-2 rounded-xl px-4 py-2 mb-4"
            style={{ background: `${riskPanelColor.text}18`, border: `1px solid ${riskPanelColor.text}40` }}>
            <span className="font-display text-3xl font-black" style={{ color: riskPanelColor.text }}>{riskBand}</span>
            <span className="text-xs text-slate-500 font-bold">RISK</span>
          </div>
          <ul className="space-y-2 mt-4">
            {riskBullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: riskPanelColor.text }} />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] text-slate-600 uppercase tracking-wider font-bold">Confidence</p>
          <p className="text-lg font-black text-emerald-400 mt-1">78%</p>
        </div>
      </div>
    </div>
  );
}