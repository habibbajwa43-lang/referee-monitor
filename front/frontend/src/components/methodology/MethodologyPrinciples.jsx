import { Eye, Crosshair, Clock, Users } from "lucide-react";

const principles = [
  {
    icon: Eye,
    title: "Transparent",
    text: "The scoring system is deterministic and explainable rather than black-box driven.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
  },
  {
    icon: Crosshair,
    title: "Context-Aware",
    text: "Referee behavior is interpreted in light of rivalry, match importance, and fixture pressure.",
    color: "#818cf8",
    bg: "rgba(129,140,248,0.08)",
  },
  {
    icon: Clock,
    title: "Multi-Season",
    text: "Profiles are based on historical behavior over time rather than one-off match outcomes.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
  },
  {
    icon: Users,
    title: "Practical",
    text: "The outputs are designed to help fans, analysts, and media understand officiating patterns quickly.",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.08)",
  },
];

export default function MethodologyPrinciples() {
  return (
    <div className="mb-8">
      <h2 className="font-display text-4xl font-bold text-white">Core Principles</h2>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {principles.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-[24px] p-6 transition-all duration-300 hover:-translate-y-1"
              style={{ background: item.bg, border: `1px solid ${item.color}22` }}
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: `${item.color}18`, border: `1px solid ${item.color}33` }}>
                <Icon size={20} style={{ color: item.color }} />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
