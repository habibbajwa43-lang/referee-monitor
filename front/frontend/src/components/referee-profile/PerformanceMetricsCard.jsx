import { motion } from "framer-motion";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer,
} from "recharts";

export default function PerformanceMetricsCard({ metrics, loading }) {
  const chartData = metrics?.map((item) => ({
    metric: item.label,
    value: Number(item.value || 0),
  })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6 }}
      className="rounded-[24px] p-6"
      style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Radar</span>
      </div>
      <h3 className="font-display text-3xl font-black text-white uppercase mb-6">
        Performance Metrics
      </h3>

      <div className="h-[300px] w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center text-slate-600">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "#64748b", fontSize: 11, fontFamily: "Barlow" }}
              />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Referee"
                dataKey="value"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
