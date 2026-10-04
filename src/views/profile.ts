import { Auth } from '@/services/auth';
import { DB } from '@/services/db';
import { LocalStorage } from '@/services/storage';
import { showToast } from '@/components/toast';
import { showConfirm } from '@/components/dialog';
import { renderDashboard } from './dashboard';
import { renderHistory } from './history';
import { esc, $maybe } from '@/lib/html';

export function exportLocalBackup(): void {
  const summary = LocalStorage.downloadBackup();
  const parts: string[] = [];
  if (summary.sessions) parts.push(`${summary.sessions} sesiones`);
  if (summary.weightEntries) parts.push(`${summary.weightEntries} pesos`);
  if (summary.completedExercises) parts.push(`${summary.completedExercises} ejercicios marcados`);
  showToast(parts.length ? `Copia descargada: ${parts.join(', ')}.` : 'Copia local descargada.', 'success');
}

export function openBackupImport(): void {
  document.getElementById('importDataInput')?.click();
}

export async function importLocalBackup(file: File): Promise<void> {
  if (file.size > 5 * 1024 * 1024) {
    showToast('La copia supera el tamaño máximo de 5 MB.', 'error');
    return;
  }

  let backup: unknown;
  try {
    backup = JSON.parse(await file.text()) as unknown;
    const preview = LocalStorage.getBackupPreview(backup);
    const confirmed = await showConfirm(
      `Se añadirán ${_summaryText(preview)} a este navegador. No se borrará la información actual ni se subirá nada todavía. ¿Quieres restaurar esta copia?`,
      'Restaurar copia'
    );
    if (!confirmed) return;
  } catch (error) {
    showToast(error instanceof Error ? error.message : 'No se pudo leer la copia seleccionada.', 'error');
    return;
  }

  try {
    const result = LocalStorage.importBackup(backup);
    const restored: string[] = [];
    if (result.importedSessions) restored.push(`${result.importedSessions} sesiones`);
    if (result.importedWeightEntries) restored.push(`${result.importedWeightEntries} pesos`);
    if (result.importedCompletedExercises) restored.push(`${result.importedCompletedExercises} ejercicios`);
    if (result.importedPerformanceEntries) restored.push(`${result.importedPerformanceEntries} borradores`);
    if (result.restoredTimer) restored.push('temporizador');
    showToast(restored.length ? `Copia restaurada: ${restored.join(', ')}.` : 'La copia ya estaba incorporada en este navegador.', 'success');
  } catch (error) {
    showToast(error instanceof Error ? error.message : 'No se pudo restaurar la copia.', 'error');
    return;
  }

  updateSyncStatus();
  if (!Auth.getState().userId) return;
  const syncNow = await showConfirm(
    'La copia ya está protegida en este navegador. ¿Quieres sincronizar ahora sus sesiones, progreso y pesos con tu cuenta?',
    'Sincronizar ahora'
  );
  if (syncNow) await _syncLocalData();
}

export async function syncLocalData(): Promise<void> {
  const confirmed = await showConfirm(
    'Se sincronizarán las sesiones, el progreso y los pesos guardados en este navegador. La copia local se conservará.',
    'Sincronizar ahora'
  );
  if (confirmed) await _syncLocalData();
}

export function updateSyncStatus(): void {
  const status = document.getElementById('syncStatus');
  const syncButton = document.getElementById('syncDataBtn') as HTMLButtonElement | null;
  if (!status || !syncButton) return;

  const { userId } = Auth.getState();
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
  if (!userId) {
    status.textContent = 'Inicia sesión para sincronizar una copia restaurada.';
    syncButton.disabled = true;
    return;
  }

  const pending = LocalStorage.getPendingSyncCount(userId);
  if (offline) {
    status.textContent = pending
      ? `${pending} cambio${pending === 1 ? '' : 's'} pendiente${pending === 1 ? '' : 's'}: se enviarán al recuperar la conexión.`
      : 'Sin conexión. Tus nuevos cambios se guardarán en este navegador.';
    syncButton.disabled = true;
    return;
  }

  status.textContent = pending
    ? `${pending} cambio${pending === 1 ? '' : 's'} pendiente${pending === 1 ? '' : 's'} de sincronización.`
    : 'Todo está al día en este navegador.';
  syncButton.disabled = false;
}

export async function showProfileModal(): Promise<void> {
  const { profile } = Auth.getState();
  if (!profile) return;

  const [totalSessions, streak, totalMins] = await Promise.all([
    DB.getTotalSessions(),
    DB.getStreak(),
    DB.getTotalMinutes(),
  ]);

  const modal = document.getElementById('profileModal');
  if (!modal) return;

  // Actualizar campos
  const avatarEl = document.getElementById('profileAvatar');
  if (avatarEl) avatarEl.textContent = esc(profile.name.charAt(0).toUpperCase());

  const nameInput = $maybe<HTMLInputElement>('profileName');
  if (nameInput) nameInput.value = profile.name;

  const sessEl = document.getElementById('profileStatSessions');
  const streakEl = document.getElementById('profileStatStreak');
  const timeEl = document.getElementById('profileStatTime');
  if (sessEl) sessEl.textContent = String(totalSessions);
  if (streakEl) streakEl.textContent = String(streak);
  if (timeEl) timeEl.textContent = Math.round(totalMins / 60) + 'h';

  updateSyncStatus();
  modal.classList.add('open');
}

export function closeProfileModal(): void {
  document.getElementById('profileModal')?.classList.remove('open');
}

export async function saveProfileChanges(): Promise<void> {
  const name = ($maybe<HTMLInputElement>('profileName')?.value ?? '').trim();
  if (!name) return;

  const { error } = await Auth.updateProfile({ name });
  if (error) { showToast(error, 'error'); return; }

  closeProfileModal();
  showToast('Perfil actualizado');
  void renderDashboard();
}

export async function confirmClearTrainingData(): Promise<void> {
  const confirmed = await showConfirm(
    'Se borrarán sesiones, pesos, progreso, borradores y temporizador de este navegador y de tu cuenta. Esta acción no se puede deshacer.',
    'Borrar datos'
  );
  if (!confirmed) return;

  const error = await DB.clearTrainingData();
  if (error) { showToast(error, 'error'); return; }

  closeProfileModal();
  showToast('Datos de entrenamiento eliminados');
  void renderDashboard();
  void renderHistory();
}

export async function signOut(): Promise<void> {
  const confirmed = await showConfirm('¿Cerrar sesión?', 'Salir');
  if (!confirmed) return;
  await Auth.signOut();
  showToast('Sesión cerrada', 'info');
}

async function _syncLocalData(): Promise<void> {
  const migration = await DB.migrateLocalData();
  const pending = await DB.flushPendingOperations();
  const parts: string[] = [];
  if (migration.sessions) parts.push(`${migration.sessions} sesiones`);
  if (migration.progress) parts.push(`${migration.progress} progresos`);
  if (migration.weights) parts.push(`${migration.weights} pesos`);
  if (pending.synced) parts.push(`${pending.synced} cambios pendientes`);

  updateSyncStatus();
  if (parts.length) showToast(`Sincronización terminada: ${parts.join(', ')}.`, 'success');
  if (migration.errors.length || pending.errors.length) {
    showToast('La copia local se conserva: algunos cambios siguen pendientes de sincronizar.', 'error');
  }
  if (!parts.length && !migration.errors.length && !pending.errors.length) {
    showToast('No hay datos locales nuevos para sincronizar.', 'info');
  }
}

function _summaryText(summary: ReturnType<typeof LocalStorage.getBackupPreview>): string {
  const parts: string[] = [];
  if (summary.sessions) parts.push(`${summary.sessions} sesiones`);
  if (summary.weightEntries) parts.push(`${summary.weightEntries} pesos`);
  if (summary.completedExercises) parts.push(`${summary.completedExercises} ejercicios`);
  if (summary.performanceEntries) parts.push(`${summary.performanceEntries} borradores`);
  if (summary.hasActiveTimer) parts.push('un temporizador');
  return parts.length ? parts.join(', ') : 'una copia sin entrenamientos registrados';
}
