import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) { setMsg("Please enter your email first."); return; }
    setMsg("✓ Newsletter signup coming soon — we'll notify you at launch!");
    setEmail("");
  };

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(16,185,129,0.06), transparent)" }} />
      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">Weekly Signals</p>
        <h2 className="font-display text-5xl md:text-6xl font-black text-white uppercase mb-4">
          Get Referee Insights
        </h2>
        <p className="text-slate-400 mb-10 leading-relaxed">
          Data-driven referee reports every week — cards, penalties, chaos predictions, stat graphics.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 h-13 rounded-xl px-4 text-sm text-white outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
          <button type="submit" className="btn-accent h-13 px-6 text-sm font-bold uppercase tracking-wider">
            Subscribe
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-600">
          {msg || "No spam. Unsubscribe anytime."}
        </p>
      </div>
    </section>
  );
}
