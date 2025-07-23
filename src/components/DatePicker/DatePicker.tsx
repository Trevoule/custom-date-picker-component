import { useMemo, useState } from 'react';

type DatePickerProps = {
  value: Date;
  onChange: (value: Date) => void;
  min?: Date;
  max?: Date;
};

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Nov',
  'Dec',
];

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

const DatePicker = ({ value }: DatePickerProps) => {
  const [year, month, day] = useMemo(() => {
    const currentYear = value.getFullYear();
    const currentMonth = MONTHS[value.getMonth()];
    const currentDate = value.getDate();

    return [currentYear, currentMonth, currentDate];
  }, [value]);

  // DATEPICKER PANEL
  const [panelYear] = useState(() => value.getFullYear());
  const [panelMonth] = useState(() => value.getMonth());

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

  // TODO: DATEPICKER NAVIGATION
  // const nextYear = () => {};
  // const prevYear = () => {};
  // const nextMonth = () => {};
  // const prevMonth = () => {};

  return (
    <div>
      Date:
      <div>
        {year} {month} {day}
      </div>
      <div>
        {dateCells.map((cell) => (
          <div>{cell.date}</div>
        ))}
        <div></div>
      </div>
    </div>
  );
};

export default DatePicker;
