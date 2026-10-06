import { formatDisplayDate, greeting, todayKey } from '../utils/dateUtils';

export function Header({
  date,
  onDateChange,
  onToday,
}: {
  date: string;
  onDateChange: (date: string) => void;
  onToday: () => void;
}) {
  const isToday = date === todayKey();

  return (
    <header className="page-header">
      <div>
        <p className="date-kicker">{isToday ? greeting() : '선택한 날짜의 기록'}</p>
        <h1 className="greeting">{formatDisplayDate(date)}</h1>
      </div>
      <div className="date-actions">
        <label className="date-picker">
          <span>날짜 변경</span>
          <input
            type="date"
            value={date}
            onChange={(event) => onDateChange(event.target.value)}
          />
        </label>
        {isToday ? null : (
          <button className="text-btn" type="button" onClick={onToday}>
            오늘로 이동
          </button>
        )}
      </div>
    </header>
  );
}
