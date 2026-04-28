import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import InsightsHero from "../components/insights/InsightsHero";
import FeaturedInsightBanner from "../components/insights/FeaturedInsightBanner";
import InsightsGrid from "../components/insights/InsightsGrid";
import InsightSignalsStrip from "../components/insights/InsightSignalsStrip";
import InsightsTopics from "../components/insights/InsightsTopics";
import InsightsDeepDIve from "../components/insights/InsightsDeepDive";

export default function InsightsPage() {
  const referees = useSelector((state) => state.referee.list);
  const fixtures = useSelector((state) => state.match.list);
  const loading = useSelector(
    (state) => state.referee.loading || state.match.loading
  );

  const insights = useMemo(() => {
    const penaltyRef = [...(referees || [])].sort(
      (a, b) =>
        (Number(b.referee_penalty_probability) || 0) -
        (Number(a.referee_penalty_probability) || 0)
    )[0];

    const chaosRef = [...(referees || [])].sort(
      (a, b) =>
        (Number(b.referee_chaos_index) || 0) -
        (Number(a.referee_chaos_index) || 0)
    )[0];

    const topStrictRef = [...(referees || [])].sort(
      (a, b) =>
        (Number(b.strictness_index) || 0) -
        (Number(a.strictness_index) || 0)
    )[0];

    const highImpactFixture = [...(fixtures || [])].sort((a, b) => {
      const riskOrder = { RED: 3, AMBER: 2, GREEN: 1 };
      const riskDiff =
        (riskOrder[b.risk_band] || 0) - (riskOrder[a.risk_band] || 0);

      if (riskDiff !== 0) return riskDiff;

      return (
        (Number(b.ref_impact_score) || 0) -
        (Number(a.ref_impact_score) || 0)
      );
    })[0];

    return [
      {
        id: "penalty-watch",
        title: penaltyRef
          ? `${penaltyRef.full_name} Leads Penalty Watch`
          : "Penalty Watch",
        description: penaltyRef
          ? `${penaltyRef.full_name} currently has one of the strongest penalty probability signals in the referee dataset.`
          : "Strong penalty trend signal available from recent model outputs.",
        badge: penaltyRef
          ? `${Math.round(Number(penaltyRef.referee_penalty_probability || 0))}%`
          : "38%",
        type: "penalty",
        target: penaltyRef ? `/referees/${penaltyRef.referee_id}` : "/insights",
        image: "/images/penalty-insight.jpeg",
      },
      {
        id: "chaos-alert",
        title: chaosRef
          ? `${chaosRef.full_name} Shows Maximum Chaos`
          : "Chaos Referee Alert",
        description: chaosRef
          ? `${chaosRef.full_name} currently tops the chaos index with a score of ${Number(
              chaosRef.referee_chaos_index || 0
            ).toFixed(1)}.`
          : "High-chaos referee trends are shaping volatile fixtures this week.",
        badge: chaosRef
          ? Number(chaosRef.referee_chaos_index || 0).toFixed(1)
          : "High",
        type: "chaos",
        target: chaosRef ? `/referees/${chaosRef.referee_id}` : "/insights",
        image: "/images/chaos-insight.jpeg",
      },
      {
        id: "strictness-trend",
        title: topStrictRef
          ? `${topStrictRef.full_name} Sets the Strictness Benchmark`
          : "Strictness Benchmark",
        description: topStrictRef
          ? `${topStrictRef.full_name} has one of the highest strictness signals, indicating stronger card frequency and tighter control.`
          : "Card-heavy referee patterns continue to define stricter officiating profiles.",
        badge: topStrictRef
          ? `${Math.round(Number(topStrictRef.strictness_index || 0) * 100)}`
          : "72",
        type: "strictness",
        target: topStrictRef ? `/referees/${topStrictRef.referee_id}` : "/insights",
        image: "/images/strictness-insight.jpeg",
      },
      {
        id: "fixture-impact",
        title: highImpactFixture
          ? `${highImpactFixture.home_team} vs ${highImpactFixture.away_team}`
          : "High-Impact Fixture",
        description: highImpactFixture
          ? `${highImpactFixture.impact_label} fixture with ${highImpactFixture.risk_band} risk and impact score ${Number(
              highImpactFixture.ref_impact_score || 0
            ).toFixed(1)}.`
          : "High-risk match dynamics are being driven by referee impact and volatility.",
        badge: highImpactFixture?.risk_band || "RED",
        type: "fixture",
        target: highImpactFixture
          ? `/matches/${highImpactFixture.fixture_id}`
          : "/insights",
        image: "/images/match-intensity.jpeg",
      },
    ];
  }, [referees, fixtures]);

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const featuredInsight = insights[0];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <div style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <InsightsHero />
        <FeaturedInsightBanner insight={featuredInsight} />
        <InsightSignalsStrip referees={referees} fixtures={fixtures} />
        <InsightsGrid insights={insights} loading={loading} />
        <InsightsDeepDIve insights={insights} />
        <InsightsTopics />

        {/* Email Capture CTA */}
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
                Newsletter
              </span>
              <h2 className="font-display text-4xl font-bold text-white">Get Weekly Ref Insights</h2>
              <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-white/60">
                Referee signals, fixture risk breakdowns, and model updates — straight to your inbox every matchweek.
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
                <button
                  type="submit"
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