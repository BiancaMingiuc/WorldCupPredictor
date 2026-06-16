// ─── usePredictions.js ────────────────────────────────────────────────────────
// Hook React pentru predicțiile utilizatorului curent.
//
// Strategie hibridă:
//  1. La montare — încarcă din Supabase și suprascrie localStorage
//  2. La fiecare savePrediction — update local IMEDIAT (UI rapid) +
//     upsert async în Supabase în background
//
// Formatul predictionsMap este identic cu scoresMap din App.jsx:
//   { "A_0": { g1: 2, g2: 1, y1: 0, y2: 0, ry1: 0, ry2: 0, rd1: 0, rd2: 0 } }
// Supabase stochează doar g1/g2 — câmpurile de cartonașe rămân în localStorage.

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchUserPredictions, upsertPrediction } from "../lib/db";

const LS_KEY = "wc2026_scores";

/** Citește scoresMap din localStorage */
function readLocalScores() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Scrie scoresMap în localStorage */
function writeLocalScores(map) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(map));
  } catch { /* storage full */ }
}

/**
 * @returns {{
 *   predictionsMap: Object,          // { matchId: { g1, g2, y1, y2, ... } }
 *   loadingPredictions: boolean,
 *   savePrediction: (group: string, idx: number, scoreObj: Object) => void
 * }}
 */
export function usePredictions() {
  const { user } = useAuth();

  // Inițializează din localStorage pentru a evita flash-ul de date goale
  const [predictionsMap, setPredictionsMap] = useState(readLocalScores);
  const [loadingPredictions, setLoadingPredictions] = useState(true);

  // Ref pentru coada de sync în background (evită closure-uri stale)
  const syncQueue = useRef(new Map());

  // ── Încărcare inițială din Supabase ─────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      setLoadingPredictions(false);
      return;
    }

    let cancelled = false;

    fetchUserPredictions(user.id)
      .then((remoteMap) => {
        if (cancelled) return;

        // Merge: local are câmpurile de cartonașe (y1, y2 etc.)
        // remote are g1/g2 authoritative
        setPredictionsMap((local) => {
          const merged = { ...local };
          for (const [matchId, scores] of Object.entries(remoteMap)) {
            merged[matchId] = {
              ...(local[matchId] ?? {}), // păstrează y1, y2, rd1 etc. din local
              g1: scores.g1,             // suprascrie golurile cu valorile din cloud
              g2: scores.g2,
            };
          }
          writeLocalScores(merged);
          return merged;
        });

        setLoadingPredictions(false);
      })
      .catch(() => {
        // Supabase indisponibil — continuăm cu ce e în localStorage
        if (!cancelled) setLoadingPredictions(false);
      });

    return () => { cancelled = true; };
  }, [user?.id]);

  // ── Salvare predicție ────────────────────────────────────────────────────────
  /**
   * Identic cu handleScoreChange din App.jsx:
   *   savePrediction(group, idx, { g1, g2, y1, y2, ... })
   */
  const savePrediction = useCallback((group, idx, scoreObj) => {
    const matchId = `${group}_${idx}`;

    // 1. Update local imediat
    setPredictionsMap((prev) => {
      const next = { ...prev, [matchId]: { ...(prev[matchId] ?? {}), ...scoreObj } };
      writeLocalScores(next);
      return next;
    });

    // 2. Sync Supabase în background (doar dacă avem g1 și g2 valide)
    const g1 = scoreObj.g1 !== undefined ? scoreObj.g1 : null;
    const g2 = scoreObj.g2 !== undefined ? scoreObj.g2 : null;

    if (user && g1 !== "" && g1 !== null && g2 !== "" && g2 !== null) {
      const numG1 = parseInt(g1, 10);
      const numG2 = parseInt(g2, 10);

      if (!isNaN(numG1) && !isNaN(numG2)) {
        // Debounce: dacă mai vine un update rapid, anulăm timerul anterior
        clearTimeout(syncQueue.current.get(matchId));
        syncQueue.current.set(
          matchId,
          setTimeout(() => {
            upsertPrediction(user.id, matchId, numG1, numG2).catch(() => {
              // Eșec silențios — localStorage are deja datele
            });
          }, 600) // 600ms debounce
        );
      }
    }
  }, [user?.id]);

  return { predictionsMap, loadingPredictions, savePrediction };
}
