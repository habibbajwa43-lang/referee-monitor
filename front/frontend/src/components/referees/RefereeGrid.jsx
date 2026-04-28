import RefereeCard from "./RefereeCard";

export default function RefereeGrid({ referees, loading }) {
  if (loading) {
    return (
      <div className="rounded-[24px] border border-white/6 bg-transparent p-10 text-center text-slate-500">
        Loading referees...
      </div>
    );
  }

  if (!referees.length) {
    return (
      <div className="rounded-[24px] border border-white/6 bg-transparent p-10 text-center text-slate-500">
        No referees found.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {referees.map((referee) => (
        <RefereeCard key={referee.referee_id} referee={referee} />
      ))}
    </div>
  );
}