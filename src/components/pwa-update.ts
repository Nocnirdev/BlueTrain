import { registerSW } from 'virtual:pwa-register';
import { showToast } from './toast';

const UPDATE_CONFIRMATION_KEY = 'bluetrain:pwa-update-confirmation';

export function initPwaUpdate(): void {
  const panel = document.getElementById('pwaUpdate');
  const button = document.getElementById('pwaUpdateBtn') as HTMLButtonElement | null;
  if (!panel || !button) return;

  if (sessionStorage.getItem(UPDATE_CONFIRMATION_KEY)) {
    sessionStorage.removeItem(UPDATE_CONFIRMATION_KEY);
    window.setTimeout(() => showToast('BlueTrain se ha actualizado.', 'success'), 0);
  }

  const updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh: () => {
      panel.hidden = false;
    },
    onRegisterError: (error) => {
      console.error('No se pudo registrar la actualización de BlueTrain.', error);
    },
  });

  button.addEventListener('click', () => {
    button.disabled = true;
    button.textContent = 'Actualizando…';
    sessionStorage.setItem(UPDATE_CONFIRMATION_KEY, '1');

    void updateServiceWorker().catch(() => {
      sessionStorage.removeItem(UPDATE_CONFIRMATION_KEY);
      button.disabled = false;
      button.textContent = 'Actualizar';
      showToast('No se pudo aplicar la actualización. Vuelve a intentarlo.', 'error');
    });
  });
}
