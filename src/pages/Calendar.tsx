import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DayRecordSheet } from '../components/DayRecordSheet';
import { MonthCalendar } from '../components/MonthCalendar';
import { getDailyRecord } from '../services/recordService';
import { statisticsService } from '../services/statisticsService';
import { useAppStore } from '../store/AppStore';
import {
  formatMonthTitleParts,
  shiftYearMonth,
  todayKey,
  yearMonthOf,
} from '../utils/dateUtils';

export function CalendarPage() {
  const {
    data,
    selectedDate,
    setSelectedDate,
    deleteWorkoutType,
    deleteWorkoutsOnDate,
  } = useAppStore();
  const navigate = useNavigate();
  const today = todayKey();
  const selectedMonth = yearMonthOf(selectedDate);
  const [view, setView] = useState(selectedMonth);
  const [open, setOpen] = useState(false);
  const daily = getDailyRecord(data, selectedDate);
  const monthly = statisticsService.monthly(data, view.year, view.month);
  const monthlyDays = statisticsService.monthlyDays(data, view.year, view.month);

  useEffect(() => {
    setView(yearMonthOf(selectedDate));
  }, [selectedDate]);

  function selectDate(date: string) {
    setSelectedDate(date);
    setOpen(true);
  }

  return (
    <section className="page-intro">
      <p className="date-kicker">Calendar</p>
      <div className="month-head">
        <h1 className="greeting">{formatMonthTitleParts(view.year, view.month)}</h1>
        <div className="month-nav">
          <button
            className="icon-btn"
            type="button"
            aria-label="이전 달"
            onClick={() => setView((current) => shiftYearMonth(current.year, current.month, -1))}
          >
            ‹
          </button>
          <button
            className="icon-btn"
            type="button"
            aria-label="다음 달"
            onClick={() => setView((current) => shiftYearMonth(current.year, current.month, 1))}
          >
            ›
          </button>
        </div>
      </div>
      <div className="card">
        <p className="card-label">월간 기록</p>
        <MonthCalendar
          year={view.year}
          month={view.month}
          today={today}
          selected={selectedDate}
          workouts={data.workouts}
          onSelect={selectDate}
        />
        {monthly.total === 0 ? (
          <p className="empty">이번 달 운동 기록이 없습니다.</p>
        ) : (
          <p className="empty">
            운동 {monthlyDays}일 · 총 {monthly.total}회 · Pilates {monthly.pilates}회 · Gym{' '}
            {monthly.gym}회
          </p>
        )}
      </div>
      {open ? (
        <DayRecordSheet
          date={selectedDate}
          workouts={daily.workouts}
          water={daily.water}
          waterGoal={data.user.waterGoal}
          onClose={() => setOpen(false)}
          onEdit={() => {
            setOpen(false);
            navigate('/');
          }}
          onDeleteType={(type) => deleteWorkoutType(selectedDate, type)}
          onDeleteDate={() => {
            deleteWorkoutsOnDate(selectedDate);
          }}
        />
      ) : null}
    </section>
  );
}
