import { Search, Funnel, ArrowUpDown } from "lucide-react";

const inputStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 14,
  padding: "10px 14px",
  display: "flex",
  alignItems: "center",
  gap: 10,
};

export default function RankingsFilters({
  search, onSearchChange,
  leagueFilter, onLeagueChange,
  countryFilter, onCountryChange,
  seasonFilter, onSeasonChange,
  sortMetric, onSortMetricChange,
  leagues = [], countries = [],
}) {
  const selectClass = "w-full cursor-pointer bg-transparent text-sm font-semibold text-slate-300 outline-none";
  const optionStyle = { background: "#0e1219" };

  return (
    <div className="mb-6 grid gap-3 rounded-[20px] p-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_0.8fr]"
      style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={inputStyle}>
        <Search size={16} className="text-slate-600 flex-shrink-0" />
        <input
          type="text" value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search referee..."
          className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
        />
      </div>
      <div style={inputStyle}>
        <Funnel size={14} className="text-slate-600 flex-shrink-0" />
        <select value={leagueFilter} onChange={(e) => onLeagueChange(e.target.value)} className={selectClass}>
          {leagues.map((l) => <option key={l} value={l} style={optionStyle}>{l === "all" ? "All Leagues" : l}</option>)}
        </select>
      </div>
      <div style={inputStyle}>
        <Funnel size={14} className="text-slate-600 flex-shrink-0" />
        <select value={countryFilter} onChange={(e) => onCountryChange(e.target.value)} className={selectClass}>
          {countries.map((c) => <option key={c} value={c} style={optionStyle}>{c === "all" ? "All Countries" : c}</option>)}
        </select>
      </div>
      <div style={inputStyle}>
        <select value={seasonFilter} onChange={(e) => onSeasonChange(e.target.value)} className={selectClass}>
          {["2025/26","2024/25","2023/24","2022/23","2021/22"].map((s) => (
            <option key={s} value={s} style={optionStyle}>{s}</option>
          ))}
        </select>
      </div>
      <div style={inputStyle}>
        <ArrowUpDown size={14} className="text-slate-600 flex-shrink-0" />
        <select value={sortMetric} onChange={(e) => onSortMetricChange(e.target.value)} className={selectClass}>
          {[["rmScore","RM Score"],["strictness","Strictness"],["chaos","Chaos"],["matches","Matches"]].map(([v, l]) => (
            <option key={v} value={v} style={optionStyle}>{l}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
