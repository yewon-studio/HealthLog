import { mutateData, type AppData } from './storageService';
import type {
  Vacation,
  VacationAllowance,
  VacationInput,
} from '../types/vacation';
import { addDays, isDateKey, parseDateKey, toDateKey } from '../utils/dateUtils';
import { createId, nowIso } from '../utils/id';

export type VacationErrors = Partial<Record<keyof VacationInput | 'balance', string>>;

function datesBetween(startDate: string, endDate: string): string[] {
  if (!isDateKey(startDate) || !isDateKey(endDate) || endDate < startDate) return [];
  const result: string[] = [];
  let current = parseDateKey(startDate);
  const end = parseDateKey(endDate);
  while (current <= end) {
    result.push(toDateKey(current));
    current = addDays(current, 1);
  }
  return result;
}

export function vacationDates(_data: AppData, vacation: Vacation): string[] {
  return datesBetween(vacation.startDate, vacation.endDate);
}

export function vacationDays(data: AppData, vacation: Vacation): number {
  return vacationDates(data, vacation).length;
}

export function allowanceForYear(data: AppData, year: number): VacationAllowance | undefined {
  return data.vacationAllowances.find((allowance) => allowance.year === year);
}

export function vacationsForYear(data: AppData, year: number): Vacation[] {
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;
  return data.vacations
    .filter((vacation) => vacation.endDate >= start && vacation.startDate <= end)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function usedVacationDays(data: AppData, year: number): number {
  return data.vacations.reduce(
    (total, vacation) =>
      total + vacationDates(data, vacation).filter((date) => date.startsWith(`${year}-`)).length,
    0,
  );
}

export function remainingVacationDays(data: AppData, year: number): number {
  return (allowanceForYear(data, year)?.totalDays ?? 0) - usedVacationDays(data, year);
}

export function vacationsByDate(data: AppData): Map<string, Vacation[]> {
  const result = new Map<string, Vacation[]>();
  for (const vacation of data.vacations) {
    for (const date of datesBetween(vacation.startDate, vacation.endDate)) {
      result.set(date, [...(result.get(date) ?? []), vacation]);
    }
  }
  return result;
}

function draftVacation(input: VacationInput, id = 'draft'): Vacation {
  const timestamp = nowIso();
  return {
    id,
    name: input.name.trim(),
    startDate: input.startDate,
    endDate: input.endDate,
    type: input.type,
    memo: input.memo.trim() || undefined,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function validateVacation(
  data: AppData,
  input: VacationInput,
  editingId?: string,
): VacationErrors {
  const errors: VacationErrors = {};
  if (!input.name.trim()) errors.name = '휴가명을 입력해 주세요.';
  if (!isDateKey(input.startDate)) errors.startDate = '시작일을 선택해 주세요.';
  if (!isDateKey(input.endDate)) errors.endDate = '종료일을 선택해 주세요.';
  if (input.startDate && input.endDate && input.endDate < input.startDate) {
    errors.endDate = '종료일은 시작일보다 빠를 수 없습니다.';
  }
  if (Object.keys(errors).length > 0) return errors;

  const overlapping = data.vacations.find(
    (vacation) =>
      vacation.id !== editingId &&
      vacation.startDate <= input.endDate &&
      vacation.endDate >= input.startDate,
  );
  if (overlapping) {
    errors.startDate = `‘${overlapping.name}’ 휴가 기간과 겹칩니다.`;
    return errors;
  }

  const draft = draftVacation(input, editingId);
  const days = vacationDays(data, draft);
  if (days === 0) {
    errors.endDate = '차감할 휴가 기간을 선택해 주세요.';
    return errors;
  }

  const year = Number(input.startDate.slice(0, 4));
  if (input.endDate.slice(0, 4) !== String(year)) {
    errors.endDate = '휴가는 같은 연도 안에서 등록해 주세요.';
    return errors;
  }
  const previousDays = editingId
    ? vacationDays(data, data.vacations.find((vacation) => vacation.id === editingId) ?? draft)
    : 0;
  const available = remainingVacationDays(data, year) + previousDays;
  if (days > available) {
    errors.balance = `남은 휴가가 ${days - available}일 부족합니다.`;
  }
  return errors;
}

export const vacationService = {
  setAllowance(year: number, totalDays: number, memo: string): AppData {
    return mutateData((data) => {
      const allowance: VacationAllowance = {
        year,
        totalDays: Math.max(0, Math.floor(totalDays)),
        memo: memo.trim() || undefined,
        updatedAt: nowIso(),
      };
      return {
        ...data,
        vacationAllowances: [
          ...data.vacationAllowances.filter((item) => item.year !== year),
          allowance,
        ],
      };
    });
  },

  add(input: VacationInput): { data: AppData; vacation: Vacation } {
    const vacation = draftVacation(input, createId());
    const data = mutateData((current) => ({
      ...current,
      vacations: [...current.vacations, vacation],
    }));
    return { data, vacation };
  },

  update(id: string, input: VacationInput): AppData {
    return mutateData((data) => ({
      ...data,
      vacations: data.vacations.map((vacation) =>
        vacation.id === id
          ? {
              ...vacation,
              ...draftVacation(input, id),
              createdAt: vacation.createdAt,
              updatedAt: nowIso(),
            }
          : vacation,
      ),
    }));
  },

  remove(id: string): AppData {
    return mutateData((data) => ({
      ...data,
      vacations: data.vacations.filter((vacation) => vacation.id !== id),
    }));
  },
};
