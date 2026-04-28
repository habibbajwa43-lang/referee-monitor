import { ArrowUpRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TYPE_LABELS = {
  penalty: { label: "Penalty Watch", color: "#f43f5e", bg: "rgba(244,63,94,0.12)", border: "rgba(244,63,94,0.25)" },
  chaos:   { label: "Chaos Alert",   color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
  strictness: { label: "Strictness", color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)" },
  fixture: { label: "High Impact",   color: "#818cf8", bg: "rgba(129,140,248,0.12)", border: "rgba(129,140,248,0.25)" },
};

export default function FeaturedInsightBanner({ insight }) {
  const navigate = useNavigate();
  const typeMeta = TYPE_LABELS[insight?.type] || TYPE_LABELS.fixture;

  return (
    <div className="mb-8 overflow-hidden rounded-[32px] border border-white/6"
      style={{ background: "var(--surface)" }}>
      <div className="grid items-stretch lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" }}>
                Featured Insight
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold"
                style={{ background: typeMeta.bg, color: typeMeta.color, border: `1px solid ${typeMeta.border}` }}>
                {typeMeta.label}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold text-emerald-400"
                style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <TrendingUp size={9} /> 78% Confidence
              </span>
            </div>

            <h2 className="font-display mt-2 text-4xl font-bold leading-tight text-white md:text-5xl">
              {insight?.title || "Loading insight..."}
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">
              {insight?.description || "Loading description..."}
            </p>
          </div>

          <button
            onClick={() => navigate(insight?.target || "/insights")}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #062c22, #0a4a36)", border: "1px solid rgba(16,185,129,0.25)" }}>
            View Full Report
            <ArrowUpRight size={16} />
          </button>
        </div>

        {/* Image with dark overlay */}
        <div className="relative min-h-[280px] overflow-hidden">
          <img
            src={insight?.image || "/images/penalty-insight.jpeg"}
            alt={insight?.title || "Insight"}
            className="h-full w-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(7,9,15,0.4), rgba(7,9,15,0.15))" }} />
          {/* Badge overlay */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex rounded-xl px-3 py-1.5 text-xs font-bold backdrop-blur-sm"
              style={{ background: "rgba(7,9,15,0.6)", color: typeMeta.color, border: `1px solid ${typeMeta.border}` }}>
              {insight?.badge || ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
