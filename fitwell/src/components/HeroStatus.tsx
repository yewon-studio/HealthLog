import type { TypeTotals } from '../utils/calculationUtils';

export function HeroStatus({
  daily,
  weekly,
  monthly,
  yearly,
  weeklyGoal,
  isToday,
}: {
  daily: TypeTotals;
  weekly: TypeTotals;
  monthly: TypeTotals;
  yearly: TypeTotals;
  weeklyGoal: number;
  isToday: boolean;
}) {
  const empty = daily.total === 0;
  const weekPercent =
    weeklyGoal === 0 ? 0 : Math.min(100, Math.round((weekly.total / weeklyGoal) * 100));

  return (
    <section className="card hero">
      <p className="card-label">{isToday ? '오늘의 운동 상태' : '선택한 날의 운동 상태'}</p>
      <div>
        <div className="hero-number">{daily.total}</div>
        <div className="hero-unit">{isToday ? '오늘 총 운동 횟수' : '이 날 총 운동 횟수'}</div>
      </div>
      {empty ? (
        <p className="empty">
          {isToday
            ? '아직 운동 기록이 없습니다. 오늘 첫 운동을 기록해보세요.'
            : '아직 운동 기록이 없습니다. 이 날짜에 첫 운동을 기록해보세요.'}
        </p>
      ) : (
        <div className="split">
          <div className="split-item">
            <span>Pilates</span>
            <strong>{daily.pilates}회</strong>
          </div>
          <div className="split-item gym">
            <span>Gym</span>
            <strong>{daily.gym}회</strong>
          </div>
        </div>
      )}
      <div className="glance" aria-label="기간별 운동 횟수">
        <div className="glance-item">
          <span>이번 주</span>
          <strong>{weekly.total}</strong>
        </div>
        <div className="glance-item">
          <span>이번 달</span>
          <strong>{monthly.total}</strong>
        </div>
        <div className="glance-item">
          <span>올해</span>
          <strong>{yearly.total}</strong>
        </div>
      </div>
      <div>
        <div className="progress-meta">
          <span>주간 목표 {weeklyGoal}회</span>
          <span>{weekPercent}%</span>
        </div>
        <div className="progress" aria-label={`주간 목표 ${weekPercent}%`}>
          <span style={{ width: `${weekPercent}%` }} />
        </div>
      </div>
    </section>
  );
}
