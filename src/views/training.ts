import { WORKOUTS_DATA } from '@/data/workouts';
import { DB } from '@/services/db';
import { LocalStorage } from '@/services/storage';
import { showToast } from '@/components/toast';
import { esc, $maybe } from '@/lib/html';

let _currentSession = 'A1';
let _firstRender = true;
let _elapsedInterval: ReturnType<typeof setInterval> | null = null;

export async function renderSession(key: string): Promise<void> {
  _currentSession = key;
  const session = WORKOUTS_DATA[key];
  if (!session) return;

  const main = document.getElementById('mainContent');
  if (!main) return;

  // Arrancar timer
  LocalStorage.startSessionTimer(key);
  _startElapsedDisplay();

  // Lazy-load animations solo cuando se abre el entrenamiento
  const { ANIMS } = await import('@/data/animations');

  let html = `
    <div class="session-timer-strip" id="sessionTimerStrip">
      <span class="session-timer-label">Sesión en curso</span>
      <span class="session-timer-value">0 min</span>
    </div>

    <div class="session-hero">
      <div class="session-meta">
        <span class="pill">${esc(session.week)}</span>
        <span class="pill">${esc(session.duration)}</span>
      </div>
      <h1 class="session-title">${esc(session.title)}</h1>
      <p class="session-subtitle">${esc(session.subtitle)}</p>
      <div class="session-stats">
        <div class="stat"><div class="stat-label">Bloques</div><div class="stat-value">${esc(String(session.blocks.length))}</div></div>
        <div class="stat"><div class="stat-label">Foco</div><div class="stat-value" style="font-size:14px;">${esc(session.focus)}</div></div>
        <div class="stat"><div class="stat-label">Duración</div><div class="stat-value">${esc(session.duration)}</div></div>
      </div>
    </div>`;

  if (_firstRender) {
    html += `<div class="info-banner">
      <strong>Animaciones en bucle:</strong> visualiza cada movimiento sin conexión.
      Cuando termines, pulsa <strong>Finalizar sesión</strong> para guardar en tu historial.
    </div>`;
    _firstRender = false;
  }

  session.blocks.forEach((block, bIdx) => {
    html += `
      <section class="block" data-type="${esc(block.type)}">
        <div class="block-header">
          <div class="block-num">${esc(String(bIdx + 1))}</div>
          <h2 class="block-title">${esc(block.title)}</h2>
          <span class="block-duration">${esc(block.duration)}</span>
        </div>`;

    if (block.note) html += `<div class="note">${block.note}</div>`;

    if (block.protocol) {
      const isFinisher = block.type === 'finisher';
      html += `
        <div class="protocol-card${isFinisher ? ' finisher-style' : ''}">
          <div class="protocol-header">
            <div class="protocol-name">${esc(block.protocol.name)}</div>
            <div class="protocol-time">${esc(block.protocol.time)}</div>
          </div>
          <ol class="protocol-list">
            ${block.protocol.items.map((item, i) =>
              `<li><span class="num">${String(i + 1).padStart(2, '0')}</span> ${esc(item)}</li>`
            ).join('')}
          </ol>
        </div>`;
    }

    const blockLabel: Record<string, string> = {
      warmup: 'CALENT.', strength: 'FUERZA',
      competition: 'COMPET.', finisher: 'FINISHER', cooldown: 'COOLDOWN',
    };

    block.items.forEach((ex, eIdx) => {
      const exId = `${key}-${bIdx}-${eIdx}`;
      const query = encodeURIComponent(ex.searchQuery ?? ex.name + ' tutorial');
      const searchUrl = `https://www.youtube.com/results?search_query=${query}`;
      const animSvg = ANIMS[ex.anim] ?? ANIMS['generic'] ?? '';
      const label = blockLabel[block.type] ?? block.type.toUpperCase();

      html += `
        <div class="exercise" id="ex-${esc(exId)}" data-id="${esc(exId)}">
          <div class="ex-row" data-toggle="${esc(exId)}">
            <div class="checkbox" data-done="${esc(exId)}"
                 role="checkbox" aria-checked="false"
                 aria-label="Marcar ${esc(ex.name)} completado">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="#000" stroke-width="4" stroke-linecap="round"
                   stroke-linejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div class="ex-main">
              <h3 class="ex-name">${esc(ex.name)}</h3>
              <div class="ex-prescription">
                ${esc(ex.prescription)}
                ${ex.rest ? `<span class="sep">·</span>Descanso ${esc(ex.rest)}` : ''}
              </div>
            </div>
            ${ex.rpe ? `<span class="ex-rpe">${esc(ex.rpe)}</span>` : ''}
            <div class="ex-toggle" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
          <div class="ex-details">
            <div class="anim-section">
              <div class="anim-stage">
                <div class="anim-label">${esc(label)}</div>
                ${animSvg}
              </div>
              <div class="video-actions">
                <a class="video-btn" href="${searchUrl}"
                   target="_blank" rel="noopener noreferrer">Ver vídeo real</a>
                <a class="video-btn" href="${searchUrl}+espa%C3%B1ol"
                   target="_blank" rel="noopener noreferrer">En español</a>
              </div>
            </div>
            ${ex.cues?.length ? `
              <div class="cues">
                <div class="cues-title">Puntos clave</div>
                <ul>${ex.cues.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
              </div>` : ''}
          </div>
        </div>`;
    });

    html += `</section>`;
  });

  html += `
    <div class="session-elapsed" id="finishElapsed"></div>
    <button class="finish-session-btn" id="finishBtn">Finalizar sesión</button>
    <div class="footer-info">BLUETRAIN · ${esc(key)} · ${esc(session.duration)}</div>`;

  main.innerHTML = html;

  _attachExerciseListeners(main);
  await _loadProgress();
  _updateProgress();
  _startElapsedDisplay();
}

function _attachExerciseListeners(container: HTMLElement): void {
  container.querySelectorAll<HTMLElement>('[data-toggle]').forEach(row => {
    row.addEventListener('click', e => {
      if ((e.target as HTMLElement).closest('[data-done]')) return;
      const id = row.dataset['toggle'] ?? '';
      document.getElementById('ex-' + id)?.classList.toggle('expanded');
    });
  });

  container.querySelectorAll<HTMLElement>('[data-done]').forEach(checkbox => {
    checkbox.addEventListener('click', e => {
      e.stopPropagation();
      const id = checkbox.dataset['done'] ?? '';
      const el = document.getElementById('ex-' + id);
      if (!el) return;
      el.classList.toggle('done');
      checkbox.setAttribute('aria-checked', el.classList.contains('done') ? 'true' : 'false');
      void _saveProgress();
      _updateProgress();
    });
  });

  container.querySelector('#finishBtn')?.addEventListener('click', () => {
    _openLogModal(_currentSession);
  });
}

function _updateProgress(): void {
  const all  = document.querySelectorAll('.exercise');
  const done = document.querySelectorAll('.exercise.done');
  const pct  = all.length ? (done.length / all.length) * 100 : 0;
  const fill = document.getElementById('progressFill');
  const text = document.getElementById('progressText');
  const bar  = document.querySelector('.progress-track');

  if (fill) fill.style.width = pct + '%';
  if (text) text.textContent = `${done.length} / ${all.length}`;
  if (bar instanceof HTMLElement) bar.setAttribute('aria-valuenow', String(Math.round(pct)));
}

async function _saveProgress(): Promise<void> {
  const done = Array.from(document.querySelectorAll<HTMLElement>('.exercise.done'))
    .map(el => el.dataset['id'] ?? '')
    .filter(Boolean);
  await DB.saveWorkoutProgress(_currentSession, done);
}

async function _loadProgress(): Promise<void> {
  const all = await DB.getWorkoutProgress();
  const done = all[_currentSession] ?? [];
  done.forEach(id => {
    const el = document.getElementById('ex-' + id);
    if (el) {
      el.classList.add('done');
      el.querySelector<HTMLElement>('[data-done]')?.setAttribute('aria-checked', 'true');
    }
  });
}

// ── Log modal ────────────────────────────────────────────────

function _openLogModal(workoutKey: string): void {
  const session = WORKOUTS_DATA[workoutKey];
  if (!session) return;

  const timer = LocalStorage.getSessionTimer();
  const elapsed = timer
    ? Math.round((Date.now() - timer.startedAt) / 60000)
    : parseInt(session.duration) || 60;

  const titleEl  = document.getElementById('logModalTitle');
  const subEl    = document.getElementById('logModalSub');
  const durEl    = $maybe<HTMLInputElement>('logDuration');
  const pctEl    = document.getElementById('logCompletionPct');
  const logModal = document.getElementById('logModal');

  if (titleEl) titleEl.textContent = session.title;
  if (subEl) subEl.textContent = session.week + ' · ' + session.subtitle;
  if (durEl) durEl.value = String(elapsed);

  const done  = document.querySelectorAll('.exercise.done').length;
  const total = document.querySelectorAll('.exercise').length;
  if (pctEl) pctEl.textContent = (total ? Math.round((done / total) * 100) : 0) + '%';

  _buildPerfInputs(session, workoutKey);
  _updateRpeVal($maybe<HTMLInputElement>('logRpe')?.value ?? '7');

  if (logModal) {
    logModal.dataset['workoutKey'] = workoutKey;
    logModal.classList.add('open');
  }
}

function _buildPerfInputs(session: typeof WORKOUTS_DATA[string], workoutKey: string): void {
  const container = document.getElementById('logPerfInputs');
  if (!container) return;

  const strengthBlock = session.blocks.find(b => b.type === 'strength');
  if (!strengthBlock) { container.innerHTML = ''; return; }

  const keyExercises = strengthBlock.items.filter(ex => ex.rpe).slice(0, 3);
  if (!keyExercises.length) { container.innerHTML = ''; return; }

  container.innerHTML = keyExercises.map((ex, i) => {
    const shortName = ex.name.replace(/^[A-C]\d+\s*·\s*/, '');
    const savedKey  = `${workoutKey}_ex${i}`;
    const saved     = LocalStorage.getPerfInput(savedKey);
    return `
      <div class="perf-input-block">
        <div class="perf-name" title="${esc(shortName)}">${esc(shortName)}</div>
        <input class="log-input" id="perfInput${i}"
          type="text" placeholder="ej. 80 kg × 4"
          value="${esc(saved)}"
          aria-label="Rendimiento en ${esc(shortName)}">
      </div>`;
  }).join('');

  container.dataset['exercises'] = JSON.stringify(keyExercises.map(ex => ex.name));
}

export function saveLoggedSession(): void {
  const logModal   = document.getElementById('logModal');
  const workoutKey = logModal?.dataset['workoutKey'] ?? '';
  const session    = WORKOUTS_DATA[workoutKey];
  if (!session) return;

  const container = document.getElementById('logPerfInputs');
  const exNames   = JSON.parse(container?.dataset['exercises'] ?? '[]') as string[];
  const performance: Record<string, string> = {};

  exNames.forEach((name, i) => {
    const val = ($maybe<HTMLInputElement>('perfInput' + i)?.value ?? '').trim();
    if (val) {
      const short = name.replace(/^[A-C]\d+\s*·\s*/, '');
      performance[short] = val;
      LocalStorage.savePerfInput(`${workoutKey}_ex${i}`, val);
    }
  });

  const hasCompetition = session.blocks.some(b => b.type === 'competition');
  const hasStrength    = session.blocks.some(b => b.type === 'strength');
  const type: SessionEntry['type'] = hasCompetition && hasStrength ? 'functional'
    : hasStrength ? 'strength' : 'functional';

  const entry: SessionEntry = {
    id:          Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    date:        new Date().toISOString().split('T')[0] ?? '',
    sessionKey:  workoutKey,
    workoutName: session.title,
    type,
    mesocycle:   session.week,
    duration:    parseInt($maybe<HTMLInputElement>('logDuration')?.value ?? '60') || 60,
    rpe:         parseInt($maybe<HTMLInputElement>('logRpe')?.value ?? '7') || 7,
    notes:       ($maybe<HTMLTextAreaElement>('logNotes')?.value ?? '').trim(),
    performance,
    completedAt: new Date().toISOString(),
  };

  void DB.addSession(entry).then(() => {
    LocalStorage.clearSessionTimer();
    _stopElapsedDisplay();
    document.getElementById('logModal')?.classList.remove('open');
    showToast('Sesión guardada en tu historial');
    document.dispatchEvent(new CustomEvent('bt:sessionSaved'));
  });
}

import type { SessionEntry } from '@/types';

export function updateRpeVal(val: string): void {
  _updateRpeVal(val);
}

function _updateRpeVal(val: string): void {
  const rpeEl = document.getElementById('logRpeVal');
  if (rpeEl) rpeEl.textContent = val;
}

export function closeLogModal(): void {
  document.getElementById('logModal')?.classList.remove('open');
}

// ── Timer display ─────────────────────────────────────────────

function _startElapsedDisplay(): void {
  if (_elapsedInterval) return;
  _updateElapsedDisplay();
  _elapsedInterval = setInterval(_updateElapsedDisplay, 30000);
}

function _stopElapsedDisplay(): void {
  if (_elapsedInterval) { clearInterval(_elapsedInterval); _elapsedInterval = null; }
}

function _updateElapsedDisplay(): void {
  const timer = LocalStorage.getSessionTimer();
  if (!timer) return;
  const mins = Math.floor((Date.now() - timer.startedAt) / 60000);
  const strip = document.getElementById('sessionTimerStrip');
  if (strip) {
    const valEl = strip.querySelector('.session-timer-value');
    if (valEl) valEl.textContent = mins + ' min';
  }
}
