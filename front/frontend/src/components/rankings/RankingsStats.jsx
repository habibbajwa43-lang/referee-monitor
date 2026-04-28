import { Activity, Users, BarChart3, TrendingUp } from "lucide-react";

export default function RankingsStats({ stats, loading }) {
  const cards = [
    { title: "AVG RM SCORE", value: loading ? "..." : stats?.avgRm || "0.0", icon: Activity, color: "#10b981" },
    { title: "TOTAL REFEREES", value: loading ? "..." : stats?.totalRefs || 0, icon: Users, color: "#818cf8" },
    { title: "AVG STRICTNESS", value: loading ? "..." : stats?.avgStrictness || 0, icon: BarChart3, color: "#f59e0b" },
    { title: "TOTAL MATCHES", value: loading ? "..." : stats?.totalMatches || 0, icon: TrendingUp, color: "#34d399" },
  ];

  return (
    <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.title} className="card-dark p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{ background: `${c.color}15`, border: `1px solid ${c.color}25` }}>
                <Icon size={16} style={{ color: c.color }} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{c.title}</span>
            </div>
            <p className="font-display text-3xl font-black text-white">{c.value}</p>
          </div>
        );
      })}
    </div>
  );
}
