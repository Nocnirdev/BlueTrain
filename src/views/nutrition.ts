import { esc, $maybe } from '@/lib/html';

export function renderNutrition(): void {
  const el = document.getElementById('nutritionSection');
  if (!el) return;

  el.innerHTML = `
    <div class="section-hero nutrition-hero">
      <h2>NUTRICIÓN DEPORTIVA</h2>
      <p>Toda la información nutricional está basada exclusivamente en fuentes científicas verificadas: ISSN, ACSM, WHO/OMS y NSCA.</p>
      <p class="source-note">Fuentes: ISSN Position Stand 2017 · ACSM/ADA/DC 2016 · WHO/OMS · Mifflin-St Jeor (1990)</p>
    </div>

    <div class="no-spot-banner">
      <h3>IMPORTANTE: LA GRASA LOCALIZADA NO EXISTE</h3>
      <p>La evidencia científica actual <strong>no respalda</strong> la reducción de grasa localizada (<em>spot reduction</em>). Los ejercicios de core <strong>fortalecen la musculatura abdominal pero no eliminan la grasa de esa zona</strong>.</p>
      <p>La pérdida de grasa ocurre de forma sistémica mediante un déficit calórico sostenido.</p>
      <p style="font-size:11px;color:var(--text-dimmer);margin-top:6px;">Ref: Ramírez-Campillo et al. (2013). J Strength Cond Res. / ACSM Position Stand on Exercise for Weight Management.</p>
    </div>

    <div class="nutr-calc">
      <h3>Calculadora de Necesidades</h3>
      <span class="nutr-calc-src">Ecuación Mifflin-St Jeor · Validada por Harris et al. (1990) · Uso clínico ACSM</span>
      <div class="calc-grid">
        <div class="calc-field">
          <label class="calc-label" for="calcWeight">Peso (kg)</label>
          <input class="calc-input" id="calcWeight" type="number" placeholder="70" min="40" max="200" aria-label="Peso en kg">
        </div>
        <div class="calc-field">
          <label class="calc-label" for="calcHeight">Altura (cm)</label>
          <input class="calc-input" id="calcHeight" type="number" placeholder="175" min="140" max="220" aria-label="Altura en cm">
        </div>
        <div class="calc-field">
          <label class="calc-label" for="calcAge">Edad</label>
          <input class="calc-input" id="calcAge" type="number" placeholder="35" min="16" max="80" aria-label="Edad en años">
        </div>
        <div class="calc-field">
          <label class="calc-label" for="calcSex">Sexo biológico</label>
          <select class="calc-select" id="calcSex" aria-label="Sexo biológico">
            <option value="m">Hombre</option>
            <option value="f">Mujer</option>
          </select>
        </div>
      </div>
      <div class="calc-field" style="margin-bottom:10px;">
        <label class="calc-label" for="calcAct">Nivel de actividad</label>
        <select class="calc-select" id="calcAct">
          <option value="1.375">Ligero (1–3 días/semana)</option>
          <option value="1.55" selected>Moderado (3–5 días — BlueTrain)</option>
          <option value="1.725">Muy activo (6–7 días)</option>
          <option value="1.9">Atleta (2× día)</option>
        </select>
      </div>
      <div class="calc-field" style="margin-bottom:10px;">
        <label class="calc-label" for="calcGoal">Objetivo</label>
        <select class="calc-select" id="calcGoal">
          <option value="maintain">Mantenimiento</option>
          <option value="loss">Pérdida de grasa (déficit 500 kcal · WHO)</option>
          <option value="gain">Ganancia muscular (superávit 300 kcal)</option>
        </select>
      </div>
      <button class="calc-btn" id="calcBtn">Calcular</button>
      <div class="calc-results">
        <div class="calc-result"><div class="calc-result-val" id="resKcal">—</div><div class="calc-result-label">kcal / día</div></div>
        <div class="calc-result"><div class="calc-result-val" id="resProt">—</div><div class="calc-result-label">g proteína</div></div>
        <div class="calc-result"><div class="calc-result-val" id="resCarb">—</div><div class="calc-result-label">g carbohidratos</div></div>
      </div>
      <p style="font-size:11px;color:var(--text-dimmer);margin-top:10px;">Proteína: 1.8 g/kg (ISSN 2017) · Carbohidratos: resto de kcal tras proteína y 25% grasa (ACSM). Valores orientativos.</p>
    </div>

    <div class="nutr-grid">
      ${_card('🥩', 'Proteína', 'ISSN 2017', '1.6–2.2', 'g/kg/día', [
        '<strong>Activos en general:</strong> 1.4–2.0 g/kg/día (ISSN Position Stand, Jäger et al. 2017)',
        '<strong>Maximizar síntesis proteica muscular:</strong> 1.6–2.2 g/kg/día',
        '<strong>En déficit calórico:</strong> 1.8–2.4 g/kg para preservar músculo (Helms et al. 2014)',
        '<strong>Distribución óptima:</strong> 0.3–0.4 g/kg por toma, cada 3–4 horas',
        '<strong>Post-entrenamiento:</strong> 20–40 g dentro de las 2 primeras horas',
      ])}
      ${_card('🌾', 'Carbohidratos', 'ACSM 2016', '5–7', 'g/kg/día (entreno)', [
        '<strong>Atletas fuerza-resistencia:</strong> 5–7 g/kg/día en días de entreno',
        '<strong>Día de competición:</strong> 7–10 g/kg el día anterior (carga de glucógeno)',
        '<strong>Pre-entreno (1–4h antes):</strong> 1–4 g/kg, fácil digestión',
        '<strong>Durante ejercicio &gt;60 min:</strong> 30–60 g/h (geles, bebida isotónica)',
        '<strong>Post-entreno (dentro de 2h):</strong> 1–1.2 g/kg + proteína',
      ])}
      ${_card('🫒', 'Grasas', 'ACSM 2016', '20–35', '% de kcal totales', [
        '<strong>Rango recomendado:</strong> 20–35% de la ingesta calórica total (ACSM 2016)',
        '<strong>Mínimo:</strong> no bajar del 20% (impacto hormonal y vitaminas liposolubles)',
        '<strong>Priorizar:</strong> grasas insaturadas (MUFA y PUFA omega-3)',
        '<strong>Fuentes MUFA:</strong> aceite de oliva virgen extra, aguacate, almendras',
      ])}
      ${_card('💧', 'Hidratación', 'ACSM 2007', '0.4–0.8', 'L/h durante ejercicio', [
        '<strong>Pre-ejercicio (4h antes):</strong> 5–7 mL/kg de agua',
        '<strong>Durante el ejercicio:</strong> 400–800 mL/h',
        '<strong>Electrolitos:</strong> necesarios si el ejercicio supera 60–90 min',
        '<strong>Post-ejercicio:</strong> 1.25–1.5 L por cada kg de peso perdido',
      ])}
      ${_card('🏁', 'Nutrición para Competición', 'ISSN 2021 · ACSM', '', '', [
        '<strong>Noche anterior:</strong> 7–10 g/kg carbohidratos, bajo en fibra y grasa',
        '<strong>3–4h antes:</strong> 1–4 g/kg carbohidratos, proteína moderada, grasa mínima',
        '<strong>1h antes:</strong> 30–60 g carbohidratos simples (plátano, gel)',
        '<strong>Post-carrera (dentro de 2h):</strong> 0.3–0.4 g/kg proteína + 1 g/kg carbohidratos',
      ])}
      ${_card('🔥', 'Pérdida de Grasa', 'WHO/OMS · ACSM', '−500/−750', 'kcal/día (WHO)', [
        '<strong>Déficit calórico:</strong> 500–750 kcal/día → pérdida ~0.5–0.75 kg/semana',
        '<strong>Proteína en déficit:</strong> mantener 1.8–2.4 g/kg para preservar músculo',
        '<strong>Velocidad saludable:</strong> no superar 1 kg/semana',
      ])}
    </div>
    <div class="footer-info">NUTRICIÓN BASADA EN EVIDENCIA · ISSN · ACSM · WHO/OMS · NSCA</div>`;

  $maybe('calcBtn')?.addEventListener('click', _calcNutrition);
}

function _card(icon: string, title: string, src: string, highlight: string, unit: string, items: string[]): string {
  return `
    <div class="nutr-card">
      <div class="nutr-card-header">
        <div class="nutr-icon">${icon}</div>
        <h3 class="nutr-card-title">${esc(title)}</h3>
        <span class="nutr-card-src">${esc(src)}</span>
      </div>
      <div class="nutr-card-body">
        ${highlight ? `<div class="nutr-highlight">${esc(highlight)} <span>${esc(unit)}</span></div>` : ''}
        <ul class="nutr-list">${items.map(i => `<li>${i}</li>`).join('')}</ul>
      </div>
    </div>`;
}

function _calcNutrition(): void {
  const w   = parseFloat(($maybe<HTMLInputElement>('calcWeight')?.value ?? ''));
  const h   = parseFloat(($maybe<HTMLInputElement>('calcHeight')?.value ?? ''));
  const age = parseFloat(($maybe<HTMLInputElement>('calcAge')?.value ?? ''));
  const sex = ($maybe<HTMLSelectElement>('calcSex')?.value ?? 'm');
  const act = parseFloat(($maybe<HTMLSelectElement>('calcAct')?.value ?? '1.55'));
  const goal = ($maybe<HTMLSelectElement>('calcGoal')?.value ?? 'maintain');

  if (!w || !h || !age || w < 40 || w > 200 || h < 140 || h > 220 || age < 16 || age > 80) return;

  const bmr = sex === 'm'
    ? (10 * w) + (6.25 * h) - (5 * age) + 5
    : (10 * w) + (6.25 * h) - (5 * age) - 161;

  let tdee = Math.round(bmr * act);
  if (goal === 'loss') tdee -= 500;
  if (goal === 'gain') tdee += 300;

  const prot     = Math.round(w * 1.8);
  const fatKcal  = tdee * 0.25;
  const carb     = Math.max(0, Math.round((tdee - (prot * 4) - fatKcal) / 4));

  const kcalEl = $maybe('resKcal');
  const protEl = $maybe('resProt');
  const carbEl = $maybe('resCarb');
  if (kcalEl) kcalEl.textContent = String(tdee);
  if (protEl) protEl.textContent = prot + ' g';
  if (carbEl) carbEl.textContent = carb + ' g';
}
