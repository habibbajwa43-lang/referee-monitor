import { ShieldAlert, Zap, Percent, BarChart2, TrendingUp, Eye } from "lucide-react";

const signals = [
  {
    icon: Zap,
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.08)",
    border: "rgba(244,63,94,0.15)",
    title: "Chaos Index",
    text: "Measures how unpredictable a referee's decision-making is across comparable fixture types. High chaos signals increase fixture volatility and late-game drama probability.",
  },
  {
    icon: Percent,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.15)",
    title: "Penalty Probability",
    text: "Derived from historical spot-kick rates, fixture pressure, and referee propensity. Above 35% triggers a Penalty Watch flag for that fixture.",
  },
  {
    icon: ShieldAlert,
    color: "#818cf8",
    bg: "rgba(129,140,248,0.08)",
    border: "rgba(129,140,248,0.15)",
    title: "VAR Interaction Score",
    text: "Tracks how frequently a referee's decisions are overturned or escalated via VAR review. High scorers create longer, more disrupted matches.",
  },
  {
    icon: BarChart2,
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.15)",
    title: "Strictness Index",
    text: "A 0–100 scale of disciplinary firmness based on cards-per-match, foul tolerance, and advantage-playing tendency across multi-season data.",
  },
  {
    icon: TrendingUp,
    color: "#eab308",
    bg: "rgba(234,179,8,0.08)",
    border: "rgba(234,179,8,0.15)",
    title: "Decision Volatility",
    text: "Quantifies game-to-game inconsistency in officiating behavior. A volatile referee may award a penalty in one fixture but ignore an identical foul in the next.",
  },
  {
    icon: Eye,
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.15)",
    title: "Fixture Context Score",
    text: "Adjusts referee impact signals based on match importance, rivalry weight, home pressure, and late-season positioning — context that raw stats miss entirely.",
  },
];

export default function InsightsDeepDive() {
  return (
    <div className="mt-8 mb-8">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">
            Signal Intelligence
          </p>
          <h2 className="font-display text-4xl font-bold text-white">
            How the Model Reads Each Match
          </h2>
        </div>
        <p className="text-sm text-slate-500 max-w-xs leading-6">
          Six core signals power every insight, ranking, and risk prediction on this platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {signals.map((sig) => {
          const Icon = sig.icon;
          return (
            <div
              key={sig.title}
              className="rounded-[22px] p-5 transition-all duration-300 hover:-translate-y-1"
              style={{ background: sig.bg, border: `1px solid ${sig.border}` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${sig.color}18`, border: `1px solid ${sig.color}30` }}
                >
                  <Icon size={17} style={{ color: sig.color }} />
                </div>
                <h3 className="font-display text-lg font-bold text-white">{sig.title}</h3>
              </div>
              <p className="text-sm leading-6 text-slate-500">{sig.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
