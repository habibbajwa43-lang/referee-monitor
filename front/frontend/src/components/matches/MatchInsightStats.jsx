import { Gauge, ShieldAlert, Tickets, Percent } from "lucide-react";

function StatCard({ title, value, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="rounded-[24px] border   p-6 ">
      <div className="mb-5 flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>

        <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
          {title}
        </p>
      </div>

      <p className="font-display text-5xl font-bold text-white">{value}</p>
    </div>
  );
}

export default function MatchInsightStats({ detail, loading }) {
  if (loading || !detail) return null;

  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Predicted RM Score"
        value={detail.rmScore}
        icon={Gauge}
        iconBg=""
        iconColor="text-emerald-700"
      />

      <StatCard
        title="Ref Impact Score"
        value={detail.impactScore}
        icon={ShieldAlert}
        iconBg=""
        iconColor="text-slate-300"
      />

      <StatCard
        title="Card Intensity"
        value={detail.cardIntensity}
        icon={Tickets}
        iconBg=""
        iconColor="text-amber-600"
      />

      <StatCard
        title="Penalty Influence"
        value={detail.penaltyInfluence}
        icon={Percent}
        iconBg=""
        iconColor="text-rose-600"
      />
    </div>
  );
}