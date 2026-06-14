import { WORKOUTS_DATA } from '@/data/workouts';
import { getWeightKey } from '@/data/weight-keys';
import { DB } from '@/services/db';
import { LocalStorage } from '@/services/storage';
import { showToast } from '@/components/toast';
import { esc, $maybe } from '@/lib/html';
import type { WeightEntry } from '@/types';

let _currentSession = 'A1';
let _firstRender = true;
let _elapsedInterval: ReturnType<typeof setInterval> | null = null;
let _wtCache: Record<string, WeightEntry[]> = {};

function _fmtKg(w: number): string {
  return (w % 1 === 0 ? w.toFixed(0) : w.toFixed(1)).replace('.', ',') + ' kg';
}

export async function renderSession(key: string): Promise<void> {
  _currentSession = key;
  const session = WORKOUTS_DATA[key];
  if (!session) return;

  const main = document.getElementById('mainContent');
  if (!main) return;

  // Arrancar timer
  LocalStorage.startSessionTimer(key);
  _startElapsedDisplay();

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
      Consulta los vídeos de técnica de cada ejercicio antes de empezar.
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

    block.items.forEach((ex, eIdx) => {
      const exId = `${key}-${bIdx}-${eIdx}`;
      const baseQuery = ex.searchQuery ?? ex.name + ' tutorial';
      const generalUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(baseQuery + ' 2024 2025')}&sp=EgIIBQ%3D%3D`;
      const spanishUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(baseQuery + ' en español 2024 2025')}&hl=es&sp=EgIIBQ%3D%3D`;
      const weightKey  = getWeightKey(ex.name);

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
              <div class="video-actions">
                <a class="video-btn" href="${generalUrl}"
                   target="_blank" rel="noopener noreferrer">Ver vídeo</a>
                <a class="video-btn" href="${spanishUrl}"
                   target="_blank" rel="noopener noreferrer">En español</a>
              </div>
            </div>
            ${weightKey ? `
            <div class="wt-tracker" data-wkey="${esc(weightKey)}">
              <div class="wt-card">
                <div class="wt-card-left">
                  <div class="wt-label">Último peso</div>
                  <div class="wt-value">—</div>
                  <div class="wt-delta"></div>
                </div>
                <div class="wt-card-right">
                  <div class="wt-record"></div>
                </div>
              </div>
              <div class="wt-input-row">
                <input class="wt-input" type="number" step="0.5" min="0.5" max="999"
                       placeholder="kg" inputmode="decimal"
                       aria-label="Peso en kg para ${esc(ex.name)}">
                <button class="wt-save-btn">Guardar</button>
              </div>
              <button class="wt-hist-btn" aria-expanded="false">
                Historial
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <div class="wt-hist-panel" hidden></div>
            </div>` : ''}
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
  await _loadWeightData();
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

  // Weight tracker — guardar peso
  container.querySelectorAll<HTMLElement>('.wt-save-btn').forEach(btn => {
    const tracker = btn.closest<HTMLElement>('.wt-tracker');
    if (!tracker) return;
    btn.addEventListener('click', async () => {
      const key = tracker.dataset['wkey'] ?? '';
      const inp = tracker.querySelector<HTMLInputElement>('.wt-input');
      if (!inp) return;
      const raw = parseFloat(inp.value.replace(',', '.'));
      if (!raw || raw <= 0 || raw >= 1000) { showToast('Introduce un peso válido', 'error'); return; }

      const entry: WeightEntry = {
        id:          Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
        exerciseKey: key,
        date:        new Date().toISOString().split('T')[0] ?? '',
        weight:      raw,
        sessionKey:  _currentSession,
        recordedAt:  new Date().toISOString(),
      };

      await DB.addWeightEntry(entry);
      inp.value = '';

      // Actualiza caché y la tarjeta
      const arr = _wtCache[key] ?? [];
      arr.unshift(entry);
      _wtCache[key] = arr;
      _updateWeightCardEl(tracker, arr);

      // Si el historial está abierto, refresca su contenido
      const panel = tracker.querySelector<HTMLElement>('.wt-hist-panel');
      if (panel && !panel.hidden) panel.innerHTML = _renderHistPanel(arr);

      showToast('Peso guardado');
    });
  });

  // Weight tracker — historial toggle
  container.querySelectorAll<HTMLElement>('.wt-hist-btn').forEach(btn => {
    const tracker = btn.closest<HTMLElement>('.wt-tracker');
    if (!tracker) return;
    btn.addEventListener('click', () => {
      const panel = tracker.querySelector<HTMLElement>('.wt-hist-panel');
      if (!panel) return;
      const open = panel.hidden;
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      btn.classList.toggle('open', open);
      if (open && !panel.dataset['loaded']) {
        panel.dataset['loaded'] = '1';
        const key = tracker.dataset['wkey'] ?? '';
        panel.innerHTML = _renderHistPanel(_wtCache[key] ?? []);
      }
    });
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

// ── Weight tracker helpers ────────────────────────────────────

async function _loadWeightData(): Promise<void> {
  const trackers = document.querySelectorAll<HTMLElement>('.wt-tracker');
  if (!trackers.length) return;
  _wtCache = await DB.getAllWeightHistory();
  trackers.forEach(t => {
    const key = t.dataset['wkey'];
    if (key) _updateWeightCardEl(t, _wtCache[key] ?? []);
  });
}

function _updateWeightCardEl(tracker: HTMLElement, history: WeightEntry[]): void {
  const valEl   = tracker.querySelector('.wt-value');
  const deltaEl = tracker.querySelector('.wt-delta');
  const recEl   = tracker.querySelector('.wt-record');
  const inp     = tracker.querySelector<HTMLInputElement>('.wt-input');

  if (!history.length) return;

  const last = history[0]!;
  const prev = history[1];

  if (valEl)  valEl.textContent  = _fmtKg(last.weight);
  if (inp)    inp.placeholder    = _fmtKg(last.weight);

  if (deltaEl) {
    if (prev) {
      const diff = last.weight - prev.weight;
      if (diff > 0) {
        deltaEl.textContent = `▲ +${_fmtKg(diff)}`;
        deltaEl.className = 'wt-delta wt-up';
      } else if (diff < 0) {
        deltaEl.textContent = `▼ −${_fmtKg(Math.abs(diff))}`;
        deltaEl.className = 'wt-delta wt-down';
      } else {
        deltaEl.textContent = '= Sin cambios';
        deltaEl.className = 'wt-delta wt-same';
      }
    } else {
      deltaEl.textContent = 'Primera sesión registrada';
      deltaEl.className = 'wt-delta wt-same';
    }
  }

  if (recEl && history.length > 1) {
    const max = Math.max(...history.map(e => e.weight));
    recEl.textContent = `Récord: ${_fmtKg(max)}`;
  }
}

function _miniChart(entries: WeightEntry[]): string {
  if (entries.length < 2) {
    return `<p class="wt-chart-empty">Registra al menos 2 sesiones para ver la tendencia.</p>`;
  }
  const W = 220, H = 56, pad = 8;
  const weights = entries.map(e => e.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = maxW - minW || 1;

  const pts = entries.map((e, i) => {
    const x = (pad + (i / (entries.length - 1)) * (W - pad * 2)).toFixed(1);
    const y = ((H - pad) - ((e.weight - minW) / range) * (H - pad * 2)).toFixed(1);
    return `${x},${y}`;
  }).join(' ');

  const dots = entries.map((e, i) => {
    const x = (pad + (i / (entries.length - 1)) * (W - pad * 2)).toFixed(1);
    const y = ((H - pad) - ((e.weight - minW) / range) * (H - pad * 2)).toFixed(1);
    return `<circle cx="${x}" cy="${y}" r="2.5" fill="var(--accent)"/>`;
  }).join('');

  return `<svg class="wt-chart-svg" viewBox="0 0 ${W} ${H}" aria-hidden="true">
    <polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="1.5"
      stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}
  </svg>`;
}

function _renderHistPanel(history: WeightEntry[]): string {
  if (!history.length) return '<p class="wt-empty">Sin registros aún. Guarda tu primer peso arriba.</p>';

  const fmtDate = (d: string): string => {
    const parts = d.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const rows = history.slice(0, 15).map((e, i) => {
    const prev = history[i + 1];
    let delta = '';
    if (prev) {
      const diff = e.weight - prev.weight;
      if (diff > 0)       delta = `<span class="wt-up">▲ +${_fmtKg(diff)}</span>`;
      else if (diff < 0)  delta = `<span class="wt-down">▼ −${_fmtKg(Math.abs(diff))}</span>`;
      else                delta = `<span class="wt-same">=</span>`;
    }
    return `<tr>
      <td>${fmtDate(e.date)}</td>
      <td>${_fmtKg(e.weight)}</td>
      <td>${delta}</td>
    </tr>`;
  }).join('');

  // Chart uses ascending order (oldest → newest)
  const chartEntries = [...history].reverse();
  const chart = _miniChart(chartEntries);

  return `
    <div class="wt-chart-wrap">${chart}</div>
    <table class="wt-table">
      <thead><tr><th>Fecha</th><th>Peso</th><th>Variación</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
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
