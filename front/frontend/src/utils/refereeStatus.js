/**
 * Referee status labels.
 * Returns one of: "Active" | "Retired" | "VAR Official" | "Former EPL Ref"
 */
const RETIRED_REFS = new Set([
  "mike dean",
  "mark clattenburg",
  "howard webb",
  "graham poll",
  "peter walton",
  "alan wiley",
  "steve bennett",
  "rob styles",
  "uriah rennie",
]);

const VAR_OFFICIALS = new Set([
  "chris kavanagh",
]);

export function getRefereeStatus(fullName = "") {
  const lower = (fullName || "").toLowerCase().trim();
  if (RETIRED_REFS.has(lower)) return "Retired";
  if (VAR_OFFICIALS.has(lower)) return "VAR Official";
  return "Active";
}

export function getStatusStyle(status) {
  switch (status) {
    case "Retired":
      return { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" };
    case "VAR Official":
      return { color: "#818cf8", bg: "rgba(129,140,248,0.1)", border: "rgba(129,140,248,0.2)" };
    case "Active":
    default:
      return { color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" };
  }
}
