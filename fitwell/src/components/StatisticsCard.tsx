import type { TypeTotals } from '../utils/calculationUtils';

export function StatisticsCard({
  label,
  totals,
  emptyText,
}: {
  label: string;
  totals: TypeTotals;
  emptyText: string;
}) {
  return (
    <section className="card">
      <p className="card-label">{label}</p>
      <div className="hero-number compact">{totals.total}</div>
      <div className="hero-unit">총 운동 횟수</div>
      {totals.total === 0 ? (
        <p className="empty">{emptyText}</p>
      ) : (
        <div className="split" style={{ marginTop: 14 }}>
          <div className="split-item">
            <span>Pilates</span>
            <strong>{totals.pilates}회</strong>
          </div>
          <div className="split-item gym">
            <span>Gym</span>
            <strong>{totals.gym}회</strong>
          </div>
        </div>
      )}
    </section>
  );
}
