import { Search, Funnel } from "lucide-react";

const iS = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 };
const sC = "w-full cursor-pointer bg-transparent text-sm font-semibold text-slate-300 outline-none";
const oS = { background: "#0e1219" };

export default function MatchesToolbar({ search, onSearchChange, riskFilter, onRiskChange, seasonFilter, onSeasonChange, seasons = [] }) {
  return (
    <div className="mb-6 grid gap-3 rounded-[20px] p-4 md:grid-cols-[1.5fr_0.8fr_0.8fr]"
      style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={iS}>
        <Search size={16} className="text-slate-600 flex-shrink-0" />
        <input type="text" value={search} onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by teams..." className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600" />
      </div>
      <div style={iS}>
        <Funnel size={14} className="text-slate-600 flex-shrink-0" />
        <select value={riskFilter} onChange={(e) => onRiskChange(e.target.value)} className={sC}>
          <option value="all" style={oS}>All Risk Bands</option>
          <option value="RED" style={oS}>🔴 RED</option>
          <option value="AMBER" style={oS}>🟡 AMBER</option>
          <option value="GREEN" style={oS}>🟢 GREEN</option>
        </select>
      </div>
      <div style={iS}>
        <Funnel size={14} className="text-slate-600 flex-shrink-0" />
        <select value={seasonFilter} onChange={(e) => onSeasonChange(e.target.value)} className={sC}>
          {seasons.map((s) => <option key={s} value={s} style={oS}>{s === "all" ? "All Seasons" : s}</option>)}
        </select>
      </div>
    </div>
  );
}
