import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AppInitializer from "./AppInitializer";

export default function AppShell() {
  return (
    <div className="min-h-screen text-slate-100" style={{ background: "var(--bg)" }}>
      <AppInitializer />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
