import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "Platform",
    links: [
      { label: "Analytics", path: "/rankings", clickable: true },
      { label: "Referees", path: "/referees", clickable: true },
      { label: "Matches", path: "/matches", clickable: true },
      { label: "Insights", path: "/insights", clickable: true },
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
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "var(--surface)" }}>
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="inline-block mb-4">
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

        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-xs text-slate-600">
            © 2025 Ref Monitor · Premier League referee analytics platform
          </p>
          <p className="text-xs text-slate-600">
            Powered by 5+ seasons of match event data
          </p>
        </div>
      </div>
    </footer>
  );
}
