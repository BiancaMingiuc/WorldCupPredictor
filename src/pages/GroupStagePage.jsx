import GroupCard from "../components/GroupCard";
import { GROUPS } from "../data/teams";
import { GROUP_MATCHES } from "../data/schedule";
import { computeGroupStandings, matchKey } from "../utils/groupLogic";
import { Users } from "lucide-react";

const GROUP_LETTERS = Object.keys(GROUPS);

export default function GroupStagePage({ scoresMap, onScoreChange }) {
  const groupStandings = {};
  for (const grp of GROUP_LETTERS) {
    groupStandings[grp] = computeGroupStandings(grp, GROUP_MATCHES[grp], scoresMap);
  }

  const totalPlayed = GROUP_LETTERS.reduce((acc, grp) => {
    return acc + GROUP_MATCHES[grp].filter((m) => {
      const sc = scoresMap[matchKey(grp, m.idx)];
      return sc && sc.g1 !== "" && sc.g2 !== "";
    }).length;
  }, 0);

  return (
    <div className="max-w-screen-xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
      {/* Page header */}
      <div className="mb-5 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-1.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#00FF87] to-[#00E5FF] flex items-center justify-center shrink-0">
            <Users size={14} className="text-black" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Faza Grupelor</h1>
        </div>
        <p className="text-white/40 text-xs sm:text-sm ml-9 sm:ml-11">
          {totalPlayed}/72 meciuri completate
        </p>
        {/* Global progress */}
        <div className="mt-3 sm:mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7A00FF] via-[#00FF87] to-[#00E5FF] rounded-full transition-all duration-700"
            style={{ width: `${(totalPlayed / 72) * 100}%` }}
          />
        </div>
      </div>

      {/* Groups grid — 1 col mobile, 2 col large */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
        {GROUP_LETTERS.map((grp) => (
          <GroupCard
            key={grp}
            groupLetter={grp}
            teams={GROUPS[grp]}
            matches={GROUP_MATCHES[grp]}
            scoresMap={scoresMap}
            standings={groupStandings[grp]}
            onScoreChange={onScoreChange}
          />
        ))}
      </div>
    </div>
  );
}
