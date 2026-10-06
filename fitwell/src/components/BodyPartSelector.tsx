import {
  GYM_BODY_PART_GROUPS,
  PILATES_BODY_PART_GROUPS,
  WorkoutType,
  type BodyPart,
} from '../types/workout';

export function BodyPartSelector({
  activeType,
  selected,
  onTypeChange,
  onToggle,
}: {
  activeType: WorkoutType;
  selected: BodyPart[];
  onTypeChange: (type: WorkoutType) => void;
  onToggle: (part: BodyPart) => void;
}) {
  const groups =
    activeType === WorkoutType.PILATES
      ? PILATES_BODY_PART_GROUPS
      : GYM_BODY_PART_GROUPS;

  return (
    <section className="card">
      <p className="card-label">운동 부위</p>
      <div className="segment" role="tablist" aria-label="운동 종류">
        <button
          type="button"
          className={activeType === WorkoutType.PILATES ? 'active' : ''}
          onClick={() => onTypeChange(WorkoutType.PILATES)}
        >
          Pilates
        </button>
        <button
          type="button"
          className={activeType === WorkoutType.GYM ? 'active' : ''}
          onClick={() => onTypeChange(WorkoutType.GYM)}
        >
          Gym
        </button>
      </div>
      <div className="part-groups">
        {groups.map((group) => (
          <details key={group.id} className="part-group" open>
            <summary>{group.label}</summary>
            <div className="chips">
              {group.parts.map((part) => (
                <button
                  key={part.id}
                  type="button"
                  className={`chip${selected.includes(part.id) ? ' active' : ''}`}
                  onClick={() => onToggle(part.id)}
                >
                  {part.label}
                </button>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
