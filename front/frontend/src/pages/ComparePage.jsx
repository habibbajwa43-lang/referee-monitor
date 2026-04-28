import React, { useState, useRef, useEffect, useMemo } from 'react'
import { referees } from '../data/appData.js'

const STYLE_ICONS = {
  'VAR Heavy': '📺', 'Strict': '🟥', 'Lenient': '🟩', 'Balanced': '⚖️', 'Standard': '🎯',
}

const PL_FLAGS = { England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }

function RadarChart({ ref1, ref2 }) {
  const canvasRef = useRef(null)

  const metrics = [
    { key: 'rmScore',      label: 'RM Score',    max: 85 },
    { key: 'chaos',        label: 'Chaos',       max: 100 },
    { key: 'penaltyProb',  label: 'Penalty',     max: 70 },
    { key: 'varInteraction',label: 'VAR Int.',   max: 100 },
    { key: 'strictness',   label: 'Strictness',  max: 100 },
    { key: 'volatility',   label: 'Volatility',  max: 100 },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !ref1 || !ref2) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const cx = W / 2, cy = H / 2
    const R = Math.min(W, H) / 2 - 50
    const n = metrics.length

    ctx.clearRect(0, 0, W, H)

    const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2
    const pt = (i, r) => ({
      x: cx + r * Math.cos(angle(i)),
      y: cy + r * Math.sin(angle(i)),
    })

    // Web grid
    for (let level = 1; level <= 5; level++) {
      ctx.beginPath()
      ctx.strokeStyle = '#1e2235'
      ctx.lineWidth = 1
      for (let i = 0; i < n; i++) {
        const p = pt(i, (R * level) / 5)
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
      }
      ctx.closePath(); ctx.stroke()
    }

    // Spokes
    for (let i = 0; i < n; i++) {
      const p = pt(i, R)
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y)
      ctx.strokeStyle = '#1e2235'; ctx.lineWidth = 1; ctx.stroke()

      // Labels
      const lp = pt(i, R + 22)
      ctx.fillStyle = '#8892aa'; ctx.font = 'bold 11px Inter, sans-serif'; ctx.textAlign = 'center'
      ctx.fillText(metrics[i].label, lp.x, lp.y + 4)
    }

    // Draw polygon for a referee
    const drawRef = (ref, color, alpha) => {
      ctx.beginPath()
      metrics.forEach((m, i) => {
        const val = Math.min(ref[m.key], m.max)
        const r = (val / m.max) * R
        const p = pt(i, r)
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
      })
      ctx.closePath()
      ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0')
      ctx.fill()
      ctx.strokeStyle = color
      ctx.lineWidth = 2.5
      ctx.stroke()

      // Dots
      metrics.forEach((m, i) => {
        const val = Math.min(ref[m.key], m.max)
        const r = (val / m.max) * R
        const p = pt(i, r)
        ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = color; ctx.fill()
        ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1; ctx.stroke()
      })
    }

    drawRef(ref1, '#3b82f6', 0.18)
    drawRef(ref2, '#ef5350', 0.15)
  }, [ref1, ref2])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <canvas ref={canvasRef} width={460} height={400} style={{ width: '100%', maxWidth: 460, height: 'auto' }} />
      <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#3b82f6' }} />
          <span style={{ fontSize: 13, color: '#8892aa' }}>{ref1?.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef5350' }} />
          <span style={{ fontSize: 13, color: '#8892aa' }}>{ref2?.name}</span>
        </div>
      </div>
    </div>
  )
}

function StatBar({ label, val1, val2, ref1Name, ref2Name, format = v => v.toFixed(1), higherIsBetter = true }) {
  const max = Math.max(val1, val2, 1)
  const winner1 = higherIsBetter ? val1 >= val2 : val1 <= val2
  const [w1, setW1] = useState(0)
  const [w2, setW2] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => {
      setW1((val1 / max) * 100)
      setW2((val2 / max) * 100)
    }, 120)
    return () => clearTimeout(t)
  }, [val1, val2, max])

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: winner1 ? '#60a5fa' : '#8892aa' }}>
          {winner1 ? '⭐ ' : ''}{format(val1)}
        </span>
        <span style={{ fontSize: 12, color: '#555e78' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: !winner1 ? '#ef5350' : '#8892aa' }}>
          {format(val2)}{!winner1 ? ' ⭐' : ''}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 4, height: 6, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', background: '#1e2235', borderRadius: '4px 0 0 4px', overflow: 'hidden' }}>
          <div style={{ width: `${w1}%`, background: winner1 ? '#3b82f6' : '#3b82f630', transition: 'width 0.8s', borderRadius: '4px 0 0 4px' }} />
        </div>
        <div style={{ flex: 1, background: '#1e2235', borderRadius: '0 4px 4px 0', overflow: 'hidden' }}>
          <div style={{ width: `${w2}%`, background: !winner1 ? '#ef5350' : '#ef535030', transition: 'width 0.8s', borderRadius: '0 4px 4px 0' }} />
        </div>
      </div>
    </div>
  )
}

function ComparisonSummary({ ref1, ref2 }) {
  if (!ref1 || !ref2) return null

  const stricterDiff = ((ref1.strictness - ref2.strictness) / ref2.strictness * 100).toFixed(0)
  const chaosDiff = ((ref1.chaos - ref2.chaos) / ref2.chaos * 100).toFixed(0)
  const varDiff = ((ref1.varInteraction - ref2.varInteraction) / ref2.varInteraction * 100).toFixed(0)
  const scoreDiff = (ref1.rmScore - ref2.rmScore).toFixed(1)

  const winner = ref1.rmScore >= ref2.rmScore ? ref1 : ref2
  const loser = ref1.rmScore >= ref2.rmScore ? ref2 : ref1

  return (
    <div className="rm-card" style={{ padding: 24, border: '1px solid rgba(59,130,246,0.25)' }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#60a5fa' }}>🤖 AI Comparison Summary</h3>
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
        <span style={{ color: '#60a5fa' }}>{ref1.name}</span> vs <span style={{ color: '#ef5350' }}>{ref2.name}</span>
      </div>

      {[
        { text: `${Math.abs(stricterDiff)}% ${parseFloat(stricterDiff) > 0 ? 'stricter' : 'more lenient'} (strictness index)`, positive: parseFloat(stricterDiff) > 0, icon: '📏' },
        { text: `${Math.abs(chaosDiff)}% ${parseFloat(chaosDiff) > 0 ? 'more chaotic' : 'calmer'} in decision-making`, positive: parseFloat(chaosDiff) < 0, icon: '🔥' },
        { text: `${Math.abs(varDiff)}% ${parseFloat(varDiff) > 0 ? 'more VAR-heavy' : 'less VAR-involved'}`, positive: false, icon: '📺' },
        { text: `${Math.abs(parseFloat(scoreDiff))} pts ${parseFloat(scoreDiff) > 0 ? 'higher' : 'lower'} RM Score overall`, positive: parseFloat(scoreDiff) > 0, icon: '📊' },
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 3 ? '1px solid #1e2235' : 'none' }}>
          <span style={{ fontSize: 16 }}>{item.icon}</span>
          <span style={{ fontSize: 13, color: '#c8d0e4' }}>{ref1.name} is <strong style={{ color: item.positive ? '#34d399' : '#ef5350' }}>{item.text}</strong></span>
        </div>
      ))}

      <div style={{ marginTop: 16, padding: '12px', background: 'rgba(59,130,246,0.08)', borderRadius: 8 }}>
        <span style={{ fontWeight: 600, color: '#60a5fa', fontSize: 14 }}>
          🏆 Higher RM Score: {winner.name} ({winner.rmScore} vs {loser.rmScore})
        </span>
      </div>
    </div>
  )
}

function RefereeCard({ ref, color, label }) {
  if (!ref) return (
    <div className="rm-card" style={{ padding: 24, textAlign: 'center', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#555e78' }}>Select a referee</span>
    </div>
  )

  return (
    <div className="rm-card" style={{ padding: 24, border: `1px solid ${color}33` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: `linear-gradient(135deg, ${color}22, ${color}55)`,
          border: `2px solid ${color}66`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
        }}>
          {PL_FLAGS[ref.nationality] || '🏴󠁧󠁢󠁥󠁮󠁧󠁿'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{ref.name}</div>
          <div style={{ fontSize: 12, color: '#8892aa' }}>{ref.nationality}</div>
        </div>
        <span className="badge" style={{ background: `${color}15`, color, border: `1px solid ${color}40`, fontSize: 10 }}>
          {label}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        <div style={{ textAlign: 'center', flex: 1, padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color }}>{ref.rmScore}</div>
          <div style={{ fontSize: 10, color: '#555e78' }}>RM SCORE</div>
        </div>
        <div style={{ textAlign: 'center', flex: 1, padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{ref.chaos.toFixed(0)}%</div>
          <div style={{ fontSize: 10, color: '#555e78' }}>CHAOS</div>
        </div>
        <div style={{ textAlign: 'center', flex: 1, padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{ref.matches}</div>
          <div style={{ fontSize: 10, color: '#555e78' }}>MATCHES</div>
        </div>
      </div>
      <span className="badge badge-purple">{STYLE_ICONS[ref.style]} {ref.style}</span>
    </div>
  )
}

export default function ComparePage() {
  const [sel1, setSel1] = useState(2) // Anthony Taylor
  const [sel2, setSel2] = useState(1) // Michael Oliver

  const ref1 = referees.find(r => r.id === sel1)
  const ref2 = referees.find(r => r.id === sel2)

  const statBars = [
    { label: 'RM Score',     key: 'rmScore',      fmt: v => v.toFixed(1),  higher: true },
    { label: 'Chaos %',      key: 'chaos',         fmt: v => v.toFixed(1)+'%', higher: false },
    { label: 'Penalty Prob', key: 'penaltyProb',   fmt: v => v.toFixed(1)+'%', higher: false },
    { label: 'VAR Inter.',   key: 'varInteraction',fmt: v => v.toFixed(0)+'%', higher: false },
    { label: 'Strictness',   key: 'strictness',    fmt: v => v.toFixed(0),  higher: true },
    { label: 'Volatility',   key: 'volatility',    fmt: v => v.toFixed(0)+'%', higher: false },
    { label: 'Cards/Match',  key: 'cards',         fmt: v => v.toFixed(2),  higher: false },
    { label: 'Penalties/M',  key: 'penalties',     fmt: v => v.toFixed(2),  higher: false },
  ]

  return (
    <div className="page-container" style={{ paddingBottom: 60 }}>
      <div className="page-header">
        <h1>Head-to-Head Comparison</h1>
        <p>Compare any two Premier League referees across all key performance metrics.</p>
      </div>

      {/* Selectors */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {[
          { sel: sel1, setSel: setSel1, color: '#3b82f6', label: 'Referee 1' },
          { sel: sel2, setSel: setSel2, color: '#ef5350', label: 'Referee 2' },
        ].map(({ sel, setSel, color, label }) => (
          <div key={label}>
            <div style={{ marginBottom: 10 }}>
              <select
                value={sel}
                onChange={e => setSel(parseInt(e.target.value))}
                style={{
                  width: '100%', padding: '10px 14px',
                  background: '#13161f', border: `1px solid ${color}44`,
                  borderRadius: 8, color: '#f0f2f8', fontSize: 14, outline: 'none',
                }}
              >
                {referees.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <RefereeCard ref={referees.find(r => r.id === sel)} color={color} label={label} />
          </div>
        ))}
      </div>

      {/* Radar + Summary layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24, alignItems: 'start' }}>
        <div className="rm-card" style={{ padding: 24 }}>
          <h3 className="section-title">📡 Performance Radar</h3>
          <RadarChart ref1={ref1} ref2={ref2} />
        </div>
        <ComparisonSummary ref1={ref1} ref2={ref2} />
      </div>

      {/* Stat Bars */}
      <div className="rm-card" style={{ padding: 28, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 className="section-title" style={{ margin: 0 }}>📊 Metric Comparison</h3>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: '#3b82f6' }} />
              <span style={{ fontSize: 12, color: '#8892aa' }}>{ref1?.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: '#ef5350' }} />
              <span style={{ fontSize: 12, color: '#8892aa' }}>{ref2?.name}</span>
            </div>
          </div>
        </div>
        {ref1 && ref2 && statBars.map(s => (
          <StatBar
            key={s.key}
            label={s.label}
            val1={ref1[s.key]}
            val2={ref2[s.key]}
            ref1Name={ref1.name}
            ref2Name={ref2.name}
            format={s.fmt}
            higherIsBetter={s.higher}
          />
        ))}
      </div>

      {/* Top Referee Cards */}
      <h2 className="section-title">🏅 Top Referees Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 40 }}>
        {[...referees].sort((a, b) => b.rmScore - a.rmScore).slice(0, 6).map((ref, i) => (
          <div
            key={ref.id}
            className="rm-card"
            style={{ padding: 20, cursor: 'pointer', textAlign: 'center' }}
            onClick={() => { setSel1(ref.id) }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>
              {PL_FLAGS[ref.nationality] || '🏴󠁧󠁢󠁥󠁮󠁧󠁿'}
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{ref.name}</div>
            <div style={{ fontSize: 11, color: '#555e78', marginBottom: 10 }}>{ref.nationality}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#60a5fa', marginBottom: 4 }}>{ref.rmScore}</div>
            <div style={{ fontSize: 10, color: '#555e78', marginBottom: 10 }}>RM SCORE</div>
            <span className="badge badge-purple" style={{ fontSize: 10 }}>{STYLE_ICONS[ref.style]} {ref.style}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="cta-block">
        <h2>📈 See Match Breakdown</h2>
        <p>Explore fixture-level analysis for both referees including historical trend patterns.</p>
        <button className="btn-primary">See Match Breakdown</button>
      </div>
    </div>
  )
}
