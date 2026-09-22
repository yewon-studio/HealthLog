import { WorkoutType } from '../types/workout';

export function WorkoutCounter({
  pilates,
  gym,
  onIncrement,
  onDecrement,
}: {
  pilates: number;
  gym: number;
  onIncrement: (type: WorkoutType) => void;
  onDecrement: (type: WorkoutType) => void;
}) {
  return (
    <section className="card span-2">
      <p className="card-label">운동 횟수</p>
      <div className="workout-row">
        <div>
          <span className="brand-dot pilates" />
          Pilates
        </div>
        <div className="counter">
          <button
            className="stepper minus"
            type="button"
            aria-label="필라테스 1회 감소"
            disabled={pilates === 0}
            onClick={() => onDecrement(WorkoutType.PILATES)}
          >
            −
          </button>
          <div className="count">
            {pilates}
            <span>회</span>
          </div>
          <button
            className="stepper"
            type="button"
            aria-label="필라테스 1회 증가"
            onClick={() => onIncrement(WorkoutType.PILATES)}
          >
            +
          </button>
        </div>
      </div>
      <div className="workout-row">
        <div>
          <span className="brand-dot gym" />
          Gym
        </div>
        <div className="counter">
          <button
            className="stepper minus"
            type="button"
            aria-label="헬스 1회 감소"
            disabled={gym === 0}
            onClick={() => onDecrement(WorkoutType.GYM)}
          >
            −
          </button>
          <div className="count">
            {gym}
            <span>회</span>
          </div>
          <button
            className="stepper"
            type="button"
            aria-label="헬스 1회 증가"
            onClick={() => onIncrement(WorkoutType.GYM)}
          >
            +
          </button>
        </div>
      </div>
    </section>
  );
}
