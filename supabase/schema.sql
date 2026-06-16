-- ============================================================
--  WorldCupPredictor — Schema Supabase
--  Rulează în: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── 1. Tabelul users (profil public, legat de auth.users) ────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id             UUID         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nume           TEXT,
  avatar         TEXT,
  punctaj_total  INTEGER      NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.users IS 'Profil public al utilizatorilor autentificați';
COMMENT ON COLUMN public.users.punctaj_total IS 'Actualizat la finalizarea fiecărui meci cu rezultat real';

-- ── 2. Tabelul matches (meciurile fazei grupelor) ────────────────────────────
CREATE TABLE IF NOT EXISTS public.matches (
  id          TEXT        PRIMARY KEY,          -- format: 'A_0', 'B_3' etc.
  grupa       TEXT        NOT NULL,             -- 'A' .. 'L'
  match_idx   INTEGER     NOT NULL,             -- 0 .. 5
  t1          TEXT        NOT NULL,             -- ID echipă 1 (ex: 'mex')
  t2          TEXT        NOT NULL,             -- ID echipă 2 (ex: 'rsa')
  ora_start   TIMESTAMPTZ,                      -- UTC
  g1_real     INTEGER,                          -- goluri reale echipă 1 (null până la final)
  g2_real     INTEGER,                          -- goluri reale echipă 2 (null până la final)
  status      TEXT        NOT NULL DEFAULT 'scheduled',  -- 'scheduled' | 'finished'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT matches_status_check CHECK (status IN ('scheduled', 'finished'))
);

COMMENT ON TABLE  public.matches IS '72 meciuri din faza grupelor CM 2026';
COMMENT ON COLUMN public.matches.id IS 'Cheie text de tip A_0 — compatibil cu matchKey() din frontend';

-- ── 3. Tabelul predictions (predicțiile utilizatorilor) ─────────────────────
CREATE TABLE IF NOT EXISTS public.predictions (
  id          BIGSERIAL   PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES public.users(id)   ON DELETE CASCADE,
  match_id    TEXT        NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  g1_pred     INTEGER     NOT NULL CHECK (g1_pred >= 0),
  g2_pred     INTEGER     NOT NULL CHECK (g2_pred >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, match_id)  -- un user = o singură predicție per meci
);

COMMENT ON TABLE public.predictions IS 'Predicțiile de scor ale utilizatorilor';

-- Trigger: actualizează updated_at automat
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS predictions_updated_at ON public.predictions;
CREATE TRIGGER predictions_updated_at
  BEFORE UPDATE ON public.predictions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 4. Trigger: creare automată profil la înregistrare ───────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, nume, avatar)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 5. Row Level Security ────────────────────────────────────────────────────
ALTER TABLE public.users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- users: oricine poate citi, doar proprietarul poate insera/modifica
CREATE POLICY "users_select_all"
  ON public.users FOR SELECT USING (true);

CREATE POLICY "users_insert_own"
  ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE USING (auth.uid() = id);

-- matches: oricine autentificat poate citi (read-only)
CREATE POLICY "matches_select_authenticated"
  ON public.matches FOR SELECT USING (auth.role() = 'authenticated');

-- predictions: fiecare user vede și modifică doar ale lui
CREATE POLICY "predictions_select_own"
  ON public.predictions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "predictions_insert_own"
  ON public.predictions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "predictions_update_own"
  ON public.predictions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "predictions_delete_own"
  ON public.predictions FOR DELETE USING (auth.uid() = user_id);
