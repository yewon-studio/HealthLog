import type { BodyPart, WorkoutRecord, WorkoutType } from '../types/workout';
import { createId, nowIso } from '../utils/id';
import { mutateData } from './storageService';

function upsertRecord(
  records: WorkoutRecord[],
  date: string,
  type: WorkoutType,
  updater: (record: WorkoutRecord) => WorkoutRecord,
): WorkoutRecord[] {
  const index = records.findIndex(
    (record) => record.date === date && record.type === type,
  );
  const stamp = nowIso();

  if (index === -1) {
    const created: WorkoutRecord = updater({
      id: createId(),
      date,
      type,
      count: 0,
      bodyParts: [],
      createdAt: stamp,
      updatedAt: stamp,
    });
    return [...records, created];
  }

  const next = [...records];
  next[index] = updater({ ...next[index], updatedAt: stamp });
  return next;
}

function pruneEmpty(records: WorkoutRecord[]): WorkoutRecord[] {
  return records.filter(
    (record) => record.count > 0 || record.bodyParts.length > 0,
  );
}

export const workoutService = {
  increment(date: string, type: WorkoutType) {
    return mutateData((data) => ({
      ...data,
      workouts: pruneEmpty(
        upsertRecord(data.workouts, date, type, (record) => ({
          ...record,
          count: record.count + 1,
        })),
      ),
    }));
  },

  decrement(date: string, type: WorkoutType) {
    return mutateData((data) => ({
      ...data,
      workouts: pruneEmpty(
        upsertRecord(data.workouts, date, type, (record) => ({
          ...record,
          count: Math.max(0, record.count - 1),
        })),
      ),
    }));
  },

  toggleBodyPart(date: string, type: WorkoutType, part: BodyPart) {
    return mutateData((data) => ({
      ...data,
      workouts: pruneEmpty(
        upsertRecord(data.workouts, date, type, (record) => {
          const selected = record.bodyParts.includes(part)
            ? record.bodyParts.filter((item) => item !== part)
            : [...record.bodyParts, part];
          return { ...record, bodyParts: selected };
        }),
      ),
    }));
  },

  deleteType(date: string, type: WorkoutType) {
    return mutateData((data) => ({
      ...data,
      workouts: data.workouts.filter(
        (record) => !(record.date === date && record.type === type),
      ),
    }));
  },

  deleteDate(date: string) {
    return mutateData((data) => ({
      ...data,
      workouts: data.workouts.filter((record) => record.date !== date),
    }));
  },
};
