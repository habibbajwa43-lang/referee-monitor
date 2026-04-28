import {
  Percent,
  AlertTriangle,
  Shield,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function getCardMeta(type) {
  if (type === "penalty") {
    return {
      icon: Percent,
      iconBg: "",
      iconColor: "text-rose-600",
      badgeClass: " text-rose-600",
    };
  }

  if (type === "chaos") {
    return {
      icon: AlertTriangle,
      iconBg: "",
      iconColor: "text-yellow-600",
      badgeClass: " text-yellow-700",
    };
  }

  if (type === "strictness") {
    return {
      icon: Shield,
      iconBg: "",
      iconColor: "text-emerald-700",
      badgeClass: " text-emerald-700",
    };
  }

  return {
    icon: Zap,
    iconBg: "",
    iconColor: "text-blue-600",
    badgeClass: " text-blue-600",
  };
}

export default function InsightsGrid({ insights, loading }) {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
      {insights.map((item) => {
        const meta = getCardMeta(item.type);
        const Icon = meta.icon;

        return (
          <button
            key={item.id}
            onClick={() => item.target && navigate(item.target)}
            className="cursor-pointer overflow-hidden rounded-[30px] border border-white/6 bg-transparent text-left  transition-all duration-300 hover:-translate-y-1 hover:"
          >
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              <div className="h-full min-h-[260px] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-7">
                <div className="mb-6 flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${meta.iconBg}`}
                  >
                    <Icon size={19} className={meta.iconColor} />
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${meta.badgeClass}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-4xl font-bold leading-tight text-white">
                  {loading ? "Loading..." : item.title}
                </h3>

                <p className="mt-5 text-base leading-8 text-slate-500">
                  {item.description}
                </p>

                <div className="mt-8 flex items-center gap-2 border-t border-white/4 pt-5 text-sm font-bold text-emerald-400">
                  {item.type === "penalty" ? "View Full Report" : item.type === "chaos" ? "See Match Breakdown" : item.type === "strictness" ? "Unlock Full Insight" : "View Full Report"}
                  <ArrowUpRight size={15} />
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}