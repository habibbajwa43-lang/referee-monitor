import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Activity } from "lucide-react";

const navItems = [
  { label: "Matches", path: "/matches" },
  { label: "Referees", path: "/referees" },
  { label: "Rankings", path: "/rankings" },
  { label: "Compare", path: "/compare" },
  { label: "Insights", path: "/insights" },
  { label: "Methodology", path: "/methodology" },
];
export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl"
      style={{
        background: "rgba(7, 9, 15, 0.9)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
          <img
            src="/images/Logo.png"
            alt="Ref Monitor"
            className="h-14 w-auto object-contain"
            style={{ filter: "brightness(1.1)" }}
          />
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "text-emerald-400 bg-emerald-400/10"
                    : "text-slate-400 hover:text-slate-100 hover:bg-transparent/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Live badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <span className="h-2 w-2 rounded-full bg-emerald-400 pulse-live" />
          <span className="text-xs font-semibold text-emerald-400 tracking-wider">LIVE DATA</span>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-slate-400 md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="px-6 py-4 md:hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(7,9,15,0.98)" }}>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl text-sm font-semibold mb-1 transition-all ${
                  isActive
                    ? "text-emerald-400 bg-emerald-400/10"
                    : "text-slate-400 hover:text-white hover:bg-transparent/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
