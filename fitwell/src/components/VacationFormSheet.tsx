import { useMemo, useState, type FormEvent } from 'react';
import {
  vacationDays,
  type VacationErrors,
} from '../services/vacationService';
import type { AppData } from '../services/storageService';
import {
  VACATION_TYPE_LABELS,
  type Vacation,
  type VacationInput,
  type VacationType,
} from '../types/vacation';
import { nowIso } from '../utils/id';

export function VacationFormSheet({
  data,
  vacation,
  initialDate,
  remainingDays,
  validate,
  onSubmit,
  onClose,
}: {
  data: AppData;
  vacation: Vacation | null;
  initialDate: string;
  remainingDays: number;
  validate: (input: VacationInput) => VacationErrors;
  onSubmit: (input: VacationInput) => void;
  onClose: () => void;
}) {
  const [input, setInput] = useState<VacationInput>({
    name: vacation?.name ?? '',
    startDate: vacation?.startDate ?? initialDate,
    endDate: vacation?.endDate ?? initialDate,
    type: vacation?.type ?? 'annual',
    memo: vacation?.memo ?? '',
  });
  const [errors, setErrors] = useState<VacationErrors>({});
  const previewDays = useMemo(
    () =>
      vacationDays(data, {
        id: vacation?.id ?? 'preview',
        ...input,
        memo: input.memo || undefined,
        createdAt: vacation?.createdAt ?? nowIso(),
        updatedAt: nowIso(),
      }),
    [data, input, vacation],
  );
  const previousDays = vacation ? vacationDays(data, vacation) : 0;
  const available = remainingDays + previousDays;

  function update<K extends keyof VacationInput>(field: K, value: VacationInput[K]) {
    setInput((current) => {
      const next = { ...current, [field]: value };
      if (field === 'startDate' && (!current.endDate || current.endDate < String(value))) {
        next.endDate = String(value);
      }
      return next;
    });
    setErrors({});
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSubmit(input);
  }

  return (
    <div className="sheet-backdrop" onClick={onClose} role="presentation">
      <form
        className="sheet vacation-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vacation-form-title"
        onSubmit={submit}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="card-label">{vacation ? '휴가 수정' : '휴가 추가'}</p>
        <h2 id="vacation-form-title">{vacation ? vacation.name : '새 휴가'}</h2>
        <div className="field">
          <label htmlFor="vacation-name">휴가명 <span className="required">필수</span></label>
          <input
            id="vacation-name"
            value={input.name}
            placeholder="예: 여름 휴가"
            autoFocus
            aria-invalid={!!errors.name}
            onChange={(event) => update('name', event.target.value)}
          />
          {errors.name ? <p className="field-error">{errors.name}</p> : null}
        </div>
        <div className="date-range-fields">
          <div className="field">
            <label htmlFor="vacation-start">시작일 <span className="required">필수</span></label>
            <input
              id="vacation-start"
              type="date"
              value={input.startDate}
              aria-invalid={!!errors.startDate}
              onChange={(event) => update('startDate', event.target.value)}
            />
            {errors.startDate ? <p className="field-error">{errors.startDate}</p> : null}
          </div>
          <div className="field">
            <label htmlFor="vacation-end">종료일 <span className="required">필수</span></label>
            <input
              id="vacation-end"
              type="date"
              min={input.startDate}
              value={input.endDate}
              aria-invalid={!!errors.endDate}
              onChange={(event) => update('endDate', event.target.value)}
            />
            {errors.endDate ? <p className="field-error">{errors.endDate}</p> : null}
          </div>
        </div>
        <div className="field">
          <span className="field-label">휴가 유형</span>
          <div className="chips">
            {(Object.keys(VACATION_TYPE_LABELS) as VacationType[]).map((type) => (
              <button
                key={type}
                type="button"
                className={`chip${input.type === type ? ' active' : ''}`}
                onClick={() => update('type', type)}
              >
                {VACATION_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>
        <div className="vacation-preview" aria-live="polite">
          <div><span>차감 예정</span><strong>{previewDays}일</strong></div>
          <div><span>현재 남은 휴가</span><strong>{available}일</strong></div>
          <div><span>등록 후</span><strong>{available - previewDays}일</strong></div>
        </div>
        {errors.balance ? <p className="field-error balance-error">{errors.balance}</p> : null}
        <p className="field-hint vacation-hint">
          시작일부터 종료일까지 휴일과 공휴일을 포함해 모두 계산합니다.
        </p>
        <div className="field">
          <label htmlFor="vacation-memo">메모</label>
          <textarea
            id="vacation-memo"
            rows={2}
            value={input.memo}
            placeholder="선택 입력"
            onChange={(event) => update('memo', event.target.value)}
          />
        </div>
        <div className="sheet-actions">
          <button className="sheet-btn primary" type="submit">
            {vacation ? '수정 저장' : '휴가 저장'}
          </button>
          <button className="sheet-btn" type="button" onClick={onClose}>취소</button>
        </div>
      </form>
    </div>
  );
}
