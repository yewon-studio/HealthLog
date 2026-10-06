import { countForType } from '../utils/calculationUtils';
import type { Holiday } from '../types/holiday';
import type { Vacation } from '../types/vacation';
import type { WorkoutRecord } from '../types/workout';
import { WorkoutType } from '../types/workout';
import { monthDateKeys } from '../utils/dateUtils';

export function MonthCalendar({
  year,
  month,
  today,
  selected,
  workouts,
  holidays,
  vacations,
  onSelect,
}: {
  year: number;
  month: number;
  today: string;
  selected: string;
  workouts: WorkoutRecord[];
  holidays: Map<string, Holiday>;
  vacations: Map<string, Vacation[]>;
  onSelect: (date: string) => void;
}) {
  const cells = monthDateKeys(year, month);
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;

  return (
    <div className="month-grid" role="grid" aria-label="월간 캘린더">
      {['일', '월', '화', '수', '목', '금', '토'].map((label) => (
        <div key={label} className="month-weekday">
          {label}
        </div>
      ))}
      {cells.map((date) => {
        const outside = !date.startsWith(monthPrefix);
        const holiday = holidays.get(date);
        const dateVacations = vacations.get(date) ?? [];
        const vacation = dateVacations[0];
        const labelName = holiday?.name ?? vacation?.name ?? '';
        return (
          <button
            key={date}
            className={[
              'month-cell',
              outside ? 'outside' : '',
              holiday ? `holiday ${holiday.source}` : '',
              vacation ? 'vacation' : '',
              date === today ? 'today' : '',
              date === selected ? 'selected' : '',
              countForType(workouts, date, WorkoutType.PILATES) +
                countForType(workouts, date, WorkoutType.GYM) >
              0
                ? 'active'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
            type="button"
            title={[holiday?.name, vacation?.name].filter(Boolean).join(' · ')}
            aria-label={`${outside ? `${Number(date.slice(5, 7))}월 ` : ''}${Number(date.slice(8))}일${holiday ? `, ${holiday.name}` : ''}${vacation ? `, ${vacation.name} 휴가` : ''}`}
            onClick={() => onSelect(date)}
          >
            <span className="cell-day">{Number(date.slice(8))}</span>
            <span
              className={[
                'cell-label',
                holiday ? 'holiday-label' : '',
                !holiday && vacation ? 'vacation-label' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {labelName}
            </span>
            <span className="marks">
              {countForType(workouts, date, WorkoutType.PILATES) > 0 ? (
                <span className="mark pilates" />
              ) : null}
              {countForType(workouts, date, WorkoutType.GYM) > 0 ? (
                <span className="mark gym" />
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
