import { supabase } from '@/lib/supabase';
import { LocalStorage } from './storage';
import { Auth } from './auth';
import type {
  LocalMigrationResult,
  SessionEntry,
  SyncQueueFlushResult,
  SyncQueueOperation,
  WorkoutProgress,
  WeightEntry,
} from '@/types';

// ── Capa de datos unificada ───────────────────────────────────
// Si el usuario está autenticado → Supabase.
// Si no → LocalStorage (modo demo / offline).

export const DB = {

  // ── Historial de sesiones ─────────────────────────────────

  async getHistory(): Promise<SessionEntry[]> {
    const { userId } = Auth.getState();
    if (!userId) return LocalStorage.getHistory();

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(500);

    if (error) { console.error(error); return LocalStorage.getHistory(); }
    return (data ?? []).map(_fromRow);
  },

  async addSession(session: SessionEntry): Promise<void> {
    const { userId } = Auth.getState();
    LocalStorage.addSession(session);
    if (!userId) return;
    if (_isOffline()) { _queue(userId, 'session_upsert', session); return; }

    const { error } = await supabase
      .from('sessions')
      .upsert(_toRow(session, userId), { onConflict: 'id', ignoreDuplicates: true });
    if (error) _queue(userId, 'session_upsert', session, error.message);
  },

  async deleteSession(id: string): Promise<void> {
    const { userId } = Auth.getState();
    LocalStorage.deleteSession(id);
    if (!userId) return;
    if (_isOffline()) { _queue(userId, 'session_delete', { sessionId: id }); return; }
    const { error } = await supabase.from('sessions').delete().eq('id', id).eq('user_id', userId);
    if (error) _queue(userId, 'session_delete', { sessionId: id }, error.message);
  },

  async clearTrainingData(): Promise<string | null> {
    const { userId } = Auth.getState();
    if (!userId) {
      LocalStorage.clearTrainingData();
      return null;
    }
    if (_isOffline()) return 'Necesitas conexión para borrar también la copia de tu cuenta.';

    const results = await Promise.all([
      supabase.from('sessions').delete().eq('user_id', userId),
      supabase.from('workout_progress').delete().eq('user_id', userId),
      supabase.from('weight_logs').delete().eq('user_id', userId),
    ]);
    if (results.some(({ error }) => error)) {
      return 'No se pudieron borrar todos los datos. No se ha eliminado la copia local.';
    }

    LocalStorage.clearTrainingData();
    LocalStorage.clearSyncQueueKinds(userId, ['session_upsert', 'session_delete', 'progress_upsert', 'weight_upsert']);
    return null;
  },

  // ── Progreso de ejercicios (checkboxes) ───────────────────

  async getWorkoutProgress(): Promise<WorkoutProgress> {
    const { userId } = Auth.getState();
    if (!userId) return LocalStorage.getWorkoutProgress();

    const { data, error } = await supabase
      .from('workout_progress')
      .select('session_key, completed_exercises')
      .eq('user_id', userId);

    if (error) { console.error(error); return LocalStorage.getWorkoutProgress(); }

    const result: WorkoutProgress = {};
    (data ?? []).forEach(row => {
      result[row.session_key as string] = row.completed_exercises as string[];
    });
    return result;
  },

  async saveWorkoutProgress(sessionKey: string, completedIds: string[]): Promise<void> {
    const { userId } = Auth.getState();
    const all = LocalStorage.getWorkoutProgress();
    all[sessionKey] = completedIds;
    LocalStorage.saveWorkoutProgress(all);

    if (!userId) return;
    if (_isOffline()) { _queue(userId, 'progress_upsert', { sessionKey, completedIds }); return; }
    const error = await _upsertProgress(userId, sessionKey, completedIds);
    if (error) _queue(userId, 'progress_upsert', { sessionKey, completedIds }, error);
  },

  // ── Stats derivadas ───────────────────────────────────────

  async getTotalSessions(): Promise<number> {
    const { userId } = Auth.getState();
    if (!userId) return LocalStorage.getTotalSessions();
    const { count, error } = await supabase
      .from('sessions').select('id', { count: 'exact', head: true }).eq('user_id', userId);
    if (error) { console.error(error); return LocalStorage.getTotalSessions(); }
    return count ?? 0;
  },

  async getWeeklySessions(): Promise<number> {
    const { userId } = Auth.getState();
    if (!userId) return LocalStorage.getWeeklySessions();
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const { count, error } = await supabase
      .from('sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('date', monday.toISOString().split('T')[0]);
    if (error) { console.error(error); return LocalStorage.getWeeklySessions(); }
    return count ?? 0;
  },

  async getStreak(): Promise<number> {
    const { userId } = Auth.getState();
    if (!userId) return LocalStorage.getStreak();
    const { data, error } = await supabase
      .from('sessions').select('date').eq('user_id', userId).order('date', { ascending: false });
    if (error) { console.error(error); return LocalStorage.getStreak(); }
    const dates = [...new Set((data ?? []).map(r => r.date as string))].sort().reverse();
    if (!dates.length) return 0;
    let streak = 0;
    let cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    for (const d of dates) {
      const date = new Date(d + 'T12:00:00');
      date.setHours(0, 0, 0, 0);
      if (Math.round((cursor.getTime() - date.getTime()) / 86400000) <= 1) { streak++; cursor = date; }
      else break;
    }
    return streak;
  },

  async getTotalMinutes(): Promise<number> {
    const { userId } = Auth.getState();
    if (!userId) return LocalStorage.getTotalMinutes();
    const { data, error } = await supabase.from('sessions').select('duration').eq('user_id', userId);
    if (error) { console.error(error); return LocalStorage.getTotalMinutes(); }
    return (data ?? []).reduce((sum, r) => sum + ((r.duration as number) || 0), 0);
  },

  // ── Seguimiento de cargas y medidas corporales ───────────

  async getAllWeightHistory(): Promise<Record<string, WeightEntry[]>> {
    const { userId } = Auth.getState();
    if (!userId) return LocalStorage.getAllWeightLog();

    const { data, error } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('recorded_at', { ascending: false })
      .limit(500);

    if (error) { console.error('DB.getAllWeightHistory:', error); return LocalStorage.getAllWeightLog(); }

    const result: Record<string, WeightEntry[]> = {};
    (data ?? []).forEach(row => {
      const key = row['exercise_key'] as string;
      if (!result[key]) result[key] = [];
      result[key]!.push(_weightFromRow(row));
    });
    return result;
  },

  async addWeightEntry(entry: WeightEntry): Promise<void> {
    LocalStorage.addWeightEntry(entry);

    const { userId } = Auth.getState();
    if (!userId) return;
    if (_isOffline()) { _queue(userId, 'weight_upsert', entry); return; }

    const { error } = await supabase.from('weight_logs').upsert({
      id:           entry.id,
      user_id:      userId,
      exercise_key: entry.exerciseKey,
      date:         entry.date,
      weight:       entry.weight,
      session_key:  entry.sessionKey ?? null,
      recorded_at:  entry.recordedAt,
    }, { onConflict: 'id', ignoreDuplicates: true });
    if (error) _queue(userId, 'weight_upsert', entry, error.message);
  },

  // ── Migración localStorage → Supabase ────────────────────

  async migrateLocalData(): Promise<LocalMigrationResult> {
    const result: LocalMigrationResult = { sessions: 0, progress: 0, weights: 0, errors: [] };
    const { userId } = Auth.getState();
    if (!userId) {
      result.errors.push('No hay una sesión activa para sincronizar los datos locales.');
      return result;
    }

    const localHistory = LocalStorage.getHistory();
    if (localHistory.length) {
      const rows = localHistory.map(s => _toRow(s, userId));
      const { error } = await supabase.from('sessions').upsert(rows, { onConflict: 'id', ignoreDuplicates: true });
      if (error) result.errors.push('No se pudieron sincronizar las sesiones.');
      else {
        result.sessions = localHistory.length;
        LocalStorage.clearSyncQueueKinds(userId, ['session_upsert']);
      }
    }

    const localProgress = LocalStorage.getWorkoutProgress();
    const progressEntries = Object.entries(localProgress);
    if (progressEntries.length) {
      const { data, error } = await supabase
        .from('workout_progress')
        .select('session_key, completed_exercises')
        .eq('user_id', userId);

      if (error) {
        result.errors.push('No se pudo sincronizar el progreso de ejercicios.');
      } else {
        const remoteProgress = new Map(
          (data ?? []).map(row => [
            row['session_key'] as string,
            (row['completed_exercises'] as string[] | null) ?? [],
          ])
        );
        const rows = progressEntries.map(([sessionKey, completedExercises]) => ({
          user_id: userId,
          session_key: sessionKey,
          completed_exercises: [...new Set([
            ...(remoteProgress.get(sessionKey) ?? []),
            ...completedExercises,
          ])],
          updated_at: new Date().toISOString(),
        }));
        const { error: upsertError } = await supabase
          .from('workout_progress')
          .upsert(rows, { onConflict: 'user_id,session_key' });
        if (upsertError) result.errors.push('No se pudo guardar el progreso de ejercicios.');
        else {
          result.progress = rows.length;
          LocalStorage.clearSyncQueueKinds(userId, ['progress_upsert']);
        }
      }
    }

    const localWeights = Object.values(LocalStorage.getAllWeightLog()).flat();
    if (localWeights.length) {
      const rows = localWeights.map(entry => ({
        id:           entry.id,
        user_id:      userId,
        exercise_key: entry.exerciseKey,
        date:         entry.date,
        weight:       entry.weight,
        session_key:  entry.sessionKey ?? null,
        recorded_at:  entry.recordedAt,
      }));
      const { error } = await supabase
        .from('weight_logs')
        .upsert(rows, { onConflict: 'id', ignoreDuplicates: true });
      if (error) result.errors.push('No se pudieron sincronizar los registros de carga y medidas corporales.');
      else {
        result.weights = rows.length;
        LocalStorage.clearSyncQueueKinds(userId, ['weight_upsert']);
      }
    }

    return result;
  },

  async flushPendingOperations(): Promise<SyncQueueFlushResult> {
    const result: SyncQueueFlushResult = { synced: 0, remaining: 0, errors: [] };
    const { userId } = Auth.getState();
    if (!userId) {
      result.errors.push('Inicia sesión para sincronizar los cambios pendientes.');
      return result;
    }
    if (_isOffline()) {
      result.remaining = LocalStorage.getPendingSyncCount(userId);
      return result;
    }

    const pending = LocalStorage.getSyncQueue(userId);
    const completedIds: string[] = [];
    for (const operation of pending) {
      const error = await _flushOperation(userId, operation);
      if (error) {
        result.errors.push(error);
        break;
      }
      completedIds.push(operation.id);
      result.synced++;
    }
    LocalStorage.removeSyncQueueItems(userId, completedIds);
    result.remaining = LocalStorage.getPendingSyncCount(userId);
    return result;
  },
};

function _isOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

function _queue<T extends SyncQueueOperation['kind']>(
  userId: string,
  kind: T,
  payload: Extract<SyncQueueOperation, { kind: T }>['payload'],
  reason?: string,
): void {
  const queuedAt = new Date().toISOString();
  const operation = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    userId,
    kind,
    payload,
    queuedAt,
  } as Extract<SyncQueueOperation, { kind: T }>;

  if (!LocalStorage.enqueueSyncOperation(operation)) {
    console.error('No se pudo guardar el cambio pendiente. Descarga una copia local antes de cerrar la aplicación.');
    return;
  }
  if (reason) console.warn('Cambio guardado para sincronizar después:', reason);
}

async function _upsertProgress(userId: string, sessionKey: string, completedIds: string[]): Promise<string | null> {
  const { data, error } = await supabase
    .from('workout_progress')
    .select('completed_exercises')
    .eq('user_id', userId)
    .eq('session_key', sessionKey)
    .maybeSingle();
  if (error) return error.message;

  const remoteIds = (data?.['completed_exercises'] as string[] | null) ?? [];
  const { error: upsertError } = await supabase.from('workout_progress').upsert({
    user_id: userId,
    session_key: sessionKey,
    completed_exercises: [...new Set([...remoteIds, ...completedIds])],
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,session_key' });
  return upsertError?.message ?? null;
}

async function _flushOperation(userId: string, operation: SyncQueueOperation): Promise<string | null> {
  switch (operation.kind) {
    case 'session_upsert': {
      const { error } = await supabase
        .from('sessions')
        .upsert(_toRow(operation.payload, userId), { onConflict: 'id', ignoreDuplicates: true });
      return error?.message ?? null;
    }
    case 'session_delete': {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', operation.payload.sessionId)
        .eq('user_id', userId);
      return error?.message ?? null;
    }
    case 'progress_upsert':
      return _upsertProgress(userId, operation.payload.sessionKey, operation.payload.completedIds);
    case 'weight_upsert': {
      const entry = operation.payload;
      const { error } = await supabase.from('weight_logs').upsert({
        id: entry.id,
        user_id: userId,
        exercise_key: entry.exerciseKey,
        date: entry.date,
        weight: entry.weight,
        session_key: entry.sessionKey ?? null,
        recorded_at: entry.recordedAt,
      }, { onConflict: 'id', ignoreDuplicates: true });
      return error?.message ?? null;
    }
  }
}

// ── Conversores ───────────────────────────────────────────────

function _weightFromRow(row: Record<string, unknown>): WeightEntry {
  return {
    id:          row['id'] as string,
    exerciseKey: row['exercise_key'] as string,
    date:        row['date'] as string,
    weight:      Number(row['weight']),
    sessionKey:  (row['session_key'] as string | null) ?? undefined,
    recordedAt:  row['recorded_at'] as string,
  };
}

function _toRow(s: SessionEntry, userId: string) {
  return {
    id: s.id,
    user_id: userId,
    session_key: s.sessionKey,
    workout_name: s.workoutName,
    type: s.type,
    mesocycle: s.mesocycle,
    duration: s.duration,
    rpe: s.rpe,
    notes: s.notes || null,
    performance: s.performance,
    completed_at: s.completedAt,
    date: s.date,
  };
}

function _fromRow(row: Record<string, unknown>): SessionEntry {
  return {
    id: row['id'] as string,
    userId: row['user_id'] as string,
    date: row['date'] as string,
    sessionKey: row['session_key'] as string,
    workoutName: row['workout_name'] as string,
    type: row['type'] as SessionEntry['type'],
    mesocycle: row['mesocycle'] as string,
    duration: row['duration'] as number,
    rpe: row['rpe'] as number,
    notes: (row['notes'] as string) || '',
    performance: (row['performance'] as Record<string, string>) || {},
    completedAt: row['completed_at'] as string,
  };
}
