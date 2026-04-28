import { useNavigate } from "react-router-dom";

export default function MethodologyCTA() {
  const navigate = useNavigate();

  return (
    <div className="rounded-[28px] p-8 text-center text-white"
      style={{ background: "linear-gradient(135deg, #062c22 0%, #0a4a36 50%, #083328 100%)", border: "1px solid rgba(16,185,129,0.2)" }}>
      <h2 className="font-display text-4xl font-bold">
        See the Method in Action
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-white/70">
        Explore rankings, referee profiles, and fixture insights generated from
        the same scoring framework described above.
      </p>

      <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button
          onClick={() => navigate("/rankings")}
          className="rounded-2xl px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
          style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
          View Rankings
        </button>
        <button
          onClick={() => navigate("/matches")}
          className="rounded-2xl border border-white/20 bg-transparent px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5">
          Explore Match Insights
        </button>
      </div>
    </div>
  );
}