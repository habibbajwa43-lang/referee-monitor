import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const footerSections = [
  {
    title: "Platform",
    links: [
      { label: "Analytics", path: "/rankings", clickable: true },
      { label: "Referees", path: "/referees", clickable: true },
      { label: "Matches", path: "/matches", clickable: true },
      { label: "Insights", path: "/insights", clickable: true },
      { label: "Compare", path: "/compare", clickable: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Methodology", path: "/methodology", clickable: true },
      { label: "API Access", path: "#", clickable: false },
      { label: "Reports", path: "#", clickable: false },
      { label: "Discussion", path: "#", clickable: false },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", path: "#", clickable: false },
      { label: "Contact", path: "#", clickable: false },
      { label: "Privacy Policy", path: "#", clickable: false },
      { label: "Terms", path: "#", clickable: false },
    ],
  },
];

export default function Footer() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "var(--surface)" }}>
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <Link to="/" onClick={scrollToTop} className="inline-block mb-4">
                <img src="/images/Logo.png" alt="Ref Monitor" className="h-12 w-auto object-contain" />
              </Link>
              <p className="max-w-[220px] text-sm leading-6 text-slate-500">
                Data-driven referee analytics and fixture impact signals for football.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 pulse-live" />
                <span className="text-xs font-semibold text-emerald-400">Live Data Active</span>
              </div>
            </div>

            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.clickable ? (
                        <Link
                          to={link.path}
                          onClick={scrollToTop}
                          className="text-sm text-slate-400 hover:text-emerald-400 transition"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <span className="text-sm text-slate-600 cursor-not-allowed">{link.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-xs text-slate-600">
              © 2025 Ref Monitor · Premier League referee analytics platform
            </p>
            <p className="text-xs text-slate-600">
              Powered by 5+ seasons of match event data
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll-to-top button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 50,
          width: "2.75rem",
          height: "2.75rem",
          borderRadius: "50%",
          background: "var(--emerald-500, #10b981)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 14px rgba(16,185,129,0.4)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </>
  );
}