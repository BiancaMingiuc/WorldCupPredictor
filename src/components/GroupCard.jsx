import { useState, memo } from "react";
import MatchInput from "./MatchInput";
import StandingsTable from "./StandingsTable";
import { ChevronDown, ChevronUp } from "lucide-react";

const GroupCard = memo(function GroupCard({ groupLetter, teams, matches, scoresMap, standings, onScoreChange }) {
  const [expanded, setExpanded] = useState(true);

  const matchesWithTeams = matches.map((m) => ({
    ...m,
    team1: teams.find((t) => t.id === m.t1),
    team2: teams.find((t) => t.id === m.t2),
  }));

  const playedCount = matches.filter((m) => {
    const sc = scoresMap[`${groupLetter}_${m.idx}`];
    return sc && sc.g1 !== "" && sc.g2 !== "";
  }).length;

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-white/8 bg-gradient-to-b from-[#111118] to-[#0A0A12] overflow-hidden">
      {/* Group header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 hover:bg-white/2 transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Group badge */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#7A00FF] to-[#00E5FF] flex items-center justify-center shadow-lg shadow-[#7A00FF]/30 shrink-0">
            <span className="text-white font-black text-lg sm:text-xl">{groupLetter}</span>
          </div>
          <div className="text-left">
            <div className="text-white font-bold text-sm sm:text-base">Grupa {groupLetter}</div>
            <div className="text-white/40 text-[10px] sm:text-xs mt-0.5">
              {teams.map((t) => t.flag).join(" ")} · {playedCount}/6
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Progress bar — hidden on mobile to save space */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-20 sm:w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00FF87] to-[#00E5FF] rounded-full transition-all duration-500"
                style={{ width: `${(playedCount / 6) * 100}%` }}
              />
            </div>
            <span className="text-white/30 text-xs">{Math.round((playedCount / 6) * 100)}%</span>
          </div>
          {/* Mobile progress dots */}
          <div className="flex sm:hidden gap-0.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < playedCount ? "bg-[#00FF87]" : "bg-white/10"}`} />
            ))}
          </div>
          {expanded ? <ChevronUp size={15} className="text-white/30" /> : <ChevronDown size={15} className="text-white/30" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-3 sm:px-5 pb-3 sm:pb-5 border-t border-white/5">
          {/* Team pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 py-3 sm:py-4">
            {teams.map((t) => (
              <div key={t.id} className="flex items-center gap-1 sm:gap-1.5 bg-white/5 rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 border border-white/5">
                <span className="text-sm sm:text-base">{t.flag}</span>
                <span className="text-white/70 text-[10px] sm:text-xs font-medium">{t.name}</span>
                <span className="text-white/20 text-[10px] sm:text-xs">#{t.fifaRank}</span>
              </div>
            ))}
          </div>

          {/* Matches */}
          <div className="space-y-2 sm:space-y-3">
            {matchesWithTeams.map((m) => (
              <MatchInput
                key={m.idx}
                match={m}
                score={scoresMap[`${groupLetter}_${m.idx}`]}
                groupLetter={groupLetter}
                onScoreChange={onScoreChange}
              />
            ))}
          </div>

          {/* Standings */}
          <StandingsTable standings={standings} groupLetter={groupLetter} />
        </div>
      )}
    </div>
  );
}, (prev, next) => {
  if (prev.groupLetter !== next.groupLetter) return false;
  // Only re-render if a score in THIS specific group changed.
  // We ignore new 'standings' array references if the group's scores didn't change.
  for (let i = 0; i < 6; i++) {
    const key = `${prev.groupLetter}_${i}`;
    if (prev.scoresMap[key] !== next.scoresMap[key]) return false;
  }
  return true;
});

export default GroupCard;
