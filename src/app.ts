import { Auth } from '@/services/auth';
import { renderDashboard } from '@/views/dashboard';
import { renderSession, saveLoggedSession, updateRpeVal, closeLogModal } from '@/views/training';
import { renderCompetition } from '@/views/competition';
import { renderNutrition } from '@/views/nutrition';
import { renderHistory } from '@/views/history';
import { renderAuthView } from '@/views/auth';
import {
  showProfileModal,
  closeProfileModal,
  saveProfileChanges,
  confirmClearHistory,
  signOut,
} from '@/views/profile';
import { initTimer, closeTimer } from '@/views/timer';
import type { ViewName } from '@/types';

// ── Registro de secciones ────────────────────────────────────

const APP_VIEWS: Record<ViewName, string> = {
  dashboard:   'dashboardSection',
  training:    'mainContent',
  competition: 'competitionSection',
  nutrition:   'nutritionSection',
  history:     'historySection',
};

const VIEW_SHOW: Record<ViewName, string[]> = {
  dashboard:   [],
  training:    ['sessionNav', 'progressContainer'],
  competition: [],
  nutrition:   [],
  history:     [],
};

const _rendered: Record<string, boolean> = {
  competition: false,
  nutrition:   false,
};

let _currentView: ViewName = 'dashboard';
let _currentSession = 'A1';

// ── View switching ────────────────────────────────────────────

export function switchView(view: ViewName): void {
  if (!APP_VIEWS[view]) return;

  Object.values(APP_VIEWS).forEach(id => {
    document.getElementById(id)?.classList.remove('active');
  });
  document.getElementById(APP_VIEWS[view])?.classList.add('active');

  const toShow = VIEW_SHOW[view] ?? [];
  ['sessionNav', 'progressContainer'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = toShow.includes(id) ? '' : 'none';
  });

  document.querySelectorAll<HTMLElement>('.view-tab').forEach(t => {
    const active = t.dataset['view'] === view;
    t.classList.toggle('active', active);
    t.setAttribute('aria-current', active ? 'page' : 'false');
  });

  _updateHeaderHeight();

  if (view === 'dashboard') void renderDashboard();
  if (view === 'competition' && !_rendered['competition']) { renderCompetition(); _rendered['competition'] = true; }
  if (view === 'nutrition' && !_rendered['nutrition']) { renderNutrition(); _rendered['nutrition'] = true; }
  if (view === 'history') void renderHistory();

  _currentView = view;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Auth gate ─────────────────────────────────────────────────

function _showAuthGate(): void {
  document.getElementById('appShell')?.classList.add('hidden');
  document.getElementById('authSection')?.classList.remove('hidden');
  renderAuthView();
}

function _showAppShell(): void {
  document.getElementById('authSection')?.classList.add('hidden');
  document.getElementById('appShell')?.classList.remove('hidden');
}

// ── Init ──────────────────────────────────────────────────────

export async function init(): Promise<void> {
  await Auth.init();

  Auth.onChange(state => {
    if (state.isLoggedIn) {
      _showAppShell();
      switchView('dashboard');
      setTimeout(() => void renderSession(_currentSession), 300);
    } else {
      _showAuthGate();
    }
  });

  _setupEventListeners();
  initTimer();
  _updateHeaderHeight();
  window.addEventListener('resize', _updateHeaderHeight);

  // Custom events
  document.addEventListener('bt:showProfile', () => void showProfileModal());
  document.addEventListener('bt:sessionSaved', () => {
    if (_currentView === 'dashboard') void renderDashboard();
    if (_currentView === 'history') void renderHistory();
  });
  document.addEventListener('bt:viewAll', () => switchView('history'));
  document.addEventListener('bt:goTrain', () => switchView('training'));
}

function _setupEventListeners(): void {
  // View nav
  document.getElementById('viewNav')?.addEventListener('click', e => {
    const tab = (e.target as HTMLElement).closest<HTMLElement>('.view-tab');
    if (!tab?.dataset['view']) return;
    switchView(tab.dataset['view'] as ViewName);
  });

  // Session nav
  document.getElementById('sessionNav')?.addEventListener('click', e => {
    const tab = (e.target as HTMLElement).closest<HTMLElement>('.session-tab');
    if (!tab?.dataset['session']) return;
    document.querySelectorAll('.session-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    _currentSession = tab.dataset['session'];
    void renderSession(_currentSession);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Escape → cierra modales
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    closeTimer();
    closeLogModal();
    closeProfileModal();
    document.getElementById('onboardingModal')?.classList.remove('open');
    document.getElementById('confirmModal')?.classList.remove('open');
  });

  // RPE slider
  document.getElementById('logRpe')?.addEventListener('input', e => {
    updateRpeVal((e.target as HTMLInputElement).value);
  });

  // Log modal buttons
  document.getElementById('saveLogBtn')?.addEventListener('click', saveLoggedSession);
  document.getElementById('cancelLogBtn')?.addEventListener('click', closeLogModal);

  // Profile modal — level/goal toggle buttons
  document.querySelectorAll<HTMLElement>('.profile-level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.profile-level-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  document.querySelectorAll<HTMLElement>('.profile-goal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.profile-goal-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Profile modal buttons
  document.getElementById('profileSaveBtn')?.addEventListener('click', () => void saveProfileChanges());
  document.getElementById('profileCancelBtn')?.addEventListener('click', closeProfileModal);
  document.getElementById('clearHistoryBtn')?.addEventListener('click', () => void confirmClearHistory());
  document.getElementById('signOutBtn')?.addEventListener('click', () => void signOut());

  // Avatar btn → profile (delegado en dashboard, también en header)
  document.getElementById('headerAvatarBtn')?.addEventListener('click', () => void showProfileModal());

  // Dashboard delegated clicks
  document.addEventListener('click', e => {
    const target = e.target as HTMLElement;
    if (target.id === 'dashViewAll') { switchView('history'); return; }
    if (target.id === 'dashGoTrain') { switchView('training'); return; }
  });
}

function _updateHeaderHeight(): void {
  const h = document.querySelector<HTMLElement>('.header')?.offsetHeight ?? 0;
  document.documentElement.style.setProperty('--header-h', (h + 4) + 'px');
}
