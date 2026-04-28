import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function MatchInsightsCTA({ refereeId }) {
  const navigate = useNavigate();
  return (
    <div className="mt-6 rounded-[20px] p-6 flex items-center justify-between"
      style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.03))", border: "1px solid rgba(16,185,129,0.2)" }}>
      <div>
        <h3 className="font-display text-2xl font-black text-white uppercase">View Match Insights</h3>
        <p className="text-sm text-slate-400 mt-1">See how this referee performed in recent fixtures</p>
      </div>
      <button
        onClick={() => navigate("/matches")}
        className="btn-accent flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wider flex-shrink-0"
      >
        Matches <ArrowRight size={14} />
      </button>
    </div>
  );
}
