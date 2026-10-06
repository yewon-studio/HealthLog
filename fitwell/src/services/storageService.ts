import type { Holiday } from '../types/holiday';
import type { Vacation, VacationAllowance } from '../types/vacation';
import { DEFAULT_USER, clampWaterGoal, clampWeeklyGoal, type User } from '../types/user';
import type { WaterRecord } from '../types/water';
import {
  isBodyPart,
  type WorkoutRecord,
} from '../types/workout';
import { isDateKey, normalizeDateKey } from '../utils/dateUtils';

export const STORAGE_KEY = 'fitwell.v1';

export interface AppData {
  version: 1;
  user: User;
  workouts: WorkoutRecord[];
  waters: WaterRecord[];
  holidays: Holiday[];
  vacationAllowances: VacationAllowance[];
  vacations: Vacation[];
}

function emptyData(): AppData {
  return {
    version: 1,
    user: { ...DEFAULT_USER },
    workouts: [],
    waters: [],
    holidays: [],
    vacationAllowances: [],
    vacations: [],
  };
}

function migrateVacationAllowances(records: unknown): VacationAllowance[] {
  if (!Array.isArray(records)) return [];
  return records
    .filter(
      (record): record is VacationAllowance =>
        !!record &&
        typeof record === 'object' &&
        Number.isInteger((record as VacationAllowance).year) &&
        Number.isFinite((record as VacationAllowance).totalDays),
    )
    .map((record) => ({
      year: record.year,
      totalDays: Math.max(0, Math.floor(record.totalDays)),
      memo: typeof record.memo === 'string' ? record.memo.trim() || undefined : undefined,
      updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : new Date().toISOString(),
    }));
}

function migrateVacations(records: unknown): Vacation[] {
  if (!Array.isArray(records)) return [];
  return records
    .filter(
      (record): record is Vacation =>
        !!record &&
        typeof record === 'object' &&
        typeof (record as Vacation).id === 'string' &&
        typeof (record as Vacation).name === 'string' &&
        typeof (record as Vacation).startDate === 'string' &&
        typeof (record as Vacation).endDate === 'string',
    )
    .map((record) => ({
      id: record.id,
      name: record.name.trim(),
      startDate: normalizeDateKey(record.startDate),
      endDate: normalizeDateKey(record.endDate),
      type: ['annual', 'sick', 'special', 'other'].includes(record.type)
        ? record.type
        : 'annual',
      memo: typeof record.memo === 'string' ? record.memo.trim() || undefined : undefined,
      createdAt: typeof record.createdAt === 'string' ? record.createdAt : new Date().toISOString(),
      updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : new Date().toISOString(),
    }))
    .filter(
      (record) =>
        record.name &&
        isDateKey(record.startDate) &&
        isDateKey(record.endDate) &&
        record.endDate >= record.startDate,
    );
}

function migrateHolidays(records: unknown): Holiday[] {
  if (!Array.isArray(records)) return [];
  return records
    .filter(
      (record): record is Holiday =>
        !!record &&
        typeof record === 'object' &&
        typeof (record as Holiday).id === 'string' &&
        typeof (record as Holiday).name === 'string' &&
        typeof (record as Holiday).date === 'string',
    )
    .map((record) => ({
      id: record.id,
      name: record.name.trim(),
      date: normalizeDateKey(record.date),
      memo: typeof record.memo === 'string' && record.memo.trim() ? record.memo.trim() : undefined,
      source: 'custom' as const,
      createdAt: typeof record.createdAt === 'string' ? record.createdAt : new Date().toISOString(),
    }))
    .filter((record) => record.name && isDateKey(record.date));
}

function migrateWorkout(record: WorkoutRecord): WorkoutRecord {
  return {
    ...record,
    date: normalizeDateKey(record.date),
    count: Math.max(0, Number(record.count) || 0),
    bodyParts: Array.isArray(record.bodyParts)
      ? record.bodyParts.filter(isBodyPart)
      : [],
  };
}

function migrateWater(record: WaterRecord): WaterRecord {
  return {
    ...record,
    date: normalizeDateKey(record.date),
    amount: Math.max(0, Number(record.amount) || 0),
  };
}

export function parseAppData(input: unknown): AppData {
  if (!input || typeof input !== 'object') {
    throw new Error('HealthLog 백업 형식이 아닙니다.');
  }

  const parsed = input as Partial<AppData>;
  return {
    version: 1,
    user: {
      ...DEFAULT_USER,
      ...parsed.user,
      waterGoal: clampWaterGoal(parsed.user?.waterGoal ?? DEFAULT_USER.waterGoal),
      weeklyWorkoutGoal: clampWeeklyGoal(
        parsed.user?.weeklyWorkoutGoal ?? DEFAULT_USER.weeklyWorkoutGoal,
      ),
    },
    workouts: Array.isArray(parsed.workouts)
      ? parsed.workouts.map(migrateWorkout)
      : [],
    waters: Array.isArray(parsed.waters) ? parsed.waters.map(migrateWater) : [],
    holidays: migrateHolidays(parsed.holidays),
    vacationAllowances: migrateVacationAllowances(parsed.vacationAllowances),
    vacations: migrateVacations(parsed.vacations),
  };
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    return parseAppData(JSON.parse(raw) as unknown);
  } catch {
    return emptyData();
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function mutateData(updater: (data: AppData) => AppData): AppData {
  const next = updater(loadData());
  saveData(next);
  return next;
}

export function resetData(): AppData {
  const next = emptyData();
  saveData(next);
  return next;
}
