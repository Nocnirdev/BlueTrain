import type {
  StrengthOcrBatch,
  StrengthOcrPage,
  StrengthOcrPageReview,
  StrengthOcrReviewStatus,
  StrengthOcrReviewStore,
  StrengthOcrSavedBatch,
} from '@/types';

const STORAGE_KEY = 'bt_strength_ocr_review_v1';
const MAX_BATCH_BYTES = 2_500_000;

const EMPTY_STORE: StrengthOcrReviewStore = {
  schemaVersion: 1,
  updatedAt: '',
  batches: {},
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function toSafeText(value: unknown, limit = 160_000): string {
  return typeof value === 'string' ? value.slice(0, limit) : '';
}

function validPage(value: unknown): StrengthOcrPage | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<StrengthOcrPage>;
  if (!Number.isInteger(candidate.page) || (candidate.page ?? 0) < 1) return null;
  if (typeof candidate.rawText !== 'string') return null;

  const lines = Array.isArray(candidate.lines)
    ? candidate.lines
      .filter(line => line && typeof line === 'object' && typeof (line as { text?: unknown }).text === 'string')
      .slice(0, 2_000)
      .map(line => {
        const item = line as { text: string; confidence?: unknown; x?: unknown; y?: unknown };
        return {
          text: toSafeText(item.text, 2_000),
          ...(typeof item.confidence === 'number' ? { confidence: item.confidence } : {}),
          ...(typeof item.x === 'number' ? { x: item.x } : {}),
          ...(typeof item.y === 'number' ? { y: item.y } : {}),
        };
      })
    : undefined;

  return {
    page: Number(candidate.page),
    rawText: toSafeText(candidate.rawText),
    ...(lines?.length ? { lines } : {}),
  };
}

export function parseStrengthOcrBatch(input: unknown): StrengthOcrBatch {
  if (!input || typeof input !== 'object') throw new Error('El archivo no contiene un lote OCR válido.');
  const value = input as Partial<StrengthOcrBatch>;
  if (value.schemaVersion !== 1 || typeof value.batchId !== 'string' || !value.batchId.trim()) {
    throw new Error('El lote no corresponde al formato privado de Fuerza.');
  }
  if (!value.source || typeof value.source.fileName !== 'string' || !Array.isArray(value.source.pageRange)) {
    throw new Error('Falta la referencia de páginas del cuaderno.');
  }
  const [first, last] = value.source.pageRange;
  if (!Number.isInteger(first) || !Number.isInteger(last) || first < 1 || last < first) {
    throw new Error('El rango de páginas del lote no es válido.');
  }
  if (!Array.isArray(value.pages) || value.pages.length === 0 || value.pages.length > 10) {
    throw new Error('Cada lote debe contener entre una y diez páginas.');
  }
  const pages = value.pages.map(validPage).filter((page): page is StrengthOcrPage => page !== null);
  if (pages.length !== value.pages.length || new Set(pages.map(page => page.page)).size !== pages.length) {
    throw new Error('El lote contiene páginas repetidas o con un formato no válido.');
  }

  const batch: StrengthOcrBatch = {
    schemaVersion: 1,
    batchId: value.batchId.trim().slice(0, 80),
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : new Date().toISOString(),
    source: {
      fileName: value.source.fileName.slice(0, 180),
      pageRange: [first, last],
      ...(Number.isInteger(value.source.totalPages) ? { totalPages: value.source.totalPages } : {}),
    },
    pages: pages.sort((a, b) => a.page - b.page),
  };

  if (new Blob([JSON.stringify(batch)]).size > MAX_BATCH_BYTES) {
    throw new Error('El lote es demasiado grande para guardarlo con seguridad en este navegador.');
  }
  return batch;
}

function defaultReview(page: StrengthOcrPage): StrengthOcrPageReview {
  return {
    correctedText: page.rawText,
    notes: '',
    status: 'needs_review',
    updatedAt: new Date().toISOString(),
  };
}

function normaliseReview(value: unknown, page: StrengthOcrPage): StrengthOcrPageReview {
  if (!value || typeof value !== 'object') return defaultReview(page);
  const review = value as Partial<StrengthOcrPageReview>;
  const validStatus: StrengthOcrReviewStatus[] = ['needs_review', 'reviewed', 'approved', 'skipped'];
  return {
    correctedText: toSafeText(review.correctedText || page.rawText),
    notes: toSafeText(review.notes, 20_000),
    status: validStatus.includes(review.status as StrengthOcrReviewStatus)
      ? review.status as StrengthOcrReviewStatus
      : 'needs_review',
    updatedAt: typeof review.updatedAt === 'string' ? review.updatedAt : new Date().toISOString(),
  };
}

export function loadStrengthOcrStore(): StrengthOcrReviewStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(EMPTY_STORE);
    const parsed = JSON.parse(raw) as Partial<StrengthOcrReviewStore>;
    if (parsed.schemaVersion !== 1 || !parsed.batches || typeof parsed.batches !== 'object') return clone(EMPTY_STORE);
    const batches: Record<string, StrengthOcrSavedBatch> = {};
    Object.entries(parsed.batches).forEach(([batchId, saved]) => {
      try {
        const candidate = saved as Partial<StrengthOcrSavedBatch>;
        const batch = parseStrengthOcrBatch(candidate.batch);
        const reviews: Record<string, StrengthOcrPageReview> = {};
        batch.pages.forEach(page => {
          reviews[String(page.page)] = normaliseReview(candidate.reviews?.[String(page.page)], page);
        });
        batches[batchId] = { batch, reviews };
      } catch {
        // Se ignora únicamente el lote dañado; el resto sigue disponible.
      }
    });
    return { schemaVersion: 1, updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '', batches };
  } catch {
    return clone(EMPTY_STORE);
  }
}

function saveStore(store: StrengthOcrReviewStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function saveStrengthOcrBatch(batch: StrengthOcrBatch): StrengthOcrSavedBatch {
  const store = loadStrengthOcrStore();
  const existing = store.batches[batch.batchId];
  const reviews: Record<string, StrengthOcrPageReview> = {};
  batch.pages.forEach(page => {
    reviews[String(page.page)] = normaliseReview(existing?.reviews[String(page.page)], page);
  });
  const saved = { batch, reviews };
  store.batches[batch.batchId] = saved;
  store.updatedAt = new Date().toISOString();
  saveStore(store);
  return saved;
}

/** Acepta tanto un lote OCR nuevo como una exportación local ya revisada. */
export function importStrengthOcrData(input: unknown): StrengthOcrSavedBatch {
  const exported = input && typeof input === 'object' ? input as {
    batch?: unknown;
    reviews?: Record<string, unknown>;
    pages?: Array<{ page?: unknown; review?: unknown }>;
  } : {};
  const batch = parseStrengthOcrBatch(exported.batch ?? input);
  const saved = saveStrengthOcrBatch(batch);
  const suppliedReviews = exported.reviews ?? Object.fromEntries(
    (exported.pages ?? [])
      .filter(page => Number.isInteger(page.page) && page.review)
      .map(page => [String(page.page), page.review]),
  );
  const store = loadStrengthOcrStore();
  const imported = store.batches[batch.batchId] ?? saved;
  batch.pages.forEach(page => {
    const supplied = suppliedReviews[String(page.page)];
    if (supplied) imported.reviews[String(page.page)] = normaliseReview(supplied, page);
  });
  store.batches[batch.batchId] = imported;
  store.updatedAt = new Date().toISOString();
  saveStore(store);
  return imported;
}

export function saveStrengthOcrPageReview(batchId: string, pageNumber: number, review: Omit<StrengthOcrPageReview, 'updatedAt'>): StrengthOcrSavedBatch | null {
  const store = loadStrengthOcrStore();
  const saved = store.batches[batchId];
  if (!saved || !saved.batch.pages.some(page => page.page === pageNumber)) return null;
  saved.reviews[String(pageNumber)] = {
    correctedText: toSafeText(review.correctedText),
    notes: toSafeText(review.notes, 20_000),
    status: review.status,
    updatedAt: new Date().toISOString(),
  };
  store.updatedAt = new Date().toISOString();
  saveStore(store);
  return saved;
}

export function deleteStrengthOcrBatch(batchId: string): void {
  const store = loadStrengthOcrStore();
  delete store.batches[batchId];
  store.updatedAt = new Date().toISOString();
  saveStore(store);
}

export function exportStrengthOcrBatch(saved: StrengthOcrSavedBatch): Blob {
  return new Blob([JSON.stringify({
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    batch: saved.batch,
    reviews: saved.reviews,
  }, null, 2)], { type: 'application/json' });
}

export function reviewProgress(saved: StrengthOcrSavedBatch): { reviewed: number; approved: number; total: number } {
  const all = Object.values(saved.reviews);
  return {
    reviewed: all.filter(review => review.status !== 'needs_review').length,
    approved: all.filter(review => review.status === 'approved').length,
    total: saved.batch.pages.length,
  };
}
