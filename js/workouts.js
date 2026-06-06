/* =====================================================
   BlueTrain — js/workouts.js
   Renderizado de sesiones, progreso de ejercicios
   y botón de finalización de sesión.
   Depende de: data/animations.js, data/workouts.js,
               js/storage.js, js/tracker.js
   ===================================================== */

let currentSession = 'A1';
let firstRender = true;

/* ─── Render session ─── */

function renderSession(key) {
  const session = WORKOUTS_DATA[key];
  if (!session) return;
  const main = document.getElementById('mainContent');

  /* Arrancar temporizador de sesión */
  startSessionTimer(key);

  let html = `
    <!-- Timer strip -->
    <div class="session-timer-strip" id="sessionTimerStrip">
      <span class="session-timer-label">Sesión en curso</span>
      <span class="session-timer-value">0 min</span>
    </div>

    <!-- Session hero -->
    <div class="session-hero">
      <div class="session-meta">
        <span class="pill">${session.week}</span>
        <span class="pill">${session.duration}</span>
      </div>
      <h1 class="session-title">${session.title}</h1>
      <p class="session-subtitle">${session.subtitle}</p>
      <div class="session-stats">
        <div class="stat">
          <div class="stat-label">Bloques</div>
          <div class="stat-value">${session.blocks.length}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Foco</div>
          <div class="stat-value" style="font-size:14px;">${session.focus}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Duración</div>
          <div class="stat-value">${session.duration}</div>
        </div>
      </div>
    </div>`;

  if (firstRender) {
    html += `<div class="info-banner">
      <strong>Animaciones en bucle:</strong> visualiza cada movimiento sin conexión.
      Cuando termines, pulsa <strong>Finalizar sesión</strong> para guardar en tu historial.
    </div>`;
    firstRender = false;
  }

  /* Bloques */
  session.blocks.forEach((block, bIdx) => {
    html += `
      <section class="block" data-type="${block.type}">
        <div class="block-header">
          <div class="block-num">${bIdx + 1}</div>
          <h2 class="block-title">${block.title}</h2>
          <span class="block-duration">${block.duration}</span>
        </div>`;

    if (block.note) html += `<div class="note">${block.note}</div>`;

    if (block.protocol) {
      const isFinisher = block.type === 'finisher';
      html += `
        <div class="protocol-card ${isFinisher ? 'finisher-style' : ''}">
          <div class="protocol-header">
            <div class="protocol-name">${block.protocol.name}</div>
            <div class="protocol-time">${block.protocol.time}</div>
          </div>
          <ol class="protocol-list">
            ${block.protocol.items.map((item, i) =>
              `<li><span class="num">${String(i + 1).padStart(2, '0')}</span> ${item}</li>`
            ).join('')}
          </ol>
        </div>`;
    }

    block.items.forEach((ex, eIdx) => {
      const exId = `${key}-${bIdx}-${eIdx}`;
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.searchQuery || ex.name + ' tutorial')}`;
      const animSvg = ANIMS[ex.anim] || ANIMS['generic'];

      const blockLabel = {
        warmup:      'CALENT.',
        strength:    'FUERZA',
        competition: 'COMPET.',
        finisher:    'FINISHER',
        cooldown:    'COOLDOWN'
      }[block.type] || block.type.toUpperCase();

      html += `
        <div class="exercise" id="ex-${exId}" data-id="${exId}">
          <div class="ex-row" onclick="toggleExercise('${exId}', event)">
            <div class="checkbox"
                 onclick="toggleDone('${exId}', event)"
                 role="checkbox" aria-checked="false"
                 aria-label="Marcar ${ex.name} completado">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="#000" stroke-width="4" stroke-linecap="round"
                   stroke-linejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div class="ex-main">
              <h3 class="ex-name">${ex.name}</h3>
              <div class="ex-prescription">
                ${ex.prescription}
                ${ex.rest ? `<span class="sep">·</span>Descanso ${ex.rest}` : ''}
              </div>
            </div>
            ${ex.rpe ? `<span class="ex-rpe">${ex.rpe}</span>` : ''}
            <div class="ex-toggle" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2.5"
                   stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
          <div class="ex-details">
            <div class="anim-section">
              <div class="anim-stage">
                <div class="anim-label">${blockLabel}</div>
                <div class="anim-counter">LOOP</div>
                ${animSvg}
              </div>
              <div class="video-actions">
                <a class="video-btn" href="${searchUrl}"
                   target="_blank" rel="noopener noreferrer">🔍 Ver vídeo real</a>
                <a class="video-btn" href="${searchUrl}+español"
                   target="_blank" rel="noopener noreferrer">🌐 En español</a>
              </div>
            </div>
            ${ex.cues && ex.cues.length ? `
              <div class="cues">
                <div class="cues-title">Puntos clave</div>
                <ul>${ex.cues.map(c => `<li>${c}</li>`).join('')}</ul>
              </div>` : ''}
          </div>
        </div>`;
    });

    html += `</section>`;
  });

  /* Botón finalizar sesión */
  html += `
    <div class="session-elapsed" id="finishElapsed"></div>
    <button class="finish-session-btn" onclick="openLogModal('${key}')"
            aria-label="Finalizar y guardar sesión">
      Finalizar sesión
    </button>
    <div class="footer-info">BLUETRAIN · ${key} · ${session.duration}</div>`;

  main.innerHTML = html;
  loadProgress();
  updateProgress();
  _startElapsedDisplay();
}

/* ─── Exercise interaction ─── */

function toggleExercise(id, e) {
  if (e && e.target.closest('.checkbox')) return;
  document.getElementById('ex-' + id).classList.toggle('expanded');
}

function toggleDone(id, e) {
  e.stopPropagation();
  const el = document.getElementById('ex-' + id);
  el.classList.toggle('done');
  el.querySelector('.checkbox').setAttribute(
    'aria-checked',
    el.classList.contains('done') ? 'true' : 'false'
  );
  saveProgress();
  updateProgress();
}

/* ─── Progress ─── */

function updateProgress() {
  const all  = document.querySelectorAll('.exercise');
  const done = document.querySelectorAll('.exercise.done');
  const pct  = all.length ? (done.length / all.length) * 100 : 0;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent = `${done.length} / ${all.length}`;
}

function saveProgress() {
  try {
    const done = Array.from(document.querySelectorAll('.exercise.done'))
      .map(el => el.dataset.id);
    const all  = Storage.getWorkoutProgress();
    all[currentSession] = done;
    Storage.saveWorkoutProgress(all);
  } catch (e) { /* Storage no disponible */ }
}

function loadProgress() {
  try {
    const all  = Storage.getWorkoutProgress();
    const done = all[currentSession] || [];
    done.forEach(id => {
      const el = document.getElementById('ex-' + id);
      if (el) {
        el.classList.add('done');
        el.querySelector('.checkbox')?.setAttribute('aria-checked', 'true');
      }
    });
  } catch (e) { /* Storage no disponible */ }
}

/* ─── Session nav ─── */

function initSessionNav() {
  document.getElementById('sessionNav').addEventListener('click', e => {
    const tab = e.target.closest('.session-tab');
    if (!tab) return;
    document.querySelectorAll('.session-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentSession = tab.dataset.session;
    renderSession(currentSession);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
