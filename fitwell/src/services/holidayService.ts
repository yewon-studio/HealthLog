import {
  DEFAULT_HOLIDAYS,
  HOLIDAY_MEMO_MAX,
  HOLIDAY_NAME_MAX,
  type Holiday,
  type HolidayInput,
} from '../types/holiday';
import { isDateKey } from '../utils/dateUtils';
import { createId, nowIso } from '../utils/id';
import { mutateData, type AppData } from './storageService';

export type HolidayErrors = Partial<Record<keyof HolidayInput, string>>;

export function allHolidays(data: AppData): Holiday[] {
  return [...DEFAULT_HOLIDAYS, ...data.holidays].sort(
    (a, b) => a.date.localeCompare(b.date) || a.source.localeCompare(b.source),
  );
}

export function holidaysForYear(data: AppData, year: number): Holiday[] {
  const prefix = `${year}-`;
  return allHolidays(data).filter((holiday) => holiday.date.startsWith(prefix));
}

export function holidayMap(data: AppData): Map<string, Holiday> {
  const map = new Map<string, Holiday>();
  for (const holiday of allHolidays(data)) {
    if (!map.has(holiday.date)) map.set(holiday.date, holiday);
  }
  return map;
}

export function validateHoliday(
  data: AppData,
  input: HolidayInput,
  editingId?: string,
): HolidayErrors {
  const errors: HolidayErrors = {};
  const name = input.name.trim();

  if (!name) {
    errors.name = '휴일명을 입력해 주세요.';
  } else if (name.length > HOLIDAY_NAME_MAX) {
    errors.name = `휴일명은 ${HOLIDAY_NAME_MAX}자 이내로 입력해 주세요.`;
  }

  if (!input.date) {
    errors.date = '날짜를 선택해 주세요.';
  } else if (!isDateKey(input.date)) {
    errors.date = '올바른 날짜를 선택해 주세요.';
  } else {
    const duplicate = allHolidays(data).find(
      (holiday) => holiday.date === input.date && holiday.id !== editingId,
    );
    if (duplicate) {
      errors.date = `이미 ‘${duplicate.name}’ 휴일이 등록된 날짜입니다.`;
    }
  }

  if (input.memo.trim().length > HOLIDAY_MEMO_MAX) {
    errors.memo = `메모는 ${HOLIDAY_MEMO_MAX}자 이내로 입력해 주세요.`;
  }

  return errors;
}

function normalizeInput(input: HolidayInput) {
  const memo = input.memo.trim();
  return {
    name: input.name.trim(),
    date: input.date,
    memo: memo || undefined,
  };
}

export const holidayService = {
  add(input: HolidayInput): { data: AppData; holiday: Holiday } {
    const holiday: Holiday = {
      id: createId(),
      ...normalizeInput(input),
      source: 'custom',
      createdAt: nowIso(),
    };
    const data = mutateData((current) => ({
      ...current,
      holidays: [...current.holidays, holiday],
    }));
    return { data, holiday };
  },

  update(id: string, input: HolidayInput): AppData {
    return mutateData((current) => ({
      ...current,
      holidays: current.holidays.map((holiday) =>
        holiday.id === id ? { ...holiday, ...normalizeInput(input) } : holiday,
      ),
    }));
  },

  remove(id: string): AppData {
    return mutateData((current) => ({
      ...current,
      holidays: current.holidays.filter((holiday) => holiday.id !== id),
    }));
  },
};
