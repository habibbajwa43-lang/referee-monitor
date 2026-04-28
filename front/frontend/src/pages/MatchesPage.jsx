import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setRiskFilter,
  setMatchSeasonFilter,
  setMatchSearch,
} from "../app/slices/matchSlice";
import MatchesToolbar from "../components/matches/MatchesToolbar";
import MatchGrid from "../components/matches/MatchGrid";

export default function MatchesPage() {
  const dispatch = useDispatch();

  const fixtures = useSelector((state) => state.match.list);
  const loading = useSelector((state) => state.match.loading);
  const riskFilter = useSelector((state) => state.match.riskFilter);
  const seasonFilter = useSelector((state) => state.match.seasonFilter);
  const search = useSelector((state) => state.match.search);
  const navigate = useNavigate();
  const pageData = useMemo(() => {
    const seasons = [
      "all",
      ...new Set((fixtures || []).map((item) => item.season || "Unknown")),
    ];

    const filtered = [...(fixtures || [])]
      .filter((item) => {
        const label =
          `${item.home_team || ""} ${item.away_team || ""}`.toLowerCase();
        return label.includes(search.toLowerCase());
      })
      .filter((item) =>
        riskFilter === "all" ? true : item.risk_band === riskFilter
      )
      .filter((item) =>
        seasonFilter === "all" ? true : item.season === seasonFilter
      )
      .sort((a, b) => {
        const riskOrder = { RED: 3, AMBER: 2, GREEN: 1 };
        const riskDiff =
          (riskOrder[b.risk_band] || 0) - (riskOrder[a.risk_band] || 0);
        if (riskDiff !== 0) return riskDiff;
        return (Number(b.ref_impact_score) || 0) - (Number(a.ref_impact_score) || 0);
      });

    return {
      rows: filtered,
      seasons,
      total: filtered.length,
    };
  }, [fixtures, riskFilter, seasonFilter, search]);

  return (
    <div style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 pb-6 md:flex-row md:items-start md:justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <h1 className="font-display text-5xl font-bold tracking-tight text-white">
              Match Insights
            </h1>
            <p className="mt-3 text-lg text-slate-500">
              Preview fixtures, referee influence, and match risk indicators
            </p>
          </div>

          <div className="text-sm font-semibold text-slate-500">
            {pageData.total} Fixtures
          </div>
        </div>

        <MatchesToolbar
          search={search}
          onSearchChange={(value) => dispatch(setMatchSearch(value))}
          riskFilter={riskFilter}
          onRiskChange={(value) => dispatch(setRiskFilter(value))}
          seasonFilter={seasonFilter}
          onSeasonChange={(value) => dispatch(setMatchSeasonFilter(value))}
          seasons={pageData.seasons}
        />

        <MatchGrid fixtures={pageData.rows} loading={loading} />
      </div>
      <div className="mt-10 rounded-[28px] p-8 text-center text-white"
        style={{ background: "linear-gradient(135deg, #062c22 0%, #0a4a36 50%, #083328 100%)", border: "1px solid rgba(16,185,129,0.2)" }}>
        <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4"
          style={{ background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" }}>
          Deep Analysis
        </span>
        <h2 className="font-display text-4xl font-bold">
          Want Deeper Match Insights?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-white/70">
          Dive deeper into match analysis with referee influence, risk indicators,
          and advanced performance insights across all fixtures.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => navigate("/referees")}
            className="rounded-2xl px-7 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
            style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
            Explore Referees
          </button>
          <button
            onClick={() => navigate("/methodology")}
            className="rounded-2xl border border-white/20 bg-transparent px-7 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5">
            View Methodology
          </button>
        </div>
      </div>
    </div>
  );
}