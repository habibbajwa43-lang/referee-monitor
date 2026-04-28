function avg(values) {
  if (!values.length) return 0;
  return values.reduce((sum, n) => sum + n, 0) / values.length;
}

export default function InsightSignalsStrip({ referees = [], fixtures = [] }) {
  const avgPenalty = avg(
    referees.map((item) => Number(item.referee_penalty_probability || 0))
  ).toFixed(0);

  const avgChaos = avg(
    referees.map((item) => Number(item.referee_chaos_index || 0))
  ).toFixed(0);

  const redFixtures = fixtures.filter((item) => item.risk_band === "RED").length;

  const avgImpact = avg(
    fixtures.map((item) => Number(item.ref_impact_score || 0))
  ).toFixed(1);

  const items = [
    { label: "Avg Penalty Signal", value: `${avgPenalty}%` },
    { label: "Avg Chaos Index", value: avgChaos },
    { label: "RED Risk Fixtures", value: redFixtures },
    { label: "Avg Fixture Impact", value: avgImpact },
  ];

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[22px] border border-white/6 bg-transparent p-5 "
        >
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            {item.label}
          </p>
          <p className="font-display mt-3 text-4xl font-bold text-white">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}