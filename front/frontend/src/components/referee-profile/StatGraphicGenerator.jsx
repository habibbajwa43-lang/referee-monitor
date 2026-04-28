import { useRef, useState } from "react";
import { Download, Image, X, Share2 } from "lucide-react";

function drawStatGraphic(canvas, ref, theme = "dark") {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  const isDark = theme === "dark";
  const bg       = isDark ? "#07090f" : "#f1f5f9";
  const surface  = isDark ? "#0e1219" : "#ffffff";
  const textPrimary = isDark ? "#f1f5f9" : "#0f172a";
  const textMuted   = isDark ? "#64748b" : "#94a3b8";
  const accent      = "#10b981";
  const accentBright = "#34d399";

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const barGrad = ctx.createLinearGradient(0, 0, W, 0);
  barGrad.addColorStop(0, accent);
  barGrad.addColorStop(1, accentBright);
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, 0, W, 6);

  // ─── HEADER ──────────────────────────────────────────────────
  roundRect(ctx, 20, 18, W - 40, 110, 16, surface, isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)");

  ctx.beginPath();
  ctx.arc(68, 73, 38, 0, Math.PI * 2);
  ctx.fillStyle = isDark ? "#1a2235" : "#e2e8f0";
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "bold 13px monospace";
  ctx.textAlign = "center";
  ctx.fillText("REF", 68, 77);

  const name = (ref.name || ref.full_name || "REFEREE").toUpperCase();
  ctx.fillStyle = textPrimary;
  ctx.font = `bold 26px 'Barlow Condensed', sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText(name, 122, 60);

  ctx.fillStyle = textMuted;
  ctx.font = "500 12px sans-serif";
  ctx.fillText(`${ref.country || "England"} · Premier League`, 122, 80);

  roundRect(ctx, 122, 88, 110, 26, 8, isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.12)", "rgba(16,185,129,0.4)");
  ctx.fillStyle = accent;
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("RM SCORE", 132, 103);
  ctx.fillStyle = accentBright;
  ctx.font = "bold 13px 'Barlow Condensed', sans-serif";
  ctx.fillText(ref.rmScore?.toFixed ? ref.rmScore.toFixed(1) : (ref.ref_monitor_score || "--"), 210, 103);

  const dynLabel = (() => {
    const chaos = Number(ref.referee_chaos_index || 0);
    const pen   = Number(ref.referee_penalty_probability || 0);
    const card  = Number(ref.referee_strictness_score || ref.strictness || 0);
    if (chaos > 75) return "🔥 HIGH CHAOS REF";
    if (pen > 35)   return "🚨 PENALTY WATCH";
    if (card > 70)  return "🟨 STRICTNESS WARNING";
    return "🎯 GAME FLOW KEEPER";
  })();
  ctx.fillStyle = isDark ? "rgba(16,185,129,0.7)" : "#0f6e56";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(dynLabel, W - 32, 55);

  // ─── RADAR CHART ─────────────────────────────────────────────
  const radarMetrics = [
    { label: "RM SCORE",   value: Number(ref.ref_monitor_score || ref.rmScore || 65), max: 100 },
    { label: "STRICTNESS", value: Number(ref.strictness_index ? ref.strictness_index * 100 : ref.strictness || 50), max: 100 },
    { label: "CHAOS",      value: Number(ref.referee_chaos_index || 68), max: 100 },
    { label: "VAR",        value: Number(ref.var_interaction_score ? ref.var_interaction_score * 100 : ref.varScore || 42), max: 100 },
    { label: "PENALTY",    value: Number(ref.referee_penalty_probability || ref.penaltyProb || 38), max: 100 },
    { label: "VOLATILITY", value: Number(ref.decision_volatility ? ref.decision_volatility * 100 : 55), max: 100 },
  ];

  const radarCX = W / 2;
  const radarCY = H * 0.48;
  const radarR  = Math.min(W, H) * 0.22;
  const n = radarMetrics.length;

  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt    = (i, r) => ({
    x: radarCX + r * Math.cos(angle(i)),
    y: radarCY + r * Math.sin(angle(i)),
  });

  roundRect(ctx, 20, 140, W - 40, H - 230, 16, surface, isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)");

  ctx.fillStyle = accent;
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PERFORMANCE RADAR", radarCX, 162);

  [1, 0.75, 0.5, 0.25].forEach((scale, ri) => {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const p = pt(i, radarR * scale);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = isDark
      ? `rgba(255,255,255,${ri === 0 ? 0.08 : 0.04})`
      : `rgba(0,0,0,${ri === 0 ? 0.1 : 0.05})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  for (let i = 0; i < n; i++) {
    const p = pt(i, radarR);
    ctx.beginPath();
    ctx.moveTo(radarCX, radarCY);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.beginPath();
  radarMetrics.forEach((m, i) => {
    const ratio = Math.min(m.value / m.max, 1);
    const p = pt(i, radarR * ratio);
    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(16,185,129,0.2)";
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  radarMetrics.forEach((m, i) => {
    const ratio = Math.min(m.value / m.max, 1);
    const p = pt(i, radarR * ratio);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = accentBright;
    ctx.fill();
    ctx.strokeStyle = bg;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const vp = pt(i, radarR * ratio - 16);
    ctx.fillStyle = accentBright;
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(Math.round(m.value), vp.x, vp.y);
  });

  radarMetrics.forEach((m, i) => {
    const p = pt(i, radarR + 24);
    ctx.fillStyle = textMuted;
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(m.label, p.x, p.y + 4);
  });

  // ─── STATS ROW ────────────────────────────────────────────────
  const statsY = H - 185;
  roundRect(ctx, 20, statsY, W - 40, 80, 16, surface, isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)");

  const quickStats = [
    { label: "MATCHES",   value: String(ref.matches || ref.total_matches || "--"), color: textPrimary },
    { label: "CARDS/M",   value: ref.strictness_index ? (ref.strictness_index * 5).toFixed(1) : "3.5", color: "#eab308" },
    { label: "PEN PROB",  value: `${Math.round(Number(ref.referee_penalty_probability || ref.penaltyProb || 38))}%`, color: "#f43f5e" },
    { label: "CHAOS IDX", value: String(Math.round(Number(ref.referee_chaos_index || 68))), color: "#f59e0b" },
    { label: "STYLE",     value: (ref.referee_style || ref.style || "VAR HEAVY").toUpperCase().slice(0, 9), color: accent },
  ];

  const cellW2 = (W - 40) / quickStats.length;
  quickStats.forEach((s, i) => {
    const x = 20 + i * cellW2 + cellW2 / 2;
    ctx.fillStyle = textMuted;
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(s.label, x, statsY + 24);
    ctx.fillStyle = s.color;
    ctx.font = "bold 20px 'Barlow Condensed', sans-serif";
    ctx.fillText(s.value, x, statsY + 56);
  });

  // ─── FOOTER ───────────────────────────────────────────────────
  const footerY = H - 44;
  ctx.fillStyle = isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.06)";
  ctx.fillRect(0, footerY - 12, W, H);

  roundRect(ctx, 32, footerY - 4, 148, 28, 8,
    isDark ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.15)",
    "rgba(16,185,129,0.5)");
  ctx.fillStyle = accent;
  ctx.font = "bold 14px 'Barlow Condensed', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("⚡ REF MONITOR", 42, footerY + 13);

  ctx.fillStyle = textMuted;
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("refmonitor.io", W - 32, footerY + 8);
  ctx.font = "9px sans-serif";
  ctx.fillText("Premier League Analytics", W - 32, footerY + 20);

  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = accent;
  ctx.font = "bold 80px 'Barlow Condensed', sans-serif";
  ctx.textAlign = "center";
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-0.35);
  ctx.fillText("REF MONITOR", 0, 0);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}

export default function StatGraphicGenerator({ referee, open, onClose }) {
  const canvasRef = useRef(null);
  const [theme, setTheme] = useState("dark");
  const [generated, setGenerated] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");
  const [exportSize, setExportSize] = useState("square");

  const EXPORT_SIZES = {
    square:  { label: "Square 1:1",     w: 600,  h: 680,  desc: "Profile card" },
    ig45:    { label: "Instagram 4:5",  w: 600,  h: 800,  desc: "Feed post" },
    story:   { label: "Story 9:16",     w: 600,  h: 1067, desc: "Instagram/TikTok" },
    twitter: { label: "X/Twitter 16:9", w: 800,  h: 520,  desc: "Tweet card" },
  };

  const DYNAMIC_LABEL = () => {
    const chaos = Number(referee?.chaosIndex || referee?.referee_chaos_index || 0);
    const pen   = Number(referee?.penaltyProb || referee?.referee_penalty_probability || 0);
    const card  = Number(referee?.strictness || referee?.referee_strictness_score || 0);
    if (chaos > 75) return "🔥 High Chaos Ref";
    if (pen > 35)   return "🚨 Penalty Watch";
    if (card > 70)  return "🟨 Strictness Warning";
    return "🎯 Game Flow Keeper";
  };

  if (!open) return null;

  const generate = () => {
    const canvas = canvasRef.current;
    const size = EXPORT_SIZES[exportSize];
    canvas.width  = size.w;
    canvas.height = size.h;
    drawStatGraphic(canvas, referee, theme);
    setPreviewSrc(canvas.toDataURL("image/png"));
    setGenerated(true);
  };

  const download = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `${(referee?.name || "referee").replace(/\s+/g, "_")}_stat_${exportSize}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl rounded-2xl p-6"
        style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.08)" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(16,185,129,0.15)" }}>
              <Image size={16} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white">Generate Stat Graphic</h3>
              <p className="text-xs text-slate-500">{DYNAMIC_LABEL()} · {referee?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {/* Theme + Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Theme</p>
            <div className="flex gap-2">
              {["dark", "light"].map((t) => (
                <button key={t}
                  onClick={() => { setTheme(t); setGenerated(false); setPreviewSrc(""); }}
                  className="px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all"
                  style={{
                    background: theme === t ? (t === "dark" ? "#10b981" : "#f1f5f9") : "rgba(255,255,255,0.05)",
                    color: theme === t ? (t === "dark" ? "#000" : "#0f172a") : "#94a3b8",
                    border: theme === t ? "none" : "1px solid rgba(255,255,255,0.08)"
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Export Size</p>
            <select value={exportSize}
              onChange={(e) => { setExportSize(e.target.value); setGenerated(false); setPreviewSrc(""); }}
              className="w-full rounded-lg px-3 py-2 text-sm font-semibold text-white outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              {Object.entries(EXPORT_SIZES).map(([key, s]) => (
                <option key={key} value={key} style={{ background: "#0e1219" }}>
                  {s.label} — {s.desc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-xl overflow-hidden mb-5 flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", minHeight: 220 }}>
          {generated && previewSrc ? (
            <img
              src={previewSrc}
              alt="stat graphic preview"
              className="w-full max-w-full rounded-lg"
              style={{ imageRendering: "crisp-edges", display: "block" }}
            />
          ) : (
            <div className="text-center py-10">
              <Share2 size={32} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Click "Generate Variant" to preview</p>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={generate}
            className="btn-accent flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase tracking-wider">
            <Image size={15} />
            {generated ? "Refresh Design" : "Generate Variant"}
          </button>
          {generated && (
            <button onClick={download}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-emerald-400 transition hover:bg-emerald-400/10"
              style={{ border: "1px solid rgba(16,185,129,0.3)" }}>
              <Download size={15} />
              Export PNG
            </button>
          )}
        </div>
      </div>
    </div>
  );
}