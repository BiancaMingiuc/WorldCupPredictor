import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { upsertProfile } from "../lib/db";

const AuthContext = createContext(null);

/**
 * Se asigură că există un rând în public.users pentru userul autentificat.
 * Necessar pentru userii care s-au înregistrat înainte ca schema să existe.
 */
async function ensureProfile(user) {
  if (!user) return;
  try {
    await upsertProfile(user.id, {
      nume: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "",
      avatar: user.user_metadata?.avatar_url ?? null,
    });
  } catch {
    // Silențios — nu blocăm login-ul dacă profilul nu poate fi creat
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obține sesiunea curentă la montare
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      setLoading(false);
      ensureProfile(u); // garantează existența profilului
    });

    // Ascultă schimbările de stare auth (login / logout / refresh token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      setLoading(false);
      ensureProfile(u); // garantează existența profilului la fiecare login
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Funcții expuse ───────────────────────────────────────────────────────────

  async function signInWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signUpWithEmail(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  const value = {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook convenabil
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth trebuie folosit în interiorul <AuthProvider>");
  return ctx;
}
