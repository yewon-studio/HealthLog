import type { WorkoutRecord, WorkoutType } from '../types/workout';
import { weekKeys } from './dateUtils';

export interface TypeTotals {
  pilates: number;
  gym: number;
  total: number;
}

export function emptyTotals(): TypeTotals {
  return { pilates: 0, gym: 0, total: 0 };
}

export function totalsForRecords(records: WorkoutRecord[]): TypeTotals {
  return records.reduce<TypeTotals>((acc, record) => {
    if (record.type === 'PILATES') acc.pilates += record.count;
    if (record.type === 'GYM') acc.gym += record.count;
    acc.total += record.count;
    return acc;
  }, emptyTotals());
}

export function recordsOnDate(
  records: WorkoutRecord[],
  date: string,
): WorkoutRecord[] {
  return records.filter((record) => record.date === date);
}

export function recordsInRange(
  records: WorkoutRecord[],
  keys: string[],
): WorkoutRecord[] {
  const set = new Set(keys);
  return records.filter((record) => set.has(record.date));
}

export function dailyTotal(records: WorkoutRecord[], date: string): TypeTotals {
  return totalsForRecords(recordsOnDate(records, date));
}

export function weeklyTotal(
  records: WorkoutRecord[],
  date: string,
): TypeTotals {
  return totalsForRecords(recordsInRange(records, weekKeys(date)));
}

export function monthlyTotal(
  records: WorkoutRecord[],
  year: number,
  month: number,
): TypeTotals {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return totalsForRecords(records.filter((record) => record.date.startsWith(prefix)));
}

export function yearlyTotal(
  records: WorkoutRecord[],
  year: number,
): TypeTotals {
  const prefix = `${year}-`;
  return totalsForRecords(records.filter((record) => record.date.startsWith(prefix)));
}

export function lifetimeTotal(records: WorkoutRecord[]): TypeTotals {
  return totalsForRecords(records);
}

export function countForType(
  records: WorkoutRecord[],
  date: string,
  type: WorkoutType,
): number {
  return records
    .filter((record) => record.date === date && record.type === type)
    .reduce((sum, record) => sum + record.count, 0);
}

export function hasWorkout(records: WorkoutRecord[], date: string): boolean {
  return dailyTotal(records, date).total > 0;
}

export function workoutDayCount(records: WorkoutRecord[]): number {
  return new Set(
    records.filter((record) => record.count > 0).map((record) => record.date),
  ).size;
}

export function bodyPartCounts(
  records: WorkoutRecord[],
): { part: string; count: number }[] {
  const counts = new Map<string, number>();

  records.forEach((record) => {
    if (record.count <= 0) return;
    record.bodyParts.forEach((part) => {
      counts.set(part, (counts.get(part) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .map(([part, count]) => ({ part, count }))
    .sort((left, right) => right.count - left.count);
}

export function streakCount(
  records: WorkoutRecord[],
  today: string,
): number {
  const activeDates = new Set(
    records.filter((record) => record.count > 0).map((record) => record.date),
  );

  const cursor = new Date(
    Number(today.slice(0, 4)),
    Number(today.slice(5, 7)) - 1,
    Number(today.slice(8, 10)),
  );

  if (!activeDates.has(today)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;

  while (true) {
    const year = cursor.getFullYear();
    const month = String(cursor.getMonth() + 1).padStart(2, '0');
    const day = String(cursor.getDate()).padStart(2, '0');
    const key = `${year}-${month}-${day}`;
    if (!activeDates.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
