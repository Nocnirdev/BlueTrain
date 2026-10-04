import { showToast } from '@/components/toast';
import {
  BODY_MEASUREMENT_KEYS,
  type BodyMeasurementField,
} from '@/data/body-measurements';
import { esc, formatDate, $maybe } from '@/lib/html';
import { DB } from '@/services/db';
import type { BodyMeasurement, WeightEntry } from '@/types';

type ChartPoint = { date: string; value: number };
type ChartSeries = { label: string; className: string; points: ChartPoint[] };

const numberFormat = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 });

export function renderBodyTracking(measurements: BodyMeasurement[]): string {
  const weightPoints = _pointsFor(measurements, 'weight');
  const waistPoints = _pointsFor(measurements, 'waist');
  const hipPoints = _pointsFor(measurements, 'hip');
  const hasMeasurements = weightPoints.length || waistPoints.length || hipPoints.length;

  return `
    <section class="body-tracking" aria-labelledby="bodyTrackingTitle">
      <div class="section-title-bar body-tracking__title">
        <div>
          <h3 id="bodyTrackingTitle">Seguimiento corporal</h3>
          <p class="body-tracking__intro">Peso, cintura y cadera</p>
        </div>
        <button class="btn btn--secondary body-tracking__button" id="openMeasurementsBtn" type="button">
          Registrar medidas
        </button>
      </div>
      ${hasMeasurements ? `
        <div class="body-latest" role="list" aria-label="Últimas medidas registradas">
          ${_latestCard('Peso', 'kg', weightPoints, 'weight')}
          ${_latestCard('Cintura', 'cm', waistPoints, 'waist')}
          ${_latestCard('Cadera', 'cm', hipPoints, 'hip')}
        </div>
        <div class="body-chart-grid">
          ${_chartCard('Peso corporal', 'kg', [{ label: 'Peso', className: 'body-line--weight', points: weightPoints }])}
          ${_chartCard('Medidas', 'cm', [
            { label: 'Cintura', className: 'body-line--waist', points: waistPoints },
            { label: 'Cadera', className: 'body-line--hip', points: hipPoints },
          ])}
        </div>
      ` : `
        <div class="body-empty">
          <p>Registra peso, cintura o cadera para ver su evolución aquí.</p>
        </div>
      `}
    </section>`;
}

export function openMeasurementsModal(): void {
  const modal = document.getElementById('measurementModal');
  if (!modal) return;

  const date = $maybe<HTMLInputElement>('measurementDate');
  if (date) date.value = _todayLocal();
  ['measurementWeight', 'measurementWaist', 'measurementHip'].forEach(id => {
    const input = $maybe<HTMLInputElement>(id);
    if (input) input.value = '';
  });

  modal.classList.add('open');
  window.setTimeout(() => date?.focus(), 0);
}

export function closeMeasurementsModal(): void {
  document.getElementById('measurementModal')?.classList.remove('open');
}

export async function saveMeasurements(): Promise<void> {
  const date = ($maybe<HTMLInputElement>('measurementDate')?.value ?? '').trim();
  if (!_isValidDate(date)) {
    showToast('Indica una fecha válida.', 'error');
    return;
  }

  const values = {
    weight: _readMeasurement('measurementWeight', 20, 400),
    waist: _readMeasurement('measurementWaist', 30, 250),
    hip: _readMeasurement('measurementHip', 30, 250),
  };
  if (Object.values(values).some(value => value === null)) {
    showToast('Revisa las medidas: usa un número dentro del rango indicado.', 'error');
    return;
  }
  if (Object.values(values).every(value => value === undefined)) {
    showToast('Añade al menos una medida para guardar el registro.', 'error');
    return;
  }

  const saveButton = $maybe<HTMLButtonElement>('saveMeasurementBtn');
  if (saveButton) saveButton.disabled = true;

  try {
    const recordedAt = new Date().toISOString();
    const entries: WeightEntry[] = [];
    (Object.entries(values) as Array<[BodyMeasurementField, number | undefined | null]>).forEach(([field, value], index) => {
      if (typeof value !== 'number') return;
      entries.push({
        id: `body-${field}-${date}-${recordedAt.replace(/\D/g, '')}-${index}`,
        exerciseKey: BODY_MEASUREMENT_KEYS[field],
        date,
        weight: value,
        recordedAt,
      });
    });
    await Promise.all(entries.map(entry => DB.addWeightEntry(entry)));
    closeMeasurementsModal();
    showToast(`Medida${entries.length === 1 ? '' : 's'} guardada${entries.length === 1 ? '' : 's'}.`, 'success');
    document.dispatchEvent(new Event('bt:measurementsSaved'));
  } catch {
    showToast('No se pudieron guardar las medidas. Inténtalo de nuevo.', 'error');
  } finally {
    if (saveButton) saveButton.disabled = false;
  }
}

function _latestCard(label: string, unit: string, points: ChartPoint[], className: string): string {
  const latest = points.at(-1);
  return `
    <div class="body-latest-card body-latest-card--${className}" role="listitem">
      <div class="body-latest-card__label">${label}</div>
      <div class="body-latest-card__value">${latest ? esc(numberFormat.format(latest.value)) : '—'}<span>${unit}</span></div>
      <div class="body-latest-card__date">${latest ? esc(formatDate(latest.date)) : 'Sin registro'}</div>
    </div>`;
}

function _chartCard(title: string, unit: string, series: ChartSeries[]): string {
  const available = series.filter(item => item.points.length);
  if (!available.length) {
    return `
      <article class="body-chart-card">
        <h4>${esc(title)}</h4>
        <p class="body-chart-card__empty">Todavía no hay datos para esta gráfica.</p>
      </article>`;
  }

  const allPoints = available.flatMap(item => item.points);
  const values = allPoints.map(point => point.value);
  const dates = allPoints.map(point => _dateValue(point.date));
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = Math.max((maxValue - minValue) * 0.2, Math.abs(maxValue) * 0.03, 1);
  const lower = minValue - padding;
  const upper = maxValue + padding;
  const startDate = Math.min(...dates);
  const endDate = Math.max(...dates);
  const points = (series: ChartSeries) => series.points.map(point => {
    const x = _chartX(_dateValue(point.date), startDate, endDate);
    const y = _chartY(point.value, lower, upper);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const dots = (series: ChartSeries) => series.points.map(point => {
    const x = _chartX(_dateValue(point.date), startDate, endDate);
    const y = _chartY(point.value, lower, upper);
    return `<circle class="${series.className}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"></circle>`;
  }).join('');
  const firstDate = allPoints.reduce((first, point) => _dateValue(point.date) < _dateValue(first) ? point.date : first, allPoints[0]!.date);
  const lastDate = allPoints.reduce((last, point) => _dateValue(point.date) > _dateValue(last) ? point.date : last, allPoints[0]!.date);
  const description = `${title}: ${available.map(item => `${item.label}, ${item.points.length} registros`).join('; ')}.`;

  return `
    <article class="body-chart-card">
      <div class="body-chart-card__header">
        <h4>${esc(title)}</h4>
        <span>${esc(unit)}</span>
      </div>
      ${available.length > 1 ? `<div class="body-chart-legend">${available.map(item => `<span><i class="${item.className}"></i>${esc(item.label)}</span>`).join('')}</div>` : ''}
      <svg class="body-line-chart" viewBox="0 0 320 104" preserveAspectRatio="none" role="img" aria-label="${esc(description)}">
        <line class="body-line-chart__grid" x1="14" y1="20" x2="306" y2="20"></line>
        <line class="body-line-chart__grid" x1="14" y1="76" x2="306" y2="76"></line>
        ${available.map(item => `<polyline class="${item.className}" points="${points(item)}"></polyline>${dots(item)}`).join('')}
      </svg>
      <div class="body-chart-axis"><span>${esc(formatDate(firstDate))}</span><span>${esc(formatDate(lastDate))}</span></div>
      <p class="body-chart-card__note">${available.every(item => item.points.length < 2) ? 'Añade una segunda medición para ver la evolución.' : 'Datos registrados por ti.'}</p>
    </article>`;
}

function _pointsFor(measurements: BodyMeasurement[], field: BodyMeasurementField): ChartPoint[] {
  return measurements.flatMap(measurement => {
    const value = measurement[field];
    return typeof value === 'number' ? [{ date: measurement.date, value }] : [];
  });
}

function _readMeasurement(inputId: string, min: number, max: number): number | undefined | null {
  const raw = ($maybe<HTMLInputElement>(inputId)?.value ?? '').trim().replace(',', '.');
  if (!raw) return undefined;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < min || value > max) return null;
  return value;
}

function _todayLocal(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

function _dateValue(date: string): number {
  return new Date(`${date}T12:00:00`).getTime();
}

function _isValidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [year, month, day] = date.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;
}

function _chartX(value: number, first: number, last: number): number {
  if (first === last) return 160;
  return 14 + ((value - first) / (last - first)) * 292;
}

function _chartY(value: number, lower: number, upper: number): number {
  return 76 - ((value - lower) / (upper - lower)) * 56;
}
