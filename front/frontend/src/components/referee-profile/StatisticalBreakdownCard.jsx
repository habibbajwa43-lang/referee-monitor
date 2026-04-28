import { motion } from "framer-motion";

function StatRow({ label, value, max = 100, color = "#10b981" }) {
  const pct = Math.min(100, Math.max(0, (Number(value) / max) * 100));
  return (
    <div className="flex items-center gap-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <span className="w-36 text-xs font-semibold text-slate-500 uppercase tracking-wide flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}60` }} />
      </div>
      <span className="font-mono text-sm font-bold text-white w-10 text-right">{Number(value).toFixed(1)}</span>
    </div>
  );
}

export default function StatisticalBreakdownCard({ breakdown, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6 }}
      className="rounded-[24px] p-6"
      style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <h3 className="font-display text-3xl font-black text-white uppercase mb-5">Statistical Breakdown</h3>

      {loading ? (
        <p className="text-slate-600 text-sm">Loading...</p>
      ) : breakdown?.length ? (
        <div>
          {breakdown.map((item) => (
            <StatRow
              key={item.label}
              label={item.label}
              value={item.value}
              max={item.max || 100}
              color={item.color || "#10b981"}
            />
          ))}
        </div>
      ) : (
        <p className="text-slate-600 text-sm">No breakdown data available.</p>
      )}
    </motion.div>
  );
}
