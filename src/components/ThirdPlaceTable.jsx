// ThirdPlaceTable — mobile-first with overflow-x-auto
export default function ThirdPlaceTable({ thirds }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0D0D14]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[360px]">
          <thead>
            <tr className="border-b border-white/8">
              <th className="text-left px-2 sm:px-3 py-2.5 sm:py-3 text-white/30 font-medium text-xs w-7">#</th>
              <th className="text-left px-1.5 sm:px-2 py-2.5 sm:py-3 text-white/30 font-medium text-xs w-7">Gr.</th>
              <th className="text-left px-1.5 sm:px-2 py-2.5 sm:py-3 text-white/30 font-medium text-xs">Echipă</th>
              <th className="px-1.5 sm:px-2 py-2.5 sm:py-3 text-white/30 font-medium text-xs text-center">J</th>
              <th className="px-1.5 sm:px-2 py-2.5 sm:py-3 text-white/30 font-medium text-xs text-center hidden sm:table-cell">V</th>
              <th className="px-1.5 sm:px-2 py-2.5 sm:py-3 text-white/30 font-medium text-xs text-center hidden sm:table-cell">E</th>
              <th className="px-1.5 sm:px-2 py-2.5 sm:py-3 text-white/30 font-medium text-xs text-center hidden sm:table-cell">Î</th>
              <th className="px-1.5 sm:px-2 py-2.5 sm:py-3 text-white/30 font-medium text-xs text-center hidden sm:table-cell">GF</th>
              <th className="px-1.5 sm:px-2 py-2.5 sm:py-3 text-white/30 font-medium text-xs text-center hidden sm:table-cell">GA</th>
              <th className="px-1.5 sm:px-2 py-2.5 sm:py-3 text-white/30 font-medium text-xs text-center">GD</th>
              <th className="px-1.5 sm:px-2 py-2.5 sm:py-3 text-white/30 font-medium text-xs text-center hidden md:table-cell">Disc</th>
              <th className="px-1.5 sm:px-2 py-2.5 sm:py-3 text-white/30 font-medium text-xs text-center hidden lg:table-cell">FIFA</th>
              <th className="px-2 sm:px-3 py-2.5 sm:py-3 text-white/30 font-medium text-xs text-center">Pct</th>
              <th className="px-2 sm:px-3 py-2.5 sm:py-3 text-white/30 font-medium text-xs text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {thirds.map((team, idx) => {
              const qualifies = idx < 8;
              const onBubble = idx === 7;
              return (
                <tr
                  key={team.id + team.group}
                  className={`border-b border-white/5 last:border-0 transition-all duration-300 ${
                    qualifies
                      ? onBubble ? "bg-[#FF004D]/5 hover:bg-[#FF004D]/8" : "bg-[#00FF87]/4 hover:bg-[#00FF87]/8"
                      : "hover:bg-white/2"
                  }`}
                >
                  <td className="px-2 sm:px-3 py-2 sm:py-3">
                    <span className={`inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-md text-xs font-black ${
                      qualifies
                        ? onBubble ? "bg-[#FF004D]/20 text-[#FF004D]" : "bg-[#00FF87]/20 text-[#00FF87]"
                        : "text-white/25"
                    }`}>{idx + 1}</span>
                  </td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-3">
                    <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#7A00FF]/20 text-[#7A00FF] text-xs font-black">{team.group}</span>
                  </td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-3">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-sm sm:text-base">{team.flag}</span>
                      <span className="text-white text-xs sm:text-sm font-semibold whitespace-nowrap">{team.name}</span>
                    </div>
                  </td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-3 text-center text-white/50 text-xs">{team.gp}</td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-3 text-center text-white/50 text-xs hidden sm:table-cell">{team.w}</td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-3 text-center text-white/50 text-xs hidden sm:table-cell">{team.d}</td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-3 text-center text-white/50 text-xs hidden sm:table-cell">{team.l}</td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-3 text-center text-white/60 text-xs hidden sm:table-cell">{team.gf}</td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-3 text-center text-white/60 text-xs hidden sm:table-cell">{team.ga}</td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-3 text-center text-xs font-semibold">
                    <span className={team.gd > 0 ? "text-[#00FF87]" : team.gd < 0 ? "text-[#FF004D]" : "text-white/40"}>
                      {team.gd > 0 ? `+${team.gd}` : team.gd}
                    </span>
                  </td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-3 text-center text-xs hidden md:table-cell">
                    <span className={team.disc < 0 ? "text-yellow-400/70" : "text-white/30"}>{team.disc}</span>
                  </td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-3 text-center text-white/40 text-xs hidden lg:table-cell">#{team.fifaRank}</td>
                  <td className="px-2 sm:px-3 py-2 sm:py-3 text-center">
                    <span className={`font-black text-sm ${qualifies ? onBubble ? "text-[#FF004D]" : "text-[#00FF87]" : "text-white/50"}`}>
                      {team.pts}
                    </span>
                  </td>
                  <td className="px-2 sm:px-3 py-2 sm:py-3 text-center">
                    {qualifies ? (
                      <span className={`text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg ${
                        onBubble ? "bg-[#FF004D]/15 text-[#FF004D]" : "bg-[#00FF87]/15 text-[#00FF87]"
                      }`}>
                        {onBubble ? "Limită" : "✓ Cal."}
                      </span>
                    ) : (
                      <span className="text-[10px] sm:text-xs text-white/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-white/3">Elim.</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
