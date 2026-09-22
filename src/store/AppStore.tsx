import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { waterService } from '../services/waterService';
import { loadData, saveData, type AppData } from '../services/storageService';
import { userService } from '../services/userService';
import { workoutService } from '../services/workoutService';
import type { BodyPart, WorkoutType } from '../types/workout';
import { isDateKey, todayKey } from '../utils/dateUtils';

interface AppStoreValue {
  data: AppData;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  goToToday: () => void;
  incrementWorkout: (date: string, type: WorkoutType) => void;
  decrementWorkout: (date: string, type: WorkoutType) => void;
  toggleBodyPart: (date: string, type: WorkoutType, part: BodyPart) => void;
  deleteWorkoutType: (date: string, type: WorkoutType) => void;
  deleteWorkoutsOnDate: (date: string) => void;
  addWater: (date: string, milliliters: number) => void;
  updateWaterGoal: (milliliters: number) => void;
  updateWeeklyWorkoutGoal: (count: number) => void;
  replaceData: (next: AppData) => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData());
  const [selectedDate, setSelectedDateState] = useState(todayKey);

  const value = useMemo<AppStoreValue>(
    () => ({
      data,
      selectedDate,
      setSelectedDate: (date) => {
        if (isDateKey(date)) setSelectedDateState(date);
      },
      goToToday: () => setSelectedDateState(todayKey()),
      incrementWorkout: (date, type) => setData(workoutService.increment(date, type)),
      decrementWorkout: (date, type) => setData(workoutService.decrement(date, type)),
      toggleBodyPart: (date, type, part) =>
        setData(workoutService.toggleBodyPart(date, type, part)),
      deleteWorkoutType: (date, type) => setData(workoutService.deleteType(date, type)),
      deleteWorkoutsOnDate: (date) => setData(workoutService.deleteDate(date)),
      addWater: (date, milliliters) => setData(waterService.add(date, milliliters)),
      updateWaterGoal: (milliliters) =>
        setData(userService.updateGoals({ waterGoal: milliliters })),
      updateWeeklyWorkoutGoal: (count) =>
        setData(userService.updateGoals({ weeklyWorkoutGoal: count })),
      replaceData: (next) => {
        saveData(next);
        setData(next);
      },
    }),
    [data, selectedDate],
  );

  return (
    <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
  );
}

export function useAppStore(): AppStoreValue {
  const store = useContext(AppStoreContext);
  if (!store) {
    throw new Error('useAppStore must be used within AppStoreProvider');
  }
  return store;
}
