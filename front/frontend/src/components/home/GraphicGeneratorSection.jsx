import { useState, useRef, useEffect } from "react";
import { Download, Image, ChevronDown, Loader, Twitter } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'https://referee-monitor-production.up.railway.app';

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r); ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}

function extractStats(ref) {
  return {
    rmScore:    Math.round(Number(ref.ref_monitor_score || 0)),
    chaos:      Math.round(Number(ref.referee_chaos_index || 0)),
    penalty:    Math.round(Number(ref.referee_penalty_probability || 0)),
    strictness: Math.round(Number(ref.strictness_index || 0) * 100),
    varScore:   Math.round(Number(ref.var_interaction_score || 0) * 100),
    matches:    ref.matches || 0,
    name:       ref.full_name || ref.name || "REFEREE",
    style:      ref.referee_style || "STANDARD",
  };
}

function drawFullCard(canvas, ref, theme) {
  const ctx = canvas.getContext("2d");
  const W = 700, H = 420;
  canvas.width = W; canvas.height = H;
  const { rmScore, chaos, penalty, strictness, varScore, matches, name, style } = extractStats(ref);
  const dark = theme === "dark";
  const bg = dark ? "#07090f" : "#f8fafc";
  const surface = dark ? "#0e1219" : "#ffffff";
  const textPrimary = dark ? "#f1f5f9" : "#0f172a";
  const textMuted = dark ? "#475569" : "#94a3b8";
  const accent = "#10b981";
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const topGrad = ctx.createLinearGradient(0, 0, W, 0);
  topGrad.addColorStop(0, "#10b981"); topGrad.addColorStop(1, "#34d399");
  ctx.fillStyle = topGrad; ctx.fillRect(0, 0, W, 5);
  roundRect(ctx, 20, 20, W-40, H-40, 18, surface, dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.08)");
  ctx.beginPath(); ctx.arc(70, 88, 34, 0, Math.PI*2);
  ctx.fillStyle = dark?"#1a2235":"#e2e8f0"; ctx.fill();
  ctx.strokeStyle = accent; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.fillStyle = accent; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center"; ctx.fillText("REF", 70, 93);
  const fullName = name.toUpperCase();
  let fs = 26; ctx.font = `bold ${fs}px sans-serif`;
  while (ctx.measureText(fullName).width > W-280 && fs > 13) { fs--; ctx.font = `bold ${fs}px sans-serif`; }
  ctx.fillStyle = textPrimary; ctx.textAlign = "left"; ctx.fillText(fullName, 120, 78);
  roundRect(ctx, 120, 88, 110, 24, 7, dark?"rgba(16,185,129,0.15)":"rgba(16,185,129,0.1)", "rgba(16,185,129,0.3)");
  ctx.fillStyle = accent; ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center"; ctx.fillText(style.toUpperCase(), 175, 104);
  roundRect(ctx, W-118, 48, 90, 58, 12, dark?"rgba(16,185,129,0.12)":"rgba(16,185,129,0.08)", "rgba(16,185,129,0.25)");
  ctx.fillStyle = textMuted; ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center"; ctx.fillText("RM SCORE", W-73, 66);
  ctx.fillStyle = accent; ctx.font = "bold 26px sans-serif"; ctx.fillText(rmScore, W-73, 96);
  ctx.strokeStyle = dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.08)";
  ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(40, 128); ctx.lineTo(W-40, 128); ctx.stroke();
  const bars = [
    { label: "CHAOS INDEX", value: chaos, color: "#f59e0b" },
    { label: "PENALTY PROB", value: penalty, color: "#f43f5e" },
    { label: "CARD STRICTNESS", value: strictness, color: "#eab308" },
    { label: "VAR SCORE", value: varScore, color: "#818cf8" },
  ];
  const bW = 320;
  bars.forEach((s, i) => {
    const y = 152 + i*52;
    ctx.fillStyle = textMuted; ctx.font = "bold 9px sans-serif"; ctx.textAlign = "left"; ctx.fillText(s.label, 40, y);
    roundRect(ctx, 40, y+10, bW, 11, 5, dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.06)");
    const fw = Math.max(12, bW * Math.min(s.value, 100)/100);
    const bg2 = ctx.createLinearGradient(40, 0, 40+fw, 0);
    bg2.addColorStop(0, s.color); bg2.addColorStop(1, s.color+"bb");
    ctx.shadowColor = s.color; ctx.shadowBlur = 5; roundRect(ctx, 40, y+10, fw, 11, 5, bg2); ctx.shadowBlur = 0;
    ctx.fillStyle = s.color; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "left"; ctx.fillText(s.value, 372, y+21);
  });
  const cx=565, cy=255, rv=82;
  const rVals=[Math.min(chaos,100)/100,Math.min(penalty,100)/100,Math.min(strictness,100)/100,Math.min(varScore,100)/100,Math.min(rmScore,100)/100,0.65];
  const rLabels=["CHAOS","PENALTY","STRICT","VAR","RM","CTRL"];
  [1,0.66,0.33].forEach(sc=>{
    ctx.beginPath();
    for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2-Math.PI/2;i===0?ctx.moveTo(cx+Math.cos(a)*rv*sc,cy+Math.sin(a)*rv*sc):ctx.lineTo(cx+Math.cos(a)*rv*sc,cy+Math.sin(a)*rv*sc);}
    ctx.closePath();ctx.strokeStyle=dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.08)";ctx.lineWidth=1;ctx.stroke();
  });
  for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2-Math.PI/2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*rv,cy+Math.sin(a)*rv);ctx.strokeStyle=dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.06)";ctx.lineWidth=1;ctx.stroke();}
  ctx.beginPath();
  rVals.forEach((v,i)=>{const a=(i/6)*Math.PI*2-Math.PI/2;i===0?ctx.moveTo(cx+Math.cos(a)*rv*v,cy+Math.sin(a)*rv*v):ctx.lineTo(cx+Math.cos(a)*rv*v,cy+Math.sin(a)*rv*v);});
  ctx.closePath();ctx.fillStyle="rgba(16,185,129,0.18)";ctx.fill();ctx.shadowColor=accent;ctx.shadowBlur=10;ctx.strokeStyle=accent;ctx.lineWidth=2.5;ctx.stroke();ctx.shadowBlur=0;
  rVals.forEach((v,i)=>{const a=(i/6)*Math.PI*2-Math.PI/2;ctx.beginPath();ctx.arc(cx+Math.cos(a)*rv*v,cy+Math.sin(a)*rv*v,3,0,Math.PI*2);ctx.fillStyle=accent;ctx.fill();});
  rLabels.forEach((l,i)=>{const a=(i/6)*Math.PI*2-Math.PI/2;ctx.fillStyle=textMuted;ctx.font="bold 8px sans-serif";ctx.textAlign="center";ctx.fillText(l,cx+Math.cos(a)*(rv+15),cy+Math.sin(a)*(rv+15)+3);});
  roundRect(ctx,40,366,110,30,8,dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.04)",dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.09)");
  ctx.fillStyle=textMuted;ctx.font="bold 8px sans-serif";ctx.textAlign="center";ctx.fillText("MATCHES",95,379);
  ctx.fillStyle=textPrimary;ctx.font="bold 13px sans-serif";ctx.fillText(matches,95,393);
  ctx.fillStyle=accent;ctx.font="bold 10px sans-serif";ctx.textAlign="left";ctx.fillText("⚡ REF MONITOR",165,H-11);
  ctx.fillStyle=dark?"rgba(100,116,139,0.55)":"rgba(148,163,184,0.8)";ctx.font="8px sans-serif";ctx.textAlign="right";ctx.fillText("refmonitor.io · Premier League Analytics",W-38,H-11);
}

function drawRadarCard(canvas, ref, theme) {
  const ctx = canvas.getContext("2d");
  const W=500, H=500; canvas.width=W; canvas.height=H;
  const { rmScore, chaos, penalty, strictness, varScore, name, style } = extractStats(ref);
  const dark = theme==="dark";
  const surface = dark?"#0e1219":"#ffffff";
  const textPrimary = dark?"#f1f5f9":"#0f172a";
  const textMuted = dark?"#64748b":"#94a3b8";
  const accent = "#10b981";
  ctx.fillStyle=dark?"#07090f":"#f8fafc"; ctx.fillRect(0,0,W,H);
  roundRect(ctx,16,16,W-32,H-32,20,surface,dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.08)");
  ctx.fillStyle=textPrimary;ctx.font="bold 22px sans-serif";ctx.textAlign="center";ctx.fillText(name.toUpperCase(),W/2,55);
  ctx.fillStyle=accent;ctx.font="bold 10px sans-serif";ctx.fillText(style.toUpperCase()+" · RM: "+rmScore,W/2,74);
  const cx=W/2,cy=H/2+20,r=150;
  const vals=[Math.min(chaos,100)/100,Math.min(penalty,100)/100,Math.min(strictness,100)/100,Math.min(varScore,100)/100,Math.min(rmScore,100)/100,0.65];
  const labels=["CHAOS","PENALTY","STRICT","VAR","RM","CTRL"];
  const colors=["#f59e0b","#f43f5e","#eab308","#818cf8","#10b981","#38bdf8"];
  [1,0.66,0.33].forEach(s=>{ctx.beginPath();for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2-Math.PI/2;i===0?ctx.moveTo(cx+Math.cos(a)*r*s,cy+Math.sin(a)*r*s):ctx.lineTo(cx+Math.cos(a)*r*s,cy+Math.sin(a)*r*s);}ctx.closePath();ctx.strokeStyle=dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.08)";ctx.lineWidth=1;ctx.stroke();});
  ctx.beginPath();vals.forEach((v,i)=>{const a=(i/6)*Math.PI*2-Math.PI/2;i===0?ctx.moveTo(cx+Math.cos(a)*r*v,cy+Math.sin(a)*r*v):ctx.lineTo(cx+Math.cos(a)*r*v,cy+Math.sin(a)*r*v);});
  ctx.closePath();ctx.fillStyle="rgba(16,185,129,0.2)";ctx.fill();ctx.shadowColor=accent;ctx.shadowBlur=12;ctx.strokeStyle=accent;ctx.lineWidth=2.5;ctx.stroke();ctx.shadowBlur=0;
  vals.forEach((v,i)=>{const a=(i/6)*Math.PI*2-Math.PI/2;ctx.beginPath();ctx.arc(cx+Math.cos(a)*r*v,cy+Math.sin(a)*r*v,5,0,Math.PI*2);ctx.fillStyle=colors[i];ctx.fill();ctx.fillStyle=textMuted;ctx.font="bold 9px sans-serif";ctx.textAlign="center";ctx.fillText(labels[i],cx+Math.cos(a)*(r+25),cy+Math.sin(a)*(r+25)+4);});
  ctx.fillStyle=accent;ctx.font="bold 10px sans-serif";ctx.textAlign="left";ctx.fillText("⚡ REF MONITOR",30,H-18);
  ctx.fillStyle=textMuted;ctx.font="8px sans-serif";ctx.textAlign="right";ctx.fillText("refmonitor.io",W-30,H-18);
}

function drawBadgeCard(canvas, ref, theme) {
  const ctx = canvas.getContext("2d");
  const W=400, H=240; canvas.width=W; canvas.height=H;
  const { rmScore, chaos, strictness, name, style, matches } = extractStats(ref);
  const dark = theme==="dark";
  const surface = dark?"#0e1219":"#ffffff";
  const textPrimary = dark?"#f1f5f9":"#0f172a";
  const textMuted = dark?"#64748b":"#94a3b8";
  const accent = "#10b981";
  ctx.fillStyle=dark?"#07090f":"#f8fafc"; ctx.fillRect(0,0,W,H);
  const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,"#10b98122");g.addColorStop(1,"#07090f");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  roundRect(ctx,14,14,W-28,H-28,16,surface,"rgba(16,185,129,0.2)");
  ctx.fillStyle=accent;ctx.font="bold 11px sans-serif";ctx.textAlign="left";ctx.fillText("⚡ REF MONITOR",30,42);
  ctx.fillStyle=textPrimary;ctx.font="bold 26px sans-serif";ctx.fillText(name.toUpperCase().substring(0,18),30,78);
  ctx.fillStyle=textMuted;ctx.font="bold 10px sans-serif";ctx.fillText(style.toUpperCase(),30,98);
  const items=[{l:"RM SCORE",v:rmScore,c:"#10b981"},{l:"CHAOS",v:chaos,c:"#f59e0b"},{l:"STRICTNESS",v:strictness,c:"#f43f5e"},{l:"MATCHES",v:matches,c:"#94a3b8"}];
  items.forEach((s,i)=>{
    const x=30+i*90;
    roundRect(ctx,x,115,80,64,10,dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.04)",dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.08)");
    ctx.fillStyle=textMuted;ctx.font="bold 7px sans-serif";ctx.textAlign="center";ctx.fillText(s.l,x+40,130);
    ctx.fillStyle=s.c;ctx.font="bold 22px sans-serif";ctx.fillText(s.v,x+40,160);
  });
  ctx.fillStyle=textMuted;ctx.font="8px sans-serif";ctx.textAlign="right";ctx.fillText("refmonitor.io",W-28,H-20);
}

const TEMPLATES = [
  { id: "full",  label: "Full Stat Card", draw: drawFullCard },
  { id: "radar", label: "Radar Only",     draw: drawRadarCard },
  { id: "badge", label: "Mini Badge",     draw: drawBadgeCard },
];

export default function GraphicGeneratorSection() {
  const [refs, setRefs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [template, setTemplate] = useState("full");
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/ref_profiles`)
      .then(r => r.json())
      .then(data => { const list=Array.isArray(data)?data:[]; setRefs(list); if(list.length>0)setSelected(list[0]); })
      .catch(() => setRefs([]))
      .finally(() => setLoading(false));
  }, []);

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selected) return;
    const tpl = TEMPLATES.find(t => t.id === template) || TEMPLATES[0];
    tpl.draw(canvas, selected, theme);
    setGenerated(true);
  };

  const download = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const name = (selected?.full_name || "referee").replace(/\s+/g, "_");
    const link = document.createElement("a");
    link.download = `${name}_${template}.png`; link.href = canvas.toDataURL("image/png"); link.click();
  };

  const shareTwitter = () => {
    const name = selected?.full_name || "Referee";
    const score = Math.round(Number(selected?.ref_monitor_score || 0));
    const text = encodeURIComponent(`📊 ${name} — RM Score: ${score} | Referee analytics on Ref Monitor! #RefMonitor #PremierLeague`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const stats = selected ? extractStats(selected) : null;

  return (
    <section className="py-20" style={{ background: "var(--surface)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-5xl font-black text-white uppercase mb-3">Generate Referee Stat Card</h2>
          <p className="text-slate-500 max-w-lg mx-auto">Select any referee, pick a template and theme — generate a shareable graphic.</p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
          <div className="rounded-2xl p-6 space-y-5" style={{ background: "var(--bg)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Select Referee</label>
              <div className="relative">
                {loading ? (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-slate-500" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <Loader size={14} className="animate-spin" /> Loading...
                  </div>
                ) : (
                  <select value={selected?.referee_id || ""}
                    onChange={e => { setSelected(refs.find(r => String(r.referee_id) === e.target.value)||null); setGenerated(false); }}
                    className="w-full appearance-none rounded-xl px-4 py-3 text-sm font-semibold text-white outline-none pr-10"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {refs.map(r => <option key={r.referee_id} value={String(r.referee_id)} style={{ background: "#0e1219" }}>{r.full_name}</option>)}
                  </select>
                )}
                {!loading && <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Card Template</label>
              <div className="flex flex-col gap-2">
                {TEMPLATES.map(t => (
                  <button key={t.id} onClick={() => { setTemplate(t.id); setGenerated(false); }}
                    className="py-2.5 px-4 rounded-xl text-sm font-bold text-left transition-all"
                    style={template===t.id?{background:"#10b981",color:"#000"}:{background:"rgba(255,255,255,0.04)",color:"#64748b",border:"1px solid rgba(255,255,255,0.07)"}}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Theme</label>
              <div className="flex gap-2">
                {["dark","light"].map(t => (
                  <button key={t} onClick={() => { setTheme(t); setGenerated(false); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all"
                    style={theme===t?{background:"#10b981",color:"#000"}:{background:"rgba(255,255,255,0.04)",color:"#64748b",border:"1px solid rgba(255,255,255,0.07)"}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {stats && (
              <div className="rounded-xl p-4 space-y-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                {[{l:"RM Score",v:stats.rmScore,c:"#10b981"},{l:"Chaos",v:stats.chaos,c:"#f59e0b"},{l:"Penalty",v:stats.penalty,c:"#f43f5e"},{l:"Strictness",v:stats.strictness,c:"#eab308"},{l:"VAR",v:stats.varScore,c:"#818cf8"},{l:"Matches",v:stats.matches,c:"#94a3b8"}].map(s => (
                  <div key={s.l} className="flex justify-between">
                    <span className="text-xs text-slate-500">{s.l}</span>
                    <span className="text-xs font-bold font-mono" style={{ color: s.c }}>{s.v}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={generate} disabled={!selected||loading}
              className="btn-accent w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold uppercase tracking-wider">
              <Image size={15} /> {generated ? "Re-generate" : "Generate Graphic"}
            </button>
            {generated && (
              <div className="flex gap-2">
                <button onClick={download}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold uppercase text-emerald-400 transition hover:bg-emerald-400/10"
                  style={{ border: "1px solid rgba(16,185,129,0.3)" }}>
                  <Download size={15} /> PNG
                </button>
                <button onClick={shareTwitter}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold uppercase text-sky-400 transition hover:bg-sky-400/10"
                  style={{ border: "1px solid rgba(56,189,248,0.3)" }}>
                  <Twitter size={15} /> Tweet
                </button>
              </div>
            )}
          </div>
          <div className="rounded-2xl overflow-hidden flex items-center justify-center"
            style={{ background: "var(--bg)", border: "1px solid rgba(255,255,255,0.07)", minHeight: 380 }}>
            {!generated && (
              <div className="text-center py-16 px-8">
                <div className="h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
                  <Image size={32} className="text-emerald-400" />
                </div>
                <p className="text-slate-400 font-semibold mb-1">Preview will appear here</p>
                <p className="text-slate-600 text-sm">Select a referee and click Generate</p>
              </div>
            )}
            <canvas ref={canvasRef} className="w-full max-w-full rounded-xl p-4"
              style={{ display: generated ? "block" : "none" }} />
          </div>
        </div>
      </div>
    </section>
  );
}