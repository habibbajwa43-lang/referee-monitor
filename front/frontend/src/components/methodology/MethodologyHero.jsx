export default function MethodologyHero() {
  const stats = [
    { value: "5+", label: "Seasons Analyzed" },
    { value: "380", label: "Matches / Season" },
    { value: "20+", label: "Signals Tracked" },
    { value: "Weekly", label: "Updated" },
  ];

  return (
    <div className="relative overflow-hidden rounded-[24px] p-10 mb-6"
      style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))", border: "1px solid rgba(16,185,129,0.15)" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top right, rgba(16,185,129,0.06), transparent 60%)" }} />
      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">Our Approach</p>
        <h1 className="font-display text-6xl font-black text-white uppercase mb-4">Methodology</h1>
        <p className="max-w-2xl text-slate-400 leading-relaxed mb-8">
          Ref Monitor uses a fully transparent, deterministic scoring system built on 5+ seasons of Premier League data.
          No black boxes — every metric is explainable and reproducible.
        </p>
        <div className="flex flex-wrap gap-6">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="rounded-xl px-4 py-2" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <p className="font-display text-2xl font-black text-emerald-400">{s.value}</p>
              </div>
              <p className="text-sm text-slate-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
