import { memo } from "react";

// MatchInput — score + disciplinary inputs (neutral field, mobile-first)
// Cards appear directly under each team name
const MatchInput = memo(function MatchInput({ match, score, groupLetter, onScoreChange }) {
  const { team1, team2, date, time } = match;

  const val = (field) =>
    score?.[field] !== undefined && score?.[field] !== null ? score[field] : "";

  const handle = (field) => (e) => {
    const raw = e.target.value;
    const num = raw === "" ? "" : Math.max(0, parseInt(raw, 10) || 0);
    onScoreChange(groupLetter, match.idx, { ...(score || {}), [field]: num === "" ? "" : num });
  };

  const hasScore = val("g1") !== "" && val("g2") !== "";

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 p-3 sm:p-4 hover:border-white/10 ${hasScore
        ? "border-[#00FF87]/25 bg-gradient-to-r from-[#00FF87]/3 to-transparent"
        : "border-white/5 bg-[#111118]"
        }`}
    >
      {/* Date / Time */}
      <div className="text-white/30 text-xs font-medium mb-3 flex items-center gap-1.5">
        <span>{date}</span>
        <span className="text-white/15">·</span>
        <span className="text-[#00E5FF]/60">{time}</span>
      </div>

      {/* Main row: [team1 + cards] [score] [team2 + cards] */}
      <div className="flex items-start gap-2 sm:gap-3">

        {/* ── Team 1 (left) ── */}
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          {/* Name + flag */}
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-base sm:text-xl shrink-0">{team1.flag}</span>
            <span className="text-white text-xs sm:text-sm font-semibold truncate leading-tight">
              {team1.name}
            </span>
          </div>
          {/* Cards */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <DiscInput label="🟨" title="Galbene" value={val("y1")} onChange={handle("y1")} color="yellow" />
            <DiscInput label="🟨🟥" title="Roșu din 2 galbene" value={val("ry1")} onChange={handle("ry1")} color="orange" />
            <DiscInput label="🟥" title="Roșu direct" value={val("rd1")} onChange={handle("rd1")} color="red" />
          </div>
        </div>

        {/* ── Score inputs (center) ── */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0 pt-0.5">
          <input
            type="number" min="0" value={val("g1")} onChange={handle("g1")} placeholder="–"
            className="w-10 h-9 sm:w-12 sm:h-10 bg-[#1E1E2E] border border-white/10 rounded-xl text-white text-center text-base sm:text-lg font-black focus:outline-none focus:border-[#00FF87]/60 focus:ring-1 focus:ring-[#00FF87]/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-white/30 font-bold text-base sm:text-lg">:</span>
          <input
            type="number" min="0" value={val("g2")} onChange={handle("g2")} placeholder="–"
            className="w-10 h-9 sm:w-12 sm:h-10 bg-[#1E1E2E] border border-white/10 rounded-xl text-white text-center text-base sm:text-lg font-black focus:outline-none focus:border-[#00FF87]/60 focus:ring-1 focus:ring-[#00FF87]/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {/* ── Team 2 (right) ── */}
        <div className="flex-1 flex flex-col gap-1.5 items-end min-w-0">
          {/* Name + flag */}
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-white text-xs sm:text-sm font-semibold truncate text-right leading-tight">
              {team2.name}
            </span>
            <span className="text-base sm:text-xl shrink-0">{team2.flag}</span>
          </div>
          {/* Cards */}
          <div className="flex items-center gap-1 sm:gap-1.5 justify-end">
            <DiscInput label="🟨" title="Galbene" value={val("y2")} onChange={handle("y2")} color="yellow" />
            <DiscInput label="🟨🟥" title="Roșu din 2 galbene" value={val("ry2")} onChange={handle("ry2")} color="orange" />
            <DiscInput label="🟥" title="Roșu direct" value={val("rd2")} onChange={handle("rd2")} color="red" />
          </div>
        </div>

      </div>
    </div>
  );
});

function DiscInput({ label, title, value, onChange, color }) {
  const colors = {
    yellow: "border-yellow-500/30 focus:border-yellow-400/70 focus:ring-yellow-400/20",
    orange: "border-orange-500/30 focus:border-orange-400/70 focus:ring-orange-400/20",
    red: "border-red-500/30   focus:border-red-400/70   focus:ring-red-400/20",
  };
  return (
    <div className="flex flex-col items-center gap-0.5" title={title}>
      <span className="text-[10px] sm:text-xs leading-none select-none">{label}</span>
      <input
        type="number" min="0" max="11" value={value} onChange={onChange}
        className={`w-8 h-6 sm:w-9 sm:h-7 bg-[#1E1E2E] border rounded-lg text-white text-center text-xs font-bold focus:outline-none focus:ring-1 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${colors[color]}`}
      />
    </div>
  );
}

export default MatchInput;
