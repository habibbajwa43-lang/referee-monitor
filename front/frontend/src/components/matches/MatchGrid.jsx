import MatchCard from "./MatchCard";

export default function MatchGrid({ fixtures, loading }) {
  if (loading) {
    return (
      <div className="rounded-[24px] border border-white/6 bg-transparent p-10 text-center text-slate-500">
        Loading match insights...
      </div>
    );
  }

  if (!fixtures.length) {
    return (
      <div className="rounded-[24px] border border-white/6 bg-transparent p-10 text-center text-slate-500">
        No fixtures found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {fixtures.map((fixture) => (
        <MatchCard key={fixture.fixture_id} fixture={fixture} />
      ))}
    </div>
  );
}