import { DB } from '@/services/db';
import { Auth } from '@/services/auth';
import { esc, formatDate, formatDateLong, $maybe } from '@/lib/html';
import type { SessionEntry } from '@/types';

export async function renderDashboard(): Promise<void> {
  const el = document.getElementById('dashboardSection');
  if (!el) return;

  el.innerHTML = _skeleton();

  const [history, totalSessions, weekSessions, streak, totalMins] = await Promise.all([
    DB.getHistory(),
    DB.getTotalSessions(),
    DB.getWeeklySessions(),
    DB.getStreak(),
    DB.getTotalMinutes(),
  ]);

  const { profile } = Auth.getState();
  const name = profile?.name ?? 'Atleta';
  const totalHours = (totalMins / 60).toFixed(1);

  // Contar días activos esta semana correctamente
  const today = new Date();
  const dayOfWeek = (today.getDay() + 6) % 7;
  const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  let activeDaysCount = 0;

  const weekBars = dayLabels.map((d, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - dayOfWeek + i);
    const dateStr = date.toISOString().split('T')[0];
    const sessions = history.filter(s => s.date === dateStr);
    const hasSession = sessions.length > 0;
    const isToday = i === dayOfWeek;
    if (hasSession) activeDaysCount++;

    return `<div class="week-bar-col">
      <div class="week-bar${hasSession ? ' active' : ''}${isToday ? ' today' : ''}"
           title="${hasSession ? esc(String(sessions.length)) + ' sesión(es)' : 'Sin entrenamiento'}">
      </div>
      <div class="week-day${isToday ? ' today' : ''}">${d}</div>
    </div>`;
  }).join('');

  const prog = _computeProgress(history);

  el.innerHTML = `
    <div class="dash-greeting">
      <div>
        <div class="dash-name">Hola, ${esc(name)}</div>
        <div class="dash-tagline">${esc(_motivationalMsg(weekSessions, streak))}</div>
      </div>
      <button class="user-avatar" id="avatarBtn" aria-label="Ver perfil">
        ${esc(name.charAt(0).toUpperCase())}
      </button>
    </div>

    <div class="stats-grid" role="list" aria-label="Estadísticas de entrenamiento">
      <div class="stat-card" role="listitem">
        <div class="stat-card-val">${esc(String(totalSessions))}</div>
        <div class="stat-card-label">Sesiones totales</div>
      </div>
      <div class="stat-card" role="listitem">
        <div class="stat-card-val">${esc(String(weekSessions))}</div>
        <div class="stat-card-label">Esta semana</div>
      </div>
      <div class="stat-card streak" role="listitem">
        <div class="stat-card-val">${esc(String(streak))}</div>
        <div class="stat-card-label">Racha de días</div>
      </div>
      <div class="stat-card time" role="listitem">
        <div class="stat-card-val">${esc(totalHours)}h</div>
        <div class="stat-card-label">Tiempo total</div>
      </div>
    </div>

    ${_quickActions()}

    <div class="weekly-chart" aria-label="Actividad semanal">
      <div class="weekly-chart-title">
        Esta semana — ${esc(String(activeDaysCount))} ${activeDaysCount === 1 ? 'sesión' : 'sesiones'}
      </div>
      <div class="week-bars" role="img" aria-label="Gráfico de actividad semanal">
        ${weekBars}
      </div>
    </div>

    ${_progressSection(prog)}

    ${history.length ? _lastSession(history[0]) : ''}
    ${history.length > 0 ? _recentFeed(history.slice(0, 5)) : _emptyCTA()}

    <div class="footer-info">BLUETRAIN · TRACKING DE RENDIMIENTO</div>`;

  $maybe('avatarBtn')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('bt:showProfile'));
  });
}

function _skeleton(): string {
  return `
    <div class="skeleton-greeting"></div>
    <div class="stats-grid">
      <div class="skeleton-card"></div><div class="skeleton-card"></div>
      <div class="skeleton-card"></div><div class="skeleton-card"></div>
    </div>
    <div class="skeleton-chart"></div>`;
}

function _lastSession(s: SessionEntry): string {
  const rpeColor = s.rpe >= 9 ? 'var(--error)' : s.rpe >= 7 ? 'var(--warning)' : 'var(--success)';
  return `
    <div class="section-title-bar"><h3>Último entrenamiento</h3></div>
    <div class="activity-item" style="margin-bottom:16px;" data-expandable>
      <div class="activity-row">
        <div class="activity-date-badge">${esc(formatDateLong(s.date))}</div>
        <div class="activity-info">
          <div class="activity-name">${esc(s.workoutName)}</div>
          <div class="activity-meta">
            <span class="activity-type" style="color:${_typeColor(s.type)}">${esc(s.type)}</span>
            <span class="activity-sep">·</span>
            <span>${esc(String(s.duration))} min</span>
            ${s.rpe ? `<span class="activity-sep">·</span><span style="color:${rpeColor}">RPE ${esc(String(s.rpe))}</span>` : ''}
          </div>
        </div>
        <div class="activity-chevron" aria-hidden="true">›</div>
      </div>
      <div class="activity-detail">
        ${_perfDetail(s.performance)}
        ${s.notes ? `<div class="activity-notes">"${esc(s.notes)}"</div>` : ''}
      </div>
    </div>`;
}

function _recentFeed(sessions: SessionEntry[]): string {
  return `
    <div class="section-title-bar">
      <h3>Actividad reciente</h3>
      <button class="source-badge" id="dashViewAll" style="cursor:pointer;">Ver todo →</button>
    </div>
    <div class="activity-feed">
      ${sessions.map(s => _activityItem(s, false)).join('')}
    </div>`;
}

function _emptyCTA(): string {
  return `
    <div class="dash-cta">
      <h3>Empieza tu primer entrenamiento</h3>
      <p>Registra sesiones para ver tu progreso aquí</p>
      <button class="btn-primary" id="dashGoTrain">Ver plan de entrenamiento</button>
    </div>`;
}

export function renderActivityItem(s: SessionEntry, showDelete: boolean): string {
  return _activityItem(s, showDelete);
}

function _activityItem(s: SessionEntry, showDelete: boolean): string {
  const rpeColor = s.rpe >= 9 ? 'var(--error)' : s.rpe >= 7 ? 'var(--warning)' : 'var(--success)';
  return `
    <div class="activity-item" data-expandable data-id="${esc(s.id)}">
      <div class="activity-row">
        <div class="activity-date-badge">${esc(formatDate(s.date))}</div>
        <div class="activity-info">
          <div class="activity-name">${esc(s.workoutName)}</div>
          <div class="activity-meta">
            <span class="activity-type" style="color:${_typeColor(s.type)}">${esc(s.type)}</span>
            <span class="activity-sep">·</span>
            <span>${esc(String(s.duration))} min</span>
            ${s.rpe ? `<span class="activity-sep">·</span><span style="color:${rpeColor}">RPE ${esc(String(s.rpe))}</span>` : ''}
          </div>
        </div>
        <div class="activity-chevron" aria-hidden="true">›</div>
      </div>
      <div class="activity-detail">
        ${_perfDetail(s.performance)}
        ${s.notes ? `<div class="activity-notes">"${esc(s.notes)}"</div>` : ''}
        ${showDelete ? `<button class="activity-delete" data-delete="${esc(s.id)}">Eliminar esta sesión</button>` : ''}
      </div>
    </div>`;
}

function _perfDetail(perf: Record<string, string>): string {
  if (!perf || !Object.keys(perf).length) return '';
  const chips = Object.entries(perf).map(([name, val]) => `
    <div class="perf-chip">
      <div class="perf-chip-label">${esc(name)}</div>
      <div class="perf-chip-val">${esc(val)}</div>
    </div>`).join('');
  return `<div class="perf-grid">${chips}</div>`;
}

function _typeColor(type: string): string {
  const map: Record<string, string> = {
    strength: 'var(--strength)',
    functional: 'var(--competition)',
    circuit: 'var(--finisher)',
  };
  return map[type] ?? 'var(--text-dim)';
}

function _motivationalMsg(weekSessions: number, streak: number): string {
  if (streak >= 5) return `${streak} días consecutivos de entrenamiento.`;
  if (weekSessions >= 3) return `${weekSessions} sesiones completadas esta semana.`;
  if (weekSessions === 0) return 'Sin sesiones esta semana.';
  return `${weekSessions} sesión${weekSessions > 1 ? 'es' : ''} esta semana.`;
}

// ── Accesos Rápidos ───────────────────────────────────────────

function _quickActions(): string {
  return `
    <div class="section-title-bar"><h3>Accesos rápidos</h3></div>
    <div class="quick-actions">
      <button class="quick-btn" id="qaGoTrain" aria-label="Ir a Entrena">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        <span>Entrena</span>
      </button>
      <button class="quick-btn" id="qaGoCompetition" aria-label="Ir a Competición">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
          <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
        </svg>
        <span>Competición</span>
      </button>
      <button class="quick-btn" id="qaGoNutrition" aria-label="Ir a Nutrición">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
        <span>Nutrición</span>
      </button>
      <button class="quick-btn" id="qaGoHistory" aria-label="Ir a Historial">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <span>Historial</span>
      </button>
    </div>`;
}

// ── Progreso semanal / mensual / anual ────────────────────────

interface _Progress {
  thisWeek: number; lastWeek: number;
  thisMonth: number; lastMonth: number;
  thisYear: number; lastYear: number;
}

function _computeProgress(history: SessionEntry[]): _Progress {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dow = (today.getDay() + 6) % 7; // lun=0
  const thisWeekStart  = new Date(today); thisWeekStart.setDate(today.getDate() - dow);
  const lastWeekStart  = new Date(thisWeekStart); lastWeekStart.setDate(thisWeekStart.getDate() - 7);
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const thisYearStart  = new Date(today.getFullYear(), 0, 1);
  const lastYearStart  = new Date(today.getFullYear() - 1, 0, 1);

  const p: _Progress = { thisWeek: 0, lastWeek: 0, thisMonth: 0, lastMonth: 0, thisYear: 0, lastYear: 0 };

  history.forEach(s => {
    const d = new Date(s.date + 'T12:00:00');
    if (d >= thisWeekStart)                        p.thisWeek++;
    else if (d >= lastWeekStart)                   p.lastWeek++;
    if (d >= thisMonthStart)                       p.thisMonth++;
    else if (d >= lastMonthStart && d < thisMonthStart) p.lastMonth++;
    if (d >= thisYearStart)                        p.thisYear++;
    else if (d >= lastYearStart && d < thisYearStart)   p.lastYear++;
  });

  return p;
}

function _delta(cur: number, prev: number): { text: string; cls: string } {
  if (prev === 0 && cur === 0) return { text: '—', cls: 'delta-same' };
  if (prev === 0)              return { text: 'Nuevo', cls: 'delta-up' };
  const pct = Math.round(((cur - prev) / prev) * 100);
  if (pct === 0) return { text: 'igual que antes', cls: 'delta-same' };
  if (pct > 0)   return { text: `+${pct}% vs anterior`, cls: 'delta-up' };
  return { text: `${pct}% vs anterior`, cls: 'delta-down' };
}

function _progressSection(p: _Progress): string {
  const week  = _delta(p.thisWeek,  p.lastWeek);
  const month = _delta(p.thisMonth, p.lastMonth);
  const year  = _delta(p.thisYear,  p.lastYear);

  return `
    <div class="section-title-bar"><h3>Progreso</h3></div>
    <div class="progress-section">
      <div class="progress-card">
        <div class="progress-label">Esta semana</div>
        <div class="progress-val">${p.thisWeek}</div>
        <div class="progress-sub">sesiones</div>
        <div class="progress-delta ${esc(week.cls)}">${esc(week.text)}</div>
      </div>
      <div class="progress-card">
        <div class="progress-label">Este mes</div>
        <div class="progress-val">${p.thisMonth}</div>
        <div class="progress-sub">sesiones</div>
        <div class="progress-delta ${esc(month.cls)}">${esc(month.text)}</div>
      </div>
      <div class="progress-card">
        <div class="progress-label">Este año</div>
        <div class="progress-val">${p.thisYear}</div>
        <div class="progress-sub">sesiones</div>
        <div class="progress-delta ${esc(year.cls)}">${esc(year.text)}</div>
      </div>
    </div>`;
}
