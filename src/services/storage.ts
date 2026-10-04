import type {
  LocalDataBackup,
  LocalDataSummary,
  SessionEntry,
  SessionTimer,
  UserProfile,
  WeightEntry,
  WorkoutProgress,
} from '@/types';

// Capa de persistencia local (localStorage).
// Usada como caché offline y para usuarios no autenticados.
// Los métodos están diseñados para ser sustituidos por llamadas DB.

const KEYS = {
  USER:             'bt_user',
  HISTORY:          'bt_history',
  WORKOUT_PROGRESS: 'bt_workout_progress',
  SESSION_START:    'bt_session_start',
  PERF_PREFIX:      'bt_perf_',
  WEIGHT_LOG:       'bt_weights',
  LEGACY_PROGRESS:  'bluetrain_progress',
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

function getAllPerformanceInputs(): Record<string, string> {
  const inputs: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(KEYS.PERF_PREFIX)) continue;
      const value = get<string>(key);
      if (value !== null) inputs[key.slice(KEYS.PERF_PREFIX.length)] = value;
    }
  } catch { /* ignore */ }
  return inputs;
}

function mergeProgress(...sources: WorkoutProgress[]): WorkoutProgress {
  const merged: WorkoutProgress = {};
  for (const source of sources) {
    for (const [sessionKey, completedIds] of Object.entries(source)) {
      if (!Array.isArray(completedIds)) continue;
      merged[sessionKey] = [...new Set([...(merged[sessionKey] ?? []), ...completedIds])];
    }
  }
  return merged;
}

function getSummary(): LocalDataSummary {
  const history = LocalStorage.getHistory();
  const progress = LocalStorage.getWorkoutProgress();
  const weights = LocalStorage.getAllWeightLog();
  const performance = getAllPerformanceInputs();

  return {
    sessions: history.length,
    completedExercises: Object.values(progress).reduce((total, ids) => total + ids.length, 0),
    weightEntries: Object.values(weights).reduce((total, entries) => total + entries.length, 0),
    performanceEntries: Object.keys(performance).length,
    hasUser: LocalStorage.getUser() !== null,
    hasActiveTimer: LocalStorage.getSessionTimer() !== null,
  };
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
    const current = get<WorkoutProgress>(KEYS.WORKOUT_PROGRESS) ?? {};
    const legacy = get<WorkoutProgress>(KEYS.LEGACY_PROGRESS) ?? {};
    return mergeProgress(current, legacy);
  },

  saveWorkoutProgress(data: WorkoutProgress): void {
    const legacy = get<WorkoutProgress>(KEYS.LEGACY_PROGRESS) ?? {};
    set(KEYS.WORKOUT_PROGRESS, mergeProgress(data, legacy));
  },

  // ── Rendimiento por ejercicio (inputs en log modal) ───────

  getPerfInput(key: string): string {
    return get<string>(KEYS.PERF_PREFIX + key) ?? '';
  },

  getAllPerfInputs(): Record<string, string> {
    return getAllPerformanceInputs();
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

  // ── Seguimiento de pesos ─────────────────────────────────

  getAllWeightLog(): Record<string, WeightEntry[]> {
    return get<Record<string, WeightEntry[]>>(KEYS.WEIGHT_LOG) ?? {};
  },

  getWeightHistory(exerciseKey: string): WeightEntry[] {
    return this.getAllWeightLog()[exerciseKey] ?? [];
  },

  addWeightEntry(entry: WeightEntry): void {
    const all = this.getAllWeightLog();
    const arr = all[entry.exerciseKey] ?? [];
    arr.unshift(entry);
    all[entry.exerciseKey] = arr.slice(0, 200);
    set(KEYS.WEIGHT_LOG, all);
  },

  clearWeightLog(): void {
    remove(KEYS.WEIGHT_LOG);
  },

  // ── Copia local y recuperación ───────────────────────────

  getSummary(): LocalDataSummary {
    return getSummary();
  },

  hasRecoverableData(): boolean {
    const summary = getSummary();
    return summary.sessions > 0
      || summary.completedExercises > 0
      || summary.weightEntries > 0
      || summary.performanceEntries > 0
      || summary.hasUser
      || summary.hasActiveTimer;
  },

  exportAll(): LocalDataBackup {
    return {
      version: 1,
      user:      this.getUser(),
      history:   this.getHistory(),
      progress:  this.getWorkoutProgress(),
      weights:   this.getAllWeightLog(),
      performance: this.getAllPerfInputs(),
      sessionTimer: this.getSessionTimer(),
      exportedAt: new Date().toISOString(),
    };
  },

  downloadBackup(): LocalDataSummary {
    const backup = this.exportAll();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = backup.exportedAt.slice(0, 10);

    link.href = url;
    link.download = `bluetrain-copia-${date}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);

    return getSummary();
  },

  clearAll(): void {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.startsWith(KEYS.PERF_PREFIX) || Object.values(KEYS).includes(key as typeof KEYS[keyof typeof KEYS])) {
          remove(key);
        }
      }
    } catch { /* ignore */ }
  },
};
