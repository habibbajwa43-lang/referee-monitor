import { Siren, Percent, Zap, Users, ArrowUpRight, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AlertsSection() {
  const navigate = useNavigate();

  // Prioritised: Chaos Alert first, then Penalty Watch, then FPL impact
  const alerts = [
    {
      icon: Siren,
      iconColor: "text-rose-400",
      iconBg: "rgba(244,63,94,0.12)",
      badge: "🔥 Chaos Alert",
      badgeColor: "#f43f5e",
      dominantLabel: "HIGH CHAOS FIXTURE",
      title: "Arsenal vs Man City",
      subtitle: "Risk Band: RED",
      desc: "High probability of cards and penalties. VAR expected to intervene multiple times. Aggressive fixture profile.",
      signals: ["High Disruption Expected", "Elevated Card Risk", "Penalty Alert Active"],
      signalColor: "#f43f5e",
      meta: "Ref Impact: 91 · Confidence: HIGH (84%)",
      border: "rgba(244,63,94,0.2)",
      glow: "rgba(244,63,94,0.06)",
      action: () => navigate("/matches/28"),
    },
    {
      icon: Percent,
      iconColor: "text-yellow-400",
      iconBg: "rgba(234,179,8,0.12)",
      badge: "⚽ Penalty Alert",
      badgeColor: "#f59e0b",
      dominantLabel: "PENALTY WATCH",
      title: "Mike Dean Profile",
      subtitle: "Penalty Alert: 0.64",
      desc: "Historically awards 2.1× more penalties in high-pressure fixtures. Good fixture for penalty takers in your FPL squad.",
      signals: ["Good Fixture for Penalty Takers", "FPL Caution for Defenders", "High VAR Intervention Risk"],
      signalColor: "#f59e0b",
      meta: "Confidence: VERY HIGH · Based on 38 fixtures",
      border: "rgba(234,179,8,0.2)",
      glow: "rgba(234,179,8,0.06)",
      action: () => navigate("/referees"),
    },
    {
      icon: Users,
      iconColor: "text-emerald-400",
      iconBg: "rgba(16,185,129,0.12)",
      badge: "🎯 FPL Impact",
      badgeColor: "#10b981",
      dominantLabel: "FPL WATCH",
      title: "Weekend FPL Signals",
      subtitle: "3 fixtures flagged",
      desc: "Captaincy volatility elevated in top-six clashes this weekend. Avoid aggressive defenders in RED risk fixtures.",
      signals: ["Captaincy Volatility Increased", "Avoid Aggressive Defenders", "Penalty Takers in Demand"],
      signalColor: "#10b981",
      meta: "3 fixtures · Updated 2h ago",
      border: "rgba(16,185,129,0.15)",
      glow: "rgba(16,185,129,0.05)",
      action: () => navigate("/matches"),
    },
  ];

  return (
    <section className="py-16" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-live" />
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">Live Intelligence Signals</span>
          </div>
          <h2 className="font-display text-5xl font-black text-white uppercase">This Weekend's Key Alerts</h2>
          <p className="mt-2 text-slate-500">Updated live · Chaos alerts, penalty watch, and FPL impact first</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {alerts.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.title}
                onClick={a.action}
                className="rounded-[22px] p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
                style={{ background: "var(--surface)", border: `1px solid ${a.border}` }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 20px 50px ${a.glow}`}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: a.iconBg }}>
                      <Icon size={18} className={a.iconColor} />
                    </div>
                    <span className="text-sm font-bold" style={{ color: a.badgeColor }}>{a.badge}</span>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-600 group-hover:text-white transition" />
                </div>

                {/* Dominant label */}
                <div className="rounded-xl px-4 py-3 mb-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <p className="font-display text-lg font-black uppercase tracking-tight" style={{ color: a.badgeColor }}>
                    {a.dominantLabel}
                  </p>
                  <p className="font-display text-xl font-bold text-white mt-0.5">{a.title}</p>
                  <p className="text-sm text-slate-400 mt-1">{a.subtitle}</p>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed mb-3">{a.desc}</p>

                {/* Signal chips */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {a.signals.map((s) => (
                    <span key={s} className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                      style={{ color: a.badgeColor, background: `${a.badgeColor}14`, border: `1px solid ${a.badgeColor}30` }}>
                      {s}
                    </span>
                  ))}
                </div>

                <p className="text-xs font-semibold text-slate-400">{a.meta}</p>

                <div className="mt-4 pt-4 flex items-center justify-between text-xs text-slate-600"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.badgeColor }} />
                    Updated 2h ago
                  </span>
                  <span className="font-semibold" style={{ color: a.badgeColor }}>View Intelligence →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
