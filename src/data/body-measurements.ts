import type { BodyMeasurement, WeightEntry } from '@/types';

export const BODY_MEASUREMENT_KEYS = {
  weight: 'body-weight',
  waist: 'body-waist',
  hip: 'body-hip',
} as const;

export type BodyMeasurementField = keyof typeof BODY_MEASUREMENT_KEYS;

export function isBodyMeasurementKey(key: string): boolean {
  return Object.values(BODY_MEASUREMENT_KEYS).includes(key as typeof BODY_MEASUREMENT_KEYS[BodyMeasurementField]);
}

export function getBodyMeasurements(weightHistory: Record<string, WeightEntry[]>): BodyMeasurement[] {
  const byDate = new Map<string, BodyMeasurement & { updatedAt: Partial<Record<BodyMeasurementField, string>> }>();

  (Object.entries(BODY_MEASUREMENT_KEYS) as Array<[BodyMeasurementField, string]>).forEach(([field, key]) => {
    (weightHistory[key] ?? []).forEach(entry => {
      const current = byDate.get(entry.date) ?? { date: entry.date, updatedAt: {} };
      const previous = current.updatedAt[field];
      if (!previous || entry.recordedAt >= previous) {
        current[field] = entry.weight;
        current.updatedAt[field] = entry.recordedAt;
      }
      byDate.set(entry.date, current);
    });
  });

  return [...byDate.values()]
    .map(({ updatedAt: _updatedAt, ...measurement }) => measurement)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function countBodyMeasurementDates(entries: WeightEntry[]): number {
  return getBodyMeasurements(
    entries.reduce<Record<string, WeightEntry[]>>((history, entry) => {
      if (!isBodyMeasurementKey(entry.exerciseKey)) return history;
      (history[entry.exerciseKey] ??= []).push(entry);
      return history;
    }, {})
  ).length;
}
