import type { UserProfile, SessionEntry, WorkoutProgress, SessionTimer } from '@/types';

// Capa de persistencia local (localStorage).
// Usada como caché offline y para usuarios no autenticados.
// Los métodos están diseñados para ser sustituidos por llamadas DB.

const KEYS = {
  USER:             'bt_user',
  HISTORY:          'bt_history',
  WORKOUT_PROGRESS: 'bt_workout_progress',
  SESSION_START:    'bt_session_start',
  PERF_PREFIX:      'bt_perf_',
} as const;

function get<T>(key: string): T | null {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') as T; }
  catch { return null; }
}

function set(key: string, value: unknown): boolean {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (e) { console.warn('BlueTrain Storage write error:', e); return false; }
}

function remove(key: string): void {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}

export const LocalStorage = {

  // ── Usuario ──────────────────────────────────────────────

  getUser(): UserProfile | null {
    return get<UserProfile>(KEYS.USER);
  },

  saveUser(data: Omit<UserProfile, 'updatedAt'>): void {
    set(KEYS.USER, { ...data, updatedAt: new Date().toISOString() });
  },

  clearUser(): void {
    remove(KEYS.USER);
  },

  // ── Historial ─────────────────────────────────────────────

  getHistory(): SessionEntry[] {
    return get<SessionEntry[]>(KEYS.HISTORY) ?? [];
  },

  addSession(session: SessionEntry): void {
    const history = this.getHistory();
    history.unshift(session);
    set(KEYS.HISTORY, history.slice(0, 500));
  },

  deleteSession(id: string): void {
    set(KEYS.HISTORY, this.getHistory().filter(s => s.id !== id));
  },

  clearHistory(): void {
    remove(KEYS.HISTORY);
  },

  // ── Progreso de ejercicios ────────────────────────────────

  getWorkoutProgress(): WorkoutProgress {
    return get<WorkoutProgress>(KEYS.WORKOUT_PROGRESS) ?? {};
  },

  saveWorkoutProgress(data: WorkoutProgress): void {
    set(KEYS.WORKOUT_PROGRESS, data);
  },

  // ── Rendimiento por ejercicio (inputs en log modal) ───────

  getPerfInput(key: string): string {
    return get<string>(KEYS.PERF_PREFIX + key) ?? '';
  },

  savePerfInput(key: string, value: string): void {
    set(KEYS.PERF_PREFIX + key, value);
  },

  // ── Timer de sesión activa ────────────────────────────────

  startSessionTimer(workoutKey: string): void {
    set(KEYS.SESSION_START, { key: workoutKey, startedAt: Date.now() } satisfies SessionTimer);
  },

  getSessionTimer(): SessionTimer | null {
    return get<SessionTimer>(KEYS.SESSION_START);
  },

  clearSessionTimer(): void {
    remove(KEYS.SESSION_START);
  },

  // ── Stats derivadas ───────────────────────────────────────

  getTotalSessions(): number {
    return this.getHistory().length;
  },

  getWeeklySessions(): number {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    return this.getHistory().filter(s => new Date(s.date + 'T12:00:00') >= monday).length;
  },

  getStreak(): number {
    const dates = [...new Set(this.getHistory().map(s => s.date))].sort().reverse();
    if (!dates.length) return 0;
    let streak = 0;
    let cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    for (const d of dates) {
      const date = new Date(d + 'T12:00:00');
      date.setHours(0, 0, 0, 0);
      const diffDays = Math.round((cursor.getTime() - date.getTime()) / 86400000);
      if (diffDays <= 1) { streak++; cursor = date; }
      else break;
    }
    return streak;
  },

  getTotalMinutes(): number {
    return this.getHistory().reduce((sum, s) => sum + (s.duration || 0), 0);
  },

  // ── Exportar todo (migración a Supabase) ─────────────────

  exportAll() {
    return {
      user:      this.getUser(),
      history:   this.getHistory(),
      progress:  this.getWorkoutProgress(),
      exportedAt: new Date().toISOString(),
    };
  },

  clearAll(): void {
    Object.values(KEYS).forEach(k => remove(k as string));
  },
};
