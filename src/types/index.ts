// ============================================================
// BlueTrain — Types
// Contratos de datos de toda la aplicación.
// ============================================================

export interface UserProfile {
  id: string;           // Supabase auth UID
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  goal: 'fat_loss' | 'hypertrophy' | 'performance';
  createdAt: string;
  updatedAt: string;
}

export interface SessionEntry {
  id: string;
  userId?: string;
  date: string;            // ISO date "YYYY-MM-DD"
  sessionKey: string;
  workoutName: string;
  type: 'strength' | 'functional' | 'circuit';
  mesocycle: string;
  duration: number;        // minutes
  rpe: number;             // 1-10
  notes: string;
  performance: Record<string, string>;
  completedAt: string;     // ISO datetime
}

export interface WorkoutProgress {
  [sessionKey: string]: string[];  // array of completed exercise IDs
}

export interface SessionTimer {
  key: string;
  startedAt: number;  // Date.now()
}

export type ViewName = 'dashboard' | 'training' | 'competition' | 'nutrition' | 'history';

// ── Workout data types ──────────────────────────────────────

export interface WorkoutExercise {
  name: string;
  prescription: string;
  rpe?: string;
  rest?: string;
  anim: string;
  searchQuery?: string;
  cues?: string[];
}

export interface WorkoutProtocol {
  name: string;
  time: string;
  items: string[];
}

export interface WorkoutBlock {
  type: 'warmup' | 'strength' | 'competition' | 'finisher' | 'cooldown';
  title: string;
  duration: string;
  note?: string;
  protocol?: WorkoutProtocol;
  items: WorkoutExercise[];
}

export interface WorkoutSession {
  title: string;
  subtitle: string;
  week: string;
  duration: string;
  focus: string;
  blocks: WorkoutBlock[];
}

export type WorkoutsData = Record<string, WorkoutSession>;

// ── Station data types ──────────────────────────────────────

export interface Station {
  num: number;
  name: string;
  dist: string;
  hasWeights: boolean;
  proM?: string;
  proW?: string;
  openM?: string;
  openW?: string;
  tips: string[];
}

// ── Auth ────────────────────────────────────────────────────

export interface AuthState {
  isLoggedIn: boolean;
  userId: string | null;
  email: string | null;
  profile: UserProfile | null;
}

export type AuthMode = 'login' | 'signup' | 'forgot';
