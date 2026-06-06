/* =====================================================
   BlueTrain — js/tracker.js
   Registro y guardado de sesiones completadas.
   Gestiona el modal de log, el temporizador activo
   y la construcción del objeto de sesión.
   Depende de: js/storage.js, data/workouts.js
   ===================================================== */

let _elapsedInterval = null;

/* ─── Session timer ─── */

function startSessionTimer(workoutKey) {
  /* Sólo arranca si no hay ya una sesión activa */
  if (!Storage.getSessionTimer()) {
    Storage.startSessionTimer(workoutKey);
  }
  _startElapsedDisplay();
}

function _startElapsedDisplay() {
  if (_elapsedInterval) return;
  _updateElapsedDisplay();
  _elapsedInterval = setInterval(_updateElapsedDisplay, 30000); /* cada 30s */
}

function _updateElapsedDisplay() {
  const timer = Storage.getSessionTimer();
  if (!timer) return;
  const mins = Math.floor((Date.now() - timer.startedAt) / 60000);
  const strip = document.getElementById('sessionTimerStrip');
  if (strip) {
    strip.querySelector('.session-timer-value').textContent = mins + ' min';
  }
}

function stopElapsedDisplay() {
  if (_elapsedInterval) {
    clearInterval(_elapsedInterval);
    _elapsedInterval = null;
  }
}

/* ─── Log modal: apertura ─── */

function openLogModal(workoutKey) {
  const session = WORKOUTS_DATA[workoutKey];
  if (!session) return;

  /* Duración estimada */
  const timer = Storage.getSessionTimer();
  const elapsed = timer
    ? Math.round((Date.now() - timer.startedAt) / 60000)
    : parseInt(session.duration) || 60;

  /* Título y subtítulo */
  document.getElementById('logModalTitle').textContent = session.title;
  document.getElementById('logModalSub').textContent   = session.week + ' · ' + session.subtitle;

  /* Duración */
  document.getElementById('logDuration').value = elapsed;

  /* Performance: extraer los 3 primeros ejercicios de fuerza con RPE */
  _buildPerformanceInputs(session, workoutKey);

  /* RPE slider inicial */
  _updateRpeVal(document.getElementById('logRpe')?.value || 7);

  /* Porcentaje de completado */
  const done  = document.querySelectorAll('.exercise.done').length;
  const total = document.querySelectorAll('.exercise').length;
  const pct   = total ? Math.round((done / total) * 100) : 0;
  document.getElementById('logCompletionPct').textContent = pct + '%';

  /* Guardar referencia al workout key */
  document.getElementById('logModal').dataset.workoutKey = workoutKey;

  document.getElementById('logModal').classList.add('open');
}

function closeLogModal() {
  document.getElementById('logModal').classList.remove('open');
}

/* ─── Build performance inputs ─── */

function _buildPerformanceInputs(session, workoutKey) {
  const container = document.getElementById('logPerfInputs');
  if (!container) return;

  /* Buscar el bloque de fuerza */
  const strengthBlock = session.blocks.find(b => b.type === 'strength');
  if (!strengthBlock) { container.innerHTML = ''; return; }

  /* Tomar los 3 primeros ejercicios con RPE (los principales) */
  const keyExercises = strengthBlock.items.filter(ex => ex.rpe).slice(0, 3);

  if (!keyExercises.length) { container.innerHTML = ''; return; }

  container.innerHTML = keyExercises.map((ex, i) => {
    /* Nombre corto: quitar el prefijo "A1 · ", "B1 · ", etc. */
    const shortName = ex.name.replace(/^[A-C]\d+\s*·\s*/, '');
    const savedKey  = `${workoutKey}_ex${i}`;
    const saved     = Storage._get('bt_perf_' + savedKey) || '';
    return `
      <div class="perf-input-block">
        <div class="perf-name" title="${shortName}">${shortName}</div>
        <input class="log-input" id="perfInput${i}"
          type="text" placeholder="ej. 80 kg × 4"
          value="${saved}"
          aria-label="Rendimiento en ${shortName}">
      </div>`;
  }).join('');

  /* Guardar referencia para usarla al salvar */
  container.dataset.exercises = JSON.stringify(keyExercises.map(ex => ex.name));
}

/* ─── RPE slider ─── */

function _updateRpeVal(val) {
  const rpeEl = document.getElementById('logRpeVal');
  if (rpeEl) rpeEl.textContent = val;
}

/* ─── Guardar sesión ─── */

function saveLoggedSession() {
  const workoutKey = document.getElementById('logModal').dataset.workoutKey;
  const session    = WORKOUTS_DATA[workoutKey];
  if (!session) return;

  /* Performance data */
  const container   = document.getElementById('logPerfInputs');
  const exNames     = JSON.parse(container?.dataset.exercises || '[]');
  const performance = {};

  exNames.forEach((name, i) => {
    const val = document.getElementById('perfInput' + i)?.value?.trim();
    if (val) {
      const shortName = name.replace(/^[A-C]\d+\s*·\s*/, '');
      performance[shortName] = val;
    }
  });

  /* Tipo de sesión */
  const hasCompetition = session.blocks.some(b => b.type === 'competition');
  const hasStrength    = session.blocks.some(b => b.type === 'strength');
  const type = hasCompetition && hasStrength ? 'functional' :
               hasStrength ? 'strength' : 'functional';

  const entry = {
    id:          Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    date:        new Date().toISOString().split('T')[0],
    sessionKey:  workoutKey,
    workoutName: session.title,
    type,
    mesocycle:   session.week,
    duration:    parseInt(document.getElementById('logDuration')?.value) || 60,
    rpe:         parseInt(document.getElementById('logRpe')?.value) || 7,
    notes:       document.getElementById('logNotes')?.value?.trim() || '',
    performance,
    completedAt: new Date().toISOString()
  };

  Storage.addSession(entry);
  Storage.clearSessionTimer();
  stopElapsedDisplay();

  closeLogModal();

  /* Reset checkboxes de progreso (limpia la sesión para la próxima vez) */
  /* No borramos el progress guardado — solo el timer */

  showToast('✓ Sesión guardada en tu historial');

  /* Actualizar secciones si están visibles */
  if (document.getElementById('dashboardSection').classList.contains('active')) {
    renderDashboard();
  }
  if (document.getElementById('historySection').classList.contains('active')) {
    renderHistory();
  }
}

/* ─── Toast ─── */

let _toastTimeout = null;

function showToast(msg) {
  const el = document.getElementById('btToast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visible');
  if (_toastTimeout) clearTimeout(_toastTimeout);
  _toastTimeout = setTimeout(() => el.classList.remove('visible'), 3000);
}
