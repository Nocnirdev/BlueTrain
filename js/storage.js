/* =====================================================
   BlueTrain — js/storage.js
   Capa de abstracción sobre localStorage.
   Todos los módulos deben leer/escribir datos
   exclusivamente a través de este objeto.

   Preparado para migración futura a API REST:
   sustituir los métodos _get/_set por fetch().
   ===================================================== */

const Storage = {

  KEYS: {
    USER:             'bt_user',
    HISTORY:          'bt_history',
    WORKOUT_PROGRESS: 'bt_workout_progress',
    SESSION_START:    'bt_session_start'
  },

  /* ─── Primitivos ─── */

  _get(key) {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
  },

  _set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { console.warn('BlueTrain Storage write error:', e); return false; }
  },

  _remove(key) {
    try { localStorage.removeItem(key); return true; }
    catch { return false; }
  },

  /* ─── Usuario ─── */

  getUser() {
    return this._get(this.KEYS.USER);
  },

  saveUser(userData) {
    return this._set(this.KEYS.USER, {
      ...userData,
      updatedAt: new Date().toISOString()
    });
  },

  /* ─── Historial de sesiones ─── */

  getHistory() {
    return this._get(this.KEYS.HISTORY) || [];
  },

  addSession(session) {
    const history = this.getHistory();
    history.unshift(session);
    /* Límite: últimas 500 sesiones */
    return this._set(this.KEYS.HISTORY, history.slice(0, 500));
  },

  deleteSession(id) {
    const history = this.getHistory().filter(s => s.id !== id);
    return this._set(this.KEYS.HISTORY, history);
  },

  getSessionById(id) {
    return this.getHistory().find(s => s.id === id) || null;
  },

  /* ─── Progreso de ejercicios (checkboxes) ─── */

  getWorkoutProgress() {
    /* Migración desde clave legacy si existe */
    const legacy = this._get('bluetrain_progress');
    if (legacy && !this._get(this.KEYS.WORKOUT_PROGRESS)) {
      this._set(this.KEYS.WORKOUT_PROGRESS, legacy);
      this._remove('bluetrain_progress');
    }
    return this._get(this.KEYS.WORKOUT_PROGRESS) || {};
  },

  saveWorkoutProgress(data) {
    return this._set(this.KEYS.WORKOUT_PROGRESS, data);
  },

  /* ─── Temporizador de sesión activa ─── */

  startSessionTimer(workoutKey) {
    return this._set(this.KEYS.SESSION_START, {
      key: workoutKey,
      startedAt: Date.now()
    });
  },

  getSessionTimer() {
    return this._get(this.KEYS.SESSION_START);
  },

  clearSessionTimer() {
    return this._remove(this.KEYS.SESSION_START);
  },

  /* ─── Stats derivadas ─── */

  getTotalSessions() {
    return this.getHistory().length;
  },

  getWeeklySessions() {
    const now = new Date();
    /* Lunes de la semana actual */
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    return this.getHistory().filter(s => new Date(s.date + 'T12:00:00') >= monday).length;
  },

  getStreak() {
    const dates = [...new Set(this.getHistory().map(s => s.date))].sort().reverse();
    if (!dates.length) return 0;
    let streak = 0;
    let cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    for (const d of dates) {
      const date = new Date(d + 'T12:00:00');
      date.setHours(0, 0, 0, 0);
      const diffDays = Math.round((cursor - date) / 86400000);
      if (diffDays <= 1) { streak++; cursor = date; }
      else break;
    }
    return streak;
  },

  getTotalMinutes() {
    return this.getHistory().reduce((sum, s) => sum + (parseInt(s.duration) || 0), 0);
  },

  /* ─── Utilidades de exportación (futuro API) ─── */

  exportAll() {
    return {
      user:    this.getUser(),
      history: this.getHistory(),
      progress: this.getWorkoutProgress(),
      exportedAt: new Date().toISOString()
    };
  },

  clearAll() {
    Object.values(this.KEYS).forEach(k => this._remove(k));
  }

};
