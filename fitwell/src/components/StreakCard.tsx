export function StreakCard({ days }: { days: number }) {
  return (
    <section className="card streak">
      <div>
        <p className="card-label">연속 운동</p>
        <strong>
          <span aria-hidden="true">🔥</span> {days} DAYS STREAK
        </strong>
        <p className="empty">
          {days > 0 ? `${days}일 연속 운동 중` : '오늘 운동하면 스트릭이 시작됩니다.'}
        </p>
      </div>
    </section>
  );
}
