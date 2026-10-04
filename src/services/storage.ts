import type {
  LocalDataBackup,
  LocalDataImportResult,
  LocalDataSummary,
  SessionEntry,
  SessionTimer,
  SyncQueueOperation,
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
  SYNC_QUEUE:       'bt_sync_queue_v1',
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

type JsonRecord = Record<string, unknown>;

const MAX_IMPORT_SESSIONS = 500;
const MAX_IMPORT_WEIGHTS = 5_000;
const MAX_IMPORT_PERFORMANCE = 500;
const MAX_PENDING_OPERATIONS = 500;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isText(value: unknown, maxLength = 1_000): value is string {
  return typeof value === 'string' && value.length <= maxLength;
}

function isDate(value: unknown): value is string {
  return isText(value, 40) && !Number.isNaN(Date.parse(value));
}

function isDateOnly(value: unknown): value is string {
  return isText(value, 10) && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00`));
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function readStringRecord(value: unknown, maxEntries: number, maxLength = 10_000): Record<string, string> | null {
  if (!isRecord(value) || Object.keys(value).length > maxEntries) return null;
  const result: Record<string, string> = {};
  for (const [key, item] of Object.entries(value)) {
    if (!isText(key, 160) || !isText(item, maxLength)) return null;
    result[key] = item;
  }
  return result;
}

function readProgress(value: unknown): WorkoutProgress | null {
  if (!isRecord(value) || Object.keys(value).length > 200) return null;
  const result: WorkoutProgress = {};
  for (const [sessionKey, ids] of Object.entries(value)) {
    if (!isText(sessionKey, 120) || !Array.isArray(ids) || ids.length > 500 || !ids.every(id => isText(id, 160))) return null;
    result[sessionKey] = [...new Set(ids)];
  }
  return result;
}

function readSession(value: unknown): SessionEntry | null {
  if (!isRecord(value)
    || !isText(value['id'], 160)
    || !isDateOnly(value['date'])
    || !isText(value['sessionKey'], 120)
    || !isText(value['workoutName'], 200)
    || !isText(value['mesocycle'], 120)
    || !isFiniteNumber(value['duration'])
    || !isFiniteNumber(value['rpe'])
    || !isText(value['notes'], 10_000)
    || !isDate(value['completedAt'])) return null;

  const type = value['type'];
  if (type !== 'strength' && type !== 'functional' && type !== 'circuit') return null;
  const performance = readStringRecord(value['performance'], 200, 2_000);
  if (!performance || value['duration'] < 0 || value['duration'] > 1_440 || value['rpe'] < 1 || value['rpe'] > 10) return null;

  return {
    id: value['id'],
    date: value['date'],
    sessionKey: value['sessionKey'],
    workoutName: value['workoutName'],
    type,
    mesocycle: value['mesocycle'],
    duration: value['duration'],
    rpe: value['rpe'],
    notes: value['notes'],
    performance,
    completedAt: value['completedAt'],
  };
}

function readWeight(value: unknown): WeightEntry | null {
  if (!isRecord(value)
    || !isText(value['id'], 160)
    || !isText(value['exerciseKey'], 160)
    || !isDateOnly(value['date'])
    || !isFiniteNumber(value['weight'])
    || !isDate(value['recordedAt'])
    || (value['sessionKey'] !== undefined && !isText(value['sessionKey'], 120))) return null;
  if (value['weight'] <= 0 || value['weight'] >= 1_000) return null;

  return {
    id: value['id'],
    exerciseKey: value['exerciseKey'],
    date: value['date'],
    weight: value['weight'],
    sessionKey: value['sessionKey'] as string | undefined,
    recordedAt: value['recordedAt'],
  };
}

function readUser(value: unknown): UserProfile | null | undefined {
  if (value === null) return null;
  if (!isRecord(value)
    || !isText(value['id'], 160)
    || !isText(value['name'], 120)
    || !isDate(value['createdAt'])
    || !isDate(value['updatedAt'])) return undefined;
  const goal = value['goal'];
  if (goal !== 'fat_loss' && goal !== 'hypertrophy' && goal !== 'performance') return undefined;
  return { id: value['id'], name: value['name'], goal, createdAt: value['createdAt'], updatedAt: value['updatedAt'] };
}

function readTimer(value: unknown): SessionTimer | null | undefined {
  if (value === null) return null;
  if (!isRecord(value) || !isText(value['key'], 120) || !isFiniteNumber(value['startedAt'])) return undefined;
  return { key: value['key'], startedAt: value['startedAt'] };
}

function readBackup(value: unknown): LocalDataBackup {
  if (!isRecord(value) || value['version'] !== 1 || !isDate(value['exportedAt']) || !Array.isArray(value['history'])) {
    throw new Error('El archivo no es una copia de BlueTrain compatible.');
  }
  if (value['history'].length > MAX_IMPORT_SESSIONS) throw new Error('La copia supera el límite de sesiones que podemos restaurar de forma segura.');

  const history = value['history'].map(readSession);
  const progress = readProgress(value['progress']);
  const performance = readStringRecord(value['performance'], MAX_IMPORT_PERFORMANCE, 10_000);
  const user = readUser(value['user']);
  const sessionTimer = readTimer(value['sessionTimer']);
  if (history.some(session => session === null) || !progress || !performance || user === undefined || sessionTimer === undefined) {
    throw new Error('La copia contiene datos incompletos o con un formato no válido.');
  }
  const parsedHistory = history as SessionEntry[];
  if (new Set(parsedHistory.map(session => session.id)).size !== parsedHistory.length) {
    throw new Error('La copia contiene sesiones duplicadas.');
  }

  if (!isRecord(value['weights'])) throw new Error('La copia contiene un registro de pesos no válido.');
  const weights: Record<string, WeightEntry[]> = {};
  const weightIds = new Set<string>();
  let weightCount = 0;
  for (const [exerciseKey, rawEntries] of Object.entries(value['weights'])) {
    if (!isText(exerciseKey, 160) || !Array.isArray(rawEntries) || rawEntries.length > 200) {
      throw new Error('La copia contiene un registro de pesos no válido.');
    }
    const entries = rawEntries.map(readWeight);
    if (entries.some(entry => entry === null) || entries.some(entry => entry?.exerciseKey !== exerciseKey)) {
      throw new Error('La copia contiene un registro de pesos no válido.');
    }
    weightCount += entries.length;
    if (weightCount > MAX_IMPORT_WEIGHTS) throw new Error('La copia supera el límite de pesos que podemos restaurar de forma segura.');
    const parsedEntries = entries as WeightEntry[];
    if (parsedEntries.some(entry => weightIds.has(entry.id))) throw new Error('La copia contiene pesos duplicados.');
    parsedEntries.forEach(entry => weightIds.add(entry.id));
    weights[exerciseKey] = parsedEntries;
  }

  return {
    version: 1,
    exportedAt: value['exportedAt'],
    user,
    history: parsedHistory,
    progress,
    weights,
    performance,
    sessionTimer,
  };
}

function queueTarget(operation: SyncQueueOperation): string {
  switch (operation.kind) {
    case 'session_upsert':
    case 'session_delete':
      return `session:${operation.userId}:${operation.kind === 'session_upsert' ? operation.payload.id : operation.payload.sessionId}`;
    case 'progress_upsert':
      return `progress:${operation.userId}:${operation.payload.sessionKey}`;
    case 'weight_upsert':
      return `weight:${operation.userId}:${operation.payload.id}`;
  }
}

function isQueueOperation(value: unknown): value is SyncQueueOperation {
  if (!isRecord(value) || !isText(value['id'], 160) || !isText(value['userId'], 160) || !isDate(value['queuedAt'])) return false;
  switch (value['kind']) {
    case 'session_upsert': return readSession(value['payload']) !== null;
    case 'session_delete': return isRecord(value['payload']) && isText(value['payload']['sessionId'], 160);
    case 'progress_upsert': return isRecord(value['payload'])
      && isText(value['payload']['sessionKey'], 120)
      && Array.isArray(value['payload']['completedIds'])
      && value['payload']['completedIds'].length <= 500
      && value['payload']['completedIds'].every(id => isText(id, 160));
    case 'weight_upsert': return readWeight(value['payload']) !== null;
    default: return false;
  }
}

function readQueue(): SyncQueueOperation[] {
  const queue = get<unknown>(KEYS.SYNC_QUEUE);
  return Array.isArray(queue) ? queue.filter(isQueueOperation) : [];
}

function notifyQueueChanged(): void {
  if (typeof document !== 'undefined') document.dispatchEvent(new Event('bt:syncQueueChanged'));
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

function getBackupSummary(backup: LocalDataBackup): LocalDataSummary {
  const completedExercises = Object.values(backup.progress).reduce((total, ids) => total + ids.length, 0);
  const weightEntries = Object.values(backup.weights).reduce((total, entries) => total + entries.length, 0);
  return {
    sessions: backup.history.length,
    completedExercises,
    weightEntries,
    performanceEntries: Object.keys(backup.performance).length,
    hasUser: backup.user !== null,
    hasActiveTimer: backup.sessionTimer !== null,
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

  getBackupPreview(value: unknown): LocalDataSummary {
    return getBackupSummary(readBackup(value));
  },

  importBackup(value: unknown): LocalDataImportResult {
    const backup = readBackup(value);
    const currentHistory = this.getHistory();
    const existingSessionIds = new Set(currentHistory.map(session => session.id));
    const importedSessions = backup.history.filter(session => !existingSessionIds.has(session.id));
    const mergedHistory = [...importedSessions, ...currentHistory]
      .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
      .slice(0, MAX_IMPORT_SESSIONS);
    set(KEYS.HISTORY, mergedHistory);

    const currentProgress = this.getWorkoutProgress();
    let importedCompletedExercises = 0;
    for (const [sessionKey, ids] of Object.entries(backup.progress)) {
      const existing = new Set(currentProgress[sessionKey] ?? []);
      importedCompletedExercises += ids.filter(id => !existing.has(id)).length;
    }
    this.saveWorkoutProgress(mergeProgress(backup.progress, currentProgress));

    const currentWeights = this.getAllWeightLog();
    const mergedWeights: Record<string, WeightEntry[]> = { ...currentWeights };
    let importedWeightEntries = 0;
    for (const [exerciseKey, incoming] of Object.entries(backup.weights)) {
      const current = currentWeights[exerciseKey] ?? [];
      const existing = new Set(current.map(entry => entry.id));
      const additions = incoming.filter(entry => !existing.has(entry.id));
      importedWeightEntries += additions.length;
      mergedWeights[exerciseKey] = [...additions, ...current]
        .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
        .slice(0, 200);
    }
    set(KEYS.WEIGHT_LOG, mergedWeights);

    const currentPerformance = this.getAllPerfInputs();
    let importedPerformanceEntries = 0;
    for (const [key, entry] of Object.entries(backup.performance)) {
      if (currentPerformance[key]) continue;
      this.savePerfInput(key, entry);
      importedPerformanceEntries++;
    }

    const restoredTimer = this.getSessionTimer() === null && backup.sessionTimer !== null;
    if (restoredTimer) set(KEYS.SESSION_START, backup.sessionTimer);

    return {
      ...getSummary(),
      importedSessions: importedSessions.length,
      importedCompletedExercises,
      importedWeightEntries,
      importedPerformanceEntries,
      restoredTimer,
    };
  },

  getSyncQueue(userId: string): SyncQueueOperation[] {
    return readQueue().filter(operation => operation.userId === userId);
  },

  getPendingSyncCount(userId: string): number {
    return this.getSyncQueue(userId).length;
  },

  enqueueSyncOperation(operation: SyncQueueOperation): boolean {
    const queue = readQueue();
    const target = queueTarget(operation);
    const index = queue.findIndex(item => queueTarget(item) === target);
    if (index === -1 && queue.length >= MAX_PENDING_OPERATIONS) return false;
    if (index === -1) queue.push(operation);
    else queue[index] = operation;
    set(KEYS.SYNC_QUEUE, queue);
    notifyQueueChanged();
    return true;
  },

  removeSyncQueueItems(userId: string, ids: string[]): void {
    if (!ids.length) return;
    const idSet = new Set(ids);
    set(KEYS.SYNC_QUEUE, readQueue().filter(operation => operation.userId !== userId || !idSet.has(operation.id)));
    notifyQueueChanged();
  },

  clearSyncQueueKinds(userId: string, kinds: SyncQueueOperation['kind'][]): void {
    const kindSet = new Set(kinds);
    set(KEYS.SYNC_QUEUE, readQueue().filter(operation => operation.userId !== userId || !kindSet.has(operation.kind)));
    notifyQueueChanged();
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
