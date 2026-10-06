import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DayRecordSheet } from '../components/DayRecordSheet';
import { HolidayFormSheet } from '../components/HolidayFormSheet';
import { HolidayList } from '../components/HolidayList';
import { MonthCalendar } from '../components/MonthCalendar';
import { VacationAllowanceSheet } from '../components/VacationAllowanceSheet';
import { VacationFormSheet } from '../components/VacationFormSheet';
import { VacationPanel } from '../components/VacationPanel';
import { holidayMap, holidaysForYear, validateHoliday } from '../services/holidayService';
import { getDailyRecord } from '../services/recordService';
import { statisticsService } from '../services/statisticsService';
import {
  allowanceForYear,
  remainingVacationDays,
  usedVacationDays,
  vacationsByDate,
  vacationsForYear,
  validateVacation,
  vacationDays,
} from '../services/vacationService';
import { useAppStore } from '../store/AppStore';
import type { Holiday } from '../types/holiday';
import type { Vacation } from '../types/vacation';
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
    addHoliday,
    updateHoliday,
    deleteHoliday,
    setVacationAllowance,
    addVacation,
    updateVacation,
    deleteVacation,
  } = useAppStore();
  const navigate = useNavigate();
  const today = todayKey();
  const selectedMonth = yearMonthOf(selectedDate);
  const [view, setView] = useState(selectedMonth);
  const [open, setOpen] = useState(false);
  const [holidayForm, setHolidayForm] = useState<{ holiday: Holiday | null } | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [allowanceOpen, setAllowanceOpen] = useState(false);
  const [vacationForm, setVacationForm] = useState<{ vacation: Vacation | null } | null>(null);
  const addHolidayRef = useRef<HTMLButtonElement>(null);
  const daily = getDailyRecord(data, selectedDate);
  const monthly = statisticsService.monthly(data, view.year, view.month);
  const monthlyDays = statisticsService.monthlyDays(data, view.year, view.month);
  const holidays = holidayMap(data);
  const yearHolidays = holidaysForYear(data, view.year);
  const allowance = allowanceForYear(data, view.year);
  const yearVacations = vacationsForYear(data, view.year);
  const vacationDateMap = vacationsByDate(data);
  const usedDays = usedVacationDays(data, view.year);
  const remainingDays = remainingVacationDays(data, view.year);

  useEffect(() => {
    setView(yearMonthOf(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    if (!highlightId) return;
    const timer = window.setTimeout(() => setHighlightId(null), 2400);
    return () => window.clearTimeout(timer);
  }, [highlightId]);

  function selectDate(date: string) {
    setSelectedDate(date);
    setOpen(true);
  }

  function closeHolidayForm() {
    setHolidayForm(null);
    addHolidayRef.current?.focus();
  }

  function removeHoliday(holiday: Holiday) {
    if (window.confirm(`‘${holiday.name}’ 휴일을 삭제할까요?`)) {
      deleteHoliday(holiday.id);
    }
  }

  function removeVacation(vacation: Vacation) {
    if (window.confirm(`‘${vacation.name}’ 휴가를 삭제할까요?`)) {
      deleteVacation(vacation.id);
    }
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
          holidays={holidays}
          vacations={vacationDateMap}
          onSelect={selectDate}
        />
        {monthly.total === 0 ? (
          <p className="month-summary">이번 달 운동 기록이 없습니다.</p>
        ) : (
          <p className="month-summary">
            운동 {monthlyDays}일 · 총 {monthly.total}회 · Pilates {monthly.pilates}회 · Gym{' '}
            {monthly.gym}회
          </p>
        )}
      </div>
      <VacationPanel
        year={view.year}
        totalDays={allowance?.totalDays ?? 0}
        usedDays={usedDays}
        vacations={yearVacations}
        daysForVacation={(vacation) => vacationDays(data, vacation)}
        onSetTotal={() => setAllowanceOpen(true)}
        onAdd={() => setVacationForm({ vacation: null })}
        onEdit={(vacation) => setVacationForm({ vacation })}
        onDelete={removeVacation}
      />
      <HolidayList
        ref={addHolidayRef}
        year={view.year}
        holidays={yearHolidays}
        highlightId={highlightId}
        onAdd={() => setHolidayForm({ holiday: null })}
        onEdit={(holiday) => setHolidayForm({ holiday })}
        onDelete={removeHoliday}
      />
      {allowanceOpen ? (
        <VacationAllowanceSheet
          year={view.year}
          currentTotal={allowance?.totalDays ?? 0}
          usedDays={usedDays}
          initialMemo={allowance?.memo ?? ''}
          onClose={() => setAllowanceOpen(false)}
          onSave={(totalDays, memo) => {
            setVacationAllowance(view.year, totalDays, memo);
            setAllowanceOpen(false);
          }}
        />
      ) : null}
      {vacationForm ? (
        <VacationFormSheet
          data={data}
          vacation={vacationForm.vacation}
          initialDate={selectedDate}
          remainingDays={remainingDays}
          validate={(input) => validateVacation(data, input, vacationForm.vacation?.id)}
          onClose={() => setVacationForm(null)}
          onSubmit={(input) => {
            if (vacationForm.vacation) {
              updateVacation(vacationForm.vacation.id, input);
            } else {
              addVacation(input);
            }
            setView(yearMonthOf(input.startDate));
            setVacationForm(null);
          }}
        />
      ) : null}
      {holidayForm ? (
        <HolidayFormSheet
          holiday={holidayForm.holiday}
          initialDate={holidays.has(selectedDate) ? '' : selectedDate}
          validate={(input) => validateHoliday(data, input, holidayForm.holiday?.id)}
          onClose={closeHolidayForm}
          onSubmit={(input) => {
            const saved = holidayForm.holiday;
            if (saved) {
              updateHoliday(saved.id, input);
              setHighlightId(saved.id);
            } else {
              setHighlightId(addHoliday(input).id);
            }
            setView(yearMonthOf(input.date));
            closeHolidayForm();
          }}
        />
      ) : null}
      {open ? (
        <DayRecordSheet
          date={selectedDate}
          holiday={holidays.get(selectedDate)}
          vacations={vacationDateMap.get(selectedDate)}
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
