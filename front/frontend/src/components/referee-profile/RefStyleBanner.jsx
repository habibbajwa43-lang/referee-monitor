import { AlertTriangle } from "lucide-react";

export default function RefStyleBanner({ text, loading }) {
  return (
    <div className="mt-5 rounded-[20px] p-5" style={{ background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.15)" }}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0" style={{ background: "rgba(234,179,8,0.12)" }}>
          <AlertTriangle size={18} className="text-yellow-400" />
        </div>
        <div>
          <h3 className="font-display text-2xl font-black text-white uppercase mb-2">Refereeing Style</h3>
          <p className="text-sm leading-7 text-slate-400">
            {loading ? "Loading style analysis..." : text}
          </p>
        </div>
      </div>
    </div>
  );
}
