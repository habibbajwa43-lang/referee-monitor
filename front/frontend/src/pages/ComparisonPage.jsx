import { useState, useEffect } from "react";
import { getRefProfiles } from "../services/refereeApi";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function StatRow({ label, a, b, colorA, colorB }) {
  const maxVal = Math.max(Number(a), Number(b), 1);
  const pctA = (Number(a) / maxVal) * 100;
  const pctB = (Number(b) / maxVal) * 100;
  const winnerA = Number(a) > Number(b);
  const winnerB = Number(b) > Number(a);
  return (
    <div className="py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
        <span style={{ color: winnerA ? colorA : "#64748b", fontWeight: winnerA ? 900 : 600 }}>
          {winnerA && "▲ "}{Number(a).toFixed(1)}
        </span>
        <span>{label}</span>
        <span style={{ color: winnerB ? colorB : "#64748b", fontWeight: winnerB ? 900 : 600 }}>
          {Number(b).toFixed(1)}{winnerB && " ▲"}
        </span>
      </div>
      <div className="flex gap-1 items-center">
        <div className="flex-1 flex justify-end">
          <div className="h-2.5 rounded-full transition-all duration-700"
            style={{
              width: `${pctA}%`,
              background: winnerA ? colorA : `${colorA}55`,
              boxShadow: winnerA ? `0 0 8px ${colorA}66` : "none"
            }} />
        </div>
        <div className="w-1" />
        <div className="flex-1">
          <div className="h-2.5 rounded-full transition-all duration-700"
            style={{
              width: `${pctB}%`,
              background: winnerB ? colorB : `${colorB}55`,
              boxShadow: winnerB ? `0 0 8px ${colorB}66` : "none"
            }} />
        </div>
      </div>
    </div>
  );
}

function DeltaBadge({ diff, higherIsBetter = true }) {
  const positive = higherIsBetter ? diff > 0 : diff < 0;
  if (Math.abs(diff) < 0.5) return <span className="text-slate-500 text-xs font-bold flex items-center gap-1"><Minus size={10} /> Similar</span>;
  return (
    <span className="text-xs font-bold flex items-center gap-1" style={{ color: positive ? "#10b981" : "#f43f5e" }}>
      {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {Math.abs(diff).toFixed(1)}% {positive ? "higher" : "lower"}
    </span>
  );
}

export default function ComparisonPage() {
  const [refs, setRefs] = useState([]);
  const [refA, setRefA] = useState(null);
  const [refB, setRefB] = useState(null);

  useEffect(() => {
    getRefProfiles().then((data) => {
      setRefs(data);
      if (data.length >= 2) { setRefA(data[0]); setRefB(data[1]); }
    });
  }, []);

  const colorA = "#10b981";
  const colorB = "#818cf8";

  const buildRadar = (a, b) => {
    if (!a || !b) return [];
    return [
      { metric: "RM Score",   A: Number(a.ref_monitor_score||0),              B: Number(b.ref_monitor_score||0) },
      { metric: "Strictness", A: Number(a.strictness_index||0)*100,            B: Number(b.strictness_index||0)*100 },
      { metric: "Chaos",      A: Number(a.referee_chaos_index||0),             B: Number(b.referee_chaos_index||0) },
      { metric: "VAR",        A: Number(a.var_interaction_score||0)*100,       B: Number(b.var_interaction_score||0)*100 },
      { metric: "Penalty",    A: Number(a.referee_penalty_probability||0),     B: Number(b.referee_penalty_probability||0) },
    ];
  };

  const radarData = buildRadar(refA, refB);

  // Comparison summary stats
  const rmDiff   = refA && refB ? Number(refA.ref_monitor_score||0) - Number(refB.ref_monitor_score||0) : 0;
  const chaosDiff = refA && refB ? Number(refA.referee_chaos_index||0) - Number(refB.referee_chaos_index||0) : 0;
  const varDiff  = refA && refB ? (Number(refA.var_interaction_score||0) - Number(refB.var_interaction_score||0)) * 100 : 0;
  const strictDiff = refA && refB ? (Number(refA.strictness_index||0) - Number(refB.strictness_index||0)) * 100 : 0;
  const aWins = refA && refB && Number(refA.ref_monitor_score||0) >= Number(refB.ref_monitor_score||0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-5xl font-black text-white uppercase mb-2">Referee Comparison</h1>
      <p className="text-slate-500 mb-10">Select two referees to compare their stats side by side.</p>

      {/* Selectors */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        {[{ val: refA, set: setRefA, color: colorA, label: "Referee A" },
          { val: refB, set: setRefB, color: colorB, label: "Referee B" }].map(({ val, set, color, label }) => (
          <div key={label} className="rounded-2xl p-5" style={{ background: "var(--surface)", border: `1px solid ${color}33` }}>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color }}>
              {label}
            </label>
            <select
              value={val?.referee_id || ""}
              onChange={(e) => set(refs.find(r => String(r.referee_id) === e.target.value) || null)}
              className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${color}44` }}>
              {refs.map(r => (
                <option key={r.referee_id} value={String(r.referee_id)} style={{ background: "#0e1219" }}>
                  {r.full_name}
                </option>
              ))}
            </select>
            {val && (
              <div className="mt-4 space-y-1">
                <p className="text-white font-bold text-lg">{val.full_name}</p>
                <p className="text-slate-500 text-sm">{val.nationality} · {val.referee_style}</p>
                <p className="text-2xl font-black mt-2" style={{ color }}>
                  {Number(val.ref_monitor_score || 0).toFixed(1)} <span className="text-xs text-slate-500 font-normal">RM Score</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {refA && refB && (
        <>
          {/* Radar + Summary 2-col layout */}
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] mb-6">
            <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Performance Radar</h2>
              <div className="flex gap-4 mb-4">
                <span className="flex items-center gap-2 text-xs font-bold" style={{ color: colorA }}>
                  <span className="w-3 h-3 rounded-full inline-block" style={{ background: colorA }} /> {refA.full_name}
                </span>
                <span className="flex items-center gap-2 text-xs font-bold" style={{ color: colorB }}>
                  <span className="w-3 h-3 rounded-full inline-block" style={{ background: colorB }} /> {refB.full_name}
                </span>
              </div>
              <ResponsiveContainer width="100%" height={420}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.07)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }} />
                  <Radar name={refA.full_name} dataKey="A" stroke={colorA} fill={colorA} fillOpacity={0.18} strokeWidth={2.5} />
                  <Radar name={refB.full_name} dataKey="B" stroke={colorB} fill={colorB} fillOpacity={0.18} strokeWidth={2.5} />
                  <Tooltip contentStyle={{ background: "#0e1219", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#e2e8f0", fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Comparison Summary Card */}
            <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "var(--surface)", border: `1px solid ${aWins ? colorA : colorB}33` }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Comparison Summary</p>
                <p className="font-display text-2xl font-bold text-white mb-1">
                  {aWins ? refA.full_name : refB.full_name}
                </p>
                <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-bold text-emerald-400"
                  style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  Higher RM Score Overall
                </span>
              </div>

              <div className="space-y-3 mt-2">
                {[
                  { label: `${refA.full_name} RM Score`, diff: rmDiff, hib: true },
                  { label: `${refA.full_name} Strictness`, diff: strictDiff, hib: false },
                  { label: `${refA.full_name} Chaos Index`, diff: chaosDiff, hib: false },
                  { label: `${refA.full_name} VAR Heavy`, diff: varDiff, hib: false },
                ].map(({ label, diff, hib }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{label}</span>
                    <DeltaBadge diff={diff} higherIsBetter={hib} />
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[10px] text-slate-600 uppercase tracking-wider">RM Score Gap</p>
                <p className="font-display text-3xl font-black mt-1" style={{ color: aWins ? colorA : colorB }}>
                  {Math.abs(rmDiff).toFixed(1)} <span className="text-sm text-slate-500 font-normal">pts</span>
                </p>
              </div>
            </div>
          </div>

          {/* Stats Comparison */}
          <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Head to Head Stats</h2>
            <div className="flex justify-between text-xs font-bold mb-4">
              <span style={{ color: colorA }}>{refA.full_name}</span>
              <span style={{ color: colorB }}>{refB.full_name}</span>
            </div>
            <StatRow label="RM Score"    a={refA.ref_monitor_score||0}             b={refB.ref_monitor_score||0}             colorA={colorA} colorB={colorB} />
            <StatRow label="Strictness"  a={(refA.strictness_index||0)*100}         b={(refB.strictness_index||0)*100}         colorA={colorA} colorB={colorB} />
            <StatRow label="Chaos Index" a={refA.referee_chaos_index||0}            b={refB.referee_chaos_index||0}            colorA={colorA} colorB={colorB} />
            <StatRow label="VAR Score"   a={(refA.var_interaction_score||0)*100}    b={(refB.var_interaction_score||0)*100}    colorA={colorA} colorB={colorB} />
            <StatRow label="Penalty %"   a={refA.referee_penalty_probability||0}    b={refB.referee_penalty_probability||0}   colorA={colorA} colorB={colorB} />
            <StatRow label="Matches"     a={refA.matches||0}                        b={refB.matches||0}                       colorA={colorA} colorB={colorB} />
          </div>
        </>
      )}

      {/* Top Referees Overview */}
      {refs.length > 0 && (
        <div className="mt-10">
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">League Leaders</p>
            <h2 className="font-display text-3xl font-bold text-white">Top Referees Overview</h2>
            <p className="text-slate-500 text-sm mt-1">Click any card to load as Referee A for comparison.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[...refs].sort((a, b) => Number(b.ref_monitor_score||0) - Number(a.ref_monitor_score||0)).slice(0, 6).map((ref, i) => {
              const tierColor = i === 0 ? "#facc15" : i === 1 ? "#94a3b8" : i === 2 ? "#c2793a" : "#10b981";
              const tierGlow = i === 0 ? "rgba(250,204,21,0.2)" : i === 1 ? "rgba(148,163,184,0.15)" : i === 2 ? "rgba(194,121,58,0.18)" : "rgba(16,185,129,0.12)";
              const tierLabel = i === 0 ? "🥇 #1 Ranked" : i === 1 ? "🥈 #2 Ranked" : i === 2 ? "🥉 #3 Ranked" : `#${i + 1}`;
              return (
                <button
                  key={ref.referee_id}
                  onClick={() => setRefA(ref)}
                  className="rounded-[22px] p-5 text-left transition-all duration-300 hover:-translate-y-1 group"
                  style={{
                    background: i < 3 ? `${tierColor}08` : "var(--surface)",
                    border: `1px solid ${i < 3 ? tierColor + "33" : "rgba(255,255,255,0.07)"}`,
                    boxShadow: i < 3 ? `0 0 20px ${tierGlow}` : "none",
                  }}
                >
                  {/* Avatar + badge row */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{
                        background: `${tierColor}18`,
                        border: `2px solid ${tierColor}44`,
                      }}
                    >
                      🏴󠁧󠁢󠁥󠁮󠁧󠁿
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm truncate group-hover:text-emerald-400 transition">{ref.full_name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{ref.nationality || "England"} · {ref.referee_style || "Standard"}</p>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0"
                      style={{ background: `${tierColor}18`, color: tierColor, border: `1px solid ${tierColor}33` }}
                    >
                      {i < 3 ? tierLabel : tierLabel}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "RM Score", val: Number(ref.ref_monitor_score || 0).toFixed(1), color: tierColor },
                      { label: "Chaos", val: Number(ref.referee_chaos_index || 0).toFixed(0), color: "#f59e0b" },
                      { label: "Matches", val: ref.matches || 0, color: "#64748b" },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="rounded-xl p-2 text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <p className="font-display text-lg font-black" style={{ color }}>{val}</p>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-10 rounded-[28px] p-8 text-center text-white"
        style={{ background: "linear-gradient(135deg, #062c22 0%, #0a4a36 50%, #083328 100%)", border: "1px solid rgba(16,185,129,0.2)" }}>
        <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4"
          style={{ background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" }}>
          Match Analysis
        </span>
        <h2 className="font-display text-4xl font-bold">See Match Breakdown</h2>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-white/70">
          Explore fixture-level analysis for both referees including historical trend patterns.
        </p>
        <button
          onClick={() => window.location.href = "/matches"}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
          style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
          See Match Breakdown
        </button>
      </div>
    </div>
  );
}
