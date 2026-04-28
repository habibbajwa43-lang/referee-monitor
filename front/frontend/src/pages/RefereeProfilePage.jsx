import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRefProfileById,
  setSelectedRefereeFromCache,
} from "../app/slices/refereeSlice";
import { getRefSeasonData } from "../services/refereeApi";

import ProfileHeroCard from "../components/referee-profile/ProfileHeroCard";
import RefStyleBanner from "../components/referee-profile/RefStyleBanner";
import PerformanceMetricsCard from "../components/referee-profile/PerformanceMetricsCard";
import StatisticalBreakdownCard from "../components/referee-profile/StatisticalBreakdownCard";
import TrendChartsSection from "../components/referee-profile/TrendChartsSection";
import SeasonStatsTable from "../components/referee-profile/SeasonStatsTable";
import MatchInsightsCTA from "../components/referee-profile/MatchInsightsCTA";

export default function RefereeProfilePage() {
  const { refId } = useParams();
  const dispatch = useDispatch();

  const referee = useSelector((state) => state.referee.selected);
  const selectedById = useSelector((state) => state.referee.selectedById);
  const loading = useSelector((state) => state.referee.loading);

  const [seasonData, setSeasonData] = useState([]);
  const [seasonLoading, setSeasonLoading] = useState(false);

  useEffect(() => {
    if (!refId) return;
    if (selectedById?.[refId]) {
      dispatch(setSelectedRefereeFromCache(refId));
    } else {
      dispatch(fetchRefProfileById(refId));
    }
  }, [dispatch, refId, selectedById]);

  useEffect(() => {
    if (!refId) return;
    setSeasonLoading(true);
    getRefSeasonData(refId)
      .then((data) => setSeasonData(data))
      .catch(() => setSeasonData([]))
      .finally(() => setSeasonLoading(false));
  }, [refId]);

  const pageData = useMemo(() => {
    if (!referee) {
      return {
        hero: null,
        radarMetrics: [],
        statBreakdown: [],
        lineData: [],
        barData: [],
        varData: [],
        seasonRows: [],
        styleText: "Referee decision trends loading...",
      };
    }

    const rmScore     = Number(referee.ref_monitor_score || 0);
    const strictness  = Number(referee.strictness_index || 0) * 100;
    const penaltyProb = Number(referee.referee_penalty_probability || 0);
    const varScore    = Number(referee.var_interaction_score || 0) * 100;
    const chaos       = Number(referee.referee_chaos_index || 0);
    const impact      = Number(referee.ref_impact_score || 0);
    const homeBias    = Number(referee.home_bias_index || 0);
    const volatility  = Number(referee.decision_volatility || 0) * 100;
    const pressure    = Number(referee.pressure_sensitivity || 0) * 100;
    const matches     = Number(referee.matches || 0);

    // ── Real season data ──────────────────────────────────────
    const lineData = seasonData.length > 0
      ? seasonData.map((s) => ({
          season: s.season,
          value: Number(s.ref_monitor_score || 0).toFixed(1),
        }))
      : [];

    const varData = seasonData.length > 0
      ? seasonData.map((s) => ({
          season: s.season,
          value: Math.round(Number(s.var_interaction_score || 0) * 100),
        }))
      : [];

    const barData = seasonData.length > 0
      ? seasonData.map((s) => ({
          season: s.season,
          value: Number(s.penalty_diff || 0),
        }))
      : [];

    const seasonRows = seasonData.length > 0
      ? seasonData.map((s) => {
          const rmS = Number(s.ref_monitor_score || 0);
          return {
            season:    s.season,
            matches:   Number(s.total_matches || 0),
            yellow:    Number(s.penalty_diff || 0),
            red:       Number(s.red_diff || 0),
            penalties: Number(s.penalty_diff || 0),
            risk:
              rmS >= 75 ? "Strict" :
              rmS >= 60 ? "Balanced" :
              rmS >= 45 ? "Moderate" : "Flexible",
          };
        })
      : [];

    return {
      hero: {
        id:         referee.referee_id,
        name:       referee.full_name,
        country:    referee.nationality || "Unknown",
        style:      referee.referee_style || "Referee",
        rmScore,
        matches,
        strictness,
        penaltyProb,
        varScore,
      },
      radarMetrics: [
        { label: "Flow Mgmt",    value: Math.min(100, 100 - volatility * 0.5) },
        { label: "Risk Trigger", value: Math.min(100, strictness) },
        { label: "Chaos Control",value: Math.min(100, 100 - chaos * 0.45) },
        { label: "Game Control", value: Math.min(100, pressure) },
        { label: "VAR Usage",    value: Math.min(100, varScore) },
      ],
      statBreakdown: [
        {
          label: "Cards per Match",
          value: (strictness / 20).toFixed(1),
          badge: strictness >= 80 ? "HIGH" : strictness >= 50 ? "MED" : "LOW",
          delta: "+12.4% vs avg",
        },
        {
          label: "Penalties per Match",
          value: (penaltyProb / 100).toFixed(2),
          badge: penaltyProb >= 60 ? "HIGH" : penaltyProb >= 35 ? "MED" : "LOW",
          delta: "+8.1% vs avg",
        },
        {
          label: "VAR Interventions",
          value: Math.round(varScore / 2.2),
          badge: varScore >= 65 ? "HIGH" : varScore >= 40 ? "MED" : "LOW",
          delta: "+16.7% vs avg",
        },
        {
          label: "Fouls per Match",
          value: (18 + strictness / 10).toFixed(1),
          badge: "Medium",
          delta: "+3.9% vs avg",
        },
      ],
      lineData,
      barData,
      varData,
      seasonRows,
      styleText:
        strictness >= 80
          ? "Very strict enforcement with low tolerance for tactical fouls and dissent. High card frequency and penalty signals create a more controlled but intense match atmosphere."
          : strictness >= 50
          ? "Balanced control style with measured interventions and moderate use of cards, penalties, and VAR."
          : "More lenient control profile with lower card frequency and a smoother game flow unless match pressure rises sharply.",
      summary: { impact, homeBias },
    };
  }, [referee, seasonData]);

  const isLoading       = loading && !referee;
  const isSeasonLoading = seasonLoading;

  return (
    <div className="">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <ProfileHeroCard hero={pageData.hero} loading={isLoading} />
        <RefStyleBanner text={pageData.styleText} loading={isLoading} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <PerformanceMetricsCard
            metrics={pageData.radarMetrics}
            hero={pageData.hero}
            loading={isLoading}
          />
          <StatisticalBreakdownCard
            items={pageData.statBreakdown}
            loading={isLoading}
          />
        </div>

        <TrendChartsSection
          lineData={pageData.lineData}
          barData={pageData.barData}
          varData={pageData.varData}
          loading={isSeasonLoading}
        />

        <SeasonStatsTable rows={pageData.seasonRows} loading={isSeasonLoading} />
        <MatchInsightsCTA refereeId={refId} />
      </div>
    </div>
  );
}