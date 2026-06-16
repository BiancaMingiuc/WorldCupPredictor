import { useState } from "react";
import { BarChart3, X } from "lucide-react";
import { GROUPS } from "../data/teams";
import { GROUP_MATCHES } from "../data/schedule";
import { computeGroupStandings, matchKey } from "../utils/groupLogic";
import StandingsTable from "../components/StandingsTable";
import MatchInput from "../components/MatchInput";

const GROUP_LETTERS = Object.keys(GROUPS);

function GroupCard({ grp, standing, onOpenModal }) {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-white/8 bg-gradient-to-b from-[#111118] to-[#0A0A12] overflow-hidden">
      {/* Group header - Clickable */}
      <button 
        onClick={() => onOpenModal(grp)}
        className="w-full flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-white/5 hover:bg-white/5 transition-colors text-left"
      >
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
          <span className="text-[10px] text-[#00FF87]/60 font-semibold">VEZI MECIURI</span>
        </div>
      </button>

      {/* Standings table */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-3 sm:pt-4">
        <StandingsTable standings={standing} groupLetter={grp} />
      </div>
    </div>
  );
}

export default function GroupStandingsPage({ scoresMap, onScoreChange }) {
  const [selectedGroupModal, setSelectedGroupModal] = useState(null);

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
          <GroupCard 
            key={grp} 
            grp={grp} 
            standing={groupStandings[grp]} 
            onOpenModal={setSelectedGroupModal}
          />
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

      {/* Modal Meciuri */}
      {selectedGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedGroupModal(null)}>
          <div className="bg-[#111118] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
              <h3 className="text-lg font-black text-white">Meciuri Grupa {selectedGroupModal}</h3>
              <button onClick={() => setSelectedGroupModal(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 sm:p-5 overflow-y-auto max-h-[70vh] space-y-3">
              {GROUP_MATCHES[selectedGroupModal].map((m) => {
                const t1 = GROUPS[selectedGroupModal].find((t) => t.id === m.t1);
                const t2 = GROUPS[selectedGroupModal].find((t) => t.id === m.t2);
                const fullMatch = { ...m, team1: t1, team2: t2 };
                return (
                  <MatchInput
                    key={m.idx}
                    match={fullMatch}
                    score={scoresMap[matchKey(selectedGroupModal, m.idx)]}
                    groupLetter={selectedGroupModal}
                    onScoreChange={onScoreChange}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
