// StandingsTable — live group standings, mobile-first
export default function StandingsTable({ standings }) {
  return (
    <div className="mt-4">
      <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0D0D14]">
        {/* Mobile: scrollable table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[320px]">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-2 sm:px-3 py-2.5 text-white/30 font-medium text-xs w-6">#</th>
                <th className="text-left px-2 py-2.5 text-white/30 font-medium text-xs">Echipă</th>
                <th className="px-1.5 sm:px-2 py-2.5 text-white/30 font-medium text-xs text-center">J</th>
                <th className="px-1.5 sm:px-2 py-2.5 text-white/30 font-medium text-xs text-center hidden sm:table-cell">V</th>
                <th className="px-1.5 sm:px-2 py-2.5 text-white/30 font-medium text-xs text-center hidden sm:table-cell">E</th>
                <th className="px-1.5 sm:px-2 py-2.5 text-white/30 font-medium text-xs text-center hidden sm:table-cell">Î</th>
                <th className="px-1.5 sm:px-2 py-2.5 text-white/30 font-medium text-xs text-center hidden sm:table-cell">GF</th>
                <th className="px-1.5 sm:px-2 py-2.5 text-white/30 font-medium text-xs text-center hidden sm:table-cell">GA</th>
                <th className="px-1.5 sm:px-2 py-2.5 text-white/30 font-medium text-xs text-center">GD</th>
                <th className="px-1.5 sm:px-2 py-2.5 text-white/30 font-medium text-xs text-center hidden md:table-cell">Disc</th>
                <th className="px-2 sm:px-3 py-2.5 text-white/30 font-medium text-xs text-center font-black">Pct</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, idx) => (
                <tr
                  key={team.id}
                  className={`border-b border-white/5 last:border-0 transition-colors ${
                    idx < 2 ? "bg-[#00FF87]/4 hover:bg-[#00FF87]/8" :
                    idx === 2 ? "bg-[#00E5FF]/3 hover:bg-[#00E5FF]/6" : "hover:bg-white/2"
                  }`}
                >
                  <td className="px-2 sm:px-3 py-2 sm:py-2.5">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-xs font-black ${
                      idx === 0 ? "bg-[#00FF87]/20 text-[#00FF87]" :
                      idx === 1 ? "bg-[#00FF87]/10 text-[#00FF87]/70" :
                      idx === 2 ? "bg-[#00E5FF]/10 text-[#00E5FF]/70" : "text-white/30"
                    }`}>{idx + 1}</span>
                  </td>
                  <td className="px-2 py-2 sm:py-2.5">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-sm sm:text-base">{team.flag}</span>
                      <span className="text-white text-xs font-semibold truncate max-w-[70px] sm:max-w-[120px]">{team.name}</span>
                    </div>
                  </td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-2.5 text-center text-white/50 text-xs">{team.gp}</td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-2.5 text-center text-white/50 text-xs hidden sm:table-cell">{team.w}</td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-2.5 text-center text-white/50 text-xs hidden sm:table-cell">{team.d}</td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-2.5 text-center text-white/50 text-xs hidden sm:table-cell">{team.l}</td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-2.5 text-center text-white/60 text-xs hidden sm:table-cell">{team.gf}</td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-2.5 text-center text-white/60 text-xs hidden sm:table-cell">{team.ga}</td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-2.5 text-center text-xs font-semibold">
                    <span className={team.gd > 0 ? "text-[#00FF87]" : team.gd < 0 ? "text-[#FF004D]" : "text-white/40"}>
                      {team.gd > 0 ? `+${team.gd}` : team.gd}
                    </span>
                  </td>
                  <td className="px-1.5 sm:px-2 py-2 sm:py-2.5 text-center text-xs hidden md:table-cell">
                    <span className={team.disc < 0 ? "text-yellow-400/70" : "text-white/30"}>{team.disc}</span>
                  </td>
                  <td className="px-2 sm:px-3 py-2 sm:py-2.5 text-center">
                    <span className={`font-black text-sm ${
                      idx < 2 ? "text-[#00FF87]" : idx === 2 ? "text-[#00E5FF]" : "text-white/60"
                    }`}>{team.pts}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-2 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#00FF87]/30" />
          <span className="text-white/30 text-xs">Calificați în 16-imi</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#00E5FF]/20" />
          <span className="text-white/30 text-xs">Potențial loc 3</span>
        </div>
      </div>
    </div>
  );
}
