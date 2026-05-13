import { useNavigate } from "react-router-dom";
import { refereeImages, fallbackRefereeImage } from "../../utils/refreeImages";
import { ArrowUpRight } from "lucide-react";
import { getRefereeArchetype } from "../../utils/refereeIntelligence";

function StatBar({ value, max = 100 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
      <div className="stat-bar-fill h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function RefereeCard({ referee }) {
  const navigate  = useNavigate();
  const archetype = getRefereeArchetype(referee);

  return (
    <button
      onClick={() => navigate(`/referees/${referee.referee_id}`)}
      className="card-dark group w-full p-5 text-left"
    >
      <div className="flex items-center gap-3 mb-4">
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
          <h3 className="font-display text-lg font-bold text-white leading-tight break-words">{referee.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{referee.country}</p>
        </div>
        <ArrowUpRight size={14} className="text-slate-600 group-hover:text-emerald-400 transition flex-shrink-0" />
      </div>

      {/* Archetype badge */}
      {archetype && (
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold"
          style={{ color: archetype.color, background: `${archetype.color}15`, border: `1px solid ${archetype.color}35` }}>
          <span>{archetype.icon}</span>
          {archetype.name}
        </div>
      )}

      {/* Ref Intelligence Score */}
      <div className="rounded-xl p-4 mb-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Ref Intelligence Score</span>
          <span className="font-mono text-sm font-bold text-emerald-400">{referee.rmScore}</span>
        </div>
        <StatBar value={Number(referee.rmScore)} max={100} />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Cards/Match</p>
          <p className="font-display text-2xl font-bold text-white mt-1">{Number(referee.cardsPerMatch).toFixed(1)}</p>
        </div>
        <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Penalty Alert</p>
          <p className="text-sm font-semibold mt-1"
            style={{ color: Number(referee.penaltyProb || 0) > 40 ? "#f43f5e" : "#10b981" }}>
            {Number(referee.penaltyProb || referee.referee_penalty_probability || 0).toFixed(0)}%
          </p>
        </div>
      </div>
    </button>
  );
}