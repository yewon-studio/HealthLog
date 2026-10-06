import type { AppData } from './storageService';
import {
  bodyPartCounts,
  dailyTotal,
  hasWorkout,
  lifetimeTotal,
  monthlyTotal,
  recordsInRange,
  streakCount,
  weeklyTotal,
  workoutDayCount,
  yearlyTotal,
  type TypeTotals,
} from '../utils/calculationUtils';
import { prefixForMonth, weekKeys } from '../utils/dateUtils';

export const statisticsService = {
  daily(data: AppData, date: string): TypeTotals {
    return dailyTotal(data.workouts, date);
  },

  weekly(data: AppData, date: string): TypeTotals {
    return weeklyTotal(data.workouts, date);
  },

  monthly(data: AppData, year: number, month: number): TypeTotals {
    return monthlyTotal(data.workouts, year, month);
  },

  yearly(data: AppData, year: number): TypeTotals {
    return yearlyTotal(data.workouts, year);
  },

  lifetime(data: AppData): TypeTotals {
    return lifetimeTotal(data.workouts);
  },

  waterAmount(data: AppData, date: string): number {
    return data.waters.find((record) => record.date === date)?.amount ?? 0;
  },

  streak(data: AppData, date: string): number {
    return streakCount(data.workouts, date);
  },

  dayHasWorkout(data: AppData, date: string): boolean {
    return hasWorkout(data.workouts, date);
  },

  weeklyDays(data: AppData, date: string): number {
    return workoutDayCount(recordsInRange(data.workouts, weekKeys(date)));
  },

  monthlyDays(data: AppData, year: number, month: number): number {
    const prefix = prefixForMonth(year, month);
    return workoutDayCount(
      data.workouts.filter((record) => record.date.startsWith(prefix)),
    );
  },

  yearlyDays(data: AppData, year: number): number {
    const prefix = `${year}-`;
    return workoutDayCount(
      data.workouts.filter((record) => record.date.startsWith(prefix)),
    );
  },

  monthlyBodyParts(data: AppData, year: number, month: number) {
    const prefix = prefixForMonth(year, month);
    return bodyPartCounts(
      data.workouts.filter((record) => record.date.startsWith(prefix)),
    );
  },

  weeklyBodyParts(data: AppData, date: string) {
    return bodyPartCounts(recordsInRange(data.workouts, weekKeys(date)));
  },

  yearlyBodyParts(data: AppData, year: number) {
    return bodyPartCounts(
      data.workouts.filter((record) => record.date.startsWith(`${year}-`)),
    );
  },
};
