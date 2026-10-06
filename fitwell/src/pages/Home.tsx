import { useMemo, useState } from 'react';
import { BodyPartSelector } from '../components/BodyPartSelector';
import { Header } from '../components/Header';
import { HeroStatus } from '../components/HeroStatus';
import { RecentCalendar } from '../components/RecentCalendar';
import { StatisticsCard } from '../components/StatisticsCard';
import { StreakCard } from '../components/StreakCard';
import { WaterTracker } from '../components/WaterTracker';
import { WorkoutCounter } from '../components/WorkoutCounter';
import { getDailyRecord } from '../services/recordService';
import { statisticsService } from '../services/statisticsService';
import { useAppStore } from '../store/AppStore';
import { WorkoutType, type WorkoutType as WorkoutTypeValue } from '../types/workout';
import { countForType } from '../utils/calculationUtils';
import { todayKey, weekKeys, yearMonthOf } from '../utils/dateUtils';

export function HomePage() {
  const {
    data,
    selectedDate,
    setSelectedDate,
    goToToday,
    incrementWorkout,
    decrementWorkout,
    toggleBodyPart,
    addWater,
  } = useAppStore();
  const today = todayKey();
  const { year, month } = yearMonthOf(selectedDate);
  const [activeType, setActiveType] = useState<WorkoutTypeValue>(WorkoutType.PILATES);
  const dailyRecord = getDailyRecord(data, selectedDate);

  const daily = statisticsService.daily(data, selectedDate);
  const weekly = statisticsService.weekly(data, selectedDate);
  const monthly = statisticsService.monthly(data, year, month);
  const yearly = statisticsService.yearly(data, year);
  const water = dailyRecord.water?.amount ?? 0;
  const streak = statisticsService.streak(data, today);
  const days = useMemo(() => weekKeys(selectedDate), [selectedDate]);
  const selectedParts =
    dailyRecord.workouts.find((record) => record.type === activeType)?.bodyParts ??
    [];

  return (
    <>
      <Header date={selectedDate} onDateChange={setSelectedDate} onToday={goToToday} />
      <div className="home-grid">
        <HeroStatus
          daily={daily}
          weekly={weekly}
          monthly={monthly}
          yearly={yearly}
          weeklyGoal={data.user.weeklyWorkoutGoal}
          isToday={selectedDate === today}
        />
        <WorkoutCounter
          pilates={countForType(data.workouts, selectedDate, WorkoutType.PILATES)}
          gym={countForType(data.workouts, selectedDate, WorkoutType.GYM)}
          onIncrement={(type) => incrementWorkout(selectedDate, type)}
          onDecrement={(type) => decrementWorkout(selectedDate, type)}
        />
        <BodyPartSelector
          activeType={activeType}
          selected={selectedParts}
          onTypeChange={setActiveType}
          onToggle={(part) => toggleBodyPart(selectedDate, activeType, part)}
        />
        <WaterTracker
          amount={water}
          goal={data.user.waterGoal}
          label={selectedDate === today ? '오늘 물' : '이 날의 물'}
          onAdd={(amount) => addWater(selectedDate, amount)}
        />
        <StatisticsCard
          label="선택한 주의 운동"
          totals={weekly}
          emptyText="이번 주 기록이 아직 없어요."
        />
        <RecentCalendar
          days={days}
          today={today}
          selected={selectedDate}
          workouts={data.workouts}
          onSelect={setSelectedDate}
        />
        <StreakCard days={streak} />
      </div>
    </>
  );
}
