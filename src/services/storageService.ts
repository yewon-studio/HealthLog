import { DEFAULT_USER, clampWaterGoal, clampWeeklyGoal, type User } from '../types/user';
import type { WaterRecord } from '../types/water';
import {
  isBodyPart,
  type WorkoutRecord,
} from '../types/workout';
import { normalizeDateKey } from '../utils/dateUtils';

export const STORAGE_KEY = 'fitwell.v1';

export interface AppData {
  version: 1;
  user: User;
  workouts: WorkoutRecord[];
  waters: WaterRecord[];
}

function emptyData(): AppData {
  return {
    version: 1,
    user: { ...DEFAULT_USER },
    workouts: [],
    waters: [],
  };
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
