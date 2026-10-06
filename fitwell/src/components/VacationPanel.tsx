import type { Vacation } from '../types/vacation';
import { VACATION_TYPE_LABELS } from '../types/vacation';
import { formatDisplayDate } from '../utils/dateUtils';

export function VacationPanel({
  year,
  totalDays,
  usedDays,
  vacations,
  daysForVacation,
  onSetTotal,
  onAdd,
  onEdit,
  onDelete,
}: {
  year: number;
  totalDays: number;
  usedDays: number;
  vacations: Vacation[];
  daysForVacation: (vacation: Vacation) => number;
  onSetTotal: () => void;
  onAdd: () => void;
  onEdit: (vacation: Vacation) => void;
  onDelete: (vacation: Vacation) => void;
}) {
  const remaining = totalDays - usedDays;
  const percentage = totalDays > 0 ? Math.min(100, (usedDays / totalDays) * 100) : 0;

  return (
    <>
      <section className="card vacation-summary" aria-labelledby="vacation-summary-title">
        <div className="holiday-head">
          <div>
            <p className="card-label">휴가 현황</p>
            <h2 id="vacation-summary-title" className="holiday-title">{year}년 휴가</h2>
          </div>
          <button className="outline-btn" type="button" onClick={onSetTotal}>총 휴가 설정</button>
        </div>
        <div className="vacation-stats">
          <div><span>총 휴가</span><strong>{totalDays}일</strong></div>
          <div><span>사용</span><strong>{usedDays}일</strong></div>
          <div className="remaining"><span>남은 휴가</span><strong>{remaining}일</strong></div>
        </div>
        <div className="progress vacation-progress" aria-label={`휴가 사용률 ${Math.round(percentage)}%`}>
          <span style={{ width: `${percentage}%` }} />
        </div>
        <div className="progress-meta">
          <span>사용률 {Math.round(percentage)}%</span>
          <span>{usedDays} / {totalDays}일</span>
        </div>
      </section>

      <section className="card vacation-list-card" aria-labelledby="vacation-list-title">
        <div className="holiday-head">
          <div>
            <p className="card-label">전체 휴가</p>
            <h2 id="vacation-list-title" className="holiday-title">
              {vacations.length}건 · {usedDays}일
            </h2>
          </div>
          <button className="add-btn vacation-add" type="button" onClick={onAdd}>+ 휴가 추가</button>
        </div>
        {vacations.length === 0 ? (
          <div className="vacation-empty">
            <span aria-hidden="true">☂</span>
            <p>등록된 휴가가 없습니다.</p>
            <small>기간을 선택하면 남은 휴가가 자동 계산됩니다.</small>
          </div>
        ) : (
          <ul className="holiday-list">
            {vacations.map((vacation) => (
              <li key={vacation.id} className="holiday-item custom vacation-item">
                <div className="vacation-range">
                  {vacation.startDate === vacation.endDate
                    ? formatDisplayDate(vacation.startDate)
                    : `${formatDisplayDate(vacation.startDate)} ~ ${formatDisplayDate(vacation.endDate)}`}
                </div>
                <div className="holiday-body">
                  <div className="holiday-name">
                    {vacation.name}
                    <span className="vacation-type">{VACATION_TYPE_LABELS[vacation.type]}</span>
                    <span className="vacation-days">{daysForVacation(vacation)}일</span>
                  </div>
                  {vacation.memo ? <p className="holiday-memo">{vacation.memo}</p> : null}
                </div>
                <div className="holiday-actions">
                  <button className="text-btn" type="button" onClick={() => onEdit(vacation)}>수정</button>
                  <button className="text-btn danger" type="button" onClick={() => onDelete(vacation)}>삭제</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
