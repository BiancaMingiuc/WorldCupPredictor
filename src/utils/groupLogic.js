import { GROUPS } from "../data/teams";

// ─── Match key helpers ───────────────────────────────────────────────────────
// Match key for a group match: "A_0" => group A, match index 0
// Score object: { g1, g2, y1, y2, ry1, ry2, rd1, rd2 }
//   g1/g2: goals team1/team2  (neutral field — no home/away)
//   y1/y2: yellow cards team1/team2
//   ry1/ry2: red from 2 yellows team1/team2
//   rd1/rd2: direct red team1/team2

export function matchKey(group, idx) {
  return `${group}_${idx}`;
}

// Disciplinary score for a team in one match:
// Yellow = -1, Red from 2Y = -3, Direct Red = -4
// If both yellow AND direct red in same match: -5 (not -1-4)
function discScore(yellow, redY, redD) {
  let score = 0;
  if (redD > 0 && yellow > 0) {
    score += -(yellow - redD) * 1;
    score += redD * (-5);
  } else {
    score += yellow * -1;
    score += redD * -4;
  }
  score += redY * -3;
  return score;
}

// ─── Compute standings for a single group ────────────────────────────────────
export function computeGroupStandings(group, matches, scoresMap) {
  const teams = GROUPS[group];

  const stats = {};
  for (const t of teams) {
    stats[t.id] = {
      id: t.id, name: t.name, flag: t.flag, fifaRank: t.fifaRank,
      gp: 0, w: 0, d: 0, l: 0,
      gf: 0, ga: 0, gd: 0,
      pts: 0, disc: 0,
    };
  }

  const played = [];
  for (const m of matches) {
    const key = matchKey(group, m.idx);
    const sc = scoresMap[key];
    if (sc && sc.g1 !== "" && sc.g2 !== "" && sc.g1 !== null && sc.g2 !== null) {
      const g1 = parseInt(sc.g1, 10);
      const g2 = parseInt(sc.g2, 10);
      if (isNaN(g1) || isNaN(g2)) continue;
      played.push({ match: m, g1, g2, sc });
    }
  }

  for (const { match, g1, g2, sc } of played) {
    const t1 = stats[match.t1];
    const t2 = stats[match.t2];

    t1.gp++; t2.gp++;
    t1.gf += g1; t1.ga += g2; t1.gd += g1 - g2;
    t2.gf += g2; t2.ga += g1; t2.gd += g2 - g1;

    if (g1 > g2) { t1.w++; t1.pts += 3; t2.l++; }
    else if (g1 < g2) { t2.w++; t2.pts += 3; t1.l++; }
    else { t1.d++; t2.d++; t1.pts += 1; t2.pts += 1; }

    t1.disc += discScore(parseInt(sc.y1 || 0), parseInt(sc.ry1 || 0), parseInt(sc.rd1 || 0));
    t2.disc += discScore(parseInt(sc.y2 || 0), parseInt(sc.ry2 || 0), parseInt(sc.rd2 || 0));
  }

  const standingsList = Object.values(stats);
  standingsList.sort((a, b) => sortTeams(a, b, standingsList, played));
  return standingsList;
}

function sortTeams(a, b, all, played) {
  if (b.pts !== a.pts) return b.pts - a.pts;

  const tiedPts = all.filter((t) => t.pts === a.pts);
  if (tiedPts.length === 2) {
    const h2h = getH2HStats([a, b], played);
    const ha = h2h[a.id], hb = h2h[b.id];
    if (hb.pts !== ha.pts) return hb.pts - ha.pts;
    const gdA = ha.gf - ha.ga, gdB = hb.gf - hb.ga;
    if (gdB !== gdA) return gdB - gdA;
    if (hb.gf !== ha.gf) return hb.gf - ha.gf;
  }

  if (b.gd !== a.gd) return b.gd - a.gd;
  if (b.gf !== a.gf) return b.gf - a.gf;
  if (b.disc !== a.disc) return b.disc - a.disc;
  return a.fifaRank - b.fifaRank;
}

function getH2HStats(teams, played) {
  const ids = teams.map((t) => t.id);
  const h2h = {};
  for (const t of teams) h2h[t.id] = { pts: 0, gf: 0, ga: 0 };

  for (const { match, g1, g2 } of played) {
    if (ids.includes(match.t1) && ids.includes(match.t2)) {
      h2h[match.t1].gf += g1; h2h[match.t1].ga += g2;
      h2h[match.t2].gf += g2; h2h[match.t2].ga += g1;
      if (g1 > g2) h2h[match.t1].pts += 3;
      else if (g1 < g2) h2h[match.t2].pts += 3;
      else { h2h[match.t1].pts += 1; h2h[match.t2].pts += 1; }
    }
  }
  return h2h;
}

export function isGroupComplete(group, matches, scoresMap) {
  return matches.every((m) => {
    const key = matchKey(group, m.idx);
    const sc = scoresMap[key];
    return sc && sc.g1 !== "" && sc.g2 !== "" && sc.g1 !== null && sc.g2 !== null &&
      !isNaN(parseInt(sc.g1)) && !isNaN(parseInt(sc.g2));
  });
}
