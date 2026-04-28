import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setSearch,
  setLeagueFilter,
  setCountryFilter,
} from "../app/slices/refereeSlice";
import RefereesToolbar from "../components/referees/RefreesToolbar";
import RefereeGrid from "../components/referees/RefereeGrid";

export default function RefereesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const referees = useSelector((state) => state.referee.list);
  const loading = useSelector((state) => state.referee.loading);
  const search = useSelector((state) => state.referee.search);
  const leagueFilter = useSelector((state) => state.referee.leagueFilter);
  const countryFilter = useSelector((state) => state.referee.countryFilter);

  const pageData = useMemo(() => {
    const mapped = (referees || []).map((item) => ({
      referee_id: item.referee_id,
      name: item.full_name,
      country: item.nationality || "Unknown",
      league: item.referee_style || "Top Flight",
      rmScore: Number(item.ref_monitor_score || 0).toFixed(1),
      cardsPerMatch: Number(item.strictness_index || 0) * 6,
      avatar: `/images/referees/${item.referee_id}.jpg`,
    }));

    const filtered = mapped.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.league.toLowerCase().includes(search.toLowerCase());

      const matchesLeague =
        leagueFilter === "all" ? true : item.league === leagueFilter;

      const matchesCountry =
        countryFilter === "all" ? true : item.country === countryFilter;

      return matchesSearch && matchesLeague && matchesCountry;
    });

    const leagues = ["all", ...new Set(mapped.map((item) => item.league))];
    const countries = ["all", ...new Set(mapped.map((item) => item.country))];

    return {
      referees: filtered,
      leagues,
      countries,
      total: mapped.length,
    };
  }, [referees, search, leagueFilter, countryFilter]);

  return (
    <div style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 pb-6 md:flex-row md:items-start md:justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <h1 className="font-display text-5xl font-bold tracking-tight text-white">
              Football Referees, Explained by Data
            </h1>
            <p className="mt-3 text-lg text-slate-500">
              Select a referee to view detailed analytics, performance metrics,
              and historical trends
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <span>👥</span>
            <span>{pageData.total} Referees</span>
          </div>
        </div>

        <RefereesToolbar
          search={search}
          onSearchChange={(value) => dispatch(setSearch(value))}
          leagueFilter={leagueFilter}
          onLeagueChange={(value) => dispatch(setLeagueFilter(value))}
          countryFilter={countryFilter}
          onCountryChange={(value) => dispatch(setCountryFilter(value))}
          leagues={pageData.leagues}
          countries={pageData.countries}
        />

        <RefereeGrid referees={pageData.referees} loading={loading} />

        <div className="mt-8 rounded-[28px] p-8 text-center text-white" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))", border: "1px solid rgba(16,185,129,0.2)" }}>
          <h2 className="font-display text-4xl font-bold">
            Want Match-Level Referee Impact?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-white/85">
            Explore how referee tendencies influence cards, penalties, and chaos
            in upcoming fixtures.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate("/matches")}
              className="cursor-pointer rounded-2xl bg-transparent px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              Explore Match Insights
            </button>

            <button
              onClick={() => navigate("/methodology")}
              className="cursor-pointer rounded-2xl border border-white/30 bg-transparent px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-transparent/10"
            >
              View Methodology
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}