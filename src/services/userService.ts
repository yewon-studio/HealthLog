import {
  clampWaterGoal,
  clampWeeklyGoal,
  type User,
} from '../types/user';
import { mutateData } from './storageService';

export const userService = {
  updateGoals(partial: Partial<Pick<User, 'waterGoal' | 'weeklyWorkoutGoal'>>) {
    return mutateData((data) => ({
      ...data,
      user: {
        ...data.user,
        waterGoal:
          partial.waterGoal === undefined
            ? data.user.waterGoal
            : clampWaterGoal(partial.waterGoal),
        weeklyWorkoutGoal:
          partial.weeklyWorkoutGoal === undefined
            ? data.user.weeklyWorkoutGoal
            : clampWeeklyGoal(partial.weeklyWorkoutGoal),
      },
    }));
  },
};
