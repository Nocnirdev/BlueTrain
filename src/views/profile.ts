import { supabase } from '@/lib/supabase';
import { Auth } from '@/services/auth';
import { DB } from '@/services/db';
import { LocalStorage } from '@/services/storage';
import { showToast } from '@/components/toast';
import { showConfirm } from '@/components/dialog';
import { renderDashboard } from './dashboard';
import { renderHistory } from './history';
import { esc, $maybe } from '@/lib/html';
import type { UserProfile } from '@/types';

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

  // Marcar nivel y objetivo activos
  modal.querySelectorAll<HTMLElement>('.profile-level-btn').forEach(b => {
    b.classList.toggle('active', b.dataset['val'] === profile.level);
  });
  modal.querySelectorAll<HTMLElement>('.profile-goal-btn').forEach(b => {
    b.classList.toggle('active', b.dataset['val'] === profile.goal);
  });

  modal.classList.add('open');
}

export function closeProfileModal(): void {
  document.getElementById('profileModal')?.classList.remove('open');
}

export async function saveProfileChanges(): Promise<void> {
  const name = ($maybe<HTMLInputElement>('profileName')?.value ?? '').trim();
  if (!name) return;

  const modal = document.getElementById('profileModal');
  const level = (modal?.querySelector<HTMLElement>('.profile-level-btn.active')?.dataset['val'] ?? '') as UserProfile['level'];
  const goal = (modal?.querySelector<HTMLElement>('.profile-goal-btn.active')?.dataset['val'] ?? '') as UserProfile['goal'];

  const { error } = await Auth.updateProfile({ name, level, goal });
  if (error) { showToast(error, 'error'); return; }

  closeProfileModal();
  showToast('Perfil actualizado');
  void renderDashboard();
}

export async function confirmClearHistory(): Promise<void> {
  const confirmed = await showConfirm(
    '¿Eliminar todo el historial de entrenamientos? Esta acción no se puede deshacer.',
    'Eliminar todo'
  );
  if (!confirmed) return;

  LocalStorage.clearHistory();

  const { userId } = Auth.getState();
  if (userId) {
    const { error } = await supabase
      .from('sessions').delete().eq('user_id', userId);
    if (error) console.error('Error clearing sessions:', error);
  }

  closeProfileModal();
  showToast('Historial eliminado');
  void renderDashboard();
  void renderHistory();
}

export async function signOut(): Promise<void> {
  const confirmed = await showConfirm('¿Cerrar sesión?', 'Salir');
  if (!confirmed) return;
  await Auth.signOut();
  showToast('Sesión cerrada', 'info');
}
