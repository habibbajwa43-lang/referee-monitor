import { Database, Filter, BarChart3, ShieldCheck } from "lucide-react";

const steps = [
  {
    title: "Raw Match Data Collection",
    text: "We ingest structured fixture, assignment, and event-level referee data across multiple seasons.",
    icon: Database,
  },
  {
    title: "Cleaning & Validation",
    text: "Data is validated, normalized, and transformed into consistent analytics-ready signals.",
    icon: Filter,
  },
  {
    title: "Metric Generation",
    text: "Referee profiles are scored across strictness, volatility, pressure sensitivity, VAR interaction, and chaos.",
    icon: BarChart3,
  },
  {
    title: "Fixture Prediction Layer",
    text: "Referee metrics are blended into match-level impact signals and risk bands for upcoming fixtures.",
    icon: ShieldCheck,
  },
];

export default function MethodologySteps() {
  return (
    <div className="mb-8">
      <h2 className="font-display text-4xl font-bold text-white">
        Methodology Pipeline
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-8 text-slate-500">
        The system transforms raw historical officiating data into referee
        profiles and fixture-level predictive outputs.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="rounded-[26px] border border-white/6 bg-transparent p-6  transition-all duration-300 hover:-translate-y-1 hover:"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl ">
                  <Icon size={22} className="text-emerald-700" />
                </div>
                <span className="font-display text-2xl font-bold text-slate-300">
                  0{index + 1}
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-500">
                {step.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}