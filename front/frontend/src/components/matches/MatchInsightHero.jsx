import { AlertTriangle, Zap, CreditCard, Shield, Target, HelpCircle, Users } from "lucide-react";
import {
  getActionableTags,
  getFPLImplications,
  getWhyReasons,
  getMatchVerdict,
  getConfidenceLevel,
  getMetricLabel,
} from "../../utils/refereeIntelligence";

const REFEREE_NAMES = {
  1: "Michael Oliver", 2: "Anthony Taylor", 3: "Chris Kavanagh",
  4: "Stuart Attwell", 5: "Andy Madley", 6: "Peter Bankes",
  7: "Simon Hooper", 8: "Paul Tierney", 9: "Robert Jones", 10: "John Brooks",
};

function riskColors(band) {
  if (band === "RED")   return { badge: { bg: "rgba(244,63,94,0.12)",  color: "#f43f5e", border: "rgba(244,63,94,0.2)" },  panel: { bg: "rgba(244,63,94,0.05)",  border: "rgba(244,63,94,0.12)"  } };
  if (band === "AMBER") return { badge: { bg: "rgba(234,179,8,0.12)",  color: "#eab308", border: "rgba(234,179,8,0.2)" },  panel: { bg: "rgba(234,179,8,0.05)",  border: "rgba(234,179,8,0.12)"  } };
  return                       { badge: { bg: "rgba(16,185,129,0.10)", color: "#10b981", border: "rgba(16,185,129,0.2)" }, panel: { bg: "rgba(16,185,129,0.04)", border: "rgba(16,185,129,0.10)" } };
}

function buildAlerts(detail) {
  const alerts = [];
  const card = Number(detail.cardIntensity    || 0);
  const pen  = Number(detail.penaltyInfluence || 0);
  const var_ = Number(detail.varInteraction   || 0);
  const vol  = Number(detail.volatility       || 0);

  if (vol  > 0.7)  alerts.push({ icon: Zap,        label: "Chaos Alert",                 color: "#f43f5e", bg: "rgba(244,63,94,0.1)",   border: "rgba(244,63,94,0.2)"   });
  if (pen  > 0.45) alerts.push({ icon: Target,      label: "Penalty Watch",               color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)"  });
  if (card > 0.45) alerts.push({ icon: CreditCard,  label: "Elevated Card Risk",          color: "#eab308", bg: "rgba(234,179,8,0.1)",   border: "rgba(234,179,8,0.2)"   });
  if (var_ > 0.6)  alerts.push({ icon: Shield,      label: "High VAR Intervention Risk",  color: "#818cf8", bg: "rgba(129,140,248,0.1)", border: "rgba(129,140,248,0.2)" });
  return alerts;
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

  const c           = riskColors(detail.risk);
  const alerts      = buildAlerts(detail);
  const refName     = REFEREE_NAMES[detail.refereeId] || `Referee ${detail.refereeId}`;
  const verdict     = getMatchVerdict(detail);
  const conf        = getConfidenceLevel(detail);
  const tags        = getActionableTags(detail);
  const fplTips     = getFPLImplications(detail);
  const whyList     = getWhyReasons(detail, { name: refName });

  const dominantLabel =
    detail.risk === "RED"   ? "HIGH CHAOS FIXTURE" :
    detail.risk === "AMBER" ? "ELEVATED RISK FIXTURE" :
                              "CLEAN FIXTURE";

  return (
    <div className="space-y-4">
      {/* ── DOMINANT TAKEAWAY BANNER ── */}
      <div className="rounded-[18px] px-6 py-4 flex flex-wrap items-center justify-between gap-4"
        style={{ background: c.panel.bg, border: `2px solid ${c.badge.border}` }}>
        <span className="font-display text-3xl font-black tracking-tighter uppercase"
          style={{ color: c.badge.color }}>
          {dominantLabel}
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Prediction Confidence</span>
          <span className="font-display text-xl font-black" style={{ color: conf.color }}>{conf.label}</span>
          <span className="text-xs font-bold text-slate-600">· {conf.pct}%</span>
          <span className="text-[10px] text-slate-700">Based on {conf.matches} similar fixtures</span>
        </div>
      </div>

      {/* ── MAIN HERO CARD ── */}
      <div className="rounded-[24px] p-7"
        style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2">Match Insight</p>
            <h1 className="font-display text-4xl font-black text-white uppercase mb-4">{detail.title}</h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {[detail.season, detail.importance].map((t) => t && (
                <span key={t} className="rounded-full px-3 py-1 text-xs font-bold text-slate-400"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>{t}</span>
              ))}
              <span className="rounded-full px-3 py-1 text-xs font-bold"
                style={{ background: c.badge.bg, color: c.badge.color, border: `1px solid ${c.badge.border}` }}>
                {detail.risk} RISK
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Referee</span>
              <span className="text-sm font-bold text-white">{refName}</span>
            </div>

            {alerts.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {alerts.map(({ icon: Icon, label, color, bg, border }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold"
                    style={{ color, background: bg, border: `1px solid ${border}` }}>
                    <Icon size={10} />{label}
                  </span>
                ))}
              </div>
            )}

            {/* AI Verdict */}
            <div className="rounded-[14px] p-4 mb-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2 flex items-center gap-1.5">
                <Zap size={10} className="text-amber-400" /> Intelligence Verdict
              </p>
              <p className="text-sm leading-6 text-slate-300 italic">"{verdict}"</p>
            </div>

            {tags.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Key Signals</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span key={t.label} className="rounded-full px-2.5 py-1 text-[10px] font-bold"
                      style={{ color: t.color, background: t.bg, border: `1px solid ${t.color}33` }}>
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT risk panel */}
          <div className="rounded-[18px] p-5 flex flex-col gap-4"
            style={{ background: c.panel.bg, border: `1px solid ${c.panel.border}` }}>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-3">Risk Assessment</p>
              <p className="font-display text-5xl font-black" style={{ color: c.badge.color }}>{detail.risk}</p>
              <p className="text-sm text-slate-500 mt-1">Referee impact probability elevated for this fixture.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: getMetricLabel("RM Score"), val: detail.rmScore,     color: "#10b981" },
                { label: getMetricLabel("Impact"),   val: detail.impactScore, color: "#818cf8" },
              ].map(({ label, val, color }) => (
                <div key={label} className="rounded-[12px] p-3"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">{label}</p>
                  <p className="font-display text-2xl font-black mt-1" style={{ color }}>{val}</p>
                </div>
              ))}
            </div>
            <div className="rounded-[12px] p-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1">Prediction Confidence</p>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-xl font-black" style={{ color: conf.color }}>{conf.label}</span>
                <span className="text-xs text-slate-500">{conf.pct}%</span>
              </div>
              <p className="text-[10px] text-slate-600 mt-0.5">Based on {conf.matches} similar historical fixtures</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── WHY? PANEL ── */}
      <div className="rounded-[20px] p-6"
        style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={14} className="text-slate-500" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Why This Prediction?</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {whyList.map((reason, i) => (
            <div key={i} className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <span className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: c.badge.color }} />
              <span className="text-xs text-slate-400 leading-relaxed">{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FPL LAYER ── */}
      {fplTips.length > 0 && (
        <div className="rounded-[20px] p-6"
          style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Users size={14} className="text-slate-500" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">FPL Intelligence Layer</p>
            <span className="rounded-full px-2 py-0.5 text-[9px] font-bold text-emerald-400 ml-auto"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
              Fantasy Football Signals
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {fplTips.map((tip, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                style={{
                  background: tip.positive ? "rgba(16,185,129,0.04)" : "rgba(244,63,94,0.04)",
                  border: `1px solid ${tip.positive ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.1)"}`,
                }}>
                <span className="text-base">{tip.icon}</span>
                <span className="text-xs font-semibold" style={{ color: tip.positive ? "#10b981" : "#f87171" }}>
                  {tip.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
