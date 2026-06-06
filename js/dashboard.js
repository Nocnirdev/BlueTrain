/* =====================================================
   BlueTrain — js/dashboard.js
   Renderizado del Dashboard y el Historial de actividad.
   Depende de: js/storage.js, js/user.js, js/tracker.js
   ===================================================== */

/* ─── Dashboard ─── */

function renderDashboard() {
  const el      = document.getElementById('dashboardSection');
  const user    = Storage.getUser();
  const history = Storage.getHistory();

  const totalSessions = Storage.getTotalSessions();
  const weekSessions  = Storage.getWeeklySessions();
  const streak        = Storage.getStreak();
  const totalHours    = (Storage.getTotalMinutes() / 60).toFixed(1);

  el.innerHTML = `
    <!-- Greeting -->
    <div class="dash-greeting">
      <div>
        <div class="dash-name" id="dashGreeting">
          ${user ? 'Hola, ' + user.name : 'Bienvenido a BlueTrain'}
        </div>
        <div class="dash-tagline">
          ${_getMotivationalMessage(weekSessions, streak)}
        </div>
      </div>
      <button class="user-avatar" onclick="showUserModal()" aria-label="Ver perfil">
        ${user ? user.name.charAt(0).toUpperCase() : '?'}
      </button>
    </div>

    <!-- Stats grid -->
    <div class="stats-grid" role="list" aria-label="Estadísticas de entrenamiento">
      <div class="stat-card" role="listitem">
        <div class="stat-card-val">${totalSessions}</div>
        <div class="stat-card-label">Sesiones totales</div>
      </div>
      <div class="stat-card" role="listitem">
        <div class="stat-card-val">${weekSessions}</div>
        <div class="stat-card-label">Esta semana</div>
      </div>
      <div class="stat-card streak" role="listitem">
        <div class="stat-card-val">${streak}</div>
        <div class="stat-card-label">Racha de días</div>
      </div>
      <div class="stat-card time" role="listitem">
        <div class="stat-card-val">${totalHours}h</div>
        <div class="stat-card-label">Tiempo total</div>
      </div>
    </div>

    <!-- Weekly chart -->
    ${_renderWeeklyChart(history)}

    <!-- Last session highlight -->
    ${history.length ? _renderLastSession(history[0]) : ''}

    <!-- Recent activity -->
    ${history.length > 0 ? _renderDashFeed(history.slice(0, 5)) : _renderEmptyDash()}

    <div class="footer-info">BLUETRAIN · TRACKING DE RENDIMIENTO</div>`;
}

/* ─── Weekly chart ─── */

function _renderWeeklyChart(history) {
  const today      = new Date();
  const dayOfWeek  = (today.getDay() + 6) % 7; /* 0=Mon, 6=Sun */
  const dayLabels  = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  const bars = dayLabels.map((d, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - dayOfWeek + i);
    const dateStr   = date.toISOString().split('T')[0];
    const sessions  = history.filter(s => s.date === dateStr);
    const hasSession = sessions.length > 0;
    const isToday    = i === dayOfWeek;

    return `<div class="week-bar-col">
      <div class="week-bar ${hasSession ? 'active' : ''} ${isToday ? 'today' : ''}"
           title="${hasSession ? sessions.length + ' sesión(es)' : 'Sin entrenamiento'}">
      </div>
      <div class="week-day ${isToday ? 'today' : ''}">${d}</div>
    </div>`;
  }).join('');

  const weekTotal = bars.split('active').length - 1;
  return `
    <div class="weekly-chart" aria-label="Actividad semanal">
      <div class="weekly-chart-title">
        Esta semana — ${weekTotal} ${weekTotal === 1 ? 'sesión' : 'sesiones'}
      </div>
      <div class="week-bars" role="img" aria-label="Gráfico de actividad semanal">
        ${bars}
      </div>
    </div>`;
}

/* ─── Last session highlight ─── */

function _renderLastSession(s) {
  const date = new Date(s.date + 'T12:00:00');
  const dateStr = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const rpeColor = s.rpe >= 9 ? 'var(--warn)' : s.rpe >= 7 ? 'var(--warmup)' : 'var(--ok)';

  return `
    <div class="section-title-bar">
      <h3>Último entrenamiento</h3>
    </div>
    <div class="activity-item" style="margin-bottom:16px;" onclick="this.classList.toggle('expanded')">
      <div class="activity-row">
        <div class="activity-date-badge">${dateStr}</div>
        <div class="activity-info">
          <div class="activity-name">${s.workoutName}</div>
          <div class="activity-meta">
            <span class="activity-type" style="color:${_typeColor(s.type)}">${s.type}</span>
            <span class="activity-sep">·</span>
            <span>${s.duration} min</span>
            ${s.rpe ? `<span class="activity-sep">·</span><span style="color:${rpeColor}">RPE ${s.rpe}</span>` : ''}
          </div>
        </div>
        <div class="activity-chevron">›</div>
      </div>
      <div class="activity-detail">
        ${_renderPerformanceDetail(s.performance)}
        ${s.notes ? `<div class="activity-notes">"${s.notes}"</div>` : ''}
      </div>
    </div>`;
}

/* ─── Dashboard activity feed (últimas 5) ─── */

function _renderDashFeed(sessions) {
  return `
    <div class="section-title-bar">
      <h3>Actividad reciente</h3>
      <button class="source-badge" onclick="switchView('history')" style="cursor:pointer;">
        Ver todo →
      </button>
    </div>
    <div class="activity-feed">
      ${sessions.map(s => _renderActivityItem(s, false)).join('')}
    </div>`;
}

function _renderEmptyDash() {
  return `
    <div class="dash-cta">
      <h3>Empieza tu primer entrenamiento</h3>
      <p>Registra sesiones para ver tu progreso aquí</p>
      <button class="btn-primary" onclick="switchView('training')">Ver plan de entrenamiento</button>
    </div>`;
}

/* ─── History section ─── */

let _historyFilter = 'all';

function renderHistory() {
  const el      = document.getElementById('historySection');
  const history = Storage.getHistory();

  const filtered = _historyFilter === 'all'
    ? history
    : history.filter(s => s.type === _historyFilter);

  el.innerHTML = `
    <div class="section-hero nutrition-hero" style="margin-bottom:16px;">
      <h2>Historial</h2>
      <p>${history.length} sesión${history.length !== 1 ? 'es' : ''} registrada${history.length !== 1 ? 's' : ''}
         · ${(Storage.getTotalMinutes() / 60).toFixed(1)}h de entrenamiento total</p>
    </div>

    <div class="history-filters" role="group" aria-label="Filtros de historial">
      ${_renderFilterChips()}
    </div>

    ${filtered.length === 0
      ? `<div class="empty-state">
           <div class="empty-state-icon">📋</div>
           <h3>${history.length ? 'Sin resultados' : 'Sin sesiones aún'}</h3>
           <p>${history.length
               ? 'No hay sesiones de tipo "' + _historyFilter + '"'
               : 'Completa tu primer entrenamiento para verlo aquí'}</p>
         </div>`
      : `<div class="activity-feed">
           ${filtered.map(s => _renderActivityItem(s, true)).join('')}
         </div>`
    }
    <div class="footer-info">BLUETRAIN · ${history.length} SESIONES REGISTRADAS</div>`;
}

function setHistoryFilter(filter) {
  _historyFilter = filter;
  renderHistory();
}

function _renderFilterChips() {
  const filters = [
    { val: 'all',        label: 'Todas' },
    { val: 'strength',   label: 'Fuerza' },
    { val: 'functional', label: 'Funcional' }
  ];
  return filters.map(f => `
    <button class="filter-chip ${_historyFilter === f.val ? 'active' : ''}"
            onclick="setHistoryFilter('${f.val}')">
      ${f.label}
    </button>`).join('');
}

/* ─── Activity item (shared) ─── */

function _renderActivityItem(s, showDelete) {
  const date    = new Date(s.date + 'T12:00:00');
  const dateStr = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  const rpeColor = s.rpe >= 9 ? 'var(--warn)' : s.rpe >= 7 ? 'var(--warmup)' : 'var(--ok)';

  return `
    <div class="activity-item" onclick="this.classList.toggle('expanded')">
      <div class="activity-row">
        <div class="activity-date-badge">${dateStr}</div>
        <div class="activity-info">
          <div class="activity-name">${s.workoutName}</div>
          <div class="activity-meta">
            <span class="activity-type" style="color:${_typeColor(s.type)}">${s.type}</span>
            <span class="activity-sep">·</span>
            <span>${s.duration} min</span>
            ${s.rpe ? `<span class="activity-sep">·</span>
              <span style="color:${rpeColor}">RPE ${s.rpe}</span>` : ''}
          </div>
        </div>
        <div class="activity-chevron">›</div>
      </div>
      <div class="activity-detail">
        ${_renderPerformanceDetail(s.performance)}
        ${s.notes ? `<div class="activity-notes">"${s.notes}"</div>` : ''}
        ${showDelete ? `<button class="activity-delete"
            onclick="event.stopPropagation(); deleteHistoryEntry('${s.id}')">
            Eliminar esta sesión
          </button>` : ''}
      </div>
    </div>`;
}

function deleteHistoryEntry(id) {
  if (!confirm('¿Eliminar esta sesión del historial?')) return;
  Storage.deleteSession(id);
  renderHistory();
  if (document.getElementById('dashboardSection').classList.contains('active')) {
    renderDashboard();
  }
  showToast('Sesión eliminada');
}

/* ─── Performance detail ─── */

function _renderPerformanceDetail(perf) {
  if (!perf || !Object.keys(perf).length) return '';
  const chips = Object.entries(perf).map(([name, val]) => `
    <div class="perf-chip">
      <div class="perf-chip-label">${name}</div>
      <div class="perf-chip-val">${val}</div>
    </div>`).join('');
  return `<div class="perf-grid">${chips}</div>`;
}

/* ─── Helpers ─── */

function _typeColor(type) {
  const map = { strength: 'var(--strength)', functional: 'var(--competition)', circuit: 'var(--finisher)' };
  return map[type] || 'var(--text-dim)';
}

function _getMotivationalMessage(weekSessions, streak) {
  if (streak >= 5)       return `🔥 Racha de ${streak} días. ¡Imparable!`;
  if (weekSessions >= 3) return `💪 ${weekSessions} sesiones esta semana. ¡Excelente!`;
  if (weekSessions === 0) return 'Hoy es un buen día para entrenar.';
  return `${weekSessions} sesión${weekSessions > 1 ? 'es' : ''} esta semana. Sigue así.`;
}
