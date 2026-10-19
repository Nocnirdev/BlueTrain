import { showConfirm } from '@/components/dialog';
import { showToast } from '@/components/toast';
import { esc } from '@/lib/html';
import {
  deleteStrengthOcrBatch,
  exportStrengthOcrBatch,
  importStrengthOcrData,
  loadStrengthOcrStore,
  reviewProgress,
  saveStrengthOcrPageReview,
} from '@/services/strength-ocr';
import type { StrengthOcrPage, StrengthOcrReviewStatus, StrengthOcrSavedBatch } from '@/types';

let selectedBatchId = '';
let selectedPageNumber: number | null = null;
let sourcePdfUrl = '';
let sourcePdfName = '';
let fileInputsBound = false;

const STATUS_LABEL: Record<StrengthOcrReviewStatus, string> = {
  needs_review: 'Pendiente',
  reviewed: 'Revisada',
  approved: 'Aprobada',
  skipped: 'No utilizable',
};

const STATUS_CLASS: Record<StrengthOcrReviewStatus, string> = {
  needs_review: 'pending',
  reviewed: 'reviewed',
  approved: 'approved',
  skipped: 'skipped',
};

function getSelectedBatch(): StrengthOcrSavedBatch | null {
  const store = loadStrengthOcrStore();
  const batches = Object.values(store.batches).sort((a, b) => b.batch.createdAt.localeCompare(a.batch.createdAt));
  if (!batches.length) return null;
  if (!store.batches[selectedBatchId]) selectedBatchId = batches[0].batch.batchId;
  return store.batches[selectedBatchId] ?? batches[0];
}

function getSelectedPage(saved: StrengthOcrSavedBatch): StrengthOcrPage {
  const fallback = saved.batch.pages[0];
  const page = saved.batch.pages.find(item => item.page === selectedPageNumber);
  if (!page) selectedPageNumber = fallback.page;
  return page ?? fallback;
}

function pageButton(saved: StrengthOcrSavedBatch, page: StrengthOcrPage): string {
  const review = saved.reviews[String(page.page)];
  const status = review?.status ?? 'needs_review';
  return `<button class="strength-page-tab ${selectedPageNumber === page.page ? 'active' : ''} status-${STATUS_CLASS[status]}"
    type="button" data-strength-page="${page.page}" aria-pressed="${selectedPageNumber === page.page}">
    Pág. ${page.page}
  </button>`;
}

function emptyState(): string {
  return `
    <div class="strength-hero">
      <div>
        <p class="section-kicker">Fuerza · archivo privado</p>
        <h2>Revisión del cuaderno</h2>
        <p>Importe el primer lote de OCR para compararlo con el PDF y corregirlo página a página.</p>
      </div>
      <button class="btn btn--primary" id="strengthImportButton" type="button">Importar lote OCR</button>
    </div>
    <div class="strength-empty card">
      <h3>El cuaderno no sale de este dispositivo</h3>
      <p>El PDF se abre solamente para consulta. El texto OCR y las correcciones quedan en el navegador hasta que usted exporte un lote revisado.</p>
      <ol>
        <li>Elija <em>Ejercicios de Fuerza.pdf</em> como referencia visual.</li>
        <li>Importe un archivo <em>lote-fuerza-XXX.json</em>.</li>
        <li>Corrija el texto, añada notas y marque el resultado.</li>
      </ol>
    </div>`;
}

function reviewState(saved: StrengthOcrSavedBatch, page: StrengthOcrPage): string {
  const review = saved.reviews[String(page.page)];
  const progress = reviewProgress(saved);
  const sourcePane = sourcePdfUrl
    ? `<iframe class="strength-pdf" title="Página ${page.page} del cuaderno de Fuerza" src="${esc(sourcePdfUrl)}#page=${page.page}&zoom=page-width"></iframe>`
    : `<div class="strength-source-placeholder">
         <h3>Seleccione el PDF de referencia</h3>
         <p>Solo se abrirá aquí para comparar la página ${page.page}. No se carga ni se guarda en línea.</p>
         <button class="btn btn--secondary" id="strengthPdfButton" type="button">Elegir PDF privado</button>
       </div>`;

  return `
    <div class="strength-hero strength-hero--compact">
      <div>
        <p class="section-kicker">Fuerza · archivo privado</p>
        <h2>Revisión del cuaderno</h2>
        <p>${esc(saved.batch.batchId)} · páginas ${saved.batch.source.pageRange[0]}–${saved.batch.source.pageRange[1]} · ${progress.reviewed}/${progress.total} revisadas</p>
      </div>
      <div class="strength-hero-actions">
        <button class="btn btn--secondary" id="strengthImportButton" type="button">Importar otro lote</button>
        <button class="btn btn--secondary" id="strengthPdfButton" type="button">${sourcePdfUrl ? 'Cambiar PDF' : 'Elegir PDF'}</button>
        <button class="btn btn--primary" id="strengthExportButton" type="button">Exportar revisión</button>
      </div>
    </div>
    <div class="alert alert--warning strength-privacy-note">
      <span>Este contenido es privado: no se envía a Supabase, Vercel ni al repositorio. La aprobación no crea entrenamientos en su historial.</span>
    </div>
    <div class="strength-batch-bar card">
      <label for="strengthBatchSelect">Lote abierto</label>
      <select id="strengthBatchSelect" class="log-select" aria-label="Lote OCR abierto">
        ${Object.values(loadStrengthOcrStore().batches)
          .sort((a, b) => a.batch.batchId.localeCompare(b.batch.batchId))
          .map(batch => `<option value="${esc(batch.batch.batchId)}" ${batch.batch.batchId === selectedBatchId ? 'selected' : ''}>${esc(batch.batch.batchId)} · págs. ${batch.batch.source.pageRange[0]}–${batch.batch.source.pageRange[1]}</option>`).join('')}
      </select>
      <span class="strength-progress"><strong>${progress.approved}</strong> aprobadas · ${progress.total - progress.reviewed} pendientes</span>
      <button class="btn btn--ghost strength-forget" id="strengthDeleteButton" type="button">Olvidar este lote</button>
    </div>
    <div class="strength-page-tabs" role="tablist" aria-label="Páginas del lote">
      ${saved.batch.pages.map(item => pageButton(saved, item)).join('')}
    </div>
    <div class="strength-review-grid">
      <article class="strength-panel card" aria-label="Original de la página ${page.page}">
        <header class="strength-panel-heading">
          <div><span>Original</span><strong>Página ${page.page}</strong></div>
          <small>${sourcePdfUrl ? esc(sourcePdfName) : 'PDF no seleccionado'}</small>
        </header>
        <div class="strength-source">${sourcePane}</div>
      </article>
      <article class="strength-panel card" aria-label="Revisión de OCR de la página ${page.page}">
        <header class="strength-panel-heading">
          <div><span>Transcripción</span><strong>Página ${page.page}</strong></div>
          <span class="strength-status status-${STATUS_CLASS[review.status]}">${STATUS_LABEL[review.status]}</span>
        </header>
        <div class="strength-editor">
          <label class="log-label" for="strengthCorrectedText">Texto corregido</label>
          <textarea class="log-textarea strength-textarea" id="strengthCorrectedText" spellcheck="true" aria-describedby="strengthAutosave">${esc(review.correctedText)}</textarea>
          <div class="strength-editor-row">
            <div>
              <label class="log-label" for="strengthStatus">Estado</label>
              <select class="log-select" id="strengthStatus">
                ${Object.entries(STATUS_LABEL).map(([value, label]) => `<option value="${value}" ${review.status === value ? 'selected' : ''}>${label}</option>`).join('')}
              </select>
            </div>
            <p id="strengthAutosave" class="strength-autosave" role="status">Se guarda solo en este navegador.</p>
          </div>
          <label class="log-label" for="strengthNotes">Notas de revisión</label>
          <textarea class="log-textarea strength-notes" id="strengthNotes" placeholder="Dudas, abreviaturas o detalles que haya que validar…">${esc(review.notes)}</textarea>
        </div>
      </article>
    </div>`;
}

export function renderStrength(): void {
  const section = document.getElementById('strengthSection');
  if (!section) return;
  const saved = getSelectedBatch();
  if (!saved) {
    section.innerHTML = emptyState();
    bindStrengthEvents();
    return;
  }
  const page = getSelectedPage(saved);
  section.innerHTML = reviewState(saved, page);
  bindStrengthEvents();
}

async function importBatch(file: File): Promise<void> {
  if (file.size > 2_500_000) {
    showToast('El lote supera el tamaño permitido para esta revisión local.', 'error');
    return;
  }
  try {
    const data = JSON.parse(await file.text()) as unknown;
    const saved = importStrengthOcrData(data);
    selectedBatchId = saved.batch.batchId;
    selectedPageNumber = saved.batch.pages[0]?.page ?? null;
    renderStrength();
    showToast(`Lote ${saved.batch.batchId} guardado solo en este navegador.`, 'success');
  } catch (error) {
    showToast(error instanceof Error ? error.message : 'No se pudo leer el lote OCR.', 'error');
  }
}

function downloadReview(saved: StrengthOcrSavedBatch): void {
  const file = exportStrengthOcrBatch(saved);
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${saved.batch.batchId}-revisado.json`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  showToast('Revisión exportada. Guárdela fuera del repositorio.', 'success');
}

function persistCurrentReview(): StrengthOcrSavedBatch | null {
  const saved = getSelectedBatch();
  if (!saved || selectedPageNumber === null) return null;
  const text = document.getElementById('strengthCorrectedText') as HTMLTextAreaElement | null;
  const notes = document.getElementById('strengthNotes') as HTMLTextAreaElement | null;
  const status = document.getElementById('strengthStatus') as HTMLSelectElement | null;
  if (!text || !notes || !status) return saved;
  const updated = saveStrengthOcrPageReview(saved.batch.batchId, selectedPageNumber, {
    correctedText: text.value,
    notes: notes.value,
    status: status.value as StrengthOcrReviewStatus,
  });
  const indicator = document.getElementById('strengthAutosave');
  if (indicator) indicator.textContent = 'Guardado solo en este navegador.';
  return updated;
}

function bindFileInputs(): void {
  if (fileInputsBound) return;
  fileInputsBound = true;
  document.getElementById('strengthBatchInput')?.addEventListener('change', event => {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (file) void importBatch(file);
  });
  document.getElementById('strengthPdfInput')?.addEventListener('change', event => {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (sourcePdfUrl) URL.revokeObjectURL(sourcePdfUrl);
    sourcePdfUrl = URL.createObjectURL(file);
    sourcePdfName = file.name;
    renderStrength();
  });
}

function bindStrengthEvents(): void {
  bindFileInputs();
  document.getElementById('strengthImportButton')?.addEventListener('click', () => {
    document.getElementById('strengthBatchInput')?.click();
  });
  document.getElementById('strengthPdfButton')?.addEventListener('click', () => {
    document.getElementById('strengthPdfInput')?.click();
  });
  document.getElementById('strengthBatchSelect')?.addEventListener('change', event => {
    selectedBatchId = (event.currentTarget as HTMLSelectElement).value;
    selectedPageNumber = null;
    renderStrength();
  });
  document.querySelectorAll<HTMLButtonElement>('[data-strength-page]').forEach(button => {
    button.addEventListener('click', () => {
      selectedPageNumber = Number(button.dataset['strengthPage']);
      renderStrength();
    });
  });
  document.getElementById('strengthStatus')?.addEventListener('change', () => {
    persistCurrentReview();
    renderStrength();
  });
  ['strengthCorrectedText', 'strengthNotes'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', persistCurrentReview);
  });
  document.getElementById('strengthExportButton')?.addEventListener('click', () => {
    const saved = persistCurrentReview() ?? getSelectedBatch();
    if (saved) downloadReview(saved);
  });
  document.getElementById('strengthDeleteButton')?.addEventListener('click', async () => {
    const saved = getSelectedBatch();
    if (!saved) return;
    const accepted = await showConfirm(`¿Olvidar ${saved.batch.batchId} de este navegador? La copia exportada, si existe, no se borrará.`, 'Olvidar lote');
    if (!accepted) return;
    deleteStrengthOcrBatch(saved.batch.batchId);
    selectedBatchId = '';
    selectedPageNumber = null;
    renderStrength();
    showToast('El lote se ha eliminado de este navegador.');
  });
}
