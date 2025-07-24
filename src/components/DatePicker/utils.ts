import type { DateCellItem } from '../types';

const VISIBLE_CELLS_AMOUNT = 7 * 6;

const sundayWeekToMondayWeekDayMap: Record<number, number> = {
  0: 6,
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
};

export const getDaysAmountInAMonth = (year: number, month: number) => {
  const nextMonthDate = new Date(year, month + 1, 1);

  // mutates the date object
  nextMonthDate.setMinutes(-1);
  const monthLastDay = nextMonthDate.getDate();
  return monthLastDay;
};

const getDayOfTheWeek = (date: Date) => {
  const day = date.getDay();
  return sundayWeekToMondayWeekDayMap[day];
};

export const getPreviousMonthDays = (year: number, month: number) => {
  // for check of the first day of the month
  const currentMonthFirstDay = new Date(year, month, 1);

  // for check day of the week
  // for check how many days should we take for showing prev month
  const prevMonthCellsAmount = getDayOfTheWeek(currentMonthFirstDay);

  const daysAmountInPrevMonth = getDaysAmountInAMonth(year, month - 1);

  const dateCells: DateCellItem[] = [];

  // check negative month, when current month 0
  const [prevYear, prevMonth] =
    month === 0 ? [year - 1, 11] : [year, month - 1];

  for (let i = prevMonthCellsAmount - 1; i >= 0; i--) {
    dateCells.push({
      year: prevYear,
      month: prevMonth,
      date: daysAmountInPrevMonth - i,
    });
  }

  return dateCells;
};

export const getNextMonthDays = (year: number, month: number) => {
  const currentMonthFirstDay = new Date(year, month, 1);
  const prevMonthCellsAmount = getDayOfTheWeek(currentMonthFirstDay);

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

export const getCurrentMonthDays = (
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
