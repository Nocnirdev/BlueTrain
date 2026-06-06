/* =====================================================
   BlueTrain — js/utils.js
   Temporizador de descanso, formatters y helpers.
   ===================================================== */

/* ─── Timer state ─── */
let timerInterval = null;
let timerSeconds = 90;
let timerRemaining = 90;
let timerRunning = false;

function formatTime(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function updateTimerDisplay() {
  document.getElementById('timerDisplay').textContent = formatTime(timerRemaining);
}

function openTimer() {
  document.getElementById('timerModal').classList.add('open');
  updateTimerDisplay();
}

function closeTimer() {
  document.getElementById('timerModal').classList.remove('open');
  if (timerInterval) clearInterval(timerInterval);
  timerRunning = false;
  timerRemaining = timerSeconds;
  document.getElementById('timerStart').textContent = 'Iniciar';
}

function initTimer() {
  document.getElementById('timerOpenBtn').addEventListener('click', openTimer);
  document.getElementById('timerClose').addEventListener('click', closeTimer);

  document.querySelectorAll('.timer-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.timer-preset').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      timerSeconds = parseInt(btn.dataset.sec);
      timerRemaining = timerSeconds;
      updateTimerDisplay();
      if (timerInterval) {
        clearInterval(timerInterval);
        timerRunning = false;
        document.getElementById('timerStart').textContent = 'Iniciar';
      }
    });
  });

  document.getElementById('timerStart').addEventListener('click', () => {
    if (timerRunning) {
      clearInterval(timerInterval);
      timerRunning = false;
      document.getElementById('timerStart').textContent = 'Reanudar';
      return;
    }
    timerRunning = true;
    document.getElementById('timerStart').textContent = 'Pausar';
    timerInterval = setInterval(() => {
      timerRemaining--;
      updateTimerDisplay();
      if (timerRemaining <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        _timerAlert();
        document.getElementById('timerStart').textContent = 'Iniciar';
        timerRemaining = timerSeconds;
        setTimeout(updateTimerDisplay, 500);
      }
    }, 1000);
  });
}

function _timerAlert() {
  if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  } catch (e) { /* AudioContext not available */ }
}

/* ─── Header height for sticky blocks ─── */
function updateHeaderHeight() {
  const h = document.querySelector('.header').offsetHeight;
  document.documentElement.style.setProperty('--header-h', (h + 4) + 'px');
}
