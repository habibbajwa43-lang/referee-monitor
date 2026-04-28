import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const darkTooltip = {
  contentStyle: {
    background: "#0e1219",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    color: "#e2e8f0",
    fontSize: 12,
  },
  cursor: { stroke: "rgba(16,185,129,0.3)" },
};

function ChartCard({ title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay }}
      className="rounded-[24px] p-6"
      style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-500">{title}</h3>
      {children}
    </motion.div>
  );
}

export default function TrendChartsSection({ lineData, barData, varData, loading }) {
  const placeholder = (
    <div className="flex h-64 items-center justify-center text-slate-600 text-sm">
      No data available
    </div>
  );

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Cards per Match — Season Trend">
          <div className="h-64 w-full">
            {loading ? <div className="flex h-full items-center justify-center text-slate-600">Loading...</div> :
              lineData?.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="season" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
                    <Tooltip {...darkTooltip} />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5}
                      dot={{ r: 4, fill: "#10b981", stroke: "#07090f", strokeWidth: 2 }}
                      activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : placeholder}
          </div>
        </ChartCard>

        <ChartCard title="Penalties Awarded — Season Trend" delay={0.1}>
          <div className="h-64 w-full">
            {loading ? <div className="flex h-full items-center justify-center text-slate-600">Loading...</div> :
              barData?.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="season" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
                    <Tooltip {...darkTooltip} />
                    <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} fillOpacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              ) : placeholder}
          </div>
        </ChartCard>
      </div>

      {varData?.length > 0 && (
        <ChartCard title="VAR Interventions — Season Trend" delay={0.2}>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={varData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="season" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
                <Tooltip {...darkTooltip} />
                <Bar dataKey="value" fill="#818cf8" radius={[6, 6, 0, 0]} fillOpacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}
    </div>
  );
}
