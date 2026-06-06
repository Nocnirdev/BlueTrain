import { DB } from '@/services/db';
import { showToast } from '@/components/toast';
import { showConfirm } from '@/components/dialog';
import { renderDashboard } from './dashboard';
import { esc } from '@/lib/html';
import { renderActivityItem } from './dashboard';

let _filter: 'all' | 'strength' | 'functional' = 'all';

export async function renderHistory(): Promise<void> {
  const el = document.getElementById('historySection');
  if (!el) return;

  el.innerHTML = '<div class="loading-state">Cargando historial…</div>';

  const history = await DB.getHistory();
  const filtered = _filter === 'all' ? history : history.filter(s => s.type === _filter);
  const totalMins = await DB.getTotalMinutes();

  const filterChips = [
    { val: 'all', label: 'Todas' },
    { val: 'strength', label: 'Fuerza' },
    { val: 'functional', label: 'Funcional' },
  ].map(f => `
    <button class="filter-chip${_filter === f.val ? ' active' : ''}" data-filter="${f.val}">
      ${esc(f.label)}
    </button>`).join('');

  el.innerHTML = `
    <div class="section-hero nutrition-hero" style="margin-bottom:16px;">
      <h2>Historial</h2>
      <p>${esc(String(history.length))} sesión${history.length !== 1 ? 'es' : ''} registrada${history.length !== 1 ? 's' : ''}
         · ${esc((totalMins / 60).toFixed(1))}h de entrenamiento total</p>
    </div>

    <div class="history-filters" role="group" aria-label="Filtros de historial">
      ${filterChips}
    </div>

    ${filtered.length === 0
      ? `<div class="empty-state">
           <div class="empty-state-icon">📋</div>
           <h3>${history.length ? 'Sin resultados' : 'Sin sesiones aún'}</h3>
           <p>${history.length
               ? 'No hay sesiones de tipo "' + esc(_filter) + '"'
               : 'Completa tu primer entrenamiento para verlo aquí'}</p>
         </div>`
      : `<div class="activity-feed" id="historyFeed">
           ${filtered.map(s => renderActivityItem(s, true)).join('')}
         </div>`
    }
    <div class="footer-info">BLUETRAIN · ${esc(String(history.length))} SESIONES REGISTRADAS</div>`;

  // Filtros
  el.querySelectorAll<HTMLElement>('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      _filter = (btn.dataset['filter'] ?? 'all') as typeof _filter;
      void renderHistory();
    });
  });

  // Expandir/colapsar items
  el.querySelectorAll<HTMLElement>('[data-expandable]').forEach(item => {
    item.addEventListener('click', e => {
      if ((e.target as HTMLElement).closest('[data-delete]')) return;
      item.classList.toggle('expanded');
    });
  });

  // Borrar sesiones
  el.querySelectorAll<HTMLElement>('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.stopPropagation();
      const id = btn.dataset['delete'] ?? '';
      const confirmed = await showConfirm('¿Eliminar esta sesión del historial?', 'Eliminar');
      if (!confirmed || !id) return;
      await DB.deleteSession(id);
      showToast('Sesión eliminada');
      void renderHistory();
      const dashEl = document.getElementById('dashboardSection');
      if (dashEl?.classList.contains('active')) void renderDashboard();
    });
  });
}
