import { BarChart3 } from "lucide-react";
import { GROUPS } from "../data/teams";
import { GROUP_MATCHES } from "../data/schedule";
import { computeGroupStandings } from "../utils/groupLogic";
import StandingsTable from "../components/StandingsTable";

const GROUP_LETTERS = Object.keys(GROUPS);

export default function GroupStandingsPage({ scoresMap }) {
  const groupStandings = {};
  for (const grp of GROUP_LETTERS) {
    groupStandings[grp] = computeGroupStandings(grp, GROUP_MATCHES[grp], scoresMap);
  }

  return (
    <div className="max-w-screen-xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-1.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#00FF87] to-[#7A00FF] flex items-center justify-center shrink-0">
            <BarChart3 size={14} className="text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Clasament Grupe
          </h1>
        </div>
        <p className="text-white/40 text-xs sm:text-sm ml-9 sm:ml-11">
          Clasamente live în funcție de predicțiile tale · 12 grupe · 48 de echipe
        </p>
      </div>

      {/* Standings grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
        {GROUP_LETTERS.map((grp) => (
          <div key={grp} className="rounded-2xl sm:rounded-3xl border border-white/8 bg-gradient-to-b from-[#111118] to-[#0A0A12] overflow-hidden">
            {/* Group header */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-white/5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#7A00FF] to-[#00E5FF] flex items-center justify-center shadow-lg shadow-[#7A00FF]/30 shrink-0">
                <span className="text-white font-black text-lg sm:text-xl">{grp}</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm sm:text-base">Grupa {grp}</div>
                <div className="text-white/40 text-[10px] sm:text-xs mt-0.5">
                  {GROUPS[grp].map((t) => t.flag).join(" ")}
                </div>
              </div>
              {/* Qualifier labels */}
              <div className="ml-auto flex flex-col items-end gap-0.5">
                <span className="text-[10px] text-[#00FF87]/60 font-semibold">TOP 2 → 16-imi</span>
                <span className="text-[10px] text-[#00E5FF]/50 font-semibold">LOC 3 → potențial</span>
              </div>
            </div>

            {/* Standings table */}
            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
              <StandingsTable standings={groupStandings[grp]} groupLetter={grp} />
            </div>
          </div>
        ))}
      </div>

      {/* Global legend */}
      <div className="mt-6 flex flex-wrap items-center gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#00FF87]/30" />
          <span className="text-white/30 text-xs">Calificați în 16-imi (locurile 1 & 2)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#00E5FF]/20" />
          <span className="text-white/30 text-xs">Potențial loc 3 (cele mai bune 8 din 12)</span>
        </div>
      </div>
    </div>
  );
}
