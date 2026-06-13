import type { Station } from '@/types';

export const STATIONS: Station[] = [
  {
    num: 1, name: 'SkiErg', dist: '1000 m', hasWeights: false,
    tips: ['Doble pull completo: brazos + bisagra de cadera', 'Manos terminan a la altura de los muslos', 'Ritmo objetivo: 2:20–2:40 /500m para Open', 'No vayas demasiado rápido: es la primera estación de ocho'],
    videoUrl: 'https://www.youtube.com/watch?v=t8teWM7jbDI',
    videoTitle: 'The Ultimate Skierg Tutorial for HYROX (The Progrm, 2024)',
  },
  {
    num: 2, name: 'Sled Push', dist: '50 m', hasWeights: true,
    proM: '102 kg', proW: '72 kg', openM: '102 kg', openW: '72 kg',
    tips: ['Tronco inclinado ≈45°, brazos rectos empujando', 'Pasos cortos y explosivos desde el suelo', 'Mantén la cadera baja durante todo el recorrido', 'No pares: el sled pesa más al arrancar que al mantener'],
    videoUrl: 'https://www.youtube.com/watch?v=HvjeefVELGg',
    videoTitle: 'Sled Push for HYROX: Technique & Tips (Peter Day, 2025)',
  },
  {
    num: 3, name: 'Sled Pull', dist: '50 m', hasWeights: true,
    proM: '102 kg', proW: '72 kg', openM: '102 kg', openW: '72 kg',
    tips: ['Tira de la cuerda con agarre alternado', 'Usa cadera + brazos, no solo brazos', 'Da pasos atrás cortos y estables', 'Mantén tensión constante en la cuerda'],
    videoUrl: 'https://www.youtube.com/watch?v=ZBqWXVjdTls',
    videoTitle: 'HYROX Sled Pull Techniques to Crush Your Next Race (Rox Lyfe, 2024)',
  },
  {
    num: 4, name: 'Burpee Broad Jump', dist: '80 m', hasWeights: false,
    tips: ['Pecho completo al suelo en cada rep', 'Salto horizontal máximo hacia adelante', 'Ritmo constante: mejor ir estable que rápido y parar', 'Aterrizaje en semiflexión para proteger rodillas'],
    videoUrl: 'https://www.youtube.com/watch?v=22PV58ToZWE',
    videoTitle: 'Burpee Broad Jumps for HYROX: Technique & Tips (Peter Day, 2024)',
  },
  {
    num: 5, name: 'Rowing', dist: '1000 m', hasWeights: false,
    tips: ['Secuencia siempre: piernas → cadera → brazos', 'Vuelta: brazos → cadera → piernas', 'Ritmo objetivo: 2:00–2:10 /500m', 'Espalda neutra al final del tirón, no te eches atrás'],
    videoUrl: 'https://www.youtube.com/watch?v=tcIpMJy6e-U',
    videoTitle: 'HYROX Rowing Technique Tips (HYROX HUB, 2024)',
  },
  {
    num: 6, name: 'Farmers Carry', dist: '200 m', hasWeights: true,
    proM: '2 × 32 kg', proW: '2 × 24 kg', openM: '2 × 24 kg', openW: '2 × 16 kg',
    tips: ['Hombros atrás y abajo, pecho arriba', 'Pasos cortos y rápidos', 'Aprieta core durante los 200 m', 'Si necesitas parar: apoya en el suelo, no lo sueltes'],
    videoUrl: 'https://www.youtube.com/watch?v=Rv8h4WoE1LA',
    videoTitle: 'HYROX Top Tips: Farmers Carry (PureGym, 2024)',
  },
  {
    num: 7, name: 'Sandbag Lunges', dist: '100 m', hasWeights: true,
    proM: '20 kg', proW: '12 kg', openM: '10 kg', openW: '5 kg',
    tips: ['Saco al hombro o posición Zercher (codos)', 'Rodilla trasera roza el suelo cada rep', 'Paso largo y estable, mirada al frente', 'Sin pausas entre pasos si es posible'],
    videoUrl: 'https://www.youtube.com/watch?v=29lLj4p6Slo',
    videoTitle: 'HYROX Top Tips: Sandbag Lunges (PureGym, 2024)',
  },
  {
    num: 8, name: 'Wall Balls', dist: '100 reps', hasWeights: true,
    proM: '9 kg', proW: '6 kg', openM: '6 kg', openW: '4 kg',
    tips: ['Diana: 3 m (H) / 2.7 m (M)', 'Sentadilla profunda: cadera bajo rodilla en cada rep', 'Ritmo objetivo: 1 rep cada 2 segundos', 'La última estación: deja todo lo que te quede'],
    videoUrl: 'https://www.youtube.com/watch?v=eVpVh2czEyI',
    videoTitle: 'Dominating The HYROX Wall Ball (The Progrm, 2024)',
  },
];
