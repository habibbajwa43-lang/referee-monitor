import { AlertTriangle, Zap, CreditCard, Shield } from "lucide-react";

const REFEREE_NAMES = {
  1: "Michael Oliver", 2: "Anthony Taylor", 3: "Chris Kavanagh",
  4: "Stuart Attwell", 5: "Andy Madley", 6: "Peter Bankes",
  7: "Simon Hooper", 8: "Paul Tierney", 9: "Robert Jones", 10: "John Brooks",
};

function riskColors(band) {
  if (band === "RED") return { badge: { bg: "rgba(244,63,94,0.12)", color: "#f43f5e", border: "rgba(244,63,94,0.2)" }, panel: { bg: "rgba(244,63,94,0.05)", border: "rgba(244,63,94,0.12)" } };
  if (band === "AMBER") return { badge: { bg: "rgba(234,179,8,0.12)", color: "#eab308", border: "rgba(234,179,8,0.2)" }, panel: { bg: "rgba(234,179,8,0.05)", border: "rgba(234,179,8,0.12)" } };
  return { badge: { bg: "rgba(16,185,129,0.1)", color: "#10b981", border: "rgba(16,185,129,0.2)" }, panel: { bg: "rgba(16,185,129,0.04)", border: "rgba(16,185,129,0.1)" } };
}

function buildAlerts(detail) {
  const alerts = [];
  const card = Number(detail.cardIntensity || 0);
  const pen  = Number(detail.penaltyInfluence || 0);
  const var_ = Number(detail.varInteraction || 0);
  const vol  = Number(detail.volatility || 0);

  if (vol > 0.7)  alerts.push({ icon: Zap,           label: "Chaos Alert",      color: "#f43f5e", bg: "rgba(244,63,94,0.1)",   border: "rgba(244,63,94,0.2)" });
  if (pen > 0.45) alerts.push({ icon: AlertTriangle,  label: "Penalty Watch",    color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" });
  if (card > 0.45) alerts.push({ icon: CreditCard,    label: "Card Alert",       color: "#eab308", bg: "rgba(234,179,8,0.1)",  border: "rgba(234,179,8,0.2)" });
  if (var_ > 0.6)  alerts.push({ icon: Shield,        label: "VAR Heavy",        color: "#818cf8", bg: "rgba(129,140,248,0.1)", border: "rgba(129,140,248,0.2)" });
  return alerts;
}

function generateAISummary(detail) {
  const risk = detail.risk;
  const vol  = Number(detail.volatility || 0);
  const pen  = Number(detail.penaltyInfluence || 0);
  const refName = REFEREE_NAMES[detail.refereeId] || "The assigned referee";
  if (risk === "RED" && vol > 0.7)
    return `${refName} has a high chaos index for this fixture. Model signals indicate elevated volatility and a meaningful chance of penalty or late drama.`;
  if (risk === "RED")
    return `${refName} is flagged as a high-impact official for this match. Expect assertive decision-making and above-average intervention probability.`;
  if (risk === "AMBER" && pen > 0.4)
    return `${refName} shows a moderate penalty signal for this type of fixture. Worth monitoring as the match progresses into key phases.`;
  return `${refName} profiles as a balanced official for this fixture. Lower impact probability with standard strictness and VAR signals.`;
}

export default function MatchInsightHero({ detail, loading }) {
  if (loading || !detail) {
    return (
      <div className="rounded-[24px] p-10 text-center text-slate-600"
        style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
        Loading match insight...
      </div>
    );
  }
  const c = riskColors(detail.risk);
  const alerts = buildAlerts(detail);
  const refName = REFEREE_NAMES[detail.refereeId] || `Referee ${detail.refereeId}`;
  const aiSummary = generateAISummary(detail);

  return (
    <div className="rounded-[24px] p-7" style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2">Match Insight</p>
          <h1 className="font-display text-4xl font-black text-white uppercase mb-4">{detail.title}</h1>

          {/* Badges row */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[detail.season, detail.importance].map((t) => t && (
              <span key={t} className="rounded-full px-3 py-1 text-xs font-bold text-slate-400"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>{t}</span>
            ))}
            <span className="rounded-full px-3 py-1 text-xs font-bold"
              style={{ background: c.badge.bg, color: c.badge.color, border: `1px solid ${c.badge.border}` }}>{detail.risk}</span>
            <span className="rounded-full px-3 py-1 text-xs font-bold text-emerald-400"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
              Confidence: 78%
            </span>
          </div>

          {/* Referee name */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Referee</span>
            <span className="text-sm font-bold text-white">{refName}</span>
          </div>

          {/* Alert badges */}
          {alerts.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {alerts.map(({ icon: Icon, label, color, bg, border }) => (
                <span key={label} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold"
                  style={{ color, background: bg, border: `1px solid ${border}` }}>
                  <Icon size={10} />
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* AI Summary */}
          <div className="rounded-[14px] p-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">AI Summary</p>
            <p className="text-sm leading-6 text-slate-400">{aiSummary}</p>
          </div>
        </div>

        {/* Risk Panel */}
        <div className="rounded-[18px] p-5 flex flex-col justify-between" style={{ background: c.panel.bg, border: `1px solid ${c.panel.border}` }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-3">Risk Assessment</p>
            <p className="font-display text-5xl font-black" style={{ color: c.badge.color }}>{detail.risk}</p>
            <p className="text-sm text-slate-500 mt-2">Referee impact probability elevated for this fixture.</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { label: "RM Score", val: detail.rmScore, color: "#10b981" },
              { label: "Impact", val: detail.impactScore, color: "#818cf8" },
            ].map(({ label, val, color }) => (
              <div key={label} className="rounded-[12px] p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{label}</p>
                <p className="font-display text-2xl font-black mt-1" style={{ color }}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
