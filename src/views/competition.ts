import { STATIONS } from '@/data/stations';
import { esc } from '@/lib/html';

export function renderCompetition(): void {
  const el = document.getElementById('competitionSection');
  if (!el) return;

  const stationsHtml = STATIONS.map(s => `
    <div class="station-card">
      <div class="station-num">${esc(String(s.num))}</div>
      <div class="station-name">${esc(s.name)}</div>
      <div class="station-dist">${esc(s.dist)}</div>
      ${s.hasWeights ? `
      <div class="weights-grid">
        <div class="weight-cell"><div class="weight-div">Pro Hombres</div><div class="weight-val">${esc(s.proM ?? '—')}</div></div>
        <div class="weight-cell"><div class="weight-div">Pro Mujeres</div><div class="weight-val">${esc(s.proW ?? '—')}</div></div>
        <div class="weight-cell"><div class="weight-div">Open Hombres</div><div class="weight-val">${esc(s.openM ?? '—')}</div></div>
        <div class="weight-cell"><div class="weight-div">Open Mujeres</div><div class="weight-val">${esc(s.openW ?? '—')}</div></div>
      </div>` : ''}
      <ul class="station-tips">${s.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
    </div>`).join('');

  el.innerHTML = `
    <div class="section-hero">
      <h2>FORMATO DE CARRERA</h2>
      <p>Competición de fitness indoor que combina 8 km de carrera (8 × 1 km) con 8 estaciones de trabajo funcional. El orden de las estaciones es siempre el mismo en todas las ciudades.</p>
      <div class="race-route">
        <span class="run">1 km RUN</span><span class="arrow">→</span>
        <span class="station">1 SKIERG</span><span class="arrow">→</span>
        <span class="run">1 km RUN</span><span class="arrow">→</span>
        <span class="station">2 SLED PUSH</span><span class="arrow">→</span>
        <span class="run">1 km RUN</span><span class="arrow">→</span>
        <span class="station">3 SLED PULL</span><span class="arrow">→</span>
        <span class="run">1 km RUN</span><span class="arrow">→</span>
        <span class="station">4 BURPEE BROAD JUMP</span><span class="arrow">→</span>
        <span class="run">1 km RUN</span><span class="arrow">→</span>
        <span class="station">5 ROWING</span><span class="arrow">→</span>
        <span class="run">1 km RUN</span><span class="arrow">→</span>
        <span class="station">6 FARMERS CARRY</span><span class="arrow">→</span>
        <span class="run">1 km RUN</span><span class="arrow">→</span>
        <span class="station">7 SANDBAG LUNGES</span><span class="arrow">→</span>
        <span class="run">1 km RUN</span><span class="arrow">→</span>
        <span class="station">8 WALL BALLS</span>
      </div>
      <p class="source-note">Formato oficial de carrera funcional por estaciones. Los pesos pueden variar cada temporada.</p>
    </div>

    <div class="section-title-bar">
      <h3>Las 8 Estaciones</h3>
      <span class="source-badge">Datos oficiales de carrera</span>
    </div>
    <div class="stations-grid">${stationsHtml}</div>
    <div class="footer-info">INFORMACIÓN OFICIAL · FORMATO FUNCIONAL DE CARRERA POR ESTACIONES</div>`;
}
