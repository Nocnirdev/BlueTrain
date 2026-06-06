import type { WorkoutsData } from '@/types';

export const WORKOUTS_DATA: WorkoutsData = {

  A1: {
    title: 'Tren Inferior + Push',
    subtitle: 'Mesociclo 1 · Base · Sentadilla + Funcional push',
    week: 'Semana 1–4', duration: '60 min', focus: 'Fuerza + Wall Balls',
    blocks: [
      {
        type: 'warmup', title: 'Calentamiento', duration: '10 min',
        items: [
          { name: 'Bici o remo Z1 progresivo', prescription: '3 min', anim: 'row-warmup', searchQuery: 'rowing easy warm up technique', cues: ['Empieza muy suave', 'Sube ritmo gradualmente', 'Termina respirando algo más fuerte'] },
          { name: 'Cat-Cow', prescription: '8 reps', anim: 'cat-cow', searchQuery: 'cat cow stretch spine mobility', cues: ['Mueve la columna vértebra a vértebra', 'Coordina con respiración'] },
          { name: 'Apertura torácica', prescription: '8/lado', anim: 'thoracic-opener', searchQuery: 'thoracic spine opener mobility', cues: ['Cadera fija mirando al suelo', 'Abre el pecho con la mano que sube'] },
          { name: 'Glute bridge con banda', prescription: '15 reps', anim: 'glute-bridge', searchQuery: 'glute bridge band activation', cues: ['Aprieta glúteo arriba 1s', 'No arquees lumbar'] },
          { name: "World's greatest stretch", prescription: '5/lado', anim: 'world-stretch', searchQuery: 'worlds greatest stretch warm up', cues: ['Codo al suelo dentro del pie', 'Rota torso hacia arriba'] },
          { name: 'Dead bug', prescription: '8/lado', anim: 'dead-bug', searchQuery: 'dead bug core stability', cues: ['Lumbar pegada al suelo siempre', 'Brazo y pierna contrarios'] },
          { name: 'Air squats + jumping jacks', prescription: '15 + 20', anim: 'jumping-jacks', searchQuery: 'air squats jumping jacks warm up', cues: ['Activación final progresiva'] },
        ],
      },
      {
        type: 'strength', title: 'Bloque de Fuerza', duration: '22 min',
        note: '<strong>Progresión:</strong> Sem 1: 70% · Sem 2: 72,5% · Sem 3: 75% · Sem 4 descarga: 65%',
        items: [
          { name: 'A1 · Back Squat', prescription: '4 × 6', rpe: 'RPE 7', rest: '2 min', anim: 'back-squat', searchQuery: 'back squat proper form barbell tutorial', cues: ['Pies anchura hombros, puntas ligeramente abiertas', 'Pecho arriba, mirada al frente', 'Rodillas siguen línea de los pies', 'Profundidad: cadera por debajo de rodilla', 'Empuja el suelo, no te levantes'] },
          { name: 'A2 · Plancha RKC', prescription: '4 × 30s', rpe: 'RPE 7', rest: '—', anim: 'plank-rkc', searchQuery: 'RKC plank hard plank technique', cues: ['Aprieta glúteos máximo', 'Tira codos hacia los pies (isométrico)', 'Respiración corta y tensa'] },
          { name: 'B1 · Sentadilla búlgara', prescription: '3 × 8/pierna', rpe: 'RPE 7', rest: '90s', anim: 'bulgarian-split', searchQuery: 'bulgarian split squat technique', cues: ['Pie atrás sobre banco, empeine arriba', 'Tronco ligeramente inclinado', 'Baja recto, rodilla delantera estable', 'Peso en talón pierna delantera'] },
          { name: 'B2 · Pallof press', prescription: '3 × 10/lado', rpe: 'RPE 6', rest: '60s', anim: 'pallof-press', searchQuery: 'pallof press anti rotation core', cues: ['Banda perpendicular al cuerpo', 'Aprieta core, no rotes', 'Estira brazos lentos y vuelve'] },
          { name: 'C1 · Farmer carry', prescription: '3 × 30 m', rpe: 'RPE 7', rest: '60s', anim: 'farmer-carry', searchQuery: 'farmer carry walk technique', cues: ['Pesos en cada mano', 'Hombros atrás, pecho arriba', 'Pasos cortos y rápidos', 'Aprieta core todo el recorrido'] },
        ],
      },
      {
        type: 'competition', title: 'Bloque Competición', duration: '15 min',
        protocol: { name: '3 Rondas · For Time', time: 'Descanso 90s entre rondas', items: ['400 m carrera @ RPE 7', '20 wall balls (6–9 kg)', '15 burpees', '30s plancha'] },
        items: [
          { name: 'Wall Ball', prescription: '20 reps · 6–9 kg', anim: 'wall-ball', searchQuery: 'functional race wall ball tutorial technique', cues: ['Sentadilla profunda con balón al pecho', 'Sube explosivo, balón a diana (3 m H / 2.7 m M)', 'Recibe en sentadilla', 'Cadera por debajo de rodilla cada rep'] },
          { name: 'Burpee', prescription: '15 reps', anim: 'burpee', searchQuery: 'burpee proper form tutorial', cues: ['Pecho al suelo abajo', 'Salto con palmada arriba', 'Ritmo constante, no pares'] },
          { name: 'Carrera 400 m', prescription: '400 m', anim: 'running', searchQuery: 'running form technique 400m', cues: ['Cadencia alta', 'Tronco ligeramente adelantado', 'Brazos relajados'] },
        ],
      },
      {
        type: 'finisher', title: 'Finisher', duration: '6 min',
        protocol: { name: "EMOM 6'", time: 'Cada minuto, on the minute', items: ['Min impar: 12 swings con kettlebell (20 kg)', 'Min par: 10 mountain climbers/lado'] },
        items: [
          { name: 'KB swing ruso', prescription: '12 reps · 20 kg', anim: 'kb-swing', searchQuery: 'russian kettlebell swing technique', cues: ['Cadera = motor (no brazos)', 'KB llega altura pecho', 'Aprieta glúteos arriba'] },
          { name: 'Mountain climbers', prescription: '10/lado', anim: 'mountain-climber', searchQuery: 'mountain climbers exercise form', cues: ['Cadera baja, plancha sólida', 'Rodilla al pecho rápido', 'Sin rebotar caderas'] },
        ],
      },
      {
        type: 'cooldown', title: 'Vuelta a la calma', duration: '5 min',
        items: [
          { name: 'Pigeon stretch', prescription: '60s/lado', anim: 'pigeon-pose', searchQuery: 'pigeon pose hip stretch', cues: ['Pierna delantera flexionada 90°', 'Tronco bajado lentamente'] },
          { name: "Child's pose extendida", prescription: '45s/lado', anim: 'child-pose', searchQuery: 'extended child pose side stretch', cues: ['Brazos extendidos, manos al lado', 'Estira dorsal completo'] },
          { name: 'Estiramiento isquios tumbado', prescription: '45s/lado', anim: 'hamstring-stretch', searchQuery: 'hamstring stretch lying down strap', cues: ['Toalla o banda en pie', 'Pierna recta, rodilla sin bloquear'] },
          { name: 'Respiración diafragmática', prescription: '90s', anim: 'breathing', searchQuery: 'diaphragmatic breathing tutorial', cues: ['Inhala 4s nariz, exhala 6s boca', 'Hincha abdomen, no pecho'] },
        ],
      },
    ],
  },

  B1: {
    title: 'Tren Superior + Pull',
    subtitle: 'Mesociclo 1 · Base · Peso muerto + Funcional pull',
    week: 'Semana 1–4', duration: '60 min', focus: 'Fuerza + Remo',
    blocks: [
      {
        type: 'warmup', title: 'Calentamiento', duration: '10 min',
        items: [
          { name: 'Ski erg o remo Z1', prescription: '3 min', anim: 'ski-erg-warm', searchQuery: 'ski erg technique tutorial', cues: ['Movimiento amplio', 'Calienta hombros y cadera'] },
          { name: 'Band pull-aparts', prescription: '15 reps', anim: 'band-pull-apart', searchQuery: 'band pull aparts shoulder warm up', cues: ['Brazos extendidos al frente', 'Aprieta escápulas atrás'] },
          { name: 'Scapular pull-ups', prescription: '8 reps', anim: 'scap-pullup', searchQuery: 'scapular pull ups tutorial', cues: ['Solo retracción escapular', 'Sin doblar codos'] },
          { name: 'YTW prono', prescription: '8 c/u', anim: 'ytw-prone', searchQuery: 'YTW prone shoulder exercise', cues: ['Tumbado boca abajo', 'Forma Y, T y W con brazos'] },
          { name: 'Bird dog', prescription: '8/lado', anim: 'bird-dog', searchQuery: 'bird dog exercise core stability', cues: ['Brazo y pierna contrarios', 'Cadera sin rotar'] },
          { name: 'Push-up to down dog', prescription: '8 reps', anim: 'push-up-dog', searchQuery: 'push up to downward dog mobility', cues: ['Empuja caderas arriba', 'Estira cadenas posteriores'] },
        ],
      },
      {
        type: 'strength', title: 'Bloque de Fuerza', duration: '22 min',
        note: '<strong>Progresión peso muerto:</strong> S1: 70% · S2: 75% · S3: 77,5% · S4 descarga: 65%',
        items: [
          { name: 'A1 · Peso muerto convencional', prescription: '4 × 5', rpe: 'RPE 7', rest: '2,5 min', anim: 'deadlift', searchQuery: 'deadlift tutorial proper form barbell', cues: ['Barra pegada al cuerpo', 'Espalda neutra, no encorvada', 'Empuja el suelo con los pies', 'Cadera y hombros suben a la vez', 'Aprieta glúteos arriba'] },
          { name: 'A2 · Hollow hold', prescription: '4 × 25s', rpe: 'RPE 7', rest: '—', anim: 'hollow-hold', searchQuery: 'hollow hold tutorial core', cues: ['Lumbar pegada al suelo', 'Hombros y piernas elevados', "Cuerpo forma 'banana' invertida"] },
          { name: 'B1 · Dominadas (o asistidas)', prescription: '4 × max-2', rpe: 'RPE 8', rest: '2 min', anim: 'pull-up', searchQuery: 'pull up tutorial proper form', cues: ['Agarre prono anchura hombros', 'Pecho hacia la barra', 'Sin balanceo, control total', 'Si no llegas: usa banda elástica o jalón'] },
          { name: 'B2 · Remo con mancuerna', prescription: '3 × 10/lado', rpe: 'RPE 7', rest: '75s', anim: 'db-row', searchQuery: 'single arm dumbbell row tutorial', cues: ['Apoyo en banco, espalda plana', 'Tira hacia cadera, no axila', 'Codo pegado al cuerpo'] },
          { name: 'C1 · Curl martillo', prescription: '3 × 12', rpe: 'RPE 7', rest: '60s', anim: 'hammer-curl', searchQuery: 'hammer curl dumbbell tutorial', cues: ['Tempo 3-0-1 (3s bajar)', 'Codos pegados al cuerpo', 'Sin balanceo'] },
          { name: 'C2 · Press francés mancuernas', prescription: '3 × 12', rpe: 'RPE 7', rest: '60s', anim: 'tricep-extension', searchQuery: 'dumbbell overhead triceps extension', cues: ['Codos fijos apuntando arriba', 'Baja la mancuerna detrás de la cabeza', 'Extensión completa'] },
        ],
      },
      {
        type: 'competition', title: 'Bloque Competición', duration: '15 min',
        protocol: { name: "AMRAP 15'", time: 'As many rounds as possible', items: ['500 m remo', '15 burpee broad jump', '20 lunges con mancuernas', '10 renegade rows/lado'] },
        items: [
          { name: 'Remo (estación oficial)', prescription: '500 m', anim: 'row-machine', searchQuery: 'functional race rowing technique tutorial', cues: ['Secuencia: piernas, cadera, brazos', 'Vuelta: brazos, cadera, piernas', 'Ritmo objetivo: 2:00–2:10/500m'] },
          { name: 'Burpee broad jump', prescription: '15 reps', anim: 'burpee-broad', searchQuery: 'functional race burpee broad jump tutorial', cues: ['Burpee + salto horizontal largo', 'Aterrizaje suave'] },
          { name: 'Walking lunges mancuernas', prescription: '20 reps · 2×12 kg', anim: 'walking-lunges', searchQuery: 'walking lunges dumbbells tutorial', cues: ['Paso largo, rodilla atrás casi al suelo', 'Tronco vertical'] },
          { name: 'Renegade row', prescription: '10/lado', anim: 'renegade-row', searchQuery: 'renegade row dumbbells tutorial', cues: ['Plancha alta con mancuernas', 'Tira una mano sin rotar cadera', 'Core muy apretado'] },
        ],
      },
      {
        type: 'finisher', title: 'Finisher', duration: '6 min',
        protocol: { name: 'Intervalos 30/30 · Ski Erg', time: '6 rondas', items: ['30s ski erg @ RPE 8 (fuerte)', '30s descanso activo', 'Repetir × 6'] },
        items: [
          { name: 'Ski erg intervalos', prescription: '30s on / 30s off · 6', anim: 'ski-erg', searchQuery: 'ski erg intervals tutorial', cues: ['Tira de brazos + bisagra cadera', 'Termina con manos a los muslos', 'Mantén potencia constante'] },
        ],
      },
      {
        type: 'cooldown', title: 'Vuelta a la calma', duration: '5 min',
        items: [
          { name: 'Doorway pec stretch', prescription: '45s/lado', anim: 'doorway-pec', searchQuery: 'doorway pec stretch chest', cues: ['Antebrazo en marco puerta', 'Rota tronco lentamente'] },
          { name: 'Lat stretch en barra', prescription: '45s/lado', anim: 'lat-stretch', searchQuery: 'lat stretch hanging bar', cues: ['Cuélgate ligeramente', 'Estira dorsal abajo'] },
          { name: 'Twist espinal tumbado', prescription: '45s/lado', anim: 'supine-twist', searchQuery: 'supine spinal twist stretch', cues: ['Hombros pegados al suelo', 'Rodilla cae al lado opuesto'] },
          { name: 'Respiración 4-7-8', prescription: '90s', anim: 'breathing', searchQuery: '4 7 8 breathing technique', cues: ['Inhala 4s, retén 7s, exhala 8s'] },
        ],
      },
    ],
  },

  C1: {
    title: 'Full Body + Simulación',
    subtitle: 'Mesociclo 1 · Base · Circuito + Mini Competición',
    week: 'Semana 1–4', duration: '60 min', focus: 'Transferencia',
    blocks: [
      {
        type: 'warmup', title: 'Calentamiento general', duration: '10 min',
        items: [
          { name: 'Combo movilidad completa', prescription: '5 min', anim: 'world-stretch', searchQuery: 'dynamic mobility warm up full body', cues: ['Mezcla de cadera, hombros, columna', 'Progresivo'] },
          { name: 'Activación glúteo + core', prescription: '3 min', anim: 'glute-bridge', searchQuery: 'glute activation core warm up', cues: ['Glute bridge + dead bug alternos'] },
          { name: 'Salto a la comba', prescription: '2 min', anim: 'jump-rope', searchQuery: 'jump rope warm up cardio', cues: ['Cadencia rápida', 'Calentamiento cardiovascular final'] },
        ],
      },
      {
        type: 'strength', title: 'Circuito de Fuerza', duration: '20 min',
        protocol: { name: '4 Rondas · RPE 7', time: 'Descanso 90s entre rondas', items: ['12 goblet squats', '8/lado push-up con rotación', '8/pierna KB single-leg deadlift', '8/lado renegade row', '20 m/lado suitcase carry'] },
        items: [
          { name: 'Goblet squat', prescription: '12 reps', anim: 'goblet-squat', searchQuery: 'goblet squat tutorial kettlebell', cues: ['KB o mancuerna al pecho', 'Sentadilla profunda controlada'] },
          { name: 'Push-up con rotación', prescription: '8/lado', anim: 't-pushup', searchQuery: 'T push up rotation tutorial', cues: ['Flexión completa', 'Sube y rota brazo al techo'] },
          { name: 'KB single-leg deadlift', prescription: '8/pierna', anim: 'sl-deadlift', searchQuery: 'single leg deadlift kettlebell tutorial', cues: ['Cadera bisagra sobre una pierna', 'Pierna libre como contrapeso'] },
          { name: 'Renegade row', prescription: '8/lado', anim: 'renegade-row', searchQuery: 'renegade row tutorial form', cues: ['Plancha estable', 'Sin rotar cadera al tirar'] },
          { name: 'Suitcase carry', prescription: '20 m/lado', anim: 'suitcase-carry', searchQuery: 'suitcase carry exercise tutorial', cues: ['Peso solo en una mano', 'No te inclines, core resiste'] },
        ],
      },
      {
        type: 'competition', title: 'Simulación Reducida', duration: '18 min',
        protocol: { name: '3 Estaciones × 2 Vueltas', time: 'Descanso 60s entre estaciones', items: ['400m carrera + 50 m sled push (o 30 squat jumps)', '400m carrera + 40 m sled pull (o 20 inverted rows)', '400m carrera + 80 m farmer carry (2×20 kg)'] },
        items: [
          { name: 'Sled push', prescription: '50 m · pesado', anim: 'sled-push', searchQuery: 'functional race sled push technique tutorial', cues: ['Tronco inclinado 45°', 'Pasos cortos y potentes', 'Empuja desde los pies'] },
          { name: 'Sled pull', prescription: '40 m · cuerda', anim: 'sled-pull', searchQuery: 'functional race sled pull rope technique', cues: ['Tira con cadera + brazos', 'Sustituto: rows invertidos'] },
          { name: 'Squat jumps (sustituto)', prescription: '30 reps', anim: 'squat-jump', searchQuery: 'squat jumps plyometric tutorial', cues: ['Aterrizaje suave en sentadilla'] },
          { name: 'Farmer carry pesado', prescription: '80 m · 2×20 kg', anim: 'farmer-carry', searchQuery: 'heavy farmer carry technique', cues: ['Postura erguida', 'Pasos cortos rápidos'] },
        ],
      },
      {
        type: 'finisher', title: 'Finisher', duration: '6 min',
        protocol: { name: "AMRAP 6'", time: 'Tantas rondas como puedas', items: ['10 wall balls', '10 burpees', '200 m carrera'] },
        items: [
          { name: 'Wall ball', prescription: '10 reps', anim: 'wall-ball', searchQuery: 'wall ball technique', cues: ['Profundidad de sentadilla completa'] },
          { name: 'Burpee', prescription: '10 reps', anim: 'burpee', searchQuery: 'burpee proper form', cues: ['Mantén ritmo aunque sea lento'] },
        ],
      },
      {
        type: 'cooldown', title: 'Vuelta a la calma', duration: '5 min',
        items: [
          { name: '90/90 cadera', prescription: '60s/lado', anim: 'ninety-ninety', searchQuery: '90 90 hip stretch mobility', cues: ['Ambas piernas en ángulo recto', 'Tronco erguido'] },
          { name: 'Cat-cow lento', prescription: '60s', anim: 'cat-cow', searchQuery: 'cat cow slow breathing', cues: ['Coordina con respiración profunda'] },
          { name: 'Pigeon stretch', prescription: '45s/lado', anim: 'pigeon-pose', searchQuery: 'pigeon pose hip stretch', cues: ['Glúteo profundo'] },
          { name: 'Respiración 4-7-8', prescription: '90s', anim: 'breathing', searchQuery: '4 7 8 breathing relaxation', cues: ['Inhala 4 · retén 7 · exhala 8'] },
        ],
      },
    ],
  },

  A2: {
    title: 'Tren Inferior + Push',
    subtitle: 'Mesociclo 2 · Intensificación · Sentadilla pesada + Ski Erg',
    week: 'Semana 5–8', duration: '65 min', focus: 'Fuerza + Ski Erg',
    blocks: [
      {
        type: 'warmup', title: 'Calentamiento', duration: '10 min',
        items: [
          { name: 'Remo Z1 progresivo', prescription: '3 min', anim: 'row-warmup', searchQuery: 'rowing warm up easy progression', cues: ['Arranca RPE 3, llega a RPE 5 al final', 'Prepara cadera y espalda para la sentadilla'] },
          { name: 'Hip 90/90 + rotación torácica', prescription: '8/lado', anim: 'ninety-ninety', searchQuery: '90 90 hip thoracic rotation mobility', cues: ['Siéntate en 90/90', 'Rota columna torácica hacia arriba'] },
          { name: 'Glute bridge unilateral con banda', prescription: '10/pierna', anim: 'glute-bridge', searchQuery: 'single leg glute bridge activation', cues: ['Banda sobre rodillas, empuja hacia afuera', 'Aprieta glúteo 2s en la cima'] },
          { name: 'Goblet squat de descarga', prescription: '10 reps lentos', anim: 'goblet-squat', searchQuery: 'goblet squat deep warm up', cues: ['3s de bajada', 'Profundidad máxima, activa core'] },
          { name: 'Jumping jacks + air squat', prescription: '20 + 10', anim: 'jumping-jacks', searchQuery: 'jumping jacks air squat activation', cues: ['Activa el patrón motor de sentadilla'] },
        ],
      },
      {
        type: 'strength', title: 'Bloque de Fuerza', duration: '22 min',
        note: '<strong>Intensificación M2 (NSCA):</strong> Sem 5: 78% · Sem 6: 80% · Sem 7: 82% · Sem 8 descarga: 70%. Volumen reducido, intensidad aumentada.',
        items: [
          { name: 'A1 · Back Squat', prescription: '4 × 4', rpe: 'RPE 8', rest: '2,5 min', anim: 'back-squat', searchQuery: 'back squat heavy 4x4 technique', cues: ['Carga aumentada respecto a M1', 'Descenso controlado 3s', 'Explosivo en la subida', 'Pausa 1s en la cima', 'Rodillas siguen línea de pies en todo momento'] },
          { name: 'A2 · Plancha RKC', prescription: '4 × 35s', rpe: 'RPE 8', rest: '—', anim: 'plank-rkc', searchQuery: 'RKC plank hard style tutorial', cues: ['Aprieta glúteos al máximo', 'Tira codos hacia pies (isométrico)', 'Respiración corta y tensa'] },
          { name: 'B1 · Hip Thrust con barra', prescription: '3 × 10', rpe: 'RPE 7', rest: '90s', anim: 'glute-bridge', searchQuery: 'barbell hip thrust glutes tutorial', cues: ['Barra sobre caderas con pad acolchado', 'Hombros sobre el banco, pies planos', 'Empuja maximizando glúteo, no lumbar', 'Pausa 1s arriba'] },
          { name: 'B2 · Sentadilla búlgara pesada', prescription: '3 × 6/pierna', rpe: 'RPE 8', rest: '90s', anim: 'bulgarian-split', searchQuery: 'bulgarian split squat heavy dumbbell', cues: ['Más carga que M1 manteniendo técnica', 'Rodilla trasera sin golpear el suelo', '70% del peso en pierna delantera'] },
          { name: 'C1 · Farmer carry pesado', prescription: '3 × 40 m', rpe: 'RPE 7', rest: '75s', anim: 'farmer-carry', searchQuery: 'heavy farmer carry competition', cues: ['Peso aumentado vs M1', 'Pasos cortos y rápidos', 'Core apretado todo el recorrido'] },
        ],
      },
      {
        type: 'competition', title: 'Bloque Competición', duration: '16 min',
        protocol: { name: '4 Rondas · For Time', time: 'Descanso 2 min entre rondas', items: ['200 m ski erg @ RPE 8–9', '15 wall balls (7–10 kg)', '10 burpee broad jumps'] },
        items: [
          { name: 'Ski Erg (estación oficial)', prescription: '200 m · RPE 8–9', anim: 'ski-erg', searchQuery: 'functional race ski erg pacing technique', cues: ['Doble pull: brazos + flexión de cadera sincronizados', 'Termina el tirón con manos a los muslos', 'Ritmo objetivo competición: 2:20–2:30 /500m'] },
          { name: 'Wall Ball (estación oficial)', prescription: '15 reps · 7–10 kg', anim: 'wall-ball', searchQuery: 'functional race wall ball heavy technique', cues: ['Diana oficial: 3 m (H) / 2.7 m (M)', 'Sentadilla profunda: cadera bajo rodilla en cada rep', 'Impulso desde el suelo: usa piernas, no solo brazos'] },
          { name: 'Burpee Broad Jump (estación oficial)', prescription: '10 reps', anim: 'burpee-broad', searchQuery: 'functional race burpee broad jump technique', cues: ['Pecho al suelo obligatorio en cada rep', 'Salto horizontal máximo', 'Aterrizaje suave en semiflexión'] },
        ],
      },
      {
        type: 'finisher', title: 'Finisher', duration: '7 min',
        protocol: { name: "EMOM 8'", time: 'Alterna cada minuto', items: ['Min impar: 20s ski erg sprint + 12 wall balls', 'Min par: 15 KB swings (24 kg) + 30s plancha'] },
        items: [
          { name: 'Ski erg sprint', prescription: '20s máximo', anim: 'ski-erg', searchQuery: 'ski erg sprint intervals', cues: ['Potencia máxima durante 20s'] },
          { name: 'Wall balls ritmo', prescription: '12 reps', anim: 'wall-ball', searchQuery: 'wall ball rhythm unbroken', cues: ['Sin parar, ritmo constante'] },
          { name: 'KB swing ruso', prescription: '15 reps · 24 kg', anim: 'kb-swing', searchQuery: 'russian kettlebell swing 24kg', cues: ['Potencia de cadera, no de brazos'] },
        ],
      },
      {
        type: 'cooldown', title: 'Vuelta a la calma', duration: '5 min',
        items: [
          { name: 'Couch stretch (flexor cadera)', prescription: '60s/pierna', anim: 'pigeon-pose', searchQuery: 'couch stretch hip flexor quad', cues: ['Rodilla trasera al suelo, pie en la pared', 'Activa glúteo: empuja cadera hacia delante'] },
          { name: 'Pigeon stretch', prescription: '60s/lado', anim: 'pigeon-pose', searchQuery: 'pigeon pose deep hip stretch', cues: ['Respira y relájate progresivamente'] },
          { name: "Child's pose extendida", prescription: '45s', anim: 'child-pose', searchQuery: 'extended child pose back', cues: ['Estira dorsal y lat'] },
          { name: 'Respiración diafragmática', prescription: '90s', anim: 'breathing', searchQuery: 'diaphragmatic breathing post workout', cues: ['Inhala 4s · Retén 2s · Exhala 6s'] },
        ],
      },
    ],
  },

  B2: {
    title: 'Tren Superior + Pull',
    subtitle: 'Mesociclo 2 · Intensificación · Peso Muerto + Remo + Sandbag',
    week: 'Semana 5–8', duration: '65 min', focus: 'Fuerza + Remo',
    blocks: [
      {
        type: 'warmup', title: 'Calentamiento', duration: '10 min',
        items: [
          { name: 'Ski erg Z1 técnico', prescription: '3 min', anim: 'ski-erg-warm', searchQuery: 'ski erg warm up easy technique', cues: ['Trabaja el patrón técnico a baja intensidad', 'Foco en el doble pull completo'] },
          { name: 'Band pull-aparts', prescription: '15 reps', anim: 'band-pull-apart', searchQuery: 'band pull aparts shoulder warm up', cues: ['Brazos extendidos al frente', 'Aprieta escápulas al final'] },
          { name: 'Scapular pull-ups', prescription: '10 reps lentas', anim: 'scap-pullup', searchQuery: 'scapular pull ups activation', cues: ['Solo retracción escapular, sin doblar codos'] },
          { name: 'Cat-cow con respiración', prescription: '10 reps', anim: 'cat-cow', searchQuery: 'cat cow spine mobility breathing', cues: ['Sincroniza movimiento con la respiración', 'Moviliza la columna antes del peso muerto'] },
          { name: 'YTW prono', prescription: '8 c/u', anim: 'ytw-prone', searchQuery: 'YTW prone shoulder exercise', cues: ['5s de pausa en cada posición', 'Activa rotadores externos'] },
          { name: 'Peso muerto rumano al 40%', prescription: '10 reps', anim: 'deadlift', searchQuery: 'romanian deadlift warm up', cues: ['Activa la cadena posterior', 'Ensaya el patrón del bloque principal'] },
        ],
      },
      {
        type: 'strength', title: 'Bloque de Fuerza', duration: '22 min',
        note: '<strong>Intensificación M2 (NSCA):</strong> Sem 5: 78% · Sem 6: 80% · Sem 7: 82% · Sem 8 descarga: 70%.',
        items: [
          { name: 'A1 · Peso Muerto Convencional', prescription: '4 × 4', rpe: 'RPE 8', rest: '3 min', anim: 'deadlift', searchQuery: 'deadlift heavy 4x4 technique', cues: ['Carga elevada: mantén técnica impecable', 'Barra pegada al cuerpo todo el recorrido', 'Activa lats antes de arrancar', 'Empuja el suelo, no tires de la barra', 'Bloqueo completo: caderas, rodillas, hombros a la vez'] },
          { name: 'A2 · Hollow hold', prescription: '4 × 30s', rpe: 'RPE 8', rest: '—', anim: 'hollow-hold', searchQuery: 'hollow hold core tutorial', cues: ['Lumbar pegada al suelo siempre', 'Si es difícil: dobla las rodillas'] },
          { name: 'B1 · Dominadas lastradas (o peso corporal)', prescription: '4 × 4–6', rpe: 'RPE 8', rest: '2 min', anim: 'pull-up', searchQuery: 'weighted pull up tutorial', cues: ['Sin lastre: 4×6 controladas', 'Pecho a la barra, bajada en 2s', 'Si no alcanzas: usa banda elástica'] },
          { name: 'B2 · Remo Pendlay / Barra', prescription: '3 × 8', rpe: 'RPE 7', rest: '90s', anim: 'db-row', searchQuery: 'pendlay row barbell technique', cues: ['Espalda paralela al suelo o 45°', 'Barra toca pecho bajo en cada rep', 'Escápulas juntas al final del tirón'] },
          { name: 'C1 · Curl martillo con tempo', prescription: '3 × 10', rpe: 'RPE 7', rest: '60s', anim: 'hammer-curl', searchQuery: 'hammer curl tempo training', cues: ['Tempo 3-1-1: 3s bajar, 1s pausa', 'Codos pegados al cuerpo'] },
          { name: 'C2 · Press francés barra EZ', prescription: '3 × 10', rpe: 'RPE 7', rest: '60s', anim: 'tricep-extension', searchQuery: 'EZ bar french press triceps', cues: ['Codos fijos apuntando arriba', 'Extensión completa arriba'] },
        ],
      },
      {
        type: 'competition', title: 'Bloque Competición', duration: '16 min',
        protocol: { name: '3 Rondas · For Time', time: 'Descanso 90s entre rondas', items: ['500 m remo @ 1:55–2:05 /500m', '20 sandbag lunges (12–20 kg)', '15 burpee broad jumps'] },
        items: [
          { name: 'Remo (estación oficial)', prescription: '500 m · 1:55–2:05/500m', anim: 'row-machine', searchQuery: 'functional race rowing pace technique 1000m', cues: ['Secuencia: PIERNAS → CADERA → BRAZOS', 'Vuelta: BRAZOS → CADERA → PIERNAS', 'Ritmo objetivo: 2:00/500m', 'Espalda neutra al final del tirón'] },
          { name: 'Sandbag Lunges (estación oficial)', prescription: '20 reps · 12–20 kg', anim: 'walking-lunges', searchQuery: 'functional race sandbag lunge technique', cues: ['Saco al hombro o posición Zercher', 'Pro H: 20 kg / Pro M: 12 kg / Open H: 10 kg / Open M: 5 kg', 'Rodilla trasera roza el suelo cada rep', 'Paso largo y estable, mirada al frente'] },
          { name: 'Burpee Broad Jump (estación oficial)', prescription: '15 reps', anim: 'burpee-broad', searchQuery: 'functional race burpee broad jump', cues: ['Pecho al suelo obligatorio', 'Salto máximo hacia adelante'] },
        ],
      },
      {
        type: 'finisher', title: 'Finisher', duration: '5 min',
        protocol: { name: 'Tabata Remo · 4 min', time: '8 rondas de 20s/10s', items: ['20s remo al máximo esfuerzo', '10s descanso total', 'Repetir 8 veces', 'Mantén vatios constantes en todas las rondas'] },
        items: [
          { name: 'Remo tabata', prescription: '20s máx / 10s off · × 8', anim: 'row-machine', searchQuery: 'rowing tabata intervals', cues: ['Arranque explosivo cada ronda', 'Mantén potencia (no decaigas al final)', 'Protocolo: Tabata et al. 1996'] },
        ],
      },
      {
        type: 'cooldown', title: 'Vuelta a la calma', duration: '5 min',
        items: [
          { name: 'Doorway pec stretch', prescription: '45s/lado', anim: 'doorway-pec', searchQuery: 'doorway chest stretch', cues: ['Antebrazo en el marco a 90°', 'Rota el tronco lentamente'] },
          { name: 'Lat stretch en barra', prescription: '45s/lado', anim: 'lat-stretch', searchQuery: 'lat stretch bar hang', cues: ['Cuélgate ligeramente dejando caer el peso'] },
          { name: 'Twist espinal tumbado', prescription: '45s/lado', anim: 'supine-twist', searchQuery: 'supine spinal twist stretch', cues: ['Hombros pegados al suelo', 'Rodilla cae al lado opuesto'] },
          { name: 'Respiración 4-7-8', prescription: '90s', anim: 'breathing', searchQuery: '4 7 8 breathing tutorial', cues: ['Inhala 4s · Retén 7s · Exhala 8s'] },
        ],
      },
    ],
  },

  C2: {
    title: 'Simulación Completa',
    subtitle: 'Mesociclo 2 · Las 8 Estaciones · Pace de Competición',
    week: 'Semana 5–8', duration: '75 min', focus: 'Race Sim',
    blocks: [
      {
        type: 'warmup', title: 'Activación pre-carrera', duration: '15 min',
        items: [
          { name: 'Remo Z1 progresivo', prescription: '5 min', anim: 'row-warmup', searchQuery: 'rowing progressive warm up', cues: ['5 min subiendo al RPE 5', 'Activa toda la cadena posterior'] },
          { name: "World's greatest stretch", prescription: '5/lado', anim: 'world-stretch', searchQuery: 'worlds greatest stretch full body', cues: ['Codo al suelo, abre el pecho', 'Prepara cadera y columna'] },
          { name: 'Activación glúteo + core', prescription: '10 + 10/lado', anim: 'dead-bug', searchQuery: 'glute activation dead bug combo', cues: ['Glute bridge × 10 + Dead bug × 10 lado'] },
          { name: 'Carrera progresiva', prescription: '2 × 200 m', anim: 'running', searchQuery: 'progressive running warm up', cues: ["1ª al 40% · 2ª al 70%", 'Prepara el sistema cardiovascular'] },
        ],
      },
      {
        type: 'competition', title: 'Simulación — Las 8 Estaciones', duration: '45 min',
        protocol: { name: '2 Vueltas · Race Sim', time: 'Descanso 2 min entre vueltas', items: ['400m carrera + 500m ski erg', '400m carrera + 25m sled push (o 20 squat jumps)', '400m carrera + 25m sled pull (o 20 inverted rows)', '400m carrera + 40m burpee broad jump', '400m carrera + 500m remo', '400m carrera + 100m farmer carry (2×20–32 kg)', '400m carrera + 50m sandbag lunges (12–20 kg)', '400m carrera + 50 wall balls (6–9 kg)'] },
        items: [
          { name: 'Ski Erg', prescription: '500 m · race pace', anim: 'ski-erg', searchQuery: 'functional race ski erg race pace 1000m', cues: ['Sal a pace objetivo, no más rápido', 'Mantén ritmo uniforme'] },
          { name: 'Sled Push / Squat Jumps', prescription: '25 m / 20 reps', anim: 'sled-push', searchQuery: 'functional race sled push technique', cues: ['Tronco inclinado, pasos cortos y explosivos', 'Sustituto: squat jumps al máximo'] },
          { name: 'Sled Pull / Inverted Rows', prescription: '25 m / 20 reps', anim: 'sled-pull', searchQuery: 'functional race sled pull rope technique', cues: ['Tira de cadera + brazos', 'Sustituto: inverted rows en barra baja'] },
          { name: 'Burpee Broad Jump', prescription: '40 m', anim: 'burpee-broad', searchQuery: 'functional race burpee broad jump 80m', cues: ['Cada rep cuenta la distancia', 'Estándar oficial: 80 m en competición'] },
          { name: 'Remo', prescription: '500 m · 2:00–2:10/500m', anim: 'row-machine', searchQuery: 'functional race rowing pace 1000m', cues: ['Piernas primero siempre', 'Objetivo: 2:00/500m'] },
          { name: 'Farmer Carry', prescription: '100 m · 2×20–32 kg', anim: 'farmer-carry', searchQuery: 'functional race farmer carry 200m', cues: ['Estándar oficial: 200 m competición', 'Hombros atrás y abajo, pecho arriba'] },
          { name: 'Sandbag Lunges', prescription: '50 m · 12–20 kg', anim: 'walking-lunges', searchQuery: 'functional race sandbag lunges', cues: ['Sin pausas entre pasos', 'Rodilla trasera roza el suelo'] },
          { name: 'Wall Balls', prescription: '50 reps · 6–9 kg', anim: 'wall-ball', searchQuery: 'functional race wall ball 100 reps', cues: ['Ritmo: 1 rep/2s mínimo', 'Diana: 3 m (H) / 2.7 m (M)'] },
          { name: 'Carrera 400 m (entre estaciones)', prescription: '400 m · pace controlado', anim: 'running', searchQuery: 'functional race running between stations pace', cues: ['No vacíes el tanque en la carrera', 'Llega a cada estación con energía'] },
        ],
      },
      {
        type: 'cooldown', title: 'Recuperación activa', duration: '10 min',
        items: [
          { name: 'Caminata descarga', prescription: '3 min', anim: 'running', searchQuery: 'active recovery cool down walk', cues: ['Baja la FC progresivamente'] },
          { name: 'Pigeon stretch bilateral', prescription: '60s/lado', anim: 'pigeon-pose', searchQuery: 'pigeon pose bilateral', cues: ['Trabaja ambas caderas tras los lunges'] },
          { name: 'Doorway pec + lat stretch', prescription: '45s c/u', anim: 'doorway-pec', searchQuery: 'chest lat stretch after ski erg row', cues: ['Fundamental tras ski erg y remo'] },
          { name: 'Respiración diafragmática', prescription: '2 min', anim: 'breathing', searchQuery: 'post workout breathing recovery', cues: ['Inhala 4s · Exhala 6–8s'] },
        ],
      },
    ],
  },

  A3: {
    title: 'Peaking · Tren Inferior',
    subtitle: 'Mesociclo 3 · Pico de Fuerza + Potencia · Preparación Competición',
    week: 'Semana 9–12', duration: '65 min', focus: 'Pico + Potencia',
    blocks: [
      {
        type: 'warmup', title: 'Activación neuromuscular', duration: '12 min',
        items: [
          { name: 'Remo Z1 progresivo', prescription: '5 min', anim: 'row-warmup', searchQuery: 'rowing CNS activation warm up', cues: ['Min 1–2: Z1 · Min 3–4: Z2 · Min 5: Z3', 'Prepara el SNC para cargas máximas'] },
          { name: 'Hip mobility + rotación torácica', prescription: '8/lado', anim: 'thoracic-opener', searchQuery: 'hip thoracic mobility deep squat', cues: ['Profundidad máxima de cadera', 'Rotación torácica en cada posición'] },
          { name: 'Jump squat sin carga (PAP)', prescription: '3 × 5 con 90s descanso', anim: 'squat-jump', searchQuery: 'bodyweight jump squat PAP activation', cues: ['Post-Activation Potentiation (NSCA)', '3 series con descanso completo', 'Prepara el SNC: activa fibras rápidas', 'Máxima explosividad en cada salto'] },
          { name: 'Goblet squat al 30% 1RM', prescription: '2 × 5', anim: 'goblet-squat', searchQuery: 'goblet squat specific warm up', cues: ['Activa el patrón específico de sentadilla', 'Acelera rápido en la subida'] },
        ],
      },
      {
        type: 'strength', title: 'Bloque de Pico', duration: '20 min',
        note: '<strong>Peaking M3 (NSCA):</strong> Sem 9: 83% · Sem 10: 85% · Sem 11: 87% · Sem 12 taper: 75% × 3. Volumen mínimo, intensidad máxima.',
        items: [
          { name: 'A1 · Back Squat', prescription: '4 × 3', rpe: 'RPE 8–9', rest: '3 min', anim: 'back-squat', searchQuery: 'back squat peaking 4x3 maximal', cues: ['Máxima concentración antes de cada serie', 'Valsalva en el descenso', 'Explosivo desde el punto más bajo', 'Sin rebotar en el fondo'] },
          { name: 'A2 · Jump Squat al 30% 1RM', prescription: '4 × 5', rpe: 'RPE 7', rest: '60s', anim: 'squat-jump', searchQuery: 'loaded jump squat 30% power development', cues: ['30% del 1RM en back squat', 'Máxima aceleración concéntrica', 'Aterrizaje suave, absorbe el impacto', 'NSCA: Power Development'] },
          { name: 'B1 · Sentadilla búlgara con tempo', prescription: '3 × 5/pierna', rpe: 'RPE 8', rest: '2 min', anim: 'bulgarian-split', searchQuery: 'bulgarian split squat tempo peaking', cues: ['Tempo 4-1-1: 4s de bajada', 'Carga máxima del mesociclo', 'Foco en estabilidad unilateral'] },
          { name: 'B2 · Pallof press + rotación', prescription: '3 × 10/lado', rpe: 'RPE 6', rest: '60s', anim: 'pallof-press', searchQuery: 'pallof press rotation advanced', cues: ['Añade rotación al final', 'Core anti-rotacional bajo fatiga'] },
        ],
      },
      {
        type: 'competition', title: 'Race Intervals', duration: '20 min',
        protocol: { name: '3 Bloques · Race Pace', time: 'Descanso 3 min entre bloques', items: ['800 m carrera + 500 m ski erg @ race pace', '800 m carrera + 25 wall balls (peso competición) + 10 burpee broad jumps', '800 m carrera + 100 m farmer carry (peso objetivo)'] },
        items: [
          { name: 'Carrera 800 m race pace', prescription: '800 m · RPE 8', anim: 'running', searchQuery: 'functional race running 1km race pace simulation', cues: ['Simula el kilómetro entre estaciones', 'Cadencia objetivo: 170–180 pasos/min'] },
          { name: 'Ski Erg race pace', prescription: '500 m · race pace', anim: 'ski-erg', searchQuery: 'ski erg race pace simulation', cues: ['Simula la estación 1', 'Velocidad constante, sin picos'] },
          { name: 'Wall Ball peso competición', prescription: '25 reps · peso objetivo', anim: 'wall-ball', searchQuery: 'wall ball competition weight practice', cues: ['Usa el peso que llevarás en carrera', 'Diana: 3 m (H) / 2.7 m (M)'] },
          { name: 'Farmer carry competición', prescription: '100 m · peso objetivo', anim: 'farmer-carry', searchQuery: 'farmer carry competition weight', cues: ['Pro H: 2×32 kg · Pro M: 2×24 kg', 'Open H: 2×24 kg · Open M: 2×16 kg'] },
        ],
      },
      {
        type: 'finisher', title: 'Strides de Carrera', duration: '5 min',
        protocol: { name: '4 × 100 m Strides', time: 'Descanso completo entre cada uno', items: ['100 m al 85%', '100 m al 90%', '100 m al 95%', '100 m al 100% sprint'] },
        items: [
          { name: 'Strides 100 m progresivos', prescription: '4 × 100 m', anim: 'running', searchQuery: 'running strides 100m technique', cues: ['Activa la velocidad máxima de carrera', 'Recuperación completa entre cada stride'] },
        ],
      },
      {
        type: 'cooldown', title: 'Vuelta a la calma', duration: '5 min',
        items: [
          { name: 'Caminata descarga', prescription: '2 min', anim: 'running', searchQuery: 'cool down walking active recovery', cues: ['Baja la FC progresivamente'] },
          { name: 'Pigeon stretch bilateral', prescription: '60s/lado', anim: 'pigeon-pose', searchQuery: 'pigeon pose hip stretch cooldown', cues: ['Prioridad tras sentadilla pesada'] },
          { name: 'Hamstring stretch tumbado', prescription: '45s/pierna', anim: 'hamstring-stretch', searchQuery: 'hamstring stretch lying post workout', cues: ['Isquios trabajados en peso muerto de M2'] },
          { name: 'Respiración 4-7-8', prescription: '2 min', anim: 'breathing', searchQuery: '4 7 8 breathing post workout', cues: ['5–6 respiraciones completas', 'Activa el sistema nervioso parasimpático'] },
        ],
      },
    ],
  },
};
