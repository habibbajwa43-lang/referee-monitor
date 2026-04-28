const metrics = [
  {
    title: "Strictness Index",
    text: "Measures disciplinary intensity through cards, penalties, and whistle-heavy control.",
  },
  {
    title: "Decision Volatility",
    text: "Captures instability and disruption patterns across the referee's decision profile.",
  },
  {
    title: "Pressure Sensitivity",
    text: "Tracks how performance shifts in rivalry, high-stakes, and emotionally charged fixtures.",
  },
  {
    title: "VAR Interaction Score",
    text: "Measures how frequently and how strongly VAR-related intervention patterns appear.",
  },
  {
    title: "Fixture Context Alignment",
    text: "Evaluates whether a referee's profile fits the expected pressure and pace of a fixture.",
  },
  {
    title: "Referee Chaos Index",
    text: "Aggregates volatility, controversy, and game disruption into a high-level chaos signal.",
  },
];

export default function MetricsFramework() {
  return (
    <div className="mb-8 rounded-[30px] p-8"
      style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
      <h2 className="font-display text-4xl font-bold text-white">
        Metric Framework
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-8 text-slate-500">
        Each referee is profiled using a set of transparent, derived metrics that
        describe style, consistency, and match-control behavior.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="rounded-[22px] p-5"
            style={{
              background: "var(--surface)",
              border: "1px solid rgba(255,255,255,0.07)"
            }}
          >
            <h3 className="font-display text-2xl font-bold text-emerald-400 mb-3">
              {metric.title}
            </h3>
            <p className="text-base leading-7 text-slate-400">
              {metric.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}