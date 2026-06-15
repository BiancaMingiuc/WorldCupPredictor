// BracketMatch — single match box, mobile-friendly
export default function BracketMatch({ matchId, label, team1, team2, score, onScoreChange, isFinal, isThirdPlace }) {
  const val = (f) => (score?.[f] !== undefined && score?.[f] !== null ? score[f] : "");
  const handle = (f) => (e) => {
    const raw = e.target.value;
    const n = raw === "" ? "" : Math.max(0, parseInt(raw, 10) || 0);
    onScoreChange?.({ ...(score || {}), [f]: n === "" ? "" : n });
  };

  const g1 = val("g1");
  const g2 = val("g2");
  const hasScore = g1 !== "" && g2 !== "";
  const isDraw = hasScore && parseInt(g1) === parseInt(g2);

  const team1Wins = hasScore && parseInt(g1) > parseInt(g2);
  const team2Wins = hasScore && parseInt(g2) > parseInt(g1);
  const team1PenWins = isDraw && val("pen1") !== "" && val("pen2") !== "" && parseInt(val("pen1")) > parseInt(val("pen2"));
  const team2PenWins = isDraw && val("pen1") !== "" && val("pen2") !== "" && parseInt(val("pen2")) > parseInt(val("pen1"));

  const team1Advances = team1Wins || team1PenWins;
  const team2Advances = team2Wins || team2PenWins;

  const borderColor = isFinal ? "border-[#00FF87]/40" : isThirdPlace ? "border-[#FF004D]/30" : "border-white/10";

  return (
    <div className={`relative rounded-xl border bg-[#111118] shadow-lg ${borderColor} w-[160px] sm:w-[190px] overflow-hidden`}>
      {/* Match label */}
      <div className={`px-2 py-1 border-b border-white/5 text-center ${
        isFinal ? "bg-gradient-to-r from-[#00FF87]/10 to-[#7A00FF]/10" :
        isThirdPlace ? "bg-[#FF004D]/5" : "bg-[#0A0A12]"
      }`}>
        <span className="text-white/30 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase">{label}</span>
      </div>

      {/* Teams + scores */}
      <div className="divide-y divide-white/5">
        <TeamRow team={team1} scoreVal={g1} onScoreChange={handle("g1")} winner={team1Advances} loser={team2Advances && !team1Advances} disabled={!team1} />
        <TeamRow team={team2} scoreVal={g2} onScoreChange={handle("g2")} winner={team2Advances} loser={team1Advances && !team2Advances} disabled={!team2} />
      </div>

      {/* Penalties section */}
      {isDraw && (
        <div className="border-t border-[#FF004D]/20 bg-[#FF004D]/5 px-2 py-1.5">
          <div className="text-[#FF004D] text-[9px] font-bold text-center mb-1.5 tracking-wider">PENALTIURI</div>
          <div className="flex items-center justify-center gap-2">
            <input
              type="number" min="0" value={val("pen1")} onChange={handle("pen1")}
              className="w-9 h-7 bg-[#1E1E2E] border border-[#FF004D]/30 rounded-lg text-white text-center text-sm font-black focus:outline-none focus:border-[#FF004D]/70 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-[#FF004D]/60 font-black text-sm">:</span>
            <input
              type="number" min="0" value={val("pen2")} onChange={handle("pen2")}
              className="w-9 h-7 bg-[#1E1E2E] border border-[#FF004D]/30 rounded-lg text-white text-center text-sm font-black focus:outline-none focus:border-[#FF004D]/70 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function TeamRow({ team, scoreVal, onScoreChange, winner, loser, disabled }) {
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1.5 transition-colors ${
      winner ? "bg-[#00FF87]/8" : loser ? "bg-transparent opacity-40" : ""
    }`}>
      <span className="text-sm w-5 text-center shrink-0">{team ? team.flag : "?"}</span>
      <span className={`text-[10px] sm:text-xs font-semibold flex-1 truncate ${
        winner ? "text-[#00FF87]" : loser ? "text-white/30" : "text-white/80"
      }`}>
        {team ? team.name : <span className="text-white/20 italic">TBD</span>}
      </span>
      {winner && <span className="text-[#00FF87] text-[9px] shrink-0">✓</span>}
      <input
        type="number" min="0" value={scoreVal} onChange={onScoreChange} disabled={disabled}
        className={`w-8 h-6 sm:w-9 sm:h-7 bg-[#1A1A28] border rounded-lg text-white text-center text-xs font-black focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
          disabled ? "border-white/3 opacity-30 cursor-not-allowed" :
          winner ? "border-[#00FF87]/40 focus:border-[#00FF87]/80" : "border-white/10 focus:border-white/30"
        }`}
      />
    </div>
  );
}
