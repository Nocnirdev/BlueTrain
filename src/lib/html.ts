// ============================================================
// BlueTrain — HTML utilities
// Sanitización XSS y helpers DOM.
// ============================================================

const ESC: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escapa caracteres HTML para prevenir XSS en innerHTML. */
export function esc(str: unknown): string {
  return String(str ?? '').replace(/[&<>"']/g, c => ESC[c] ?? c);
}

/** Obtiene un elemento del DOM por ID. Lanza si no existe. */
export function $<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found`);
  return el as T;
}

/** Obtiene un elemento del DOM sin lanzar si no existe. */
export function $maybe<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/** Establece innerHTML de forma segura (solo para templates propios, no datos de usuario). */
export function setHTML(id: string, html: string): void {
  const el = $maybe(id);
  if (el) el.innerHTML = html;
}

/** Formatea una fecha ISO a texto legible en español. */
export function formatDate(isoDate: string, options?: Intl.DateTimeFormatOptions): string {
  const defaults: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
  };
  return new Date(isoDate + 'T12:00:00').toLocaleDateString('es-ES', options ?? defaults);
}

/** Formatea fecha larga (para "último entrenamiento"). */
export function formatDateLong(isoDate: string): string {
  return new Date(isoDate + 'T12:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}
