import { createId, nowIso } from '../utils/id';
import { mutateData } from './storageService';

export const waterService = {
  add(date: string, milliliters: number) {
    return mutateData((data) => {
      const stamp = nowIso();
      const existing = data.waters.find((record) => record.date === date);
      if (!existing) {
        return {
          ...data,
          waters: [
            ...data.waters,
            {
              id: createId(),
              date,
              amount: Math.max(0, milliliters),
              createdAt: stamp,
              updatedAt: stamp,
            },
          ],
        };
      }

      return {
        ...data,
        waters: data.waters.map((record) =>
          record.date === date
            ? {
                ...record,
                amount: Math.max(0, record.amount + milliliters),
                updatedAt: stamp,
              }
            : record,
        ),
      };
    });
  },
};
