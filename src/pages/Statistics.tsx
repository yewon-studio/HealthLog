import { useState } from 'react';
import { StatisticsCard } from '../components/StatisticsCard';
import { statisticsService } from '../services/statisticsService';
import { useAppStore } from '../store/AppStore';
import { bodyPartLabel } from '../types/workout';
import { formatMonthTitleParts, yearMonthOf } from '../utils/dateUtils';

type Period = 'week' | 'month' | 'year';

export function StatisticsPage() {
  const { data, selectedDate } = useAppStore();
  const [period, setPeriod] = useState<Period>('month');
  const { year, month } = yearMonthOf(selectedDate);

  const weekly = statisticsService.weekly(data, selectedDate);
  const monthly = statisticsService.monthly(data, year, month);
  const yearly = statisticsService.yearly(data, year);
  const weeklyDays = statisticsService.weeklyDays(data, selectedDate);
  const monthlyDays = statisticsService.monthlyDays(data, year, month);
  const yearlyDays = statisticsService.yearlyDays(data, year);
  const parts =
    period === 'week'
      ? statisticsService.weeklyBodyParts(data, selectedDate)
      : period === 'month'
        ? statisticsService.monthlyBodyParts(data, year, month)
        : statisticsService.yearlyBodyParts(data, year);
  const totals = period === 'week' ? weekly : period === 'month' ? monthly : yearly;
  const days = period === 'week' ? weeklyDays : period === 'month' ? monthlyDays : yearlyDays;
  const maxPart = parts[0]?.count ?? 0;

  return (
    <section className="page-intro">
      <p className="date-kicker">Statistics</p>
      <h1 className="greeting">통계</h1>
      <div className="segment three" role="tablist" aria-label="통계 기간">
        <button
          type="button"
          className={period === 'week' ? 'active' : ''}
          onClick={() => setPeriod('week')}
        >
          주간
        </button>
        <button
          type="button"
          className={period === 'month' ? 'active' : ''}
          onClick={() => setPeriod('month')}
        >
          월간
        </button>
        <button
          type="button"
          className={period === 'year' ? 'active' : ''}
          onClick={() => setPeriod('year')}
        >
          연간
        </button>
      </div>
      <div className="stack" style={{ marginTop: 14 }}>
        <StatisticsCard
          label={
            period === 'week'
              ? '선택한 주'
              : period === 'month'
                ? formatMonthTitleParts(year, month)
                : `${year}년`
          }
          totals={totals}
          emptyText="아직 통계 데이터가 없습니다."
        />
        <section className="card">
          <p className="card-label">운동 날짜 수</p>
          <div className="hero-number compact">{days}</div>
          <div className="hero-unit">실제 운동 기록이 있는 날짜</div>
          <p className="empty">총 운동 횟수 {totals.total}회와는 별도로 계산합니다.</p>
        </section>
        <section className="card">
          <p className="card-label">운동 부위</p>
          {parts.length === 0 ? (
            <p className="empty">아직 통계 데이터가 없습니다.</p>
          ) : (
            <div className="part-stats">
              {parts.map((item) => (
                <div key={item.part} className="part-stat">
                  <div className="progress-meta">
                    <span>{bodyPartLabel(item.part)}</span>
                    <span>{item.count}회</span>
                  </div>
                  <div className="progress" aria-hidden="true">
                    <span
                      style={{
                        width: `${maxPart === 0 ? 0 : Math.round((item.count / maxPart) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
