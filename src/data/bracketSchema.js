// Official bracket schema for FIFA World Cup 2026
// Each match has: id, round, label, homeSlot, awaySlot, venue, date
// homeSlot/awaySlot can be:
//   { type: 'group1', group: 'A' }  => 1st place group A
//   { type: 'group2', group: 'B' }  => 2nd place group B
//   { type: 'third', groups: ['A','B','C','D','F'] } => best 3rd from those groups
//   { type: 'winner', match: 73 }   => winner of match 73
//   { type: 'loser',  match: 101 }  => loser of match 101

export const BRACKET_MATCHES = {
  // ─── Round of 32 (16-imi) ───────────────────────────────────────────────
  73: {
    id: 73, round: "R32", label: "Meci 73",
    venue: "Los Angeles, SUA", date: "28 iunie",
    homeSlot: { type: "group2", group: "A" },
    awaySlot: { type: "group2", group: "B" },
  },
  74: {
    id: 74, round: "R32", label: "Meci 74",
    venue: "Boston, SUA", date: "28 iunie",
    homeSlot: { type: "group1", group: "E" },
    awaySlot: { type: "third", match: 74 }, // best 3rd from A/B/C/D/F
  },
  75: {
    id: 75, round: "R32", label: "Meci 75",
    venue: "Monterrey, Mexic", date: "29 iunie",
    homeSlot: { type: "group1", group: "F" },
    awaySlot: { type: "group2", group: "C" },
  },
  76: {
    id: 76, round: "R32", label: "Meci 76",
    venue: "Houston, SUA", date: "29 iunie",
    homeSlot: { type: "group1", group: "C" },
    awaySlot: { type: "group2", group: "F" },
  },
  77: {
    id: 77, round: "R32", label: "Meci 77",
    venue: "New York, SUA", date: "30 iunie",
    homeSlot: { type: "group1", group: "I" },
    awaySlot: { type: "third", match: 77 }, // best 3rd from C/D/F/G/H
  },
  78: {
    id: 78, round: "R32", label: "Meci 78",
    venue: "Dallas, SUA", date: "30 iunie",
    homeSlot: { type: "group2", group: "E" },
    awaySlot: { type: "group2", group: "I" },
  },
  79: {
    id: 79, round: "R32", label: "Meci 79",
    venue: "Mexico City, Mexic", date: "30 iunie",
    homeSlot: { type: "group1", group: "A" },
    awaySlot: { type: "third", match: 79 }, // best 3rd from C/E/F/H/I
  },
  80: {
    id: 80, round: "R32", label: "Meci 80",
    venue: "Atlanta, SUA", date: "1 iulie",
    homeSlot: { type: "group1", group: "L" },
    awaySlot: { type: "third", match: 80 }, // best 3rd from E/H/I/J/K
  },
  81: {
    id: 81, round: "R32", label: "Meci 81",
    venue: "San Francisco, SUA", date: "1 iulie",
    homeSlot: { type: "group1", group: "D" },
    awaySlot: { type: "third", match: 81 }, // best 3rd from B/E/F/I/J
  },
  82: {
    id: 82, round: "R32", label: "Meci 82",
    venue: "Seattle, SUA", date: "1 iulie",
    homeSlot: { type: "group1", group: "G" },
    awaySlot: { type: "third", match: 82 }, // best 3rd from A/E/H/I/J
  },
  83: {
    id: 83, round: "R32", label: "Meci 83",
    venue: "Toronto, Canada", date: "2 iulie",
    homeSlot: { type: "group2", group: "K" },
    awaySlot: { type: "group2", group: "L" },
  },
  84: {
    id: 84, round: "R32", label: "Meci 84",
    venue: "Los Angeles, SUA", date: "2 iulie",
    homeSlot: { type: "group1", group: "H" },
    awaySlot: { type: "group2", group: "J" },
  },
  85: {
    id: 85, round: "R32", label: "Meci 85",
    venue: "Vancouver, Canada", date: "2 iulie",
    homeSlot: { type: "group1", group: "B" },
    awaySlot: { type: "third", match: 85 }, // best 3rd from E/F/G/I/J
  },
  86: {
    id: 86, round: "R32", label: "Meci 86",
    venue: "Miami, SUA", date: "3 iulie",
    homeSlot: { type: "group1", group: "J" },
    awaySlot: { type: "group2", group: "H" },
  },
  87: {
    id: 87, round: "R32", label: "Meci 87",
    venue: "Kansas, SUA", date: "3 iulie",
    homeSlot: { type: "group1", group: "K" },
    awaySlot: { type: "third", match: 87 }, // best 3rd from D/E/I/J/L
  },
  88: {
    id: 88, round: "R32", label: "Meci 88",
    venue: "Dallas, SUA", date: "3 iulie",
    homeSlot: { type: "group2", group: "D" },
    awaySlot: { type: "group2", group: "G" },
  },

  // ─── Round of 16 (Optimi) ──────────────────────────────────────────────
  89: {
    id: 89, round: "R16", label: "Meci 89",
    venue: "Philadelphia, SUA", date: "4 iulie",
    homeSlot: { type: "winner", match: 74 },
    awaySlot: { type: "winner", match: 77 },
  },
  90: {
    id: 90, round: "R16", label: "Meci 90",
    venue: "Houston, SUA", date: "4 iulie",
    homeSlot: { type: "winner", match: 73 },
    awaySlot: { type: "winner", match: 75 },
  },
  91: {
    id: 91, round: "R16", label: "Meci 91",
    venue: "New York, SUA", date: "5 iulie",
    homeSlot: { type: "winner", match: 76 },
    awaySlot: { type: "winner", match: 78 },
  },
  92: {
    id: 92, round: "R16", label: "Meci 92",
    venue: "Mexico City, Mexic", date: "5 iulie",
    homeSlot: { type: "winner", match: 79 },
    awaySlot: { type: "winner", match: 80 },
  },
  93: {
    id: 93, round: "R16", label: "Meci 93",
    venue: "Dallas, SUA", date: "6 iulie",
    homeSlot: { type: "winner", match: 83 },
    awaySlot: { type: "winner", match: 84 },
  },
  94: {
    id: 94, round: "R16", label: "Meci 94",
    venue: "Seattle, SUA", date: "6 iulie",
    homeSlot: { type: "winner", match: 81 },
    awaySlot: { type: "winner", match: 82 },
  },
  95: {
    id: 95, round: "R16", label: "Meci 95",
    venue: "Atlanta, SUA", date: "7 iulie",
    homeSlot: { type: "winner", match: 86 },
    awaySlot: { type: "winner", match: 88 },
  },
  96: {
    id: 96, round: "R16", label: "Meci 96",
    venue: "Vancouver, Canada", date: "7 iulie",
    homeSlot: { type: "winner", match: 85 },
    awaySlot: { type: "winner", match: 87 },
  },

  // ─── Quarter Finals (Sferturi) ─────────────────────────────────────────
  97: {
    id: 97, round: "QF", label: "Meci 97",
    venue: "Boston, SUA", date: "9 iulie",
    homeSlot: { type: "winner", match: 89 },
    awaySlot: { type: "winner", match: 90 },
  },
  98: {
    id: 98, round: "QF", label: "Meci 98",
    venue: "Los Angeles, SUA", date: "10 iulie",
    homeSlot: { type: "winner", match: 93 },
    awaySlot: { type: "winner", match: 94 },
  },
  99: {
    id: 99, round: "QF", label: "Meci 99",
    venue: "Miami, SUA", date: "11 iulie",
    homeSlot: { type: "winner", match: 91 },
    awaySlot: { type: "winner", match: 92 },
  },
  100: {
    id: 100, round: "QF", label: "Meci 100",
    venue: "Kansas, SUA", date: "11 iulie",
    homeSlot: { type: "winner", match: 95 },
    awaySlot: { type: "winner", match: 96 },
  },

  // ─── Semi Finals ──────────────────────────────────────────────────────
  101: {
    id: 101, round: "SF", label: "Semifinală 1",
    venue: "Dallas, SUA", date: "14 iulie",
    homeSlot: { type: "winner", match: 97 },
    awaySlot: { type: "winner", match: 98 },
  },
  102: {
    id: 102, round: "SF", label: "Semifinală 2",
    venue: "Atlanta, SUA", date: "15 iulie",
    homeSlot: { type: "winner", match: 99 },
    awaySlot: { type: "winner", match: 100 },
  },

  // ─── Third Place ──────────────────────────────────────────────────────
  103: {
    id: 103, round: "TPF", label: "Finala Mică",
    venue: "Miami, SUA", date: "18 iulie",
    homeSlot: { type: "loser", match: 101 },
    awaySlot: { type: "loser", match: 102 },
  },

  // ─── Final ────────────────────────────────────────────────────────────
  104: {
    id: 104, round: "FINAL", label: "Finala Mare",
    venue: "New York, SUA", date: "19 iulie",
    homeSlot: { type: "winner", match: 101 },
    awaySlot: { type: "winner", match: 102 },
  },
};

export const ROUND_ORDER = ["R32", "R16", "QF", "SF", "TPF", "FINAL"];

export const ROUND_LABELS = {
  R32: "16-imi de Finală",
  R16: "Optimi de Finală",
  QF: "Sferturi de Finală",
  SF: "Semifinale",
  TPF: "Finala Mică",
  FINAL: "Finala Mare",
};

// Left half: matches 73-80 -> QF 97,99 -> SF 101 -> Final 104
// Right half: matches 81-88 -> QF 98,100 -> SF 102
export const BRACKET_LEFT = [
  [73, 74, 75, 76, 77, 78, 79, 80], // R32
  [89, 90, 91, 92],                  // R16
  [97, 99],                           // QF
  [101],                              // SF
];
export const BRACKET_RIGHT = [
  [81, 82, 83, 84, 85, 86, 87, 88], // R32
  [93, 94, 95, 96],                  // R16
  [98, 100],                          // QF
  [102],                              // SF
];
