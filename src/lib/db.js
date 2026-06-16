// ─── db.js ────────────────────────────────────────────────────────────────────
// Funcții pure de acces la baza de date Supabase.
// Pattern: funcțiile returnează datele sau aruncă eroarea — fără state intern.
// Importă supabase singleton din ./supabase.js

import { supabase } from "./supabase";

// ═══════════════════════════════════════════════════════════════════════════════
//  PROFILE (tabelul users)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Obține profilul unui utilizator după id.
 * @param {string} userId - UUID din auth.users
 * @returns {Promise<Object|null>}
 */
export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 = not found
  return data ?? null;
}

/**
 * Creează sau actualizează profilul utilizatorului.
 * @param {string} userId
 * @param {{ nume?: string, avatar?: string }} fields
 * @returns {Promise<Object>}
 */
export async function upsertProfile(userId, fields) {
  const { data, error } = await supabase
    .from("users")
    .upsert({ id: userId, ...fields }, { onConflict: "id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MATCHES (tabelul matches)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Obține toate cele 72 de meciuri din faza grupelor.
 * @returns {Promise<Array>}
 */
export async function fetchAllMatches() {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("ora_start", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/**
 * Obține un singur meci după id (ex: 'A_0').
 * @param {string} matchId
 * @returns {Promise<Object|null>}
 */
export async function fetchMatch(matchId) {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data ?? null;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PREDICTIONS (tabelul predictions)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Obține toate predicțiile unui utilizator.
 * Returnează un obiect { [matchId]: { g1_pred, g2_pred } } pentru compatibilitate
 * cu formatul scoresMap din frontend.
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export async function fetchUserPredictions(userId) {
  const { data, error } = await supabase
    .from("predictions")
    .select("match_id, g1_pred, g2_pred")
    .eq("user_id", userId);

  if (error) throw error;

  // Transformă array → map { matchId: { g1: n, g2: n } }
  const map = {};
  for (const row of data ?? []) {
    map[row.match_id] = { g1: row.g1_pred, g2: row.g2_pred };
  }
  return map;
}

/**
 * Salvează sau actualizează o predicție (UPSERT).
 * @param {string} userId
 * @param {string} matchId  - ex: 'A_0'
 * @param {number} g1       - goluri echipă 1 (predicție)
 * @param {number} g2       - goluri echipă 2 (predicție)
 * @returns {Promise<Object>}
 */
export async function upsertPrediction(userId, matchId, g1, g2) {
  const { data, error } = await supabase
    .from("predictions")
    .upsert(
      {
        user_id:  userId,
        match_id: matchId,
        g1_pred:  g1,
        g2_pred:  g2,
      },
      { onConflict: "user_id,match_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Șterge predicția unui utilizator pentru un meci.
 * @param {string} userId
 * @param {string} matchId
 * @returns {Promise<void>}
 */
export async function deletePrediction(userId, matchId) {
  const { error } = await supabase
    .from("predictions")
    .delete()
    .eq("user_id", userId)
    .eq("match_id", matchId);

  if (error) throw error;
}

/**
 * Șterge toate predicțiile unui utilizator.
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function deleteAllPredictions(userId) {
  const { error } = await supabase
    .from("predictions")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
}
