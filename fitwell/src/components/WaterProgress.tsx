export function WaterProgress({
  amount,
  goal,
}: {
  amount: number;
  goal: number;
}) {
  const percent = goal === 0 ? 0 : Math.min(100, Math.round((amount / goal) * 100));
  const met = amount >= goal && goal > 0;

  return (
    <div>
      <div className="water-amount">
        {amount.toLocaleString('ko-KR')}ml <span>/ {goal.toLocaleString('ko-KR')}ml</span>
      </div>
      <div className="progress" aria-label={`수분 섭취 ${percent}%`}>
        <span style={{ width: `${percent}%` }} />
      </div>
      {met ? (
        <p className="goal-met">오늘의 수분 목표 달성!</p>
      ) : (
        <p className="empty">{percent}% 채웠어요</p>
      )}
    </div>
  );
}
