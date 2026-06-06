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

    <div class="weekly-chart" aria-label="Actividad semanal">
      <div class="weekly-chart-title">
        Esta semana — ${esc(String(activeDaysCount))} ${activeDaysCount === 1 ? 'sesión' : 'sesiones'}
      </div>
      <div class="week-bars" role="img" aria-label="Gráfico de actividad semanal">
        ${weekBars}
      </div>
    </div>

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
  const rpeColor = s.rpe >= 9 ? 'var(--warn)' : s.rpe >= 7 ? 'var(--warmup)' : 'var(--ok)';
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
  const rpeColor = s.rpe >= 9 ? 'var(--warn)' : s.rpe >= 7 ? 'var(--warmup)' : 'var(--ok)';
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
  if (streak >= 5) return `Racha de ${streak} días. Imparable.`;
  if (weekSessions >= 3) return `${weekSessions} sesiones esta semana. Excelente.`;
  if (weekSessions === 0) return 'Hoy es un buen día para entrenar.';
  return `${weekSessions} sesión${weekSessions > 1 ? 'es' : ''} esta semana. Sigue así.`;
}
