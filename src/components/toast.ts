// ── Toast notification component ──────────────────────────────

type ToastType = 'success' | 'error' | 'info';

let _timeout: ReturnType<typeof setTimeout> | null = null;

export function showToast(msg: string, type: ToastType = 'success'): void {
  const el = document.getElementById('btToast');
  if (!el) return;

  el.textContent = msg;
  el.className = `bt-toast bt-toast--${type} visible`;

  if (_timeout) clearTimeout(_timeout);
  _timeout = setTimeout(() => {
    el.classList.remove('visible');
  }, 3500);
}
