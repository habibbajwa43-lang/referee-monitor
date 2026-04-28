import { Percent, Zap, Shield, Flame, BarChart2, Star } from "lucide-react";

const topics = [
  {
    icon: Percent,
    title: "Penalty Trends",
    text: "Identify referees with elevated penalty probability and compare changes in officiating behavior.",
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.08)",
    border: "rgba(244,63,94,0.15)",
  },
  {
    icon: Zap,
    title: "Chaos Signals",
    text: "Track chaos-heavy referees and understand how volatility affects fixture interpretation.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.15)",
  },
  {
    icon: Shield,
    title: "Strictness Profiles",
    text: "Explore stricter vs more lenient officiating styles using RM score and disciplinary indicators.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.15)",
  },
  {
    icon: Flame,
    title: "Weekly Trends",
    text: "Stay up to date with the latest patterns from the current matchweek across the top flight.",
    color: "#818cf8",
    bg: "rgba(129,140,248,0.08)",
    border: "rgba(129,140,248,0.15)",
  },
  {
    icon: Star,
    title: "Referee of the Week",
    text: "The standout official based on this week's RM Score, impact level, and fixture significance.",
    color: "#eab308",
    bg: "rgba(234,179,8,0.08)",
    border: "rgba(234,179,8,0.15)",
  },
  {
    icon: BarChart2,
    title: "Highest VAR Volatility",
    text: "Which fixtures showed the most VAR-driven variance and what that means for betting and analysis.",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.15)",
  },
];

export default function InsightsTopics() {
  return (
    <div className="mt-8">
      <h2 className="font-display text-3xl font-bold text-white mb-6">Why These Signals Matter</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <div
              key={topic.title}
              className="rounded-[20px] p-5 transition-all duration-300 hover:-translate-y-1"
              style={{ background: topic.bg, border: `1px solid ${topic.border}` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${topic.color}18`, border: `1px solid ${topic.color}30` }}>
                  <Icon size={16} style={{ color: topic.color }} />
                </div>
                <h3 className="font-display text-lg font-bold text-white">{topic.title}</h3>
              </div>
              <p className="text-sm leading-6 text-slate-500">{topic.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
