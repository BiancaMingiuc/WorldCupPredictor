// Third-place ranking logic
// Collects 3rd-place team from each group and sorts them

export function computeThirdPlaceRanking(groupStandings) {
  // groupStandings: { A: [...4 teams sorted], B: [...], ... }
  // We take index 2 from each group (3rd place) — always, even if 0 games played
  const thirds = [];

  for (const [group, standings] of Object.entries(groupStandings)) {
    if (standings && standings.length === 4) {
      const t = standings[2];
      // Always include, mark as partial if no matches played yet
      thirds.push({ ...t, group, isPartial: t.gp === 0 });
    }
  }

  // Sort: 1.Pts, 2.GD, 3.GF, 4.Disc, 5.FIFA rank
  thirds.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    if (b.disc !== a.disc) return b.disc - a.disc;
    return a.fifaRank - b.fifaRank;
  });

  return thirds;
}

// Given the sorted third-place list and the bracket slots (each slot defines which groups are allowed),
// assign the top 8 third-place teams to the 8 slots respecting group constraints.
// Slots: { matchId: ['A','B','C','D','F'], ... }
// Returns: { matchId: teamId }
export function assignThirdPlaceSlots(sortedThirds, slotConstraints) {
  const top8 = sortedThirds.slice(0, 8);
  const matchIds = Object.keys(slotConstraints);
  const result = {};
  const used = new Set();

  // Backtracking assignment
  function backtrack(slotIndex) {
    if (slotIndex === matchIds.length) return true;
    const matchId = matchIds[slotIndex];
    const allowedGroups = slotConstraints[matchId];

    for (const team of top8) {
      if (used.has(team.id)) continue;
      if (!allowedGroups.includes(team.group)) continue;
      result[matchId] = team;
      used.add(team.id);
      if (backtrack(slotIndex + 1)) return true;
      delete result[matchId];
      used.delete(team.id);
    }
    return false;
  }

  backtrack(0);
  return result;
}

// The 8 third-place slots and their group constraints
export const THIRD_PLACE_SLOTS = {
  74:  ["A","B","C","D","F"],
  77:  ["C","D","F","G","H"],
  79:  ["C","E","F","H","I"],
  80:  ["E","H","I","J","K"],
  81:  ["B","E","F","I","J"],
  82:  ["A","E","H","I","J"],
  85:  ["E","F","G","I","J"],
  87:  ["D","E","I","J","L"],
};
