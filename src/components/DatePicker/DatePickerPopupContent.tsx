import { useLayoutEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

import { MONTHS, WEEKDAYS } from '../../constants/common';
import type { DateCellItem, DatePickerPopupContentProps } from '../types';
import {
  getCurrentMonthDays,
  getDaysAmountInAMonth,
  getNextMonthDays,
  getPreviousMonthDays,
  isInRange,
  isToday,
} from './utils';

const DatePickerPopupContent = ({
  selectedValue,
  inputValueDate,
  onChange,
  min,
  max,
}: DatePickerPopupContentProps) => {
  const [year, month, day] = useMemo(() => {
    const currentYear = selectedValue.getFullYear();
    const currentMonth = selectedValue.getMonth();
    const currentDate = selectedValue.getDate();

    return [currentYear, currentMonth, currentDate];
  }, [selectedValue]);

  const [panelYear, setPanelYear] = useState(() => selectedValue.getFullYear());
  const [panelMonth, setPanelMonth] = useState(() => selectedValue.getMonth());
  const todayDate = useMemo(() => new Date(), []);

  useLayoutEffect(() => {
    if (!inputValueDate) return;

    setPanelMonth(inputValueDate.getMonth());
    setPanelYear(inputValueDate.getFullYear());
  }, [inputValueDate]);

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
    const year = panelYear;
    const prevYear = year - 1;
    setPanelYear(prevYear);
  };
  const prevMonthHandler = () => {
    const month = panelMonth;
    const year = panelYear;

    const [prevMonth, prevYear] =
      month === 0 ? [11, year - 1] : [month - 1, year];

    setPanelYear(prevYear);
    setPanelMonth(prevMonth);
  };

  const nextMonthHandler = () => {
    const month = panelMonth;
    const year = panelYear;

    const [nextMonth, nextYear] =
      month === 0 ? [0, year + 1] : [month + 1, year];

    setPanelYear(nextYear);
    setPanelMonth(nextMonth);
  };

  const nextYearHandler = () => {
    const year = panelYear;
    const nextYear = year + 1;

    setPanelYear(nextYear);
  };

  return (
    <div className="CalendarPanel--container">
      <div className="CalendarPanel--controls">
        <button onClick={prevYearHandler}>Prev Year</button>
        <button onClick={prevMonthHandler}>Prev Month</button>

        <div>
          {MONTHS[panelMonth]} {panelYear}
        </div>

        <button onClick={nextMonthHandler}>Next Month</button>
        <button onClick={nextYearHandler}>Next Year</button>
      </div>
      <div className="CalendarPanel--content">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className="CalendarPanelItem">
            {weekday}
          </div>
        ))}
        {dateCells.map((cell) => {
          const isSelectedDate =
            cell.year === year && cell.month === month && cell.date === day;

          const isTodayDate = isToday(todayDate, cell);
          const isNotCurrent = cell.type !== 'current';

          const date = new Date(cell.year, cell.month, cell.date);
          const isDateNotInRange = !isInRange(date, min, max);

          return (
            <div
              key={`${cell.date}-${cell.month}-${cell.year}`}
              className={clsx(
                'CalendarPanelItem',
                isSelectedDate && 'CalendarPanelItem--selected',
                !isDateNotInRange && isTodayDate && 'CalendarPanelItem--today',
                isNotCurrent && 'CalendarPanelItem--not-current',
                isDateNotInRange && 'CalendarPanelItem--not-in-range'
              )}
              onClick={() => !isDateNotInRange && onDateSelect(cell)}
            >
              <div className="CalendarPanelItem__date">{cell.date}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DatePickerPopupContent;
