import { useState, useMemo } from "react";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { buildFlatSchedule } from "../data/schedule";
import { matchKey } from "../utils/groupLogic";
import MatchInput from "../components/MatchInput";

const FLAT_SCHEDULE = buildFlatSchedule();

// Extragem toate zilele unice în ordine cronologică
const ALL_DATES = [...new Set(FLAT_SCHEDULE.map(m => m.date))];

export default function CalendarPage({ scoresMap, onScoreChange }) {
  // Implicit selectăm prima zi
  const [selectedDate, setSelectedDate] = useState(ALL_DATES[0]);

  const matchesForDate = useMemo(() => {
    return FLAT_SCHEDULE.filter(m => m.date === selectedDate);
  }, [selectedDate]);

  const playedOnDay = useMemo(() => {
    return matchesForDate.filter((m) => {
      const sc = scoresMap[matchKey(m.group, m.idx)];
      return sc && sc.g1 !== "" && sc.g2 !== "";
    }).length;
  }, [matchesForDate, scoresMap]);

  return (
    <div className="max-w-screen-lg mx-auto px-3 sm:px-4 py-5 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-1.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#7A00FF] flex items-center justify-center shrink-0">
            <CalendarDays size={14} className="text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Calendar
          </h1>
        </div>
        <p className="text-white/40 text-xs sm:text-sm ml-9 sm:ml-11">
          Alege o zi pentru a vedea meciurile programate
        </p>
      </div>

      {/* Date Selector (Horizontal Scroll) */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-6 scrollbar-hide snap-x" style={{ WebkitOverflowScrolling: 'touch' }}>
        {ALL_DATES.map(date => {
          const isActive = date === selectedDate;
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`snap-start shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 border ${
                isActive 
                  ? "bg-gradient-to-r from-[#7A00FF]/80 to-[#00E5FF]/80 border-transparent text-white shadow-lg shadow-[#7A00FF]/25" 
                  : "bg-[#111118] border-white/10 text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              {date}
            </button>
          );
        })}
      </div>

      {/* Matches for selected date */}
      <section className="bg-[#111118]/50 border border-white/5 rounded-3xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-black text-white capitalize">
            {selectedDate}
          </h2>
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-xs text-white/30 font-medium shrink-0">
            {playedOnDay}/{matchesForDate.length} completate
          </span>
          {playedOnDay === matchesForDate.length && matchesForDate.length > 0 && (
            <CheckCircle2 size={15} className="text-[#00FF87] shrink-0" />
          )}
        </div>

        <div className="space-y-3">
          {matchesForDate.length > 0 ? (
            matchesForDate.map((m) => (
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
            ))
          ) : (
            <div className="text-center text-white/30 text-sm py-10">
              Nu există meciuri în această zi.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
