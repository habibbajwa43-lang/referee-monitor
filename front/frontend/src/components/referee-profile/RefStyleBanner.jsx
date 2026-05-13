import { AlertTriangle, Zap } from "lucide-react";
import { getRefereeArchetype } from "../../utils/refereeIntelligence";

export default function RefStyleBanner({ text, loading, hero }) {
  const archetype = hero ? getRefereeArchetype(hero) : null;

  return (
    <div className="mt-5 rounded-[20px] p-5"
      style={{
        background: archetype ? `${archetype.color}08` : "rgba(234,179,8,0.05)",
        border: `1px solid ${archetype ? `${archetype.color}25` : "rgba(234,179,8,0.15)"}`,
      }}>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 text-xl"
          style={{ background: archetype ? `${archetype.color}18` : "rgba(234,179,8,0.12)" }}>
          {archetype ? archetype.icon : <AlertTriangle size={18} className="text-yellow-400" />}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="font-display text-2xl font-black text-white uppercase">Referee Profile</h3>
            {archetype && (
              <span className="rounded-full px-3 py-1 text-xs font-bold"
                style={{ color: archetype.color, background: `${archetype.color}15`, border: `1px solid ${archetype.color}35` }}>
                {archetype.name}
              </span>
            )}
          </div>
          {archetype && (
            <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
              <Zap size={10} style={{ color: archetype.color }} />
              <span className="font-semibold" style={{ color: archetype.color }}>Archetype Intelligence:</span>
              {archetype.desc}
            </p>
          )}
          <p className="text-sm leading-7 text-slate-400">
            {loading ? "Loading style analysis..." : text}
          </p>
        </div>
      </div>
    </div>
  );
}
