import { useNavigate } from "react-router-dom";
import { refereeImages, fallbackRefereeImage } from "../../utils/refreeImages";
import { ArrowUpRight } from "lucide-react";

function StatBar({ value, max = 100 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
      <div className="stat-bar-fill h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function RefereeCard({ referee }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/referees/${referee.referee_id}`)}
      className="card-dark group w-full p-5 text-left"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="h-14 w-14 overflow-hidden rounded-full flex-shrink-0"
          style={{ border: "2px solid rgba(16,185,129,0.3)" }}>
          <img
            src={refereeImages[referee.referee_id] || fallbackRefereeImage}
            alt={referee.name}
            className="h-full w-full object-cover"
            onError={(e) => { e.currentTarget.src = fallbackRefereeImage; }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-bold text-white leading-tight break-words">
            {referee.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {referee.league} · {referee.country}
          </p>
        </div>
        <ArrowUpRight size={14} className="text-slate-600 group-hover:text-emerald-400 transition flex-shrink-0" />
      </div>

      {/* RM Score */}
      <div className="rounded-xl p-4 mb-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">RM Score</span>
          <span className="font-mono text-sm font-bold text-emerald-400">{referee.rmScore}</span>
        </div>
        <StatBar value={Number(referee.rmScore)} max={100} />
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Cards/Match</p>
          <p className="font-display text-2xl font-bold text-white mt-1">
            {Number(referee.cardsPerMatch).toFixed(1)}
          </p>
        </div>
        <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Style</p>
          <p className="text-sm font-semibold text-slate-300 mt-1 truncate">
            {referee.style || "Standard"}
          </p>
        </div>
      </div>
    </button>
  );
}