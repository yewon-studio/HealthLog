import { useEffect, useState, type FormEvent } from 'react';
import type { HolidayErrors } from '../services/holidayService';
import {
  HOLIDAY_MEMO_MAX,
  HOLIDAY_NAME_MAX,
  type Holiday,
  type HolidayInput,
} from '../types/holiday';

export function HolidayFormSheet({
  holiday,
  initialDate,
  validate,
  onSubmit,
  onClose,
}: {
  holiday: Holiday | null;
  initialDate: string;
  validate: (input: HolidayInput) => HolidayErrors;
  onSubmit: (input: HolidayInput) => void;
  onClose: () => void;
}) {
  const [input, setInput] = useState<HolidayInput>({
    name: holiday?.name ?? '',
    date: holiday?.date ?? initialDate,
    memo: holiday?.memo ?? '',
  });
  const [errors, setErrors] = useState<HolidayErrors>({});
  const editing = holiday !== null;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  function update(field: keyof HolidayInput, value: string) {
    setInput((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(input);
    setErrors(nextErrors);
    const firstInvalid = (['name', 'date', 'memo'] as const).find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(`holiday-${firstInvalid}`)?.focus();
      return;
    }
    onSubmit(input);
  }

  return (
    <div className="sheet-backdrop" onClick={onClose} role="presentation">
      <form
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="holiday-sheet-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={submit}
        noValidate
      >
        <p className="card-label">{editing ? '휴일 수정' : '휴일 추가'}</p>
        <h2 id="holiday-sheet-title">{editing ? holiday.name : '새 휴일'}</h2>

        <div className="field">
          <label htmlFor="holiday-name">
            휴일명 <span className="required">필수</span>
          </label>
          <input
            id="holiday-name"
            type="text"
            value={input.name}
            maxLength={HOLIDAY_NAME_MAX + 10}
            placeholder="예: 회사 창립기념일"
            autoFocus
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'holiday-name-error' : undefined}
            onChange={(event) => update('name', event.target.value)}
          />
          {errors.name ? (
            <p id="holiday-name-error" className="field-error" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="holiday-date">
            날짜 <span className="required">필수</span>
          </label>
          <input
            id="holiday-date"
            type="date"
            value={input.date}
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? 'holiday-date-error' : undefined}
            onChange={(event) => update('date', event.target.value)}
          />
          {errors.date ? (
            <p id="holiday-date-error" className="field-error" role="alert">
              {errors.date}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="holiday-memo">메모</label>
          <textarea
            id="holiday-memo"
            rows={2}
            value={input.memo}
            placeholder="선택 입력"
            aria-invalid={!!errors.memo}
            aria-describedby={errors.memo ? 'holiday-memo-error' : 'holiday-memo-count'}
            onChange={(event) => update('memo', event.target.value)}
          />
          {errors.memo ? (
            <p id="holiday-memo-error" className="field-error" role="alert">
              {errors.memo}
            </p>
          ) : (
            <p id="holiday-memo-count" className="field-hint">
              {input.memo.trim().length}/{HOLIDAY_MEMO_MAX}
            </p>
          )}
        </div>

        <div className="sheet-actions">
          <button className="sheet-btn primary" type="submit">
            {editing ? '수정 저장' : '휴일 저장'}
          </button>
          <button className="sheet-btn" type="button" onClick={onClose}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
