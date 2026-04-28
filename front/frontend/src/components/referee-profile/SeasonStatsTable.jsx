function riskBadge(risk) {
  if (risk === "Strict") return { bg: "rgba(244,63,94,0.12)", color: "#f43f5e", border: "rgba(244,63,94,0.2)" };
  if (risk === "Moderate") return { bg: "rgba(234,179,8,0.12)", color: "#eab308", border: "rgba(234,179,8,0.2)" };
  if (risk === "Flexible") return { bg: "rgba(251,146,60,0.12)", color: "#fb923c", border: "rgba(251,146,60,0.2)" };
  return { bg: "rgba(16,185,129,0.12)", color: "#10b981", border: "rgba(16,185,129,0.2)" };
}

export default function SeasonStatsTable({ rows, loading }) {
  return (
    <div className="mt-6 rounded-[24px] p-6" style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <h3 className="font-display text-3xl font-black text-white uppercase mb-5">Season-by-Season Stats</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-600">
              <th className="px-4 py-3">Season</th>
              <th className="px-4 py-3">Matches</th>
              <th className="px-4 py-3">Yellows</th>
              <th className="px-4 py-3">Reds</th>
              <th className="px-4 py-3">Penalties</th>
              <th className="px-4 py-3">Risk Class</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-600">Loading...</td></tr>
            ) : rows?.map((row) => {
              const badge = riskBadge(row.risk);
              return (
                <tr key={row.season} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <td className="px-4 py-4 font-mono text-sm font-bold text-white">{row.season}</td>
                  <td className="px-4 py-4 text-slate-400">{row.matches}</td>
                  <td className="px-4 py-4 text-yellow-400">🟨 {row.yellow}</td>
                  <td className="px-4 py-4 text-rose-400">🟥 {row.red}</td>
                  <td className="px-4 py-4 text-slate-400">{row.penalties}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full px-3 py-1 text-xs font-bold"
                      style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
                      {row.risk}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
