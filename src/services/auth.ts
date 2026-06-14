import { supabase } from '@/lib/supabase';
import type { AuthState, UserProfile } from '@/types';

// ── Estado de auth (singleton en memoria) ────────────────────

let _state: AuthState = {
  isLoggedIn: false,
  userId: null,
  email: null,
  profile: null,
};

const _listeners: Array<(state: AuthState) => void> = [];

function notifyListeners(): void {
  _listeners.forEach(fn => fn({ ..._state }));
}

export const Auth = {

  // ── Suscripción al estado ─────────────────────────────────

  onChange(fn: (state: AuthState) => void): () => void {
    _listeners.push(fn);
    fn({ ..._state }); // emit inmediato con estado actual
    return () => {
      const idx = _listeners.indexOf(fn);
      if (idx !== -1) _listeners.splice(idx, 1);
    };
  },

  getState(): AuthState {
    return { ..._state };
  },

  // ── Inicialización ────────────────────────────────────────

  async init(): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      await _loadProfile(session.user.id, session.user.email ?? '');
    }

    // Escuchar cambios futuros (login, logout, token refresh)
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await _loadProfile(session.user.id, session.user.email ?? '');
      } else {
        _state = { isLoggedIn: false, userId: null, email: null, profile: null };
        notifyListeners();
      }
    });
  },

  // ── Sign up ───────────────────────────────────────────────

  async signUp(email: string, password: string, name: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, goal: 'performance' },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { error: _mapError(error.message) };
    return { error: null };
  },

  // ── Sign in ───────────────────────────────────────────────

  async signIn(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: _mapError(error.message) };
    return { error: null };
  },

  // ── Sign out ──────────────────────────────────────────────

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  },

  // ── Reset password ────────────────────────────────────────

  async resetPassword(email: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}?reset=true`,
    });
    if (error) return { error: _mapError(error.message) };
    return { error: null };
  },

  // ── Actualizar perfil ─────────────────────────────────────

  async updateProfile(updates: Partial<Pick<UserProfile, 'name'>>): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.updateUser({ data: updates });
    if (error) return { error: _mapError(error.message) };
    if (_state.profile) {
      _state.profile = { ..._state.profile, ...updates };
      notifyListeners();
    }
    return { error: null };
  },
};

// ── Privados ─────────────────────────────────────────────────

async function _loadProfile(userId: string, email: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  const meta = user?.user_metadata ?? {};

  _state = {
    isLoggedIn: true,
    userId,
    email,
    profile: {
      id: userId,
      name: (meta['name'] as string) || email.split('@')[0],
      goal: (meta['goal'] as UserProfile['goal']) || 'performance',
      createdAt: user?.created_at ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
  notifyListeners();
}

function _mapError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Email o contraseña incorrectos.';
  if (msg.includes('Email not confirmed')) return 'Confirma tu email antes de entrar.';
  if (msg.includes('User already registered')) return 'Ya existe una cuenta con ese email.';
  if (msg.includes('Password should be')) return 'La contraseña debe tener al menos 6 caracteres.';
  if (msg.includes('rate limit')) return 'Demasiados intentos. Espera unos minutos.';
  return msg;
}
