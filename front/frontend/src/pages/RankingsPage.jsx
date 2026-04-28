import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ScatterPlotSection from "../components/rankings/ScatterPlotSection";
import {
  setSearch,
  setLeagueFilter,
  setCountryFilter,
  setSeasonFilter,
  setSortMetric,
} from "../app/slices/refereeSlice";

import RankingsStats from "../components/rankings/RankingsStats";
import RankingsFilters from "../components/rankings/RankingsFilters";
import MetricsInfoCard from "../components/rankings/MetricsInfoCard";
import RankingsTable from "../components/rankings/RankingsTable";

function getStrictnessLabel(value) {
  const scaled = Number(value || 0) * 100;

  if (scaled >= 80) {
    return { label: "STRICT", className: "bg-rose-100 text-rose-700" };
  }
  if (scaled >= 45) {
    return { label: "MODERATE", className: "bg-yellow-100 text-yellow-700" };
  }
  return { label: "LENIENT", className: "bg-emerald-100 text-emerald-700" };
}

function getChaosLabel(value) {
  const num = Number(value || 0);

  if (num >= 80) {
    return { label: "HIGH", className: "bg-rose-100 text-rose-700" };
  }
  if (num >= 50) {
    return { label: "MEDIUM", className: "bg-yellow-100 text-yellow-700" };
  }
  return { label: "LOW", className: "bg-emerald-100 text-emerald-700" };
}

export default function RankingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const referees = useSelector((state) => state.referee.list);
  const loading = useSelector((state) => state.referee.loading);
  const search = useSelector((state) => state.referee.search);
  const leagueFilter = useSelector((state) => state.referee.leagueFilter);
  const countryFilter = useSelector((state) => state.referee.countryFilter);
  const seasonFilter = useSelector((state) => state.referee.seasonFilter);
  const sortMetric = useSelector((state) => state.referee.sortMetric);

  const rankingData = useMemo(() => {
    let filtered = [...(referees || [])]
      .filter((item) =>
        item.full_name?.toLowerCase().includes(search.toLowerCase())
      )
      .filter((item) =>
        leagueFilter === "all"
          ? true
          : (item.referee_style || "Unknown") === leagueFilter
      )
      .filter((item) =>
        countryFilter === "all"
          ? true
          : (item.nationality || "Unknown") === countryFilter
      )
      .map((item) => {
        const strictness = getStrictnessLabel(item.strictness_index);
        const chaos = getChaosLabel(item.referee_chaos_index);

        return {
          referee_id: item.referee_id,
          name: item.full_name,
          country: item.nationality || "Unknown",
          rmScore: Number(item.ref_monitor_score || 0),
          strictness: Math.round(Number(item.strictness_index || 0) * 100),
          strictnessLabel: strictness.label,
          strictnessClass: strictness.className,
          chaos: Number(item.referee_chaos_index || 0),
          chaosLabel: chaos.label,
          chaosClass: chaos.className,
          matches: item.matches || 0,
          style: item.referee_style || "Referee",
        };
      });

    filtered.sort((a, b) => {
      if (sortMetric === "strictness") return b.strictness - a.strictness;
      if (sortMetric === "chaos") return b.chaos - a.chaos;
      if (sortMetric === "matches") return b.matches - a.matches;
      return b.rmScore - a.rmScore;
    });

    const rows = filtered.map((item, index) => ({
      ...item,
      rank: index + 1,
      rmScore: item.rmScore.toFixed(1),
      chaos: item.chaos.toFixed(0),
    }));

    const avgRm =
      rows.length > 0
        ? (
            rows.reduce((sum, item) => sum + Number(item.rmScore || 0), 0) /
            rows.length
          ).toFixed(1)
        : "0.0";

    const avgStrictness =
      rows.length > 0
        ? Math.round(
            rows.reduce((sum, item) => sum + Number(item.strictness || 0), 0) /
              rows.length
          )
        : 0;

    const totalMatches = rows.reduce(
      (sum, item) => sum + Number(item.matches || 0),
      0
    );

    const leagues = [
      "all",
      ...new Set(referees.map((item) => item.referee_style || "Unknown")),
    ];

    const countries = [
      "all",
      ...new Set(referees.map((item) => item.nationality || "Unknown")),
    ];

    return {
      rows,
      leagues,
      countries,
      stats: {
        avgRm,
        totalRefs: rows.length,
        avgStrictness,
        totalMatches,
      },
    };
  }, [referees, search, leagueFilter, countryFilter, seasonFilter, sortMetric]);

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <div style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-5xl font-bold tracking-tight text-white">
            Global Referee Rankings
          </h1>
          <p className="mt-3 text-lg text-slate-500">
            Comprehensive performance scores across top leagues
          </p>
        </div>

        <RankingsStats stats={rankingData.stats} loading={loading} />

        <RankingsFilters
          search={search}
          onSearchChange={(value) => dispatch(setSearch(value))}
          leagueFilter={leagueFilter}
          onLeagueChange={(value) => dispatch(setLeagueFilter(value))}
          countryFilter={countryFilter}
          onCountryChange={(value) => dispatch(setCountryFilter(value))}
          seasonFilter={seasonFilter}
          onSeasonChange={(value) => dispatch(setSeasonFilter(value))}
          sortMetric={sortMetric}
          onSortMetricChange={(value) => dispatch(setSortMetric(value))}
          leagues={rankingData.leagues}
          countries={rankingData.countries}
        />

        <MetricsInfoCard />
        <RankingsTable rows={rankingData.rows} loading={loading} />

        <ScatterPlotSection />

        <div className="mt-8 rounded-[28px] p-8 text-center"
          style={{ background: "linear-gradient(135deg, #062c22 0%, #0a4a36 60%, #083328 100%)", border: "1px solid rgba(16,185,129,0.2)" }}>
          {subscribed ? (
            <div className="py-4">
              <p className="text-3xl mb-2">✅</p>
              <h2 className="font-display text-3xl font-bold text-white">You're on the list!</h2>
              <p className="text-slate-400 mt-2 text-sm">Weekly ref insights will land in your inbox every Monday.</p>
            </div>
          ) : (
            <>
              <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4"
                style={{ background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" }}>
                Weekly Newsletter
              </span>
              <h2 className="font-display text-4xl font-bold text-white">Get Weekly Ref Insights</h2>
              <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-white/60">
                Rankings updates, referee signals, and match-week breakdowns delivered every Monday.
              </p>
              <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                />
                <button type="submit"
                  className="rounded-xl px-6 py-3 text-sm font-bold text-white whitespace-nowrap transition hover:-translate-y-0.5"
                  style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.35)" }}>
                  Subscribe Free
                </button>
              </form>
              <p className="text-[11px] text-slate-600 mt-3">No spam. Unsubscribe anytime.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}