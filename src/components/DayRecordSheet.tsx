import {
  BODY_PART_LABELS,
  WorkoutType,
  type BodyPart,
  type WorkoutRecord,
} from '../types/workout';
import type { WaterRecord } from '../types/water';
import { formatDisplayDate } from '../utils/dateUtils';

export function DayRecordSheet({
  date,
  workouts,
  water,
  waterGoal,
  onClose,
  onEdit,
  onDeleteType,
  onDeleteDate,
}: {
  date: string;
  workouts: WorkoutRecord[];
  water: WaterRecord | null;
  waterGoal: number;
  onClose: () => void;
  onEdit: () => void;
  onDeleteType: (type: typeof WorkoutType.PILATES | typeof WorkoutType.GYM) => void;
  onDeleteDate: () => void;
}) {
  const active = workouts.filter((record) => record.count > 0);
  const empty = active.length === 0 && (water?.amount ?? 0) === 0;

  return (
    <div className="sheet-backdrop" onClick={onClose} role="presentation">
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="day-sheet-title"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="card-label">날짜 기록</p>
        <h2 id="day-sheet-title">{formatDisplayDate(date)}</h2>
        {empty ? (
          <>
            <p className="empty">아직 운동 기록이 없습니다.</p>
            <button className="sheet-btn primary" type="button" onClick={onEdit}>
              + 운동 기록 추가
            </button>
          </>
        ) : (
          <>
            {active.map((record) => (
              <div key={record.id} className="sheet-block">
                <div className="sheet-row">
                  <strong>
                    {record.type === WorkoutType.PILATES ? 'Pilates' : 'Gym'}
                  </strong>
                  <span>{record.count}회</span>
                </div>
                {record.bodyParts.length > 0 ? (
                  <p className="sheet-parts">
                    {record.bodyParts
                      .map((part) => BODY_PART_LABELS[part as BodyPart] ?? part)
                      .join(' · ')}
                  </p>
                ) : (
                  <p className="empty">선택한 운동 부위가 없습니다.</p>
                )}
                <button
                  className="text-btn danger"
                  type="button"
                  onClick={() => onDeleteType(record.type)}
                >
                  {record.type === WorkoutType.PILATES ? 'Pilates' : 'Gym'} 기록 삭제
                </button>
              </div>
            ))}
            <div className="sheet-block">
              <div className="sheet-row">
                <strong>물</strong>
                <span>
                  {(water?.amount ?? 0).toLocaleString('ko-KR')}ml /{' '}
                  {waterGoal.toLocaleString('ko-KR')}ml
                </span>
              </div>
            </div>
            <div className="sheet-actions">
              <button className="sheet-btn primary" type="button" onClick={onEdit}>
                수정하기
              </button>
              {active.length > 0 ? (
                <button className="sheet-btn" type="button" onClick={onDeleteDate}>
                  이날 운동 전체 삭제
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
