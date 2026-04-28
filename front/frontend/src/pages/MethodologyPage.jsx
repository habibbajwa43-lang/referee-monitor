import MethodologyHero from "../components/methodology/MethodologyHero";
import MethodologySteps from "../components/methodology/MethodologySteps";
import MetricsFramework from "../components/methodology/MetricsFramework";
import ScoringWeights from "../components/methodology/ScoringWeights";
import MethodologyPrinciples from "../components/methodology/MethodologyPrinciples";
import MetricMap from "../components/methodology/MetricMap";
import MethodologyCTA from "../components/methodology/MethodologyCTA";

export default function MethodologyPage() {
  return (
    <div style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <MethodologyHero />
        <MethodologySteps />
        <MetricMap />
        <MetricsFramework />
        <ScoringWeights />
        <MethodologyPrinciples />
        <MethodologyCTA />
      </div>
    </div>
  );
}