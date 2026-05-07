import { motion } from "framer-motion";
import MetricTooltip from "../shared/MetricTooltip";

function badgeStyle(badge) {
  if (badge === "HIGH")   return { bg: "rgba(244,63,94,0.12)",  color: "#f43f5e", border: "rgba(244,63,94,0.2)" };
  if (badge === "MED")    return { bg: "rgba(234,179,8,0.12)",  color: "#eab308", border: "rgba(234,179,8,0.2)" };
  if (badge === "LOW")    return { bg: "rgba(16,185,129,0.12)", color: "#10b981", border: "rgba(16,185,129,0.2)" };
  return                         { bg: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "rgba(255,255,255,0.1)" };
}

function StatRow({ label, value, leagueAvg, diff, diffPositive, badge, tooltip, color = "#10b981", barPct = 50 }) {
  const bs = badgeStyle(badge);
  return (
    <div
      className="py-4 space-y-2"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {tooltip ? (
            <MetricTooltip metric={tooltip}>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
            </MetricTooltip>
          ) : (
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-black text-white">{value}</span>
          <span
            className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
            style={{ background: bs.bg, color: bs.color, border: `1px solid ${bs.border}` }}
          >
            {badge}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.max(4, Math.min(100, barPct))}%`, background: color, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>

      {/* League avg comparison */}
      {leagueAvg && (
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-600">League avg: {leagueAvg}</span>
          {diff && (
            <span
              className="font-bold"
              style={{ color: diffPositive ? "#f43f5e" : "#10b981" }}
            >
              {diffPositive ? "▲" : "▼"} {diff} vs avg
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function StatisticalBreakdownCard({ items, breakdown, loading }) {
  // Support both prop names (items from RefereeProfilePage, breakdown from legacy)
  const data = items || breakdown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6 }}
      className="rounded-[24px] p-6"
      style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <h3 className="font-display text-3xl font-black text-white uppercase mb-1">Statistical Breakdown</h3>
      <p className="text-xs text-slate-600 mb-5">All figures compared to Premier League average</p>

      {loading ? (
        <p className="text-slate-600 text-sm py-8 text-center">Loading breakdown...</p>
      ) : data?.length ? (
        <div>
          {data.map((item) => (
            <StatRow
              key={item.label}
              label={item.label}
              value={item.value}
              leagueAvg={item.leagueAvg}
              diff={item.diff}
              diffPositive={item.diffPositive}
              badge={item.badge}
              tooltip={item.tooltip}
              color={item.color || "#10b981"}
              barPct={item.barPct || 50}
            />
          ))}
        </div>
      ) : (
        <p className="text-slate-600 text-sm">No breakdown data available.</p>
      )}
    </motion.div>
  );
}
