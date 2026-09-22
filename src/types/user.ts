export interface User {
  id: string;
  name: string;
  waterGoal: number;
  weeklyWorkoutGoal: number;
}

export const WATER_GOAL_STEP = 250;
export const WATER_GOAL_MIN = 500;
export const WATER_GOAL_MAX = 5000;
export const WATER_GOAL_PRESETS = [1500, 2000, 2500, 3000] as const;

export const WEEKLY_GOAL_MIN = 1;
export const WEEKLY_GOAL_MAX = 14;
export const WEEKLY_GOAL_PRESETS = [3, 5, 7] as const;

export const DEFAULT_USER: User = {
  id: 'local-user',
  name: '',
  waterGoal: 2000,
  weeklyWorkoutGoal: 5,
};

export function clampWaterGoal(value: number): number {
  const rounded = Math.round(value / WATER_GOAL_STEP) * WATER_GOAL_STEP;
  return Math.min(WATER_GOAL_MAX, Math.max(WATER_GOAL_MIN, rounded));
}

export function clampWeeklyGoal(value: number): number {
  return Math.min(WEEKLY_GOAL_MAX, Math.max(WEEKLY_GOAL_MIN, Math.round(value)));
}
