export type HolidaySource = 'default' | 'custom';

export interface Holiday {
  id: string;
  name: string;
  date: string;
  memo?: string;
  source: HolidaySource;
  createdAt: string;
}

export interface HolidayInput {
  name: string;
  date: string;
  memo: string;
}

export const HOLIDAY_NAME_MAX = 20;
export const HOLIDAY_MEMO_MAX = 60;

const DEFAULT_CREATED_AT = '2026-01-01T00:00:00.000Z';

const DEFAULT_HOLIDAY_ROWS: [date: string, name: string][] = [
  ['2026-01-01', '신정'],
  ['2026-02-16', '설날 연휴'],
  ['2026-02-17', '설날'],
  ['2026-02-18', '설날 연휴'],
  ['2026-03-01', '삼일절'],
  ['2026-03-02', '대체공휴일(삼일절)'],
  ['2026-05-05', '어린이날'],
  ['2026-05-24', '부처님오신날'],
  ['2026-05-25', '대체공휴일(부처님오신날)'],
  ['2026-06-03', '전국동시지방선거'],
  ['2026-06-06', '현충일'],
  ['2026-08-15', '광복절'],
  ['2026-08-17', '대체공휴일(광복절)'],
  ['2026-09-24', '추석 연휴'],
  ['2026-09-25', '추석'],
  ['2026-09-26', '추석 연휴'],
  ['2026-10-03', '개천절'],
  ['2026-10-05', '대체공휴일(개천절)'],
  ['2026-10-09', '한글날'],
  ['2026-12-25', '성탄절'],
];

export const DEFAULT_HOLIDAYS: Holiday[] = DEFAULT_HOLIDAY_ROWS.map(([date, name]) => ({
  id: `default-${date}`,
  name,
  date,
  source: 'default',
  createdAt: DEFAULT_CREATED_AT,
}));
