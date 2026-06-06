import { Auth } from '@/services/auth';
import { DB } from '@/services/db';
import { LocalStorage } from '@/services/storage';
import { showToast } from '@/components/toast';
import { esc, $maybe } from '@/lib/html';
import type { AuthMode } from '@/types';

let _mode: AuthMode = 'login';

export function renderAuthView(): void {
  const el = document.getElementById('authSection');
  if (!el) return;

  el.innerHTML = `
    <div class="auth-card">
      <div class="auth-logo">Blue<span>Train</span></div>
      <div class="auth-tagline">Entrena. Registra. Evoluciona.</div>

      <!-- Tabs -->
      <div class="auth-tabs" id="authTabs">
        <button class="auth-tab active" data-mode="login">Entrar</button>
        <button class="auth-tab" data-mode="signup">Crear cuenta</button>
      </div>

      <!-- Formularios -->
      <form id="authForm" class="auth-form" novalidate>

        <div class="auth-field" id="authNameField" style="display:none;">
          <label class="auth-label" for="authName">Nombre o apodo</label>
          <input class="auth-input" id="authName" type="text"
            placeholder="Tu nombre" maxlength="30" autocomplete="name">
        </div>

        <div class="auth-field">
          <label class="auth-label" for="authEmail">Email</label>
          <input class="auth-input" id="authEmail" type="email"
            placeholder="tu@email.com" autocomplete="email" required>
        </div>

        <div class="auth-field" id="authPassField">
          <label class="auth-label" for="authPassword">Contraseña</label>
          <input class="auth-input" id="authPassword" type="password"
            placeholder="Mínimo 6 caracteres" autocomplete="current-password" required minlength="6">
        </div>

        <div id="authError" class="auth-error" style="display:none;"></div>

        <button class="btn-primary auth-submit" id="authSubmit" type="submit">
          Entrar
        </button>
      </form>

      <button class="auth-link" id="authForgotBtn">¿Olvidaste tu contraseña?</button>

      <!-- Forgot password form (oculto por defecto) -->
      <div id="authForgotForm" style="display:none;">
        <p class="auth-hint">Escribe tu email y te enviaremos un enlace para restablecer la contraseña.</p>
        <div class="auth-field">
          <label class="auth-label" for="authForgotEmail">Email</label>
          <input class="auth-input" id="authForgotEmail" type="email" placeholder="tu@email.com">
        </div>
        <div id="authForgotError" class="auth-error" style="display:none;"></div>
        <div class="auth-actions-row">
          <button class="btn-primary" id="authForgotSubmit">Enviar enlace</button>
          <button class="auth-link" id="authForgotBack">Volver</button>
        </div>
      </div>

      <p class="auth-footer">
        Al registrarte aceptas los <a href="#" class="auth-link-inline">Términos de uso</a>
        y la <a href="#" class="auth-link-inline">Política de privacidad</a>.
      </p>
    </div>`;

  _setupListeners();
  _setMode('login');
}

function _setupListeners(): void {
  // Tab switching
  $maybe('authTabs')?.addEventListener('click', e => {
    const tab = (e.target as HTMLElement).closest<HTMLElement>('[data-mode]');
    if (!tab?.dataset['mode']) return;
    _setMode(tab.dataset['mode'] as AuthMode);
  });

  // Form submit
  $maybe('authForm')?.addEventListener('submit', e => {
    e.preventDefault();
    void _handleSubmit();
  });

  // Forgot password
  $maybe('authForgotBtn')?.addEventListener('click', () => _setMode('forgot'));
  $maybe('authForgotBack')?.addEventListener('click', () => _setMode('login'));
  $maybe('authForgotSubmit')?.addEventListener('click', () => void _handleForgot());
}

function _setMode(mode: AuthMode): void {
  _mode = mode;

  const nameField = $maybe('authNameField');
  const passField = $maybe('authPassField');
  const mainForm = $maybe('authForm');
  const forgotForm = $maybe('authForgotForm');
  const forgotBtn = $maybe('authForgotBtn');
  const submitBtn = $maybe<HTMLButtonElement>('authSubmit');
  const tabLogin = $maybe('authTabs')?.querySelector<HTMLElement>('[data-mode="login"]');
  const tabSignup = $maybe('authTabs')?.querySelector<HTMLElement>('[data-mode="signup"]');

  _clearError();

  if (mode === 'forgot') {
    if (mainForm) mainForm.style.display = 'none';
    if (forgotForm) forgotForm.style.display = 'block';
    if (forgotBtn) forgotBtn.style.display = 'none';
    return;
  }

  if (mainForm) mainForm.style.display = '';
  if (forgotForm) forgotForm.style.display = 'none';
  if (forgotBtn) forgotBtn.style.display = mode === 'login' ? '' : 'none';

  if (nameField) nameField.style.display = mode === 'signup' ? '' : 'none';
  if (passField) passField.style.display = '';
  if (submitBtn) submitBtn.textContent = mode === 'signup' ? 'Crear cuenta' : 'Entrar';

  tabLogin?.classList.toggle('active', mode === 'login');
  tabSignup?.classList.toggle('active', mode === 'signup');

  const passInput = $maybe<HTMLInputElement>('authPassword');
  if (passInput) passInput.autocomplete = mode === 'signup' ? 'new-password' : 'current-password';
}

async function _handleSubmit(): Promise<void> {
  const email = ($maybe<HTMLInputElement>('authEmail')?.value ?? '').trim();
  const password = ($maybe<HTMLInputElement>('authPassword')?.value ?? '').trim();
  const name = ($maybe<HTMLInputElement>('authName')?.value ?? '').trim();
  const btn = $maybe<HTMLButtonElement>('authSubmit');

  if (!email || !password) { _showError('Rellena todos los campos.'); return; }
  if (password.length < 6) { _showError('La contraseña debe tener al menos 6 caracteres.'); return; }
  if (_mode === 'signup' && !name) { _showError('Escribe tu nombre o apodo.'); return; }

  if (btn) { btn.disabled = true; btn.textContent = 'Cargando…'; }

  const result = _mode === 'signup'
    ? await Auth.signUp(email, password, name)
    : await Auth.signIn(email, password);

  if (btn) { btn.disabled = false; btn.textContent = _mode === 'signup' ? 'Crear cuenta' : 'Entrar'; }

  if (result.error) {
    _showError(result.error);
    return;
  }

  if (_mode === 'signup') {
    showToast('Revisa tu email para confirmar la cuenta.', 'info');
    _setMode('login');
    return;
  }

  // Login exitoso → comprobar migración
  void _offerMigration();
}

async function _handleForgot(): Promise<void> {
  const email = ($maybe<HTMLInputElement>('authForgotEmail')?.value ?? '').trim();
  if (!email) { _showForgotError('Escribe tu email.'); return; }
  const { error } = await Auth.resetPassword(email);
  if (error) { _showForgotError(error); return; }
  showToast('Email enviado. Revisa tu bandeja de entrada.', 'success');
  _setMode('login');
}

async function _offerMigration(): Promise<void> {
  const localCount = LocalStorage.getHistory().length;
  if (!localCount) return;
  const migrated = await DB.migrateLocalData();
  if (migrated > 0) {
    showToast(`${migrated} sesiones importadas a tu cuenta.`, 'info');
  }
}

function _showError(msg: string): void {
  const el = $maybe('authError');
  if (!el) return;
  el.textContent = esc(msg);
  el.style.display = '';
}

function _showForgotError(msg: string): void {
  const el = $maybe('authForgotError');
  if (!el) return;
  el.textContent = esc(msg);
  el.style.display = '';
}

function _clearError(): void {
  [$maybe('authError'), $maybe('authForgotError')].forEach(el => {
    if (el) { el.textContent = ''; el.style.display = 'none'; }
  });
}
