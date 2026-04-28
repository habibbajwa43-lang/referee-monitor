import { Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import HomePage from "./pages/HomePage";
import RankingsPage from "./pages/RankingsPage";
import RefereesPage from "./pages/RefereesPage";
import RefereeProfilePage from "./pages/RefereeProfilePage";
import MatchesPage from "./pages/MatchesPage";
import MatchInsightPage from "./pages/MatchInsightsPage";
import InsightsPage from "./pages/InsightsPage";
import MethodologyPage from "./pages/MethodologyPage";
import ComparisonPage from "./pages/ComparisonPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/rankings" element={<RankingsPage />} />
        <Route path="/referees" element={<RefereesPage />} />
        <Route path="/referees/:refId" element={<RefereeProfilePage />} />
        <Route path="/compare" element={<ComparisonPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/matches/:fixtureId" element={<MatchInsightPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/methodology" element={<MethodologyPage />} />
      </Route>
    </Routes>
  );
}