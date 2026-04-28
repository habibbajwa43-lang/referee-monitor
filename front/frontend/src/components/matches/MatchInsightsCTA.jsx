import { useNavigate } from "react-router-dom";

export default function MatchInsightsCTA({ refereeId }) {
  const navigate = useNavigate();

  return (
    <div className="mt-6 rounded-[24px] p-8 text-center text-white"
      style={{ background: "linear-gradient(135deg, #062c22 0%, #0a4a36 50%, #083328 100%)", border: "1px solid rgba(16,185,129,0.2)" }}>
      <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4"
        style={{ background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" }}>
        Deep Dive
      </span>
      <h3 className="font-display text-3xl font-bold">
        Explore the Referee Behind This Match
      </h3>
      <p className="mx-auto mt-3 max-w-2xl text-white/70">
        Go deeper into referee tendencies, control patterns, cards, penalties,
        and decision trends that shape match outcomes.
      </p>
      <button
        onClick={() => refereeId ? navigate(`/referees/${refereeId}`) : navigate("/referees")}
        className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
        style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
        View Referee Profile
      </button>
    </div>
  );
}