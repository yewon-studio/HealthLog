import type { TypeTotals } from '../utils/calculationUtils';

export function WorkoutSummary({ weekly }: { weekly: TypeTotals }) {
  return (
    <section className="card">
      <p className="card-label">이번 주 운동</p>
      <div className="hero-number" style={{ fontSize: 44 }}>{weekly.total}</div>
      <div className="hero-unit">이번 주 총 운동 횟수</div>
      {weekly.total === 0 ? (
        <p className="empty">이번 주 기록이 아직 없어요.</p>
      ) : (
        <div className="split" style={{ marginTop: 14 }}>
          <div className="split-item">
            <span>Pilates</span>
            <strong>{weekly.pilates}회</strong>
          </div>
          <div className="split-item gym">
            <span>Gym</span>
            <strong>{weekly.gym}회</strong>
          </div>
        </div>
      )}
    </section>
  );
}
