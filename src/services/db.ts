import { supabase } from '@/lib/supabase';
import { LocalStorage } from './storage';
import { Auth } from './auth';
import type { SessionEntry, WorkoutProgress } from '@/types';

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
    if (!userId) { LocalStorage.addSession(session); return; }

    const { error } = await supabase.from('sessions').insert(_toRow(session, userId));
    if (error) console.error('DB.addSession error:', error);
    // También cache local para velocidad
    LocalStorage.addSession(session);
  },

  async deleteSession(id: string): Promise<void> {
    const { userId } = Auth.getState();
    LocalStorage.deleteSession(id);
    if (!userId) return;
    const { error } = await supabase.from('sessions').delete().eq('id', id).eq('user_id', userId);
    if (error) console.error('DB.deleteSession error:', error);
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
    const { error } = await supabase.from('workout_progress').upsert({
      user_id: userId,
      session_key: sessionKey,
      completed_exercises: completedIds,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,session_key' });
    if (error) console.error('DB.saveWorkoutProgress error:', error);
  },

  // ── Stats derivadas ───────────────────────────────────────

  async getTotalSessions(): Promise<number> {
    const { userId } = Auth.getState();
    if (!userId) return LocalStorage.getTotalSessions();
    const { count } = await supabase
      .from('sessions').select('id', { count: 'exact', head: true }).eq('user_id', userId);
    return count ?? 0;
  },

  async getWeeklySessions(): Promise<number> {
    const { userId } = Auth.getState();
    if (!userId) return LocalStorage.getWeeklySessions();
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from('sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('date', monday.toISOString().split('T')[0]);
    return count ?? 0;
  },

  async getStreak(): Promise<number> {
    const { userId } = Auth.getState();
    if (!userId) return LocalStorage.getStreak();
    const { data } = await supabase
      .from('sessions').select('date').eq('user_id', userId).order('date', { ascending: false });
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
    const { data } = await supabase.from('sessions').select('duration').eq('user_id', userId);
    return (data ?? []).reduce((sum, r) => sum + ((r.duration as number) || 0), 0);
  },

  // ── Migración localStorage → Supabase ────────────────────

  async migrateLocalData(): Promise<number> {
    const { userId } = Auth.getState();
    if (!userId) return 0;
    const localHistory = LocalStorage.getHistory();
    if (!localHistory.length) return 0;

    const rows = localHistory.map(s => _toRow(s, userId));
    const { error } = await supabase.from('sessions').upsert(rows, { onConflict: 'id', ignoreDuplicates: true });
    if (error) { console.error('Migration error:', error); return 0; }
    return localHistory.length;
  },
};

// ── Conversores ───────────────────────────────────────────────

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
