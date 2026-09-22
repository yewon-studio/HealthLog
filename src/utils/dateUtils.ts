const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function todayKey(now = new Date()): string {
  return toDateKey(now);
}

export function formatDisplayDate(key: string): string {
  const date = parseDateKey(key);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export function formatWeekday(key: string): string {
  return WEEKDAY_KO[parseDateKey(key).getDay()] ?? '';
}

export function greeting(now = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export function startOfWeek(key: string): Date {
  const date = parseDateKey(key);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function weekKeys(anchorKey: string): string[] {
  const start = startOfWeek(anchorKey);
  return Array.from({ length: 7 }, (_, index) => toDateKey(addDays(start, index)));
}

export function recentKeys(anchorKey: string, length = 7): string[] {
  const end = parseDateKey(anchorKey);
  return Array.from({ length }, (_, index) =>
    toDateKey(addDays(end, index - (length - 1))),
  );
}

export function formatMonthTitle(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

export function isDateKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function normalizeDateKey(value: string): string {
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? value;
}

export function yearMonthOf(key: string): { year: number; month: number } {
  return {
    year: Number(key.slice(0, 4)),
    month: Number(key.slice(5, 7)),
  };
}

export function shiftYearMonth(
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } {
  const next = new Date(year, month - 1 + delta, 1);
  return { year: next.getFullYear(), month: next.getMonth() + 1 };
}

export function formatMonthTitleParts(year: number, month: number): string {
  return `${year}년 ${month}월`;
}

export function monthDateKeys(year: number, month: number): (string | null)[] {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const lastDay = new Date(year, month, 0).getDate();
  const cells: (string | null)[] = Array.from({ length: firstWeekday }, () => null);

  for (let day = 1; day <= lastDay; day += 1) {
    cells.push(
      `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    );
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export function prefixForMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}
