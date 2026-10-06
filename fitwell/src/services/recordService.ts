import type { AppData } from './storageService';
import type { WaterRecord } from '../types/water';
import type { WorkoutRecord } from '../types/workout';
import { recordsOnDate } from '../utils/calculationUtils';

export interface DailyRecord {
  date: string;
  workouts: WorkoutRecord[];
  water: WaterRecord | null;
}

export function getWorkoutRecordsByDate(
  data: AppData,
  date: string,
): WorkoutRecord[] {
  return recordsOnDate(data.workouts, date);
}

export function getWaterRecordByDate(
  data: AppData,
  date: string,
): WaterRecord | null {
  return data.waters.find((record) => record.date === date) ?? null;
}

export function getDailyRecord(data: AppData, date: string): DailyRecord {
  return {
    date,
    workouts: getWorkoutRecordsByDate(data, date),
    water: getWaterRecordByDate(data, date),
  };
}
