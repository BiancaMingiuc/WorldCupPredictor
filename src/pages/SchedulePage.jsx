import { useMemo } from "react";
import { CalendarDays, CheckCircle2, Clock } from "lucide-react";
import { GROUPS } from "../data/teams";
import { GROUP_MATCHES } from "../data/schedule";
import { matchKey } from "../utils/groupLogic";
import MatchInput from "../components/MatchInput";

// Build a flat list of all matches with group + team info, then sort by date+time
function buildFlatSchedule() {
  const dateOrder = {
    "11 iunie": 11,
    "12 iunie": 12,
    "13 iunie": 13,
    "14 iunie": 14,
    "15 iunie": 15,
    "16 iunie": 16,
    "17 iunie": 17,
    "18 iunie": 18,
    "19 iunie": 19,
    "20 iunie": 20,
    "21 iunie": 21,
    "22 iunie": 22,
    "23 iunie": 23,
    "24 iunie": 24,
    "25 iunie": 25,
    "26 iunie": 26,
    "27 iunie": 27,
    "28 iunie": 28,
  };

  const all = [];
  for (const [grp, matches] of Object.entries(GROUP_MATCHES)) {
    const teams = GROUPS[grp];
    for (const m of matches) {
      const t1 = teams.find((t) => t.id === m.t1);
      const t2 = teams.find((t) => t.id === m.t2);
      all.push({ ...m, group: grp, team1: t1, team2: t2 });
    }
  }

  all.sort((a, b) => {
    const dayA = dateOrder[a.date] ?? 99;
    const dayB = dateOrder[b.date] ?? 99;
    if (dayA !== dayB) return dayA - dayB;
    // Sort by time: "22:00" etc. — treat midnight-crossing times (00-09 h) as next-day
    const toMin = (t) => {
      const [h, m] = t.split(":").map(Number);
      // Times 00-09 are actually "next day" (late night) — put them after 20+
      return h < 10 ? h * 60 + m + 1440 : h * 60 + m;
    };
    return toMin(a.time) - toMin(b.time);
  });

  return all;
}

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
