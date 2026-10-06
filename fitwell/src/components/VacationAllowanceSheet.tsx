import { useState, type FormEvent } from 'react';

export function VacationAllowanceSheet({
  year,
  currentTotal,
  usedDays,
  initialMemo,
  onSave,
  onClose,
}: {
  year: number;
  currentTotal: number;
  usedDays: number;
  initialMemo: string;
  onSave: (totalDays: number, memo: string) => void;
  onClose: () => void;
}) {
  const [total, setTotal] = useState(String(currentTotal || ''));
  const [memo, setMemo] = useState(initialMemo);
  const [error, setError] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = Number(total);
    if (!Number.isInteger(value) || value < 0) {
      setError('총 휴가는 0 이상의 정수로 입력해 주세요.');
      return;
    }
    if (value < usedDays) {
      setError(`이미 사용한 ${usedDays}일보다 적게 설정할 수 없습니다.`);
      return;
    }
    onSave(value, memo);
  }

  return (
    <div className="sheet-backdrop" onClick={onClose} role="presentation">
      <form
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="allowance-title"
        onSubmit={submit}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="card-label">총 휴가 설정</p>
        <h2 id="allowance-title">{year}년 휴가</h2>
        <div className="field">
          <label htmlFor="vacation-total">총 휴가 일수 <span className="required">필수</span></label>
          <div className="number-field">
            <input
              id="vacation-total"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={total}
              autoFocus
              aria-invalid={!!error}
              onChange={(event) => {
                setTotal(event.target.value);
                setError('');
              }}
            />
            <span>일</span>
          </div>
          {error ? <p className="field-error" role="alert">{error}</p> : null}
        </div>
        <div className="field">
          <label htmlFor="allowance-memo">메모</label>
          <textarea
            id="allowance-memo"
            rows={2}
            value={memo}
            placeholder="예: 2026년 연차"
            onChange={(event) => setMemo(event.target.value)}
          />
        </div>
        <div className="sheet-actions">
          <button className="sheet-btn primary" type="submit">저장</button>
          <button className="sheet-btn" type="button" onClick={onClose}>취소</button>
        </div>
      </form>
    </div>
  );
}
