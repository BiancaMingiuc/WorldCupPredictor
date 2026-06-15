import BracketMatch from "../components/BracketMatch";
import { BRACKET_MATCHES } from "../data/bracketSchema";
import { GROUPS } from "../data/teams";
import { GROUP_MATCHES } from "../data/schedule";
import { computeGroupStandings } from "../utils/groupLogic";
import { computeThirdPlaceRanking, assignThirdPlaceSlots, THIRD_PLACE_SLOTS } from "../utils/thirdPlaceLogic";
import { GitBranch } from "lucide-react";

const GROUP_LETTERS = Object.keys(GROUPS);

// ─── Resolve team for a slot ─────────────────────────────────────────────────
function resolveSlotTeam(slot, groupStandings, thirdSlotAssignment, bracketScores) {
  if (!slot) return null;

  if (slot.type === "group1") return groupStandings[slot.group]?.[0] || null;
  if (slot.type === "group2") return groupStandings[slot.group]?.[1] || null;
  if (slot.type === "third")  return thirdSlotAssignment[slot.match] || null;

  if (slot.type === "winner" || slot.type === "loser") {
    const sc = bracketScores[slot.match];
    const prevMatch = BRACKET_MATCHES[slot.match];
    if (!prevMatch) return null;

    const team1 = resolveSlotTeam(prevMatch.homeSlot, groupStandings, thirdSlotAssignment, bracketScores);
    const team2 = resolveSlotTeam(prevMatch.awaySlot, groupStandings, thirdSlotAssignment, bracketScores);

    if (!sc || sc.g1 === "" || sc.g2 === "") return null;

    const g1 = parseInt(sc.g1);
    const g2 = parseInt(sc.g2);
    let winner = null, loser = null;

    if (g1 > g2) { winner = team1; loser = team2; }
    else if (g2 > g1) { winner = team2; loser = team1; }
    else {
      const pen1 = parseInt(sc.pen1);
      const pen2 = parseInt(sc.pen2);
      if (!isNaN(pen1) && !isNaN(pen2)) {
        if (pen1 > pen2) { winner = team1; loser = team2; }
        else if (pen2 > pen1) { winner = team2; loser = team1; }
      }
    }
    return slot.type === "winner" ? winner : loser;
  }
  return null;
}

// ─── Round definitions ───────────────────────────────────────────────────────
const ROUNDS = [
  { key: "R32", label: "16-imi de Finală",  ids: [73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88] },
  { key: "R16", label: "Optimi de Finală",   ids: [89,90,91,92,93,94,95,96] },
  { key: "QF",  label: "Sferturi de Finală", ids: [97,98,99,100] },
  { key: "SF",  label: "Semifinale",         ids: [101,102] },
  { key: "TPF", label: "Finala Mică",        ids: [103] },
  { key: "FIN", label: "Finala Mare",        ids: [104] },
];

export default function BracketPage({ scoresMap, bracketScores, onBracketScoreChange }) {
  const groupStandings = {};
  for (const grp of GROUP_LETTERS) {
    groupStandings[grp] = computeGroupStandings(grp, GROUP_MATCHES[grp], scoresMap);
  }

  const thirds = computeThirdPlaceRanking(groupStandings);
  const thirdSlotAssignment = assignThirdPlaceSlots(thirds, THIRD_PLACE_SLOTS);

  return (
    <div className="px-3 sm:px-4 py-5 sm:py-8">
      {/* Page header */}
      <div className="max-w-screen-xl mx-auto mb-5 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-1.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#7A00FF] flex items-center justify-center shrink-0">
            <GitBranch size={14} className="text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Tablou Eliminatoriu</h1>
        </div>
        <p className="text-white/40 text-xs sm:text-sm ml-9 sm:ml-11">
          Scroll orizontal pentru a vedea toate meciurile
        </p>
      </div>

      {/* Rounds */}
      <div className="space-y-8 sm:space-y-10 max-w-screen-2xl mx-auto">
        {ROUNDS.map(({ key, label, ids }) => (
          <RoundSection
            key={key}
            roundKey={key}
            label={label}
            matchIds={ids}
            groupStandings={groupStandings}
            thirdSlotAssignment={thirdSlotAssignment}
            bracketScores={bracketScores}
            onBracketScoreChange={onBracketScoreChange}
          />
        ))}
      </div>
    </div>
  );
}

function RoundSection({ roundKey, label, matchIds, groupStandings, thirdSlotAssignment, bracketScores, onBracketScoreChange }) {
  const isFinalRound = roundKey === "FIN";
  const isThirdPlaceRound = roundKey === "TPF";

  return (
    <div>
      {/* Round label */}
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
        <div className={`h-px flex-1 bg-gradient-to-r ${
          isFinalRound ? "from-[#00FF87]/60 to-transparent" :
          isThirdPlaceRound ? "from-[#FF004D]/40 to-transparent" : "from-white/10 to-transparent"
        }`} />
        <span className={`text-[10px] sm:text-xs font-black tracking-widest uppercase px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border whitespace-nowrap ${
          isFinalRound ? "text-[#00FF87] border-[#00FF87]/30 bg-[#00FF87]/5" :
          isThirdPlaceRound ? "text-[#FF004D] border-[#FF004D]/30 bg-[#FF004D]/5" :
          "text-white/40 border-white/10 bg-white/2"
        }`}>
          {label}
        </span>
        <div className={`h-px flex-1 bg-gradient-to-l ${
          isFinalRound ? "from-[#00FF87]/60 to-transparent" :
          isThirdPlaceRound ? "from-[#FF004D]/40 to-transparent" : "from-white/10 to-transparent"
        }`} />
      </div>

      {/* Horizontal scroll container for matches */}
      <div className="overflow-x-auto pb-3">
        <div className={`flex gap-3 sm:gap-4 ${
          matchIds.length <= 2 ? "justify-center" : "justify-start sm:justify-center"
        } min-w-max sm:min-w-0 sm:flex-wrap px-1`}>
          {matchIds.map((id) => {
            const matchDef = BRACKET_MATCHES[id];
            if (!matchDef) return null;

            const team1 = resolveSlotTeam(matchDef.homeSlot, groupStandings, thirdSlotAssignment, bracketScores);
            const team2 = resolveSlotTeam(matchDef.awaySlot, groupStandings, thirdSlotAssignment, bracketScores);

            return (
              <div key={id} className="flex flex-col items-center gap-1">
                <BracketMatch
                  matchId={id}
                  label={matchDef.label}
                  team1={team1}
                  team2={team2}
                  score={bracketScores[id]}
                  onScoreChange={(sc) => onBracketScoreChange(id, sc)}
                  isFinal={isFinalRound}
                  isThirdPlace={isThirdPlaceRound}
                />
                <div className="text-white/20 text-[9px] sm:text-[10px] text-center max-w-[160px] sm:max-w-[190px] leading-tight">
                  {matchDef.venue} · {matchDef.date}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
