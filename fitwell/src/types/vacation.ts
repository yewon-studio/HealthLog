export type VacationType = 'annual' | 'sick' | 'special' | 'other';

export interface VacationAllowance {
  year: number;
  totalDays: number;
  memo?: string;
  updatedAt: string;
}

export interface Vacation {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  type: VacationType;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VacationInput {
  name: string;
  startDate: string;
  endDate: string;
  type: VacationType;
  memo: string;
}

export const VACATION_TYPE_LABELS: Record<VacationType, string> = {
  annual: '연차',
  sick: '병가',
  special: '특별휴가',
  other: '기타',
};
