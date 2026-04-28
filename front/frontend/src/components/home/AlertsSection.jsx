import { Trophy, Siren, Percent, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AlertsSection() {
  const navigate = useNavigate();

  const alerts = [
    {
      icon: Trophy,
      iconColor: "text-emerald-400",
      iconBg: "rgba(16,185,129,0.12)",
      badge: "Referee of the Week",
      badgeColor: "#10b981",
      title: "Anthony Taylor",
      subtitle: "Control Rating: Strong",
      desc: "Based on last 5 matches. Consistently high control and calm demeanor in major fixtures.",
      meta: "Confidence: High",
      border: "rgba(16,185,129,0.15)",
      glow: "rgba(16,185,129,0.08)",
      action: () => navigate("/referees/2"),
    },
    {
      icon: Siren,
      iconColor: "text-rose-400",
      iconBg: "rgba(244,63,94,0.12)",
      badge: "🔥 Chaos Alert",
      badgeColor: "#f43f5e",
      title: "Arsenal vs Man City",
      subtitle: "Risk Band: RED",
      desc: "High probability of cards and penalties. VAR expected to intervene multiple times.",
      meta: "Ref Impact: 91",
      border: "rgba(244,63,94,0.15)",
      glow: "rgba(244,63,94,0.06)",
      action: () => navigate("/matches/28"),
    },
    {
      icon: Percent,
      iconColor: "text-yellow-400",
      iconBg: "rgba(234,179,8,0.12)",
      badge: "Penalty Spike",
      badgeColor: "#f59e0b",
      title: "Mike Dean Pattern",
      subtitle: "Penalty Prob: 0.64",
      desc: "Historically awards 2.1× more penalties in high-pressure fixtures. Watch weekend game.",
      meta: "Confidence: Very High",
      border: "rgba(234,179,8,0.15)",
      glow: "rgba(234,179,8,0.06)",
      action: () => navigate("/referees"),
    },
  ];

  return (
    <section className="py-16" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-live" />
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">Live Signals</span>
          </div>
          <h2 className="font-display text-5xl font-black text-white uppercase">This Week's Key Alerts</h2>
          <p className="mt-2 text-slate-500">Updated live · Fast signals for cards, penalties, and match chaos</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {alerts.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.title}
                onClick={a.action}
                className="rounded-[22px] p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
                style={{ background: "var(--surface)", border: `1px solid ${a.border}`, boxShadow: `0 0 0 0 ${a.glow}` }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 20px 50px ${a.glow}`}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: a.iconBg }}>
                      <Icon size={18} className={a.iconColor} />
                    </div>
                    <span className="text-sm font-bold" style={{ color: a.badgeColor }}>{a.badge}</span>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-600 group-hover:text-white transition" />
                </div>

                <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <p className="font-display text-2xl font-bold text-white">{a.title}</p>
                  <p className="text-sm text-slate-400 mt-1">{a.subtitle}</p>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed mb-3">{a.desc}</p>
                <p className="text-xs font-semibold text-slate-300">{a.meta}</p>

                <div className="mt-4 pt-4 flex items-center justify-between text-xs text-slate-600"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full 0" />
                    Updated 2h ago
                  </span>
                  <span className="font-semibold" style={{ color: a.badgeColor }}>Open →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
