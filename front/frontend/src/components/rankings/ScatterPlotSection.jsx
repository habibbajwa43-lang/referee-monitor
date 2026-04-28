import { useEffect, useState } from "react";
import { getRefProfiles } from "../../services/refereeApi";
import { useNavigate } from "react-router-dom";

const STYLE_COLORS = {
  "VAR Heavy Referee": "#818cf8",
  "Strict":            "#f43f5e",
  "Lenient":           "#10b981",
  "Balanced":          "#f59e0b",
  "Standard":          "#64748b",
};

export default function ScatterPlotSection() {
  const [refs, setRefs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getRefProfiles().then(setRefs).catch(() => {});
  }, []);

  if (!refs.length) return null;

  const chaosVals  = refs.map(r => Number(r.referee_chaos_index || 0));
  const strictVals = refs.map(r => Number(r.strictness_index || 0) * 100);
  const minChaos   = Math.min(...chaosVals);
  const maxChaos   = Math.max(...chaosVals);
  const minStrict  = Math.min(...strictVals);
  const maxStrict  = Math.max(...strictVals);

  const toX = (v) => ((v - minChaos)  / (maxChaos  - minChaos  || 1)) * 88 + 6;
  const toY = (v) => 94 - ((v - minStrict) / (maxStrict - minStrict || 1)) * 88;

  return (
    <section className="py-16" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-display text-4xl font-black text-white uppercase mb-2">League Overview</h2>
        <p className="text-slate-500 mb-4">Chaos Index vs Strictness — click a dot to view referee profile.</p>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          {Object.entries(STYLE_COLORS).map(([style, color]) => (
            <span key={style} className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
              {style}
            </span>
          ))}
        </div>

        <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Axis labels */}
          <div className="flex justify-between text-xs text-slate-600 font-bold mb-2 px-2">
            <span>← Less Chaos</span>
            <span>More Chaos →</span>
          </div>

          {/* Plot area */}
          <div className="relative w-full" style={{ paddingBottom: "42%", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>

            {/* Grid lines */}
            {[25, 50, 75].map(pct => (
              <div key={pct} style={{ position: "absolute", left: `${pct}%`, top: 0, bottom: 0, borderLeft: "1px dashed rgba(255,255,255,0.05)" }} />
            ))}
            {[25, 50, 75].map(pct => (
              <div key={pct} style={{ position: "absolute", top: `${pct}%`, left: 0, right: 0, borderTop: "1px dashed rgba(255,255,255,0.05)" }} />
            ))}

            {/* Y axis label */}
            <div style={{ position: "absolute", left: -32, top: "50%", transform: "translateY(-50%) rotate(-90deg)", fontSize: 10, color: "#475569", fontWeight: 700, whiteSpace: "nowrap" }}>
              STRICTNESS
            </div>

            {/* Dots */}
            {refs.map((r) => {
              const x = toX(Number(r.referee_chaos_index || 0));
              const y = toY(Number(r.strictness_index || 0) * 100);
              const color = STYLE_COLORS[r.referee_style] || "#64748b";
              return (
                <div
                  key={r.referee_id}
                  onClick={() => navigate(`/referees/${r.referee_id}`)}
                  title={`${r.full_name}\nChaos: ${Math.round(r.referee_chaos_index)}\nStrictness: ${Math.round((r.strictness_index||0)*100)}`}
                  style={{
                    position: "absolute",
                    left: `${x}%`,
                    top: `${y}%`,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: color,
                    border: "2px solid rgba(255,255,255,0.2)",
                    cursor: "pointer",
                    transform: "translate(-50%, -50%)",
                    transition: "transform 0.15s",
                    zIndex: 2,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.8)";
                    e.currentTarget.style.zIndex = 10;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
                    e.currentTarget.style.zIndex = 2;
                  }}
                />
              );
            })}
          </div>

          <div className="flex justify-between text-xs text-slate-600 font-bold mt-2 px-2">
            <span>↑ More Strict</span>
            <span>↓ Less Strict</span>
          </div>
        </div>
      </div>
    </section>
  );
}