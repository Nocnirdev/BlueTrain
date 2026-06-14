// Mapeo de nombres de ejercicio → clave estable de seguimiento de peso.
// Usar esta clave en lugar de modificar workouts.ts.
// La misma clave unifica el historial entre sesiones (ej. back-squat en A1, A2 y A3).

const _MAP: Record<string, string> = {
  // ── Tren inferior ──────────────────────────────────────────
  'Back Squat':                             'back-squat',
  'Sentadilla búlgara':                     'bulgarian-split',
  'Sentadilla búlgara pesada':              'bulgarian-split',
  'Sentadilla búlgara con tempo':           'bulgarian-split',
  'Hip Thrust con barra':                   'hip-thrust',
  'Goblet squat':                           'goblet-squat',
  'Jump Squat al 30% 1RM':                  'jump-squat',

  // ── Tren superior (empuje) ─────────────────────────────────
  'Press francés mancuernas':               'tricep-extension',
  'Press francés barra EZ':                 'tricep-extension',

  // ── Tren superior (tracción) ───────────────────────────────
  'Dominadas (o asistidas)':                'pull-up',
  'Dominadas lastradas (o peso corporal)':  'pull-up',
  'Remo con mancuerna':                     'db-row',
  'Remo Pendlay / Barra':                   'pendlay-row',
  'Renegade row':                           'renegade-row',
  'Curl martillo':                          'hammer-curl',
  'Curl martillo con tempo':                'hammer-curl',

  // ── Unilateral / carga libre ───────────────────────────────
  'KB single-leg deadlift':                 'sl-deadlift',
  'KB swing ruso':                          'kb-swing',

  // ── Carga de transporte (funcional) ───────────────────────
  'Farmer carry':                           'farmer-carry',
  'Farmer carry pesado':                    'farmer-carry',
  'Farmer Carry':                           'farmer-carry',
  'Farmer carry competición':               'farmer-carry',
  'Suitcase carry':                         'suitcase-carry',
  'Walking lunges mancuernas':              'walking-lunges',
  'Sandbag Lunges (estación oficial)':      'sandbag-lunges',
  'Sandbag Lunges':                         'sandbag-lunges',

  // ── Wall ball ──────────────────────────────────────────────
  'Wall Ball':                              'wall-ball',
  'Wall ball':                              'wall-ball',
  'Wall Balls':                             'wall-ball',
  'Wall balls ritmo':                       'wall-ball',
  'Wall Ball (estación oficial)':           'wall-ball',
  'Wall Ball peso competición':             'wall-ball',
};

// Prefijo "A1 · ", "B2 · ", etc.
const _PREFIX_RE = /^[A-C]\d+\s*·\s*/;

/**
 * Devuelve la clave de seguimiento de peso para un ejercicio,
 * o null si el ejercicio no requiere carga externa.
 */
export function getWeightKey(exerciseName: string): string | null {
  const clean = exerciseName.replace(_PREFIX_RE, '').trim();
  return _MAP[clean] ?? null;
}

/** Etiqueta legible para mostrar en la UI. */
export const WEIGHT_KEY_LABELS: Record<string, string> = {
  'back-squat':       'Back Squat',
  'bulgarian-split':  'Sentadilla búlgara',
  'hip-thrust':       'Hip Thrust',
  'goblet-squat':     'Goblet Squat',
  'jump-squat':       'Jump Squat',
  'tricep-extension': 'Press francés',
  'pull-up':          'Dominadas',
  'db-row':           'Remo mancuerna',
  'pendlay-row':      'Remo barra',
  'renegade-row':     'Renegade Row',
  'hammer-curl':      'Curl martillo',
  'sl-deadlift':      'Peso muerto unilateral',
  'kb-swing':         'KB Swing',
  'farmer-carry':     'Farmer Carry',
  'suitcase-carry':   'Suitcase Carry',
  'walking-lunges':   'Lunges mancuernas',
  'sandbag-lunges':   'Sandbag Lunges',
  'wall-ball':        'Wall Ball',
};
