// ── Rest timer ───────────────────────────────────────────────

let _interval: ReturnType<typeof setInterval> | null = null;
let _seconds = 90;
let _remaining = 90;
let _running = false;

export function initTimer(): void {
  document.getElementById('timerOpenBtn')?.addEventListener('click', openTimer);
  document.getElementById('timerClose')?.addEventListener('click', closeTimer);

  document.querySelectorAll<HTMLElement>('.timer-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.timer-preset').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _seconds = parseInt(btn.dataset['sec'] ?? '90');
      _remaining = _seconds;
      _updateDisplay();
      if (_interval) { clearInterval(_interval); _running = false; _setStartLabel('Iniciar'); }
    });
  });

  document.getElementById('timerStart')?.addEventListener('click', _toggle);
}

export function openTimer(): void {
  document.getElementById('timerModal')?.classList.add('open');
  _updateDisplay();
}

export function closeTimer(): void {
  document.getElementById('timerModal')?.classList.remove('open');
  if (_interval) clearInterval(_interval);
  _running = false;
  _remaining = _seconds;
  _setStartLabel('Iniciar');
}

function _toggle(): void {
  if (_running) {
    if (_interval) clearInterval(_interval);
    _running = false;
    _setStartLabel('Reanudar');
    return;
  }
  _running = true;
  _setStartLabel('Pausar');
  _interval = setInterval(() => {
    _remaining--;
    _updateDisplay();
    if (_remaining <= 0) {
      if (_interval) clearInterval(_interval);
      _running = false;
      _setStartLabel('Iniciar');
      _alert();
      _remaining = _seconds;
      setTimeout(_updateDisplay, 500);
    }
  }, 1000);
}

function _updateDisplay(): void {
  const m = Math.floor(_remaining / 60);
  const s = _remaining % 60;
  const text = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  const el = document.getElementById('timerDisplay');
  if (el) el.textContent = text;
}

function _setStartLabel(label: string): void {
  const btn = document.getElementById('timerStart');
  if (btn) btn.textContent = label;
}

function _alert(): void {
  if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  } catch { /* AudioContext unavailable */ }
}
