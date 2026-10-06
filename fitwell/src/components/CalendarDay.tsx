import { formatWeekday } from '../utils/dateUtils';

export function CalendarDay({
  date,
  today,
  selected,
  pilates,
  gym,
  onSelect,
}: {
  date: string;
  today: string;
  selected?: string;
  pilates: number;
  gym: number;
  onSelect?: (date: string) => void;
}) {
  const active = pilates + gym > 0;
  const className = [
    'day-cell',
    date === today ? 'today' : '',
    date === selected ? 'selected' : '',
    active ? 'active' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (!onSelect) {
    return (
      <div className={className}>
        {formatWeekday(date)}
        <div>{Number(date.slice(8))}</div>
        <div className="marks">
          {pilates > 0 ? <span className="mark pilates" /> : null}
          {gym > 0 ? <span className="mark gym" /> : null}
        </div>
      </div>
    );
  }

  return (
    <button className={className} type="button" onClick={() => onSelect(date)}>
      {formatWeekday(date)}
      <div>{Number(date.slice(8))}</div>
      <div className="marks">
        {pilates > 0 ? <span className="mark pilates" /> : null}
        {gym > 0 ? <span className="mark gym" /> : null}
      </div>
    </button>
  );
}
