import ThirdPlaceTable from "../components/ThirdPlaceTable";
import { computeThirdPlaceRanking } from "../utils/thirdPlaceLogic";
import { computeGroupStandings } from "../utils/groupLogic";
import { GROUPS } from "../data/teams";
import { GROUP_MATCHES } from "../data/schedule";
import { Award, Info } from "lucide-react";

const GROUP_LETTERS = Object.keys(GROUPS);

export default function ThirdPlacePage({ scoresMap }) {
  const groupStandings = {};
  for (const grp of GROUP_LETTERS) {
    groupStandings[grp] = computeGroupStandings(grp, GROUP_MATCHES[grp], scoresMap);
  }

  const thirds = computeThirdPlaceRanking(groupStandings);
  const qualifiedCount = Math.min(8, thirds.filter((t) => t.gp > 0).length);

  return (
    <div className="max-w-screen-xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
      {/* Page header */}
      <div className="mb-5 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-1.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#FF004D] to-[#7A00FF] flex items-center justify-center shrink-0">
            <Award size={14} className="text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Clasament Locuri 3</h1>
        </div>
        <p className="text-white/40 text-xs sm:text-sm ml-9 sm:ml-11">
          Primele 8 echipe de pe locul 3 se califică · {qualifiedCount}/12 grupe
        </p>
      </div>

      {/* Info banner */}
      <div className="mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-[#7A00FF]/10 border border-[#7A00FF]/20">
        <Info size={14} className="text-[#7A00FF] mt-0.5 shrink-0" />
        <div className="text-white/60 text-xs sm:text-sm">
          <span className="text-white/80 font-semibold">Sortare: </span>
          Puncte → Golaveraj → Goluri marcate → Disciplinar → FIFA
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        {[
          { label: "Grupe finalizate", value: qualifiedCount, color: "text-[#00FF87]" },
          { label: "Cu meciuri", value: thirds.filter(t => t.gp > 0).length, color: "text-[#00E5FF]" },
          { label: "Se califică", value: 8, color: "text-[#FF004D]" },
          { label: "Eliminate", value: 4, color: "text-white/40" },
        ].map((s) => (
          <div key={s.label} className="bg-[#111118] border border-white/8 rounded-2xl p-3 sm:p-4 text-center">
            <div className={`text-xl sm:text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-white/30 text-[10px] sm:text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {thirds.length === 0 ? (
        <div className="text-center py-16 sm:py-20">
          <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">⚽</div>
          <div className="text-white/40 text-base sm:text-lg font-semibold">Niciun meci completat</div>
          <div className="text-white/20 text-xs sm:text-sm mt-2">
            Introdu scoruri în Faza Grupelor pentru a vedea clasamentul
          </div>
        </div>
      ) : (
        <ThirdPlaceTable thirds={thirds} />
      )}

      {/* Legend */}
      <div className="mt-3 sm:mt-4 flex flex-wrap gap-3 sm:gap-4 px-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#00FF87]/25" />
          <span className="text-white/30 text-xs">Calificat (top 8)</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#FF004D]/20" />
          <span className="text-white/30 text-xs">Pe limită (locul 8)</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-white/5 border border-white/10" />
          <span className="text-white/30 text-xs">Eliminat</span>
        </div>
      </div>
    </div>
  );
}
