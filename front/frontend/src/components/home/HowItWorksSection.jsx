import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const metrics = [
  {
    emoji: "🔥",
    label: "High Chaos Index",
    meaning: "More volatile fixtures",
    detail: "Expect more cards, disputed calls and VAR involvement. Ideal for high-intensity match betting and fantasy alerts.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.18)",
  },
  {
    emoji: "🟨",
    label: "High Strictness",
    meaning: "More cards & fouls",
    detail: "This referee enforces the rulebook tightly. Card tallies and foul counts consistently exceed the league average.",
    color: "#eab308",
    bg: "rgba(234,179,8,0.08)",
    border: "rgba(234,179,8,0.18)",
  },
  {
    emoji: "🎯",
    label: "High Penalty Risk",
    meaning: "Increased penalty probability",
    detail: "Historical data shows this referee awards penalties at an above-average rate. Watch for contact in the box.",
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.08)",
    border: "rgba(244,63,94,0.18)",
  },
  {
    emoji: "⚡",
    label: "VAR Involvement",
    meaning: "Frequent VAR decisions",
    detail: "VAR is consulted regularly in this referee's matches. Expect review delays and late decision changes.",
    color: "#818cf8",
    bg: "rgba(129,140,248,0.08)",
    border: "rgba(129,140,248,0.18)",
  },
];

export default function HowItWorksSection() {
  const navigate = useNavigate();

  return (
    <section
      className="py-20"
      style={{
        background: "var(--bg)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">
            Quick Guide
          </p>
          <h2 className="font-display text-5xl font-black text-white uppercase mb-4">
            How to Read the Metrics
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Ref Monitor distils years of Premier League data into four key signals. Here is what each one means for any fixture.
          </p>
        </div>

        {/* Metric cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-[20px] p-5"
              style={{
                background: m.bg,
                border: `1px solid ${m.border}`,
              }}
            >
              <span className="text-3xl block mb-4">{m.emoji}</span>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: m.color }}
              >
                {m.label}
              </p>
              <p className="font-display text-xl font-black text-white uppercase mb-2">
                {m.meaning}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">{m.detail}</p>
            </div>
          ))}
        </div>

        {/* RM Score callout */}
        <div
          className="rounded-[20px] p-6 flex flex-col md:flex-row items-start md:items-center gap-5 justify-between"
          style={{
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.18)",
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
              style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}
            >
              📊
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">
                Important · Ref Impact Score
              </p>
              <p className="text-white font-semibold">
                A higher score means greater match influence — not a better referee.
              </p>
              <p className="text-sm text-slate-400 mt-1">
                The Ref Impact Score measures how significantly a referee's decisions shaped the match outcome. It is a measure of impact, not quality or consistency.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/methodology")}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-emerald-400 transition hover:bg-emerald-400/10 flex-shrink-0"
            style={{ border: "1px solid rgba(16,185,129,0.3)" }}
          >
            Full Methodology <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
