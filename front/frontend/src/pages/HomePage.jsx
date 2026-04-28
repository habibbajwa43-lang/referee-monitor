import { useMemo } from "react";
import { useSelector } from "react-redux";
import HeroSection from "../components/home/HeroSection";
import AlertsSection from "../components/home/AlertsSection";
import FeaturedMatchCard from "../components/home/FeaturedMatchCard";
import RefereeProfilePreview from "../components/home/RefereeProfilePreview";
import LatestInsightsSection from "../components/home/LatestInsightsSection";
import TrustStatsSection from "../components/home/TrustStatsSection";
import MethodologyPreview from "../components/home/MethodologyPreview";
import NewsletterSection from "../components/home/NewsletterSection";
import AudienceSection from "../components/home/AudienceSection";
import GraphicGeneratorSection from "../components/home/GraphicGeneratorSection";

export default function HomePage() {
  const referees = useSelector((state) => state.referee.list);
  const fixtures = useSelector((state) => state.match.list);
  const featuredMatch = useSelector((state) => state.match.featured);
  const loading = useSelector((state) => state.referee.loading || state.match.loading);

  const homeData = useMemo(() => {
    const sortedReferees = [...(referees || [])].sort((a, b) =>
      (Number(b.ref_monitor_score) || 0) - (Number(a.ref_monitor_score) || 0)
    );
    const sortedPenaltyRefs = [...(referees || [])].sort((a, b) =>
      (Number(b.referee_penalty_probability) || 0) - (Number(a.referee_penalty_probability) || 0)
    );
    const sortedChaosRefs = [...(referees || [])].sort((a, b) =>
      (Number(b.referee_chaos_index) || 0) - (Number(a.referee_chaos_index) || 0)
    );
    const sortedFixtures = [...(fixtures || [])].sort((a, b) => {
      const riskOrder = { RED: 3, AMBER: 2, GREEN: 1 };
      const riskDiff = (riskOrder[b.risk_band] || 0) - (riskOrder[a.risk_band] || 0);
      if (riskDiff !== 0) return riskDiff;
      return (Number(b.ref_impact_score) || 0) - (Number(a.ref_impact_score) || 0);
    });
    return {
      topReferee: sortedReferees[0] || null,
      penaltyReferee: sortedPenaltyRefs[0] || null,
      chaosReferee: sortedChaosRefs[0] || null,
      chaosFixture: sortedFixtures[0] || null,
      featuredMatch: featuredMatch || sortedFixtures[0] || null,
      profileReferee: sortedReferees[0] || null,
      hasRefData: sortedReferees.length > 0,
      hasFixtureData: sortedFixtures.length > 0,
    };
  }, [referees, fixtures, featuredMatch]);

  return (
    <div style={{ background: "var(--bg)" }}>
      <HeroSection />
      <AlertsSection
        loading={loading}
        topReferee={homeData.topReferee}
        penaltyReferee={homeData.penaltyReferee}
        chaosFixture={homeData.chaosFixture}
        hasRefData={homeData.hasRefData}
        hasFixtureData={homeData.hasFixtureData}
      />
      <FeaturedMatchCard match={homeData.featuredMatch} loading={loading} hasFixtureData={homeData.hasFixtureData} />
      <RefereeProfilePreview referee={homeData.profileReferee} loading={loading} hasRefData={homeData.hasRefData} />
      <AudienceSection />
      <GraphicGeneratorSection />
      <MethodologyPreview />
      <LatestInsightsSection
        penaltyReferee={homeData.penaltyReferee}
        chaosReferee={homeData.chaosReferee}
        featuredFixture={homeData.chaosFixture}
        hasRefData={homeData.hasRefData}
        hasFixtureData={homeData.hasFixtureData}
      />
      <TrustStatsSection />
      <NewsletterSection />
    </div>
  );
}