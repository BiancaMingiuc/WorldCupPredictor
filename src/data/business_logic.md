# World Cup 2026 Predictor — Business Logic Documentation

## 1. Data Architecture

### 1.1 State Management
All state is persisted in **`localStorage`** — no backend, no database.

| Key | Type | Description |
|-----|------|-------------|
| `wcp_scores` | `object` | Group-stage scores, keyed by `"GROUP_matchIndex"` (e.g. `"A_0"`) |
| `wcp_bracket` | `object` | Knockout-stage scores, keyed by match number (e.g. `73`) |

Each score object:
```js
{
  g1: number,   // goals team1
  g2: number,   // goals team2
  y1: number,   // yellow cards team1
  y2: number,   // yellow cards team2
  ry1: number,  // red from 2 yellows team1
  ry2: number,  // red from 2 yellows team2
  rd1: number,  // direct red team1
  rd2: number,  // direct red team2
  // Bracket matches also have:
  pen1: number, // penalty shootout goals team1
  pen2: number, // penalty shootout goals team2
}
```

### 1.2 Neutrality
All matches are played on **neutral ground**. There is no home/away distinction.  
Internally, teams are always referred to as `team1`/`team2` (or `t1`/`t2` in raw schedule data).

---

## 2. Group Stage

### 2.1 Groups & Schedule

**12 groups (A–L), 4 teams each, 6 matches per group = 72 total matches.**

| Group | Teams |
|-------|-------|
| A | Mexic, Africa de Sud, Coreea de Sud, Cehia |
| B | Canada, Bosnia, Qatar, Elveția |
| C | Brazilia, Maroc, Haiti, Scoția |
| D | SUA, Paraguay, Australia, Turcia |
| E | Germania, Curacao, Coasta de Fildeș, Ecuador |
| F | Olanda, Japonia, Suedia, Tunisia |
| G | Belgia, Egipt, Iran, Noua Zeelandă |
| H | Spania, Ins. Capului Verde, Arabia Saudită, Uruguay |
| I | Franța, Irak, Senegal, Norvegia |
| J | Argentina, Algeria, Austria, Iordania |
| K | Portugalia, RD Congo, Uzbekistan, Columbia |
| L | Anglia, Croația, Ghana, Panama |

Each group plays a **round-robin**: every team faces every other team once.  
Match pair indices (0–5) within each group:

```
idx 0: team[0] vs team[1]    idx 3: team[0] vs team[2]
idx 1: team[2] vs team[3]    idx 4: team[2] vs team[0]  ← note: "reversed"
idx 2: team[2] vs team[1]    idx 5: team[1] vs team[2]
```
*(exact pairings defined in `schedule.js`)*

### 2.2 Points System

| Result | Points |
|--------|--------|
| Win | 3 |
| Draw | 1 |
| Loss | 0 |

### 2.3 FIFA Tiebreaker Chain (8 Levels)

When teams are equal on points, FIFA applies the following rules **in order**:

> **Level 1** → Total points  
> **Level 2** → Head-to-head points (between tied teams only)  
> **Level 3** → Head-to-head goal difference  
> **Level 4** → Head-to-head goals scored  
> **Level 5** → Overall goal difference (all group matches)  
> **Level 6** → Overall goals scored  
> **Level 7** → Disciplinary score *(lower = better, see below)*  
> **Level 8** → FIFA ranking *(lower number = better)*

> [!NOTE]
> Levels 2–4 (head-to-head) only apply when **exactly 2 teams** are tied. If 3+ teams are tied on points, the app skips directly to Level 5.

### 2.4 Disciplinary Score

Each card type has a negative score:

| Card | Event | Points |
|------|-------|--------|
| 🟨 Yellow card | — | −1 |
| 🟥 Red from 2 yellows | — | −3 |
| 🟥 Direct red | — | −4 |
| 🟨 + 🟥 direct red (same match) | Special case | −5 per incident |

The **team with the highest (least negative) score wins** the tiebreaker.

### 2.5 Qualification from Groups

From each group:
- **Rank 1** → qualifies for R32 directly
- **Rank 2** → qualifies for R32 directly  
- **Rank 3** → enters the third-place pool (best 8 of 12 qualify)
- **Rank 4** → eliminated

---

## 3. Third-Place Pool

### 3.1 How It Works

All 12 third-place teams (one per group) compete in a **single ranking** using the same criteria as the group standings:

> Pts → GD → GF → Disc → FIFA Rank

The **top 8** qualify for the Round of 32.

### 3.2 Live Preview

> [!NOTE]
> The app **always shows** the current 3rd-place team from every group — even before any matches have been played (initial order is by FIFA ranking). Teams are marked as "estimated" until their group is complete.

### 3.3 Slot Assignment (Backtracking Algorithm)

FIFA pre-defined **which groups' 3rd-place teams can enter each R32 match slot**.  
This is not a simple free-for-all — each of the 8 third-place slots has specific group constraints:

| R32 Match | Allowed Groups for 3rd |
|-----------|------------------------|
| 74 | A, B, C, D, F |
| 77 | C, D, F, G, H |
| 79 | C, E, F, H, I |
| 80 | E, H, I, J, K |
| 81 | B, E, F, I, J |
| 82 | A, E, H, I, J |
| 85 | E, F, G, I, J |
| 87 | D, E, I, J, L |

The app uses a **backtracking algorithm** to find a valid assignment:
1. Takes the top-8 ranked 3rd-place teams
2. Iterates through slots in order
3. Tries each eligible team for each slot
4. If a conflict arises (team already used, or group not in constraints), it backtracks and tries the next candidate

This guarantees a valid assignment exists as long as the FIFA group constraints are feasible.

---

## 4. Bracket / Knockout Stage

### 4.1 Structure

```
R32 (16 matches) → R16 (8 matches) → QF (4 matches) → SF (2 matches) → Final
                                                       → 3rd Place Match
```

**Total elimination matches: 31**  
Match IDs: 73–104

### 4.2 R32 — Round of 32 Slot Assignments

| Match | Team 1 | Team 2 |
-------|--------|--------|
| 73 | 2nd A | 2nd B |
| 74 | 1st E | Best 3rd (A/B/C/D/F) |
| 75 | 1st F | 2nd C |
| 76 | 1st C | 2nd F |
| 77 | 1st I | Best 3rd (C/D/F/G/H) |
| 78 | 2nd E | 2nd I |
| 79 | 1st A | Best 3rd (C/E/F/H/I) |
| 80 | 1st L | Best 3rd (E/H/I/J/K) |
| 81 | 1st D | Best 3rd (B/E/F/I/J) |
| 82 | 1st G | Best 3rd (A/E/H/I/J) |
| 83 | 2nd K | 2nd L |
| 84 | 1st H | 2nd J |
| 85 | 1st B | Best 3rd (E/F/G/I/J) |
| 86 | 1st J | 2nd H |
| 87 | 1st K | Best 3rd (D/E/I/J/L) |
| 88 | 2nd D | 2nd G |
|
### 4.3 R16 → QF → SF Bracket Path

```
M74 winner ─┐
            ├─ M89 ─┐
M77 winner ─┘       │
                    ├─ M97 ─┐
M73 winner ─┐       │       │
            ├─ M90 ─┘       │
M75 winner ─┘               ├─ M101 ─┐
                            │         ├─ M104 (FINAL)
M76 winner ─┐               │         │
            ├─ M91 ─┐       │         │
M78 winner ─┘       │       │         │
                    ├─ M99 ─┘         │
M79 winner ─┐       │                 │
            ├─ M92 ─┘                 │
M80 winner ─┘                         │
                                      │
M81 winner ─┐                         │
            ├─ M94 ─┐                 │
M82 winner ─┘       │                 │
                    ├─ M98 ─┐         │
M83 winner ─┐       │       │         │
            ├─ M93 ─┘       │         │
M84 winner ─┘               ├─ M102 ──┘
                            │
M85 winner ─┐               │
            ├─ M96 ─┐       │
M87 winner ─┘       │       │
                    ├─ M100─┘
M86 winner ─┐       │
            ├─ M95 ─┘
M88 winner ─┘
```

**3rd Place Match:**  
M103 = Loser M101 vs Loser M102

### 4.4 Knockout Resolving Rules

In elimination matches:
- **Winner**: team with more goals after 90 minutes
- **Loser**: team with fewer goals
- **Draw**: requires a penalty shootout  
  - Input `pen1` / `pen2` fields appear automatically when the score is level
  - The team with more penalties wins

> [!IMPORTANT]
> If a bracket match score is entered but penalties haven't been filled in for a draw, the winner is `null` — downstream matches will remain TBD until penalties are resolved.

### 4.5 Cascading Resolution

The bracket resolves **lazily and recursively**:

```
resolveSlotTeam(slot):
  if slot is group1/group2 → look up current group standings[idx]
  if slot is third         → look up backtracking assignment
  if slot is winner/loser  → recursively resolve parent match teams,
                             then check bracketScores for that match
```

This means editing any match automatically updates all downstream matches.

---

## 5. Summary of Files

| File | Role |
|------|------|
| `src/data/teams.js` | 48 teams, flags, FIFA rankings |
| `src/data/schedule.js` | 72 group-stage matches with dates/times |
| `src/data/bracketSchema.js` | 31 knockout matches with slot descriptors |
| `src/utils/groupLogic.js` | Points calculation + 8-level FIFA tiebreaker + disciplinary |
| `src/utils/thirdPlaceLogic.js` | 3rd-place ranking + backtracking slot assignment |
| `src/hooks/useLocalStorage.js` | Persistent state via localStorage |
| `src/pages/GroupStagePage.jsx` | Group-stage UI with collapsible cards |
| `src/pages/ThirdPlacePage.jsx` | Third-place ranking table |
| `src/pages/BracketPage.jsx` | Knockout bracket with recursive team resolution |

---

*Generated automatically from source code — last updated June 2026.*
