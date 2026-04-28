import { useState } from "react";
import { ArrowLeft, Shield, Tickets, Percent, GitBranch, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { refereeImages, fallbackRefereeImage } from "../../utils/refreeImages";
import StatGraphicGenerator from "./StatGraphicGenerator";

export default function ProfileHeroCard({ hero, loading }) {
  const navigate = useNavigate();
  const [showGraphic, setShowGraphic] = useState(false);

  const statCards = [
    {
      label: "Matches",
      value: hero?.matches ?? "--",
      icon: Shield,
      color: "text-emerald-400",
      bg: "rgba(16,185,129,0.1)",
    },
    {
      label: "Cards / Match",
      value: hero ? (hero.strictness / 20).toFixed(1) : "--",
      icon: Tickets,
      color: "text-yellow-400",
      bg: "rgba(234,179,8,0.1)",
    },
    {
      label: "Penalties / Match",
      value: hero ? (hero.penaltyProb / 100).toFixed(2) : "--",
      icon: Percent,
      color: "text-rose-400",
      bg: "rgba(244,63,94,0.1)",
    },
    {
      label: "VAR Interventions",
      value: hero ? Math.round(hero.varScore / 2.2) : "--",
      icon: GitBranch,
      color: "text-blue-400",
      bg: "rgba(96,165,250,0.1)",
    },
  ];

  return (
    <>
      <StatGraphicGenerator
        referee={hero}
        open={showGraphic}
        onClose={() => setShowGraphic(false)}
      />

      <button
        onClick={() => navigate("/referees")}
        className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-400"
      >
        <ArrowLeft size={16} />
        Back to Referees
      </button>

      <div
        className="rounded-[24px] p-6"
        style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          {/* Avatar + info */}
          <div className="flex gap-4 items-start">
            <div
              className="h-20 w-20 overflow-hidden rounded-full flex-shrink-0"
              style={{ border: "2px solid rgba(16,185,129,0.4)" }}
            >
              <img
                src={refereeImages[hero?.id] || fallbackRefereeImage}
                alt={hero?.name || "Referee"}
                className="h-full w-full object-cover"
                onError={(e) => { e.currentTarget.src = fallbackRefereeImage; }}
              />
            </div>
            <div>
              <h1 className="font-display text-5xl font-black text-white uppercase">
                {loading ? "Loading..." : hero?.name || "Referee Profile"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Detailed Analytics & Historical Trends
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full px-3 py-1 text-xs font-bold text-slate-300"
                  style={{ background: "rgba(255,255,255,0.06)" }}>
                  {hero?.style || "Standard"}
                </span>
                <span className="rounded-full px-3 py-1 text-xs font-bold text-slate-300"
                  style={{ background: "rgba(255,255,255,0.06)" }}>
                  {hero?.country || "Unknown"}
                </span>
                <span className="rounded-full px-3 py-1 text-xs font-bold text-emerald-400"
                  style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  RM Score: {hero ? hero.rmScore?.toFixed(1) : "--"}
                </span>
              </div>
            </div>
          </div>

          {/* Generate Graphic Button */}
          <button
            onClick={() => setShowGraphic(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-emerald-400 transition hover:bg-emerald-400/10 flex-shrink-0"
            style={{ border: "1px solid rgba(16,185,129,0.3)" }}
          >
            <Image size={15} />
            Generate Stat Graphic
          </button>
        </div>

        {/* Stat cards */}
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-[16px] p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: item.bg }}>
                    <Icon size={14} className={item.color} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {item.label}
                  </span>
                </div>
                <p className="font-display text-3xl font-black text-white">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
