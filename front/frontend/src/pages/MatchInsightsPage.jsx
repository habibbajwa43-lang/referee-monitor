import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFixtureById,
  setSelectedMatchFromCache,
} from "../app/slices/matchSlice";
import MatchInsightHero from "../components/matches/MatchInsightHero";
import MatchInsightStats from "../components/matches/MatchInsightStats";
import MatchRiskBreakdown from "../components/matches/MatchRiskBreakdown";
import MatchInsightsCTA from "../components/matches/MatchInsightsCTA";

export default function MatchInsightPage() {
  const { fixtureId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fixture = useSelector((state) => state.match.selected);
  const selectedById = useSelector((state) => state.match.selectedById);
  const loading = useSelector((state) => state.match.loading);

  useEffect(() => {
    if (!fixtureId) return;

    if (selectedById?.[fixtureId]) {
      dispatch(setSelectedMatchFromCache(fixtureId));
    } else {
      dispatch(fetchFixtureById(fixtureId));
    }
  }, [dispatch, fixtureId, selectedById]);

  const detail = useMemo(() => {
    if (!fixture) {
      const volatility = 0.64;
      const varInteraction = 0.58;
      const penaltyInfluence = 0.54;
      const cardIntensity = 0.48;

      return {
        title: "Loading Match...",
        season: "—",
        importance: "—",
        risk: "AMBER",
        impactLabel: "—",
        refereeId: null,
        rmScore: "—",
        impactScore: "—",
        cardIntensity: cardIntensity.toFixed(2),
        penaltyInfluence: penaltyInfluence.toFixed(2),
        volatility: volatility.toFixed(2),
        varInteraction: varInteraction.toFixed(2),
        bars: [
          { label: "Volatility", value: volatility, color: "0" },
          { label: "VAR Interaction", value: varInteraction, color: "0" },
          { label: "Penalty Influence", value: penaltyInfluence, color: "0" },
          { label: "Card Intensity", value: cardIntensity, color: "0" },
        ],
      };
    }

    const volatility = Number(fixture.volatility ?? 0.64);
    const varInteraction = Number(fixture.var_interaction ?? 0.58);
    const penaltyInfluence = Number(fixture.penalty_influence ?? 0.54);
    const cardIntensity = Number(fixture.card_intensity ?? 0.48);

    return {
      title: `${fixture.home_team} vs ${fixture.away_team}`,
      season: fixture.season || "2020-21",
      importance: fixture.importance_band || "LOW",
      risk: fixture.risk_band || "RED",
      impactLabel: fixture.impact_label || "HIGH IMPACT",
      refereeId: fixture.referee_id || 4,
      rmScore: Number(fixture.predicted_ref_monitor_score ?? 80.6).toFixed(1),
      impactScore: Number(fixture.ref_impact_score ?? 72.7).toFixed(1),
      cardIntensity: cardIntensity.toFixed(2),
      penaltyInfluence: penaltyInfluence.toFixed(2),
      volatility: volatility.toFixed(2),
      varInteraction: varInteraction.toFixed(2),
      bars: [
        { label: "Volatility", value: volatility, color: "0" },
        { label: "VAR Interaction", value: varInteraction, color: "0" },
        { label: "Penalty Influence", value: penaltyInfluence, color: "0" },
        { label: "Card Intensity", value: cardIntensity, color: "0" },
      ],
    };
  }, [fixture]);

  return (
    <div className="">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <button
          onClick={() => navigate("/matches")}
          className="mb-4 cursor-pointer text-sm font-semibold text-slate-500 transition hover:text-slate-200"
        >
          ← Back to Match List
        </button>

        <MatchInsightHero detail={detail} loading={loading && !fixture} />
        <MatchInsightStats detail={detail} loading={loading && !fixture} />
        <MatchRiskBreakdown detail={detail} loading={loading && !fixture} />
        <MatchInsightsCTA refereeId={detail?.refereeId} />
      </div>
    </div>
  );
}