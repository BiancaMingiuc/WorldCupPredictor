import { useMemo } from "react";
import { CalendarDays, CheckCircle2, Clock } from "lucide-react";
import { GROUPS } from "../data/teams";
import { GROUP_MATCHES, buildFlatSchedule } from "../data/schedule";
import { matchKey } from "../utils/groupLogic";
import MatchInput from "../components/MatchInput";

const FLAT_SCHEDULE = buildFlatSchedule();

export default function SchedulePage({ scoresMap, onScoreChange }) {
  // Group matches by date for section headers
  const byDate = useMemo(() => {
    const map = new Map();
    for (const m of FLAT_SCHEDULE) {
      if (!map.has(m.date)) map.set(m.date, []);
      map.get(m.date).push(m);
    }
    return map;
  }, []);

  const totalPlayed = useMemo(
    () =>
      FLAT_SCHEDULE.filter((m) => {
        const sc = scoresMap[matchKey(m.group, m.idx)];
        return sc && sc.g1 !== "" && sc.g2 !== "";
      }).length,
    [scoresMap]
  );

  return (
    <div className="max-w-screen-lg mx-auto px-3 sm:px-4 py-5 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-1.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#7A00FF] to-[#00E5FF] flex items-center justify-center shrink-0">
            <CalendarDays size={14} className="text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Program Meciuri
          </h1>
        </div>
        <p className="text-white/40 text-xs sm:text-sm ml-9 sm:ml-11">
          {totalPlayed}/72 meciuri completate · toate meciurile în ordine cronologică
        </p>
        <div className="mt-3 sm:mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7A00FF] via-[#00FF87] to-[#00E5FF] rounded-full transition-all duration-700"
            style={{ width: `${(totalPlayed / 72) * 100}%` }}
          />
        </div>
      </div>

      {/* Matches grouped by date */}
      <div className="space-y-8 sm:space-y-10">
        {[...byDate.entries()].map(([date, matches]) => {
          const playedOnDay = matches.filter((m) => {
            const sc = scoresMap[matchKey(m.group, m.idx)];
            return sc && sc.g1 !== "" && sc.g2 !== "";
          }).length;

          return (
            <section key={date}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-[#00E5FF]/70" />
                  <h2 className="text-sm sm:text-base font-bold text-white capitalize">
                    {date}
                  </h2>
                </div>
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-xs text-white/30 font-medium shrink-0">
                  {playedOnDay}/{matches.length} completate
                </span>
                {playedOnDay === matches.length && matches.length > 0 && (
                  <CheckCircle2 size={13} className="text-[#00FF87] shrink-0" />
                )}
              </div>

              {/* Match cards */}
              <div className="space-y-2 sm:space-y-3">
                {matches.map((m) => (
                  <div key={`${m.group}_${m.idx}`} className="flex items-start gap-2 sm:gap-3">
                    {/* Group badge */}
                    <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 mt-0.5 rounded-xl bg-gradient-to-br from-[#7A00FF]/70 to-[#00E5FF]/70 flex items-center justify-center border border-white/10">
                      <span className="text-white font-black text-xs">{m.group}</span>
                    </div>
                    {/* Match input */}
                    <div className="flex-1 min-w-0">
                      <MatchInput
                        match={m}
                        score={scoresMap[matchKey(m.group, m.idx)]}
                        groupLetter={m.group}
                        onScoreChange={onScoreChange}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
