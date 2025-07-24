import { useMemo, useState } from 'react';

import { WEEKDAYS } from '../../constants/common';

type DatePickerProps = {
  value: Date;
  onChange: (value: Date) => void;
  min?: Date;
  max?: Date;
};

type DateCellItem = {
  date: number;
  month: number;
  year: number;

  // ???
  isToday?: boolean;
  isSelected?: boolean;
};

const getDaysAmountInAMonth = (year: number, month: number) => {
  const nextMonthDate = new Date(year, month + 1, 1);

  // mutates the date object
  nextMonthDate.setMinutes(-1);
  const monthLastDay = nextMonthDate.getDate();
  return monthLastDay;
};

const getPreviousMonthDays = (year: number, month: number) => {
  // for check of the first day of the month
  const currentMonthFirstDay = new Date(year, month, 1);

  // for check day of the week
  const dayOfTheWeek = currentMonthFirstDay.getDay();

  // if dayOfTheWeek not equals 1 we need to take some days from previous month
  // for check how many days should we take for showing prev month
  const prevMonthCellsAmount = dayOfTheWeek - 1;

  const daysAmountInPrevMonth = getDaysAmountInAMonth(year, month - 1);

  const dateCells: DateCellItem[] = [];

  // check negative month, when current month 0
  const [prevYear, prevMonth] =
    month === 0 ? [year - 1, 11] : [year, month - 1];

  for (let i = 0; i < prevMonthCellsAmount; i++) {
    dateCells.push({
      year: prevYear,
      month: prevMonth,
      date: daysAmountInPrevMonth - i,
    });
  }

  return dateCells;
};

const VISIBLE_CELLS_AMOUNT = 7 * 6;

const getNextMonthDays = (year: number, month: number) => {
  // TODO: copy paste
  const currentMonthFirstDay = new Date(year, month, 1);
  const dayOfTheWeek = currentMonthFirstDay.getDay();
  const prevMonthCellsAmount = dayOfTheWeek - 1;
  // TODO: end copy paste

  const currentMonthDaysAmount = getDaysAmountInAMonth(year, month);

  // left cells for next month
  const nextMonthDays =
    VISIBLE_CELLS_AMOUNT - currentMonthDaysAmount - prevMonthCellsAmount;

  const dateCells: DateCellItem[] = [];

  const [nextYear, nextMonth] =
    month === 11 ? [year + 1, 0] : [year, month + 1];

  for (let i = 1; i <= nextMonthDays; i++) {
    dateCells.push({
      year: nextYear,
      month: nextMonth,
      date: i,
    });
  }

  return dateCells;
};

const getCurrentMonthDays = (
  year: number,
  month: number,
  numberOfDays: number
) => {
  const dateCells: DateCellItem[] = [];

  for (let i = 1; i <= numberOfDays; i++) {
    dateCells.push({
      year,
      month,
      date: i,
    });
  }

  return dateCells;
};

const DatePicker = ({ value, onChange }: DatePickerProps) => {
  const [year, month, day] = useMemo(() => {
    const currentYear = value.getFullYear();
    const currentMonth = value.getMonth();

    const currentDate = value.getDate();

    return [currentYear, currentMonth, currentDate];
  }, [value]);

  // DATEPICKER PANEL
  const [panelYear, setPanelYear] = useState(() => value.getFullYear());
  const [panelMonth, setPanelMonth] = useState(() => value.getMonth());

  const dateCells = useMemo(() => {
    const daysInMonth = getDaysAmountInAMonth(panelYear, panelMonth);

    const currentMonthDays = getCurrentMonthDays(
      panelYear,
      panelMonth,
      daysInMonth
    );

    const prevMonthDays = getPreviousMonthDays(panelYear, panelMonth);
    const nextMonthDays = getNextMonthDays(panelYear, panelMonth);

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }, [panelYear, panelMonth]);

  const onDateSelect = (dateItem: DateCellItem) => {
    const date = new Date(dateItem.year, dateItem.month, dateItem.date);
    onChange(date);
  };

  const prevYearHandler = () => {
    const year = value.getFullYear();
    const prevYear = year - 1;
    setPanelYear(prevYear);
  };
  const prevMonthHandler = () => {
    const month = value.getMonth();
    const year = value.getFullYear();

    const [prevMonth, prevYear] =
      month === 0 ? [11, year - 1] : [month - 1, year];

    setPanelYear(prevYear);
    setPanelMonth(prevMonth);
  };

  const nextMonthHandler = () => {
    const month = value.getMonth();
    const year = value.getFullYear();

    const [nextMonth, nextYear] =
      month === 0 ? [0, year + 1] : [month + 1, year];

    setPanelYear(nextYear);
    setPanelMonth(nextMonth);
  };

  const nextYearHandler = () => {
    const year = value.getFullYear();
    const nextYear = year + 1;

    setPanelYear(nextYear);
  };

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'flex', margin: '12px 0', gap: 8 }}>
        <button onClick={prevYearHandler}>Prev Year</button>
        <button onClick={prevMonthHandler}>Prev Month</button>
        <button onClick={nextMonthHandler}>Next Month</button>
        <button onClick={nextYearHandler}>Next Year</button>
      </div>
      <div className="CalendarPanel">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className="CalendarPanelItem">
            {weekday}
          </div>
        ))}
        {dateCells.map((cell) => {
          const isCurrentDate =
            cell.year === year && cell.month === month && cell.date === day;

          return (
            <div
              key={`${cell.date}-${cell.month}-${cell.year}`}
              className={`CalendarPanelItem ${isCurrentDate ? 'CalendarPanelItem--current' : ''}`}
              onClick={() => onDateSelect(cell)}
            >
              {cell.date}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DatePicker;
