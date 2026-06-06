/* =====================================================
   BlueTrain — js/app.js
   Punto de entrada de la aplicación.
   Orquesta inicialización, navegación y módulos.

   Vista por defecto: Dashboard
   Preparado para: auth, API REST, PWA
   ===================================================== */

/* ─── Registro de secciones ─── */

const APP_VIEWS = {
  dashboard:   'dashboardSection',
  training:    'mainContent',
  competition: 'competitionSection',
  nutrition:   'nutritionSection',
  history:     'historySection'
};

/* Qué elementos están ligados a qué vista */
const VIEW_SHOW = {
  dashboard:   [],
  training:    ['sessionNav', 'progressContainer'],
  competition: [],
  nutrition:   [],
  history:     []
};

/* Renderizado lazy (solo una vez) */
const _rendered = {
  dashboard:   false,
  competition: false,
  nutrition:   false,
  history:     false
};

/* Vista activa actual */
let _currentView = 'dashboard';

/* ─── View switching ─── */

function switchView(view) {
  if (!APP_VIEWS[view]) return;

  /* Ocultar todas las secciones */
  Object.values(APP_VIEWS).forEach(sectionId => {
    const el = document.getElementById(sectionId);
    if (el) el.classList.remove('active');
  });

  /* Mostrar la sección activa */
  const targetEl = document.getElementById(APP_VIEWS[view]);
  if (targetEl) targetEl.classList.add('active');

  /* Elementos condicionales (sessionNav, progressBar) */
  const toShow = VIEW_SHOW[view] || [];
  ['sessionNav', 'progressContainer'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = toShow.includes(id) ? '' : 'none';
  });

  /* Actualizar tabs de navegación */
  document.querySelectorAll('.view-tab').forEach(t => {
    const active = t.dataset.view === view;
    t.classList.toggle('active', active);
    t.setAttribute('aria-current', active ? 'page' : 'false');
  });

  /* Recalcular header height */
  updateHeaderHeight();

  /* Renderizado lazy */
  if (view === 'dashboard' && !_rendered.dashboard) {
    renderDashboard();
    _rendered.dashboard = true;
  } else if (view === 'dashboard') {
    /* Re-renderizar siempre para reflejar datos actualizados */
    renderDashboard();
  }

  if (view === 'competition' && !_rendered.competition) {
    renderCompetition();
    _rendered.competition = true;
  }

  if (view === 'nutrition' && !_rendered.nutrition) {
    renderNutrition();
    _rendered.nutrition = true;
  }

  if (view === 'history') {
    /* Siempre re-renderizar historial para mostrar cambios */
    renderHistory();
    _rendered.history = true;
  }

  _currentView = view;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── Event listeners ─── */

function setupEventListeners() {
  /* View nav */
  document.getElementById('viewNav').addEventListener('click', e => {
    const tab = e.target.closest('.view-tab');
    if (!tab) return;
    switchView(tab.dataset.view);
  });

  /* Cerrar cualquier modal con Escape */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    closeTimer();
    closeLogModal();
    closeUserModal();
    document.getElementById('onboardingModal')?.classList.remove('open');
  });

  /* RPE slider */
  document.getElementById('logRpe')?.addEventListener('input', e => {
    _updateRpeVal(e.target.value);
  });
}

/* ─── Init ─── */

function init() {
  setupEventListeners();
  initTimer();
  initSessionNav();
  initUser();
  updateHeaderHeight();
  window.addEventListener('resize', updateHeaderHeight);

  /* Vista inicial: Dashboard */
  switchView('dashboard');

  /* Pre-renderizar training en background para que sea rápido al entrar */
  setTimeout(() => renderSession('A1'), 300);
}

init();
