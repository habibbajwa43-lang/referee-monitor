const stats = [
  { value: "5+", label: "Seasons of Data", icon: "📊" },
  { value: "380+", label: "Matches Analyzed", icon: "⚽" },
  { value: "Weekly", label: "Updated Predictions", icon: "🔄" },
  { value: "100%", label: "Transparent Model", icon: "🎯" },
];

export default function TrustStatsSection() {
  return (
    <section className="py-16" style={{ background: "var(--surface)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">By The Numbers</p>
        <h3 className="font-display text-4xl font-black text-white uppercase mb-2">
          Trusted by Analysts & Media
        </h3>
        <p className="text-slate-500 mb-10">Built on comprehensive data and transparent methodology</p>

        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card-dark p-6 text-center">
              <span className="text-2xl mb-3 block">{s.icon}</span>
              <p className="font-display text-4xl font-black text-white">{s.value}</p>
              <p className="mt-2 text-sm font-semibold text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
