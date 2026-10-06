import { forwardRef } from 'react';
import type { Holiday } from '../types/holiday';
import { formatKoreanDate } from '../utils/dateUtils';

export const HolidayList = forwardRef<
  HTMLButtonElement,
  {
    year: number;
    holidays: Holiday[];
    highlightId: string | null;
    onAdd: () => void;
    onEdit: (holiday: Holiday) => void;
    onDelete: (holiday: Holiday) => void;
  }
>(function HolidayList({ year, holidays, highlightId, onAdd, onEdit, onDelete }, addRef) {
  const customCount = holidays.filter((holiday) => holiday.source === 'custom').length;

  return (
    <section className="card holiday-card" aria-labelledby="holiday-list-title">
      <div className="holiday-head">
        <div>
          <p className="card-label">전체 휴일</p>
          <h2 id="holiday-list-title" className="holiday-title">
            {year}년 <strong>{holidays.length}일</strong>
          </h2>
          <p className="holiday-sub">
            기본 {holidays.length - customCount}일 · 내가 추가 {customCount}일
          </p>
        </div>
        <button ref={addRef} className="add-btn" type="button" onClick={onAdd}>
          + 휴일 추가
        </button>
      </div>

      {holidays.length === 0 ? (
        <p className="empty">{year}년에 등록된 휴일이 없습니다. 휴일을 추가해 보세요.</p>
      ) : (
        <ul className="holiday-list">
          {holidays.map((holiday) => (
            <li
              key={holiday.id}
              className={[
                'holiday-item',
                holiday.source,
                holiday.id === highlightId ? 'just-added' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="holiday-date">{formatKoreanDate(holiday.date)}</div>
              <div className="holiday-body">
                <div className="holiday-name">
                  {holiday.name}
                  <span className={`holiday-badge ${holiday.source}`}>
                    {holiday.source === 'custom' ? '내 휴일' : '공휴일'}
                  </span>
                </div>
                {holiday.memo ? <p className="holiday-memo">{holiday.memo}</p> : null}
              </div>
              {holiday.source === 'custom' ? (
                <div className="holiday-actions">
                  <button
                    className="text-btn"
                    type="button"
                    aria-label={`${holiday.name} 수정`}
                    onClick={() => onEdit(holiday)}
                  >
                    수정
                  </button>
                  <button
                    className="text-btn danger"
                    type="button"
                    aria-label={`${holiday.name} 삭제`}
                    onClick={() => onDelete(holiday)}
                  >
                    삭제
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
});
