import { Search, Funnel } from "lucide-react";

const iS = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 };
const sC = "w-full cursor-pointer bg-transparent text-sm font-semibold text-slate-300 outline-none";
const oS = { background: "#0e1219" };

export default function RefereesToolbar({ search, onSearchChange, leagueFilter, onLeagueChange, countryFilter, onCountryChange, leagues = [], countries = [] }) {
  return (
    <div className="mb-6 grid gap-3 rounded-[20px] p-4 md:grid-cols-[1.6fr_0.8fr_0.8fr]"
      style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={iS}>
        <Search size={16} className="text-slate-600 flex-shrink-0" />
        <input type="text" value={search} onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search referee name or league..." className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600" />
      </div>
      <div style={iS}>
        <Funnel size={14} className="text-slate-600 flex-shrink-0" />
        <select value={leagueFilter} onChange={(e) => onLeagueChange(e.target.value)} className={sC}>
          {leagues.map((l) => <option key={l} value={l} style={oS}>{l === "all" ? "All Leagues" : l}</option>)}
        </select>
      </div>
      <div style={iS}>
        <Funnel size={14} className="text-slate-600 flex-shrink-0" />
        <select value={countryFilter} onChange={(e) => onCountryChange(e.target.value)} className={sC}>
          {countries.map((c) => <option key={c} value={c} style={oS}>{c === "all" ? "All Countries" : c}</option>)}
        </select>
      </div>
    </div>
  );
}
