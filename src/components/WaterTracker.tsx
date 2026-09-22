import { WaterProgress } from './WaterProgress';

const STEPS = [250, 500, 750] as const;

export function WaterTracker({
  amount,
  goal,
  onAdd,
  label = '오늘 물',
}: {
  amount: number;
  goal: number;
  onAdd: (milliliters: number) => void;
  label?: string;
}) {
  return (
    <section className="card">
      <p className="card-label">{label}</p>
      <WaterProgress amount={amount} goal={goal} />
      <div className="water-actions">
        {STEPS.map((step) => (
          <button
            key={step}
            className="water-btn primary"
            type="button"
            onClick={() => onAdd(step)}
          >
            +{step}ml
          </button>
        ))}
        <button
          className="water-btn"
          type="button"
          disabled={amount === 0}
          onClick={() => onAdd(-250)}
        >
          −250ml
        </button>
      </div>
    </section>
  );
}
