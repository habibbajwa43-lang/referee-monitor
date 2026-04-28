import { Trophy, Medal, Award, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RankIcon({ rank }) {
  if (rank === 1) return <Trophy size={15} className="text-yellow-400" />;
  if (rank === 2) return <Medal size={15} className="text-slate-400" />;
  if (rank === 3) return <Award size={15} className="text-yellow-600" />;
  return null;
}

function darkBadge(cls) {
  if (!cls) return { bg: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "rgba(255,255,255,0.08)" };
  if (cls.includes("rose") || cls.includes("red")) return { bg: "rgba(244,63,94,0.1)", color: "#f43f5e", border: "rgba(244,63,94,0.2)" };
  if (cls.includes("yellow") || cls.includes("amber")) return { bg: "rgba(234,179,8,0.1)", color: "#eab308", border: "rgba(234,179,8,0.2)" };
  if (cls.includes("emerald") || cls.includes("green")) return { bg: "rgba(16,185,129,0.1)", color: "#10b981", border: "rgba(16,185,129,0.2)" };
  return { bg: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "rgba(255,255,255,0.08)" };
}

export default function RankingsTable({ rows, loading }) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-[24px]" style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="font-display text-3xl font-black text-white uppercase">2025/26 Season Rankings</h3>
        <p className="mt-1 text-sm text-slate-500">Showing {rows?.length || 0} referees</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#0e1219" }}>
            <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-600"
              style={{ background: "rgba(14,18,25,0.98)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <th className="px-6 py-4">Rank</th>
              <th className="px-6 py-4">Referee</th>
              <th className="px-6 py-4">RM Score</th>
              <th className="px-6 py-4">Strictness</th>
              <th className="px-6 py-4">Chaos</th>
              <th className="px-6 py-4">Matches</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-600">Loading rankings...</td></tr>
            ) : rows?.length ? rows.map((row) => {
              const strictBadge = darkBadge(row.strictnessClass);
              const chaosBadge = darkBadge(row.chaosClass);
              const topGlow = row.rank === 1
                ? { bg: "rgba(250,204,21,0.04)", border: "rgba(250,204,21,0.15)", shadow: "0 0 20px rgba(250,204,21,0.08)" }
                : row.rank === 2
                ? { bg: "rgba(148,163,184,0.04)", border: "rgba(148,163,184,0.15)", shadow: "0 0 20px rgba(148,163,184,0.08)" }
                : row.rank === 3
                ? { bg: "rgba(180,83,9,0.06)", border: "rgba(180,83,9,0.2)", shadow: "0 0 20px rgba(180,83,9,0.1)" }
                : null;
              return (
                <tr
                  key={row.referee_id}
                  onClick={() => navigate(`/referees/${row.referee_id}`)}
                  className="cursor-pointer group transition-all"
                  style={{
                    borderTop: topGlow ? `1px solid ${topGlow.border}` : "1px solid rgba(255,255,255,0.04)",
                    background: topGlow ? topGlow.bg : "transparent",
                    boxShadow: topGlow ? topGlow.shadow : "none",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = topGlow ? topGlow.bg : "transparent"}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <RankIcon rank={row.rank} />
                      <span className="font-display text-2xl font-black text-white">{row.rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-semibold text-white group-hover:text-emerald-400 transition">{row.name}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{row.style} · {row.country}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-display text-2xl font-black text-emerald-400">{row.rmScore}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold"
                      style={{ background: strictBadge.bg, color: strictBadge.color, border: `1px solid ${strictBadge.border}` }}>
                      {row.strictnessLabel}
                    </span>
                    <p className="mt-1.5 text-sm text-slate-400">{row.strictness}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold"
                      style={{ background: chaosBadge.bg, color: chaosBadge.color, border: `1px solid ${chaosBadge.border}` }}>
                      {row.chaosLabel}
                    </span>
                    <p className="mt-1.5 text-sm text-slate-400">{row.chaos}</p>
                  </td>
                  <td className="px-6 py-5 font-mono text-sm font-bold text-white">{row.matches}</td>
                </tr>
              );
            }) : (
              <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-600">No rankings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
