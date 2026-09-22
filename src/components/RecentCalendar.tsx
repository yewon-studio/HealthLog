import { CalendarDay } from './CalendarDay';
import { countForType } from '../utils/calculationUtils';
import type { WorkoutRecord } from '../types/workout';
import { WorkoutType } from '../types/workout';

export function RecentCalendar({
  days,
  today,
  selected,
  workouts,
  onSelect,
}: {
  days: string[];
  today: string;
  selected: string;
  workouts: WorkoutRecord[];
  onSelect: (date: string) => void;
}) {
  return (
    <section className="card span-2">
      <p className="card-label">최근 운동 기록</p>
      <div className="week-grid">
        {days.map((day) => (
          <CalendarDay
            key={day}
            date={day}
            today={today}
            selected={selected}
            pilates={countForType(workouts, day, WorkoutType.PILATES)}
            gym={countForType(workouts, day, WorkoutType.GYM)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
