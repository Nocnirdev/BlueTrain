-- ================================================================
-- BlueTrain — Schema Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
-- ================================================================

-- Tabla: sesiones de entrenamiento
CREATE TABLE IF NOT EXISTS public.sessions (
  id            TEXT        PRIMARY KEY,
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_key   TEXT        NOT NULL,
  workout_name  TEXT        NOT NULL,
  type          TEXT        NOT NULL CHECK (type IN ('strength', 'functional', 'circuit')),
  mesocycle     TEXT,
  duration      INTEGER     NOT NULL CHECK (duration > 0),
  rpe           INTEGER     CHECK (rpe BETWEEN 1 AND 10),
  notes         TEXT,
  performance   JSONB       DEFAULT '{}',
  date          DATE        NOT NULL DEFAULT CURRENT_DATE,
  completed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: progreso de ejercicios (checkboxes)
CREATE TABLE IF NOT EXISTS public.workout_progress (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_key         TEXT        NOT NULL,
  completed_exercises TEXT[]      NOT NULL DEFAULT '{}',
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, session_key)
);

-- Índices de rendimiento
CREATE INDEX IF NOT EXISTS idx_sessions_user_date    ON public.sessions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_user_type    ON public.sessions(user_id, type);
CREATE INDEX IF NOT EXISTS idx_progress_user_session ON public.workout_progress(user_id, session_key);

-- ── Row Level Security ──────────────────────────────────────────

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_progress ENABLE ROW LEVEL SECURITY;

-- Sessions: cada usuario solo ve y modifica sus datos
CREATE POLICY "sessions_select" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "sessions_insert" ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sessions_delete" ON public.sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Workout progress: ídem
CREATE POLICY "progress_select" ON public.workout_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "progress_upsert" ON public.workout_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "progress_update" ON public.workout_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- ── Función: updated_at automático ─────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_progress_updated_at
  BEFORE UPDATE ON public.workout_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
