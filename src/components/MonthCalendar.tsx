import { countForType } from '../utils/calculationUtils';
import type { WorkoutRecord } from '../types/workout';
import { WorkoutType } from '../types/workout';
import { monthDateKeys } from '../utils/dateUtils';

export function MonthCalendar({
  year,
  month,
  today,
  selected,
  workouts,
  onSelect,
}: {
  year: number;
  month: number;
  today: string;
  selected: string;
  workouts: WorkoutRecord[];
  onSelect: (date: string) => void;
}) {
  const cells = monthDateKeys(year, month);

  return (
    <div className="month-grid" role="grid" aria-label="월간 캘린더">
      {['일', '월', '화', '수', '목', '금', '토'].map((label) => (
        <div key={label} className="month-weekday">
          {label}
        </div>
      ))}
      {cells.map((date, index) =>
        date ? (
          <button
            key={date}
            className={[
              'month-cell',
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
            onClick={() => onSelect(date)}
          >
            <span>{Number(date.slice(8))}</span>
            <span className="marks">
              {countForType(workouts, date, WorkoutType.PILATES) > 0 ? (
                <span className="mark pilates" />
              ) : null}
              {countForType(workouts, date, WorkoutType.GYM) > 0 ? (
                <span className="mark gym" />
              ) : null}
            </span>
          </button>
        ) : (
          <div key={`empty-${index}`} className="month-cell empty" />
        ),
      )}
    </div>
  );
}
