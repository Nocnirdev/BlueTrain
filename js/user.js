/* =====================================================
   BlueTrain — js/user.js
   Gestión del perfil de usuario y onboarding.
   Depende de: js/storage.js
   ===================================================== */

/* Estado temporal durante onboarding / edición */
let _pendingUser = { name: '', level: '', goal: '' };
let _onboardStep = 1;

/* ─── Lectura ─── */

function getUser() {
  return Storage.getUser();
}

function getUserDisplayName() {
  const u = getUser();
  return u ? u.name : 'Atleta';
}

/* ─── Onboarding ─── */

function showOnboarding() {
  _pendingUser = { name: '', level: '', goal: '' };
  _onboardStep = 1;
  _renderOnboardStep(1);
  document.getElementById('onboardingModal').classList.add('open');
}

function _renderOnboardStep(step) {
  document.querySelectorAll('.onboard-step').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === step);
  });
  document.querySelectorAll('.onboard-dot').forEach((el, i) => {
    el.classList.toggle('done', i < step);
  });
}

function onboardNext() {
  if (_onboardStep === 1) {
    const name = document.getElementById('onboardName').value.trim();
    if (!name) {
      document.getElementById('onboardName').style.borderColor = 'var(--warn)';
      return;
    }
    _pendingUser.name = name;
    _onboardStep = 2;
    _renderOnboardStep(2);

  } else if (_onboardStep === 2) {
    if (!_pendingUser.level) {
      _flashError('onboard-level-error', 'Elige tu nivel');
      return;
    }
    _onboardStep = 3;
    _renderOnboardStep(3);

  } else if (_onboardStep === 3) {
    if (!_pendingUser.goal) {
      _flashError('onboard-goal-error', 'Elige tu objetivo');
      return;
    }
    _saveOnboarding();
  }
}

function selectLevel(level) {
  _pendingUser.level = level;
  document.querySelectorAll('.level-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.val === level);
  });
}

function selectGoal(goal) {
  _pendingUser.goal = goal;
  document.querySelectorAll('.goal-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.val === goal);
  });
}

function _saveOnboarding() {
  Storage.saveUser({
    name:      _pendingUser.name,
    level:     _pendingUser.level,
    goal:      _pendingUser.goal,
    createdAt: new Date().toISOString(),
    history:   []
  });
  document.getElementById('onboardingModal').classList.remove('open');
  updateUserGreeting();
  showToast('¡Bienvenido, ' + _pendingUser.name + '!');
  /* Si el dashboard está activo, re-renderizarlo */
  if (document.getElementById('dashboardSection').classList.contains('active')) {
    renderDashboard();
  }
}

/* ─── Perfil (edición) ─── */

function showUserModal() {
  const user = getUser();
  if (!user) { showOnboarding(); return; }

  const modal = document.getElementById('profileModal');

  /* Stats en el header */
  document.getElementById('profileAvatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('profileStatSessions').textContent = Storage.getTotalSessions();
  document.getElementById('profileStatStreak').textContent  = Storage.getStreak();
  document.getElementById('profileStatTime').textContent    =
    Math.round(Storage.getTotalMinutes() / 60) + 'h';

  /* Campos editables */
  document.getElementById('profileName').value = user.name;

  document.querySelectorAll('.profile-level-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.val === user.level);
  });
  document.querySelectorAll('.profile-goal-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.val === user.goal);
  });

  modal.classList.add('open');
}

function closeUserModal() {
  document.getElementById('profileModal').classList.remove('open');
}

function saveUserProfile() {
  const user = getUser() || {};
  const name = document.getElementById('profileName').value.trim();
  if (!name) return;

  const level = document.querySelector('.profile-level-btn.active')?.dataset.val || user.level;
  const goal  = document.querySelector('.profile-goal-btn.active')?.dataset.val || user.goal;

  Storage.saveUser({ ...user, name, level, goal });
  closeUserModal();
  updateUserGreeting();
  showToast('Perfil actualizado');
}

function selectProfileLevel(level) {
  document.querySelectorAll('.profile-level-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.val === level);
  });
}

function selectProfileGoal(goal) {
  document.querySelectorAll('.profile-goal-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.val === goal);
  });
}

function confirmClearHistory() {
  if (!confirm('¿Eliminar todo el historial de entrenamientos? Esta acción no se puede deshacer.')) return;
  Storage.clearAll();
  Storage.saveUser(getUser()); /* Mantener usuario */
  closeUserModal();
  showToast('Historial eliminado');
  renderDashboard();
  renderHistory();
}

/* ─── Greeting update ─── */

function updateUserGreeting() {
  const user = getUser();
  const greetEl = document.getElementById('dashGreeting');
  if (greetEl) {
    greetEl.textContent = user ? 'Hola, ' + user.name : 'Bienvenido';
  }
  const avatarEl = document.querySelector('.user-avatar');
  if (avatarEl && user) {
    avatarEl.textContent = user.name.charAt(0).toUpperCase();
  }
}

/* ─── Utils ─── */

function _flashError(id, msg) {
  let el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.opacity = '1';
  setTimeout(() => { el.style.opacity = '0'; }, 2500);
}

/* ─── Init ─── */

function initUser() {
  if (!getUser()) {
    /* Pequeño delay para dejar que se cargue el DOM */
    setTimeout(showOnboarding, 400);
  } else {
    updateUserGreeting();
  }
}
