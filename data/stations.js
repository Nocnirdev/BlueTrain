/* =====================================================
   BlueTrain — data/stations.js
   Estaciones oficiales de carrera funcional.
   Verificar pesos y distancias cada temporada.
   ===================================================== */

const STATIONS = [
  {
    num: 1,
    name: 'SkiErg',
    dist: '1,000 m',
    hasWeights: false,
    tips: [
      'Doble pull: brazos + flexión de cadera simultáneos',
      'Termina el tirón con manos a los muslos',
      'Mantén ritmo constante: no piques al salir',
      'Objetivo competición aprox. 2:20–2:30 /500m'
    ]
  },
  {
    num: 2,
    name: 'Sled Push',
    dist: '50 m',
    hasWeights: true,
    proM: '152 kg total', proW: '102 kg total',
    openM: '102 kg total', openW: '72 kg total',
    tips: [
      'Tronco inclinado ~45° sobre los postes',
      'Pasos cortos, rápidos y explosivos',
      'Empuja desde los pies, no solo de los brazos',
      'El peso indicado incluye el trineo (varía por venue)'
    ]
  },
  {
    num: 3,
    name: 'Sled Pull',
    dist: '50 m',
    hasWeights: true,
    proM: '152 kg total', proW: '102 kg total',
    openM: '102 kg total', openW: '72 kg total',
    tips: [
      'Cuerda con agarre overhand o underhand',
      'Tira desde los pies y la cadera, no solo brazos',
      'Recupera cuerda en movimientos cortos y rápidos',
      'Mantén espalda neutra durante todo el ejercicio'
    ]
  },
  {
    num: 4,
    name: 'Burpee Broad Jump',
    dist: '80 m',
    hasWeights: false,
    tips: [
      'Pecho al suelo obligatorio en cada repetición',
      'Salta lo más lejos posible horizontalmente',
      'Aterrizaje en semiflexión para absorber el impacto',
      'Sin contar el tiempo, cuenta la distancia acumulada'
    ]
  },
  {
    num: 5,
    name: 'Rowing',
    dist: '1,000 m',
    hasWeights: false,
    tips: [
      'Secuencia: PIERNAS → CADERA → BRAZOS',
      'Vuelta al monolito: BRAZOS → CADERA → PIERNAS',
      'Ritmo objetivo: 2:00–2:10 /500m',
      'Nunca redondees la espalda al final del tirón'
    ]
  },
  {
    num: 6,
    name: 'Farmers Carry',
    dist: '200 m',
    hasWeights: true,
    proM: '2 × 32 kg', proW: '2 × 24 kg',
    openM: '2 × 24 kg', openW: '2 × 16 kg',
    tips: [
      'Hombros atrás y abajo, pecho arriba',
      'Pasos cortos y rápidos, sin oscilación lateral',
      'Aprieta el core todo el recorrido',
      'Objetivo: completar sin soltar las mancuernas'
    ]
  },
  {
    num: 7,
    name: 'Sandbag Lunges',
    dist: '100 m',
    hasWeights: true,
    proM: '20 kg', proW: '12 kg',
    openM: '10 kg', openW: '5 kg',
    tips: [
      'Saco en el hombro o posición Zercher (frente al pecho)',
      'Rodilla trasera roza el suelo en cada repetición',
      'Paso largo y estable, mirada al frente',
      'Sin pausa entre pasos si puedes mantenerlo'
    ]
  },
  {
    num: 8,
    name: 'Wall Balls',
    dist: '100 reps',
    hasWeights: true,
    proM: '9 kg · diana 3 m', proW: '6 kg · diana 2,7 m',
    openM: '6 kg · diana 2,7 m', openW: '4 kg · diana 2,7 m',
    tips: [
      'Sentadilla profunda: cadera bajo rodilla en cada rep',
      'Impulso desde el suelo: usa las piernas, no los brazos',
      'Recoge el balón fluyendo directamente a la siguiente sentadilla',
      'Mantén ritmo unbroken el mayor tiempo posible'
    ]
  }
];
