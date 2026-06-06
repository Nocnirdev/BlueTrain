/* =====================================================
   BlueTrain — js/nutrition.js
   Renderizado de la sección Competición y Nutrición.
   Depende de: data/stations.js
   Fuentes: ISSN 2017, ACSM 2016, WHO/OMS, Mifflin-St Jeor
   ===================================================== */

/* ─── Competition section ─── */
function renderCompetition() {
  const el = document.getElementById('competitionSection');
  let html = `
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
    <div class="stations-grid">`;

  STATIONS.forEach(s => {
    html += `
      <div class="station-card">
        <div class="station-num">${s.num}</div>
        <div class="station-name">${s.name}</div>
        <div class="station-dist">${s.dist}</div>
        ${s.hasWeights ? `
        <div class="weights-grid">
          <div class="weight-cell"><div class="weight-div">Pro Hombres</div><div class="weight-val">${s.proM}</div></div>
          <div class="weight-cell"><div class="weight-div">Pro Mujeres</div><div class="weight-val">${s.proW}</div></div>
          <div class="weight-cell"><div class="weight-div">Open Hombres</div><div class="weight-val">${s.openM}</div></div>
          <div class="weight-cell"><div class="weight-div">Open Mujeres</div><div class="weight-val">${s.openW}</div></div>
        </div>` : ''}
        <ul class="station-tips">${s.tips.map(t => `<li>${t}</li>`).join('')}</ul>
      </div>`;
  });

  html += `</div><div class="footer-info">INFORMACIÓN OFICIAL · FORMATO FUNCIONAL DE CARRERA POR ESTACIONES</div>`;
  el.innerHTML = html;
}

/* ─── Nutrition section ─── */
function renderNutrition() {
  const el = document.getElementById('nutritionSection');
  el.innerHTML = `
    <div class="section-hero nutrition-hero">
      <h2>NUTRICIÓN DEPORTIVA</h2>
      <p>Toda la información nutricional está basada exclusivamente en fuentes científicas verificadas: ISSN, ACSM, WHO/OMS y NSCA.</p>
      <p class="source-note">Fuentes: ISSN Position Stand 2017 · ACSM/ADA/DC 2016 · WHO/OMS · Mifflin-St Jeor (1990)</p>
    </div>

    <div class="no-spot-banner">
      <h3>IMPORTANTE: LA GRASA LOCALIZADA NO EXISTE</h3>
      <p>La evidencia científica actual <strong>no respalda</strong> la reducción de grasa localizada (<em>spot reduction</em>). Los ejercicios de core (plank, dead bug, hollow hold…) <strong>fortalecen la musculatura abdominal pero no eliminan la grasa de esa zona</strong>.</p>
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
      <button class="calc-btn" onclick="calcNutrition()">Calcular</button>
      <div class="calc-results">
        <div class="calc-result"><div class="calc-result-val" id="resKcal">—</div><div class="calc-result-label">kcal / día</div></div>
        <div class="calc-result"><div class="calc-result-val" id="resProt">—</div><div class="calc-result-label">g proteína</div></div>
        <div class="calc-result"><div class="calc-result-val" id="resCarb">—</div><div class="calc-result-label">g carbohidratos</div></div>
      </div>
      <p style="font-size:11px;color:var(--text-dimmer);margin-top:10px;">Proteína: 1.8 g/kg (ISSN 2017) · Carbohidratos: resto de kcal tras proteína y 25% grasa (ACSM). Valores orientativos.</p>
    </div>

    <div class="nutr-grid">
      <div class="nutr-card">
        <div class="nutr-card-header">
          <div class="nutr-icon">🥩</div>
          <h3 class="nutr-card-title">Proteína</h3>
          <span class="nutr-card-src">ISSN 2017</span>
        </div>
        <div class="nutr-card-body">
          <div class="nutr-highlight">1.6–2.2 <span>g/kg/día</span></div>
          <ul class="nutr-list">
            <li><strong>Activos en general:</strong> 1.4–2.0 g/kg/día (ISSN Position Stand, Jäger et al. 2017)</li>
            <li><strong>Maximizar síntesis proteica muscular:</strong> 1.6–2.2 g/kg/día</li>
            <li><strong>En déficit calórico:</strong> 1.8–2.4 g/kg para preservar músculo (Helms et al. 2014)</li>
            <li><strong>Distribución óptima:</strong> 0.3–0.4 g/kg por toma, cada 3–4 horas</li>
            <li><strong>Post-entrenamiento:</strong> 20–40 g dentro de las 2 primeras horas</li>
            <li><strong>Fuentes:</strong> pollo (~31 g/100g), atún (~30 g/100g), huevos (~13 g/100g), lentejas (~9 g/100g)</li>
          </ul>
        </div>
      </div>

      <div class="nutr-card">
        <div class="nutr-card-header">
          <div class="nutr-icon">🌾</div>
          <h3 class="nutr-card-title">Carbohidratos</h3>
          <span class="nutr-card-src">ACSM 2016</span>
        </div>
        <div class="nutr-card-body">
          <div class="nutr-highlight">5–7 <span>g/kg/día (entreno)</span></div>
          <ul class="nutr-list">
            <li><strong>Atletas fuerza-resistencia:</strong> 5–7 g/kg/día en días de entreno (ACSM/ADA/DC 2016)</li>
            <li><strong>Día de competición:</strong> 7–10 g/kg el día anterior (carga de glucógeno)</li>
            <li><strong>Pre-entreno (1–4h antes):</strong> 1–4 g/kg, fácil digestión</li>
            <li><strong>Durante ejercicio &gt;60 min:</strong> 30–60 g/h (geles, bebida isotónica)</li>
            <li><strong>Post-entreno (dentro de 2h):</strong> 1–1.2 g/kg + proteína</li>
            <li><strong>Fuentes:</strong> avena, arroz, pasta, patata, plátano, fruta</li>
          </ul>
        </div>
      </div>

      <div class="nutr-card">
        <div class="nutr-card-header">
          <div class="nutr-icon">🫒</div>
          <h3 class="nutr-card-title">Grasas</h3>
          <span class="nutr-card-src">ACSM 2016</span>
        </div>
        <div class="nutr-card-body">
          <div class="nutr-highlight">20–35 <span>% de kcal totales</span></div>
          <ul class="nutr-list">
            <li><strong>Rango recomendado:</strong> 20–35% de la ingesta calórica total (ACSM 2016)</li>
            <li><strong>Mínimo:</strong> no bajar del 20% (impacto hormonal y vitaminas liposolubles)</li>
            <li><strong>Priorizar:</strong> grasas insaturadas (MUFA y PUFA omega-3)</li>
            <li><strong>Fuentes MUFA:</strong> aceite de oliva virgen extra, aguacate, almendras</li>
            <li><strong>Fuentes omega-3:</strong> salmón, sardinas, nueces, semillas de chía</li>
          </ul>
        </div>
      </div>

      <div class="nutr-card">
        <div class="nutr-card-header">
          <div class="nutr-icon">💧</div>
          <h3 class="nutr-card-title">Hidratación</h3>
          <span class="nutr-card-src">ACSM 2007</span>
        </div>
        <div class="nutr-card-body">
          <div class="nutr-highlight">0.4–0.8 <span>L/h durante ejercicio</span></div>
          <ul class="nutr-list">
            <li><strong>Pre-ejercicio (4h antes):</strong> 5–7 mL/kg de agua (ACSM Position Stand 2007)</li>
            <li><strong>Pre-ejercicio (2h antes):</strong> 3–5 mL/kg si la orina es oscura</li>
            <li><strong>Durante el ejercicio:</strong> 400–800 mL/h (ajustar a la tasa de sudoración)</li>
            <li><strong>Electrolitos:</strong> necesarios si el ejercicio supera 60–90 min (400–1100 mg Na/L)</li>
            <li><strong>Post-ejercicio:</strong> 1.25–1.5 L por cada kg de peso perdido</li>
            <li><strong>Control:</strong> orina color amarillo pálido = hidratación correcta</li>
          </ul>
        </div>
      </div>

      <div class="nutr-card">
        <div class="nutr-card-header">
          <div class="nutr-icon">🏁</div>
          <h3 class="nutr-card-title">Nutrición para Competición</h3>
          <span class="nutr-card-src">ISSN 2021 · ACSM</span>
        </div>
        <div class="nutr-card-body">
          <ul class="nutr-list">
            <li><strong>Noche anterior:</strong> 7–10 g/kg carbohidratos, bajo en fibra y grasa</li>
            <li><strong>3–4h antes:</strong> 1–4 g/kg carbohidratos, proteína moderada, grasa mínima</li>
            <li><strong>1h antes:</strong> 30–60 g carbohidratos simples (plátano, gel), poca proteína</li>
            <li><strong>Durante (&lt;90 min):</strong> hidratación isotónica, sin sólido necesario</li>
            <li><strong>Durante (&gt;90 min):</strong> 30–60 g/h carbohidratos + 400–600 mg/L sodio</li>
            <li><strong>Post-carrera (dentro de 2h):</strong> 0.3–0.4 g/kg proteína + 1 g/kg carbohidratos</li>
          </ul>
        </div>
      </div>

      <div class="nutr-card">
        <div class="nutr-card-header">
          <div class="nutr-icon">🔥</div>
          <h3 class="nutr-card-title">Pérdida de Grasa</h3>
          <span class="nutr-card-src">WHO/OMS · ACSM</span>
        </div>
        <div class="nutr-card-body">
          <div class="nutr-highlight">−500/−750 <span>kcal/día (WHO)</span></div>
          <ul class="nutr-list">
            <li><strong>Déficit calórico:</strong> 500–750 kcal/día → pérdida ~0.5–0.75 kg/semana (WHO/OMS)</li>
            <li><strong>Proteína en déficit:</strong> mantener 1.8–2.4 g/kg para preservar músculo</li>
            <li><strong>Velocidad saludable:</strong> no superar 1 kg/semana</li>
            <li><strong>Ejercicio funcional:</strong> aumenta el gasto calórico total, no elimina grasa localizada</li>
            <li><strong>Core recomendado:</strong> plank, side plank, dead bug, hollow hold, bird dog, farmer carry</li>
            <li><strong>Recuerda:</strong> fortalecen el core pero NO eliminan grasa abdominal de forma localizada</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-info">NUTRICIÓN BASADA EN EVIDENCIA · ISSN · ACSM · WHO/OMS · NSCA</div>`;
}

/* ─── Calculator (Mifflin-St Jeor) ─── */
function calcNutrition() {
  const w   = parseFloat(document.getElementById('calcWeight').value);
  const h   = parseFloat(document.getElementById('calcHeight').value);
  const age = parseFloat(document.getElementById('calcAge').value);
  const sex = document.getElementById('calcSex').value;
  const act = parseFloat(document.getElementById('calcAct').value);
  const goal = document.getElementById('calcGoal').value;

  if (!w || !h || !age) return;

  /* Mifflin-St Jeor BMR (Harris et al. 1990) */
  const bmr = sex === 'm'
    ? (10 * w) + (6.25 * h) - (5 * age) + 5
    : (10 * w) + (6.25 * h) - (5 * age) - 161;

  let tdee = Math.round(bmr * act);
  if (goal === 'loss') tdee -= 500;
  if (goal === 'gain') tdee += 300;

  const prot    = Math.round(w * 1.8);        /* ISSN 2017: 1.8 g/kg */
  const fatKcal = tdee * 0.25;               /* 25% de kcal en grasa */
  const carbKcal = tdee - (prot * 4) - fatKcal;
  const carb    = Math.max(0, Math.round(carbKcal / 4));

  document.getElementById('resKcal').textContent = tdee;
  document.getElementById('resProt').textContent = prot + ' g';
  document.getElementById('resCarb').textContent = carb + ' g';
}
