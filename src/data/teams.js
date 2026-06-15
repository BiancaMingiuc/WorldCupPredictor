// World Cup 2026 — Groups, Teams, Flags, FIFA Rankings (official FIFA rankings)
export const GROUPS = {
  A: [
    { id: "mex", name: "Mexic", flag: "🇲🇽", fifaRank: 14 },
    { id: "rsa", name: "Africa de Sud", flag: "🇿🇦", fifaRank: 60 },
    { id: "kor", name: "Coreea de Sud", flag: "🇰🇷", fifaRank: 25 },
    { id: "cze", name: "Cehia", flag: "🇨🇿", fifaRank: 40 },
  ],
  B: [
    { id: "can", name: "Canada", flag: "🇨🇦", fifaRank: 30 },
    { id: "bih", name: "Bosnia", flag: "🇧🇦", fifaRank: 64 },
    { id: "qat", name: "Qatar", flag: "🇶🇦", fifaRank: 56 },
    { id: "sui", name: "Elveția", flag: "🇨🇭", fifaRank: 19 },
  ],
  C: [
    { id: "bra", name: "Brazilia", flag: "🇧🇷", fifaRank: 6 },
    { id: "mar", name: "Maroc", flag: "🇲🇦", fifaRank: 7 },
    { id: "hai", name: "Haiti", flag: "🇭🇹", fifaRank: 83 },
    { id: "sco", name: "Scoția", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", fifaRank: 42 },
  ],
  D: [
    { id: "usa", name: "SUA", flag: "🇺🇸", fifaRank: 17 },
    { id: "par", name: "Paraguay", flag: "🇵🇾", fifaRank: 41 },
    { id: "aus", name: "Australia", flag: "🇦🇺", fifaRank: 27 },
    { id: "tur", name: "Turcia", flag: "🇹🇷", fifaRank: 22 },
  ],
  E: [
    { id: "ger", name: "Germania", flag: "🇩🇪", fifaRank: 10 },
    { id: "cur", name: "Curacao", flag: "🇨🇼", fifaRank: 82 },
    { id: "civ", name: "Coasta de Fildeș", flag: "🇨🇮", fifaRank: 33 },
    { id: "ecu", name: "Ecuador", flag: "🇪🇨", fifaRank: 23 },
  ],
  F: [
    { id: "ned", name: "Olanda", flag: "🇳🇱", fifaRank: 8 },
    { id: "jpn", name: "Japonia", flag: "🇯🇵", fifaRank: 18 },
    { id: "swe", name: "Suedia", flag: "🇸🇪", fifaRank: 38 },
    { id: "tun", name: "Tunisia", flag: "🇹🇳", fifaRank: 45 },
  ],
  G: [
    { id: "bel", name: "Belgia", flag: "🇧🇪", fifaRank: 9 },
    { id: "egy", name: "Egipt", flag: "🇪🇬", fifaRank: 29 },
    { id: "irn", name: "Iran", flag: "🇮🇷", fifaRank: 20 },
    { id: "nzl", name: "Noua Zeelandă", flag: "🇳🇿", fifaRank: 85 },
  ],
  H: [
    { id: "esp", name: "Spania", flag: "🇪🇸", fifaRank: 2 },
    { id: "cpv", name: "Ins. Capului Verde", flag: "🇨🇻", fifaRank: 67 },
    { id: "ksa", name: "Arabia Saudită", flag: "🇸🇦", fifaRank: 61 },
    { id: "uru", name: "Uruguay", flag: "🇺🇾", fifaRank: 16 },
  ],
  I: [
    { id: "fra", name: "Franța", flag: "🇫🇷", fifaRank: 3 },
    { id: "irq", name: "Irak", flag: "🇮🇶", fifaRank: 57 },
    { id: "sen", name: "Senegal", flag: "🇸🇳", fifaRank: 15 },
    { id: "nor", name: "Norvegia", flag: "🇳🇴", fifaRank: 31 },
  ],
  J: [
    { id: "arg", name: "Argentina", flag: "🇦🇷", fifaRank: 1 },
    { id: "alg", name: "Algeria", flag: "🇩🇿", fifaRank: 28 },
    { id: "aut", name: "Austria", flag: "🇦🇹", fifaRank: 24 },
    { id: "jor", name: "Iordania", flag: "🇯🇴", fifaRank: 63 },
  ],
  K: [
    { id: "por", name: "Portugalia", flag: "🇵🇹", fifaRank: 5 },
    { id: "cod", name: "RD Congo", flag: "🇨🇩", fifaRank: 46 },
    { id: "uzb", name: "Uzbekistan", flag: "🇺🇿", fifaRank: 50 },
    { id: "col", name: "Columbia", flag: "🇨🇴", fifaRank: 13 },
  ],
  L: [
    { id: "eng", name: "Anglia", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", fifaRank: 4 },
    { id: "cro", name: "Croația", flag: "🇭🇷", fifaRank: 11 },
    { id: "gha", name: "Ghana", flag: "🇬🇭", fifaRank: 73 },
    { id: "pan", name: "Panama", flag: "🇵🇦", fifaRank: 34 },
  ],
};

// Returns team by id
export function getTeamById(id) {
  for (const group of Object.values(GROUPS)) {
    const t = group.find((t) => t.id === id);
    if (t) return t;
  }
  return null;
}

// Returns group letter for a team id
export function getGroupForTeam(id) {
  for (const [grp, teams] of Object.entries(GROUPS)) {
    if (teams.find((t) => t.id === id)) return grp;
  }
  return null;
}
