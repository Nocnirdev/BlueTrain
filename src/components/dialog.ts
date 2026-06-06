// ── Confirm dialog — reemplaza window.confirm() ───────────────
// Usa el sistema de modales existente (bt-modal).

export function showConfirm(message: string, confirmLabel = 'Confirmar'): Promise<boolean> {
  return new Promise(resolve => {
    const modal = document.getElementById('confirmModal');
    const msgEl = document.getElementById('confirmMessage');
    const okBtn = document.getElementById('confirmOk');
    const cancelBtn = document.getElementById('confirmCancel');

    if (!modal || !msgEl || !okBtn || !cancelBtn) {
      // Fallback si el modal no existe en el DOM
      resolve(window.confirm(message));
      return;
    }

    msgEl.textContent = message;
    if (okBtn instanceof HTMLButtonElement) okBtn.textContent = confirmLabel;

    modal.classList.add('open');

    const cleanup = (result: boolean) => {
      modal.classList.remove('open');
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      resolve(result);
    };

    const onOk = () => cleanup(true);
    const onCancel = () => cleanup(false);

    okBtn.addEventListener('click', onOk, { once: true });
    cancelBtn.addEventListener('click', onCancel, { once: true });
  });
}

export function showAlert(message: string): Promise<void> {
  return showConfirm(message, 'Entendido').then(() => {});
}
