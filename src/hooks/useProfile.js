// ─── useProfile.js ────────────────────────────────────────────────────────────
// Hook React pentru profilul utilizatorului autentificat.
// Pattern: similar cu useLocalStorage.js — simplu, fără Redux/zustand.

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchProfile, upsertProfile } from "../lib/db";

/**
 * @returns {{
 *   profile: Object|null,
 *   loading: boolean,
 *   error: string|null,
 *   updateProfile: (fields: Object) => Promise<void>
 * }}
 */
export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);

  // Încarcă profilul la montare sau când se schimbă userul
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProfile(user.id)
      .then((data) => { if (!cancelled) { setProfile(data); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, [user?.id]);

  /**
   * Actualizează profilul utilizatorului.
   * @param {{ nume?: string, avatar?: string }} fields
   */
  const updateProfile = useCallback(async (fields) => {
    if (!user) return;
    setError(null);
    try {
      const updated = await upsertProfile(user.id, fields);
      setProfile(updated);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user?.id]);

  return { profile, loading, error, updateProfile };
}
