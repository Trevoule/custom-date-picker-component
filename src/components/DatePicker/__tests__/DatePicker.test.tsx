import { useState } from 'react';
import { vi, describe } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import DatePicker from '../DatePicker';
import type { DatePickerProps } from '../../types';
import { DATA_TEST_IDS } from '../constants';

const TEST_DATES = {
  INITIAL_DATE: new Date(2025, 0, 1),
  INITIAL_DATE_STRING: '01-01-2025',
  INITIAL_SHORT_DATE: 'Jan 2025',
  INITIAL_DAY: '1',
  TODAY: new Date(2025, 1, 1),
  MIN_RANGE: new Date(2025, 1, 1),
  MAX_RANGE: new Date(2025, 11, 31),
} as const;

// create TestApp for testing input update
const TestApp = ({
  value = TEST_DATES.INITIAL_DATE,
  onChange = () => {},
  ...rest
}: Partial<DatePickerProps>) => {
  const [date, setDate] = useState(new Date(value));

  const handleChange = (value: Date) => {
    // for mock function
    onChange?.(value);
    setDate(value);
  };

  return <DatePicker value={date} onChange={handleChange} {...rest} />;
};

function getElements() {
  const dateInput = screen.getByTestId(DATA_TEST_IDS.DATEPICKER_INPUT);

  return { dateInput };
}

async function getPopupElements() {
  const popup = await screen.findByTestId(DATA_TEST_IDS.DATEPICKER_POPUP);
  const popupDateCells = await screen.findAllByTestId(
    DATA_TEST_IDS.DATEPICKER_POPUP_CELL
  );
  const popupMonth = await screen.findByTestId(
    DATA_TEST_IDS.DATEPICKER_POPUP_MONTH
  );

  const popupPrevMonthHandler = await screen.findByTestId(
    DATA_TEST_IDS.DATEPICKER_PREV_MONTH_HANDLER
  );
  const popupPrevYearHandler = await screen.findByTestId(
    DATA_TEST_IDS.DATEPICKER_PREV_YEAR_HANDLER
  );

  const popupNextMonthHandler = await screen.findByTestId(
    DATA_TEST_IDS.DATEPICKER_NEXT_MONTH_HANDLER
  );
  const popupNextYearHandler = await screen.findByTestId(
    DATA_TEST_IDS.DATEPICKER_NEXT_YEAR_HANDLER
  );

  return {
    popup,
    popupDateCells,
    popupMonth,
    popupPrevMonthHandler,
    popupPrevYearHandler,
    popupNextMonthHandler,
    popupNextYearHandler,
  };
}

describe('DatePicker', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true }).setSystemTime(
      TEST_DATES.TODAY
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('popup', () => {
    test('should show correct date in input', () => {
      render(<TestApp value={TEST_DATES.INITIAL_DATE} onChange={() => {}} />);

      const { dateInput } = getElements();
      expect(dateInput).toHaveValue(TEST_DATES.INITIAL_DATE_STRING);
    });

    test('should open popup when click on input', async () => {
      render(<TestApp value={TEST_DATES.INITIAL_DATE} onChange={() => {}} />);

      const { dateInput } = getElements();
      await user.click(dateInput);

      const { popup } = await getPopupElements();
      expect(popup).toBeInTheDocument();
    });

    test('should close popup when click outside', async () => {
      render(<TestApp value={TEST_DATES.INITIAL_DATE} onChange={() => {}} />);

      const { dateInput } = getElements();
      await user.click(dateInput);

      const { popup } = await getPopupElements();
      expect(popup).toBeInTheDocument();

      //close popup
      await user.click(document.documentElement);
      expect(popup).not.toBeInTheDocument();
    });
  });

  describe('date highlight', () => {
    test('should highlight today', async () => {
      render(<TestApp value={TEST_DATES.TODAY} onChange={() => {}} />);

      const { dateInput } = getElements();
      await user.click(dateInput);

      const { popup, popupDateCells } = await getPopupElements();
      expect(popup).toBeInTheDocument();

      const todayCells = popupDateCells.filter((item) =>
        item.classList.contains('CalendarPanelItem--today')
      );

      expect(todayCells).toHaveLength(1);

      const todayCell = todayCells[0];
      expect(todayCell).toHaveTextContent(
        TEST_DATES.TODAY.getDate().toString()
      );
    });

    test('should highlight selected date', async () => {
      const selectedDate = TEST_DATES.INITIAL_DATE;

      render(<TestApp value={selectedDate} onChange={() => {}} />);

      const { dateInput } = getElements();
      await user.click(dateInput);

      const { popup, popupDateCells } = await getPopupElements();
      expect(popup).toBeInTheDocument();

      const selectedCells = popupDateCells.filter((item) =>
        item.classList.contains('CalendarPanelItem--selected')
      );

      expect(selectedCells).toHaveLength(1);

      const selectedCell = selectedCells[0];
      expect(selectedCell).toHaveTextContent(selectedDate.getDate().toString());
    });
  });

  describe('input', () => {
    test('should select date and update input', async () => {
      const TARGET_DAY = 15;
      const TARGET_DATE_STRING = '15-01-2025';

      const onChange = vi.fn();

      render(<TestApp value={TEST_DATES.INITIAL_DATE} onChange={onChange} />);

      const { dateInput } = getElements();
      await user.click(dateInput);

      const { popup, popupDateCells } = await getPopupElements();
      expect(popup).toBeInTheDocument();

      const selectCells = popupDateCells.filter(
        (item) => item.textContent === TARGET_DAY.toString()
      );

      expect(selectCells).toHaveLength(1);

      const selectCell = selectCells[0];
      await user.click(selectCell);

      expect(onChange).toHaveBeenCalledWith(new Date(2025, 0, 15));

      // popup closed after click
      expect(popup).not.toBeInTheDocument();

      expect(dateInput).toHaveValue(TARGET_DATE_STRING);
    });

    test('should apply valid date from input on enter press', async () => {
      const TARGET_DATE = new Date(2025, 1, 15);
      const TARGET_DATE_STRING = '15-02-2025';

      const onChange = vi.fn();

      render(<TestApp value={TEST_DATES.INITIAL_DATE} onChange={onChange} />);

      const { dateInput } = getElements();
      await user.click(dateInput);

      await user.clear(dateInput);

      await user.type(dateInput, TARGET_DATE_STRING);

      await user.keyboard('[Enter]');

      expect(onChange).toHaveBeenCalledWith(TARGET_DATE);

      expect(dateInput).toHaveValue(TARGET_DATE_STRING);
    });

    test('should reset invalid date from input on enter press', async () => {
      const INVALID_INPUT_STRING = '32-13-2025';

      const onChange = vi.fn();

      render(<TestApp value={TEST_DATES.INITIAL_DATE} onChange={onChange} />);

      const { dateInput } = getElements();
      await user.click(dateInput);

      await user.clear(dateInput);

      await user.type(dateInput, INVALID_INPUT_STRING);

      await user.keyboard('[Enter]');

      expect(onChange).not.toHaveBeenCalled();

      expect(dateInput).toHaveValue(TEST_DATES.INITIAL_DATE_STRING);
    });

    test('should apply valid date from input on outside click', async () => {
      const TARGET_DATE = new Date(2025, 1, 15);
      const TARGET_DATE_STRING = '15-02-2025';

      const onChange = vi.fn();

      render(<TestApp value={TEST_DATES.INITIAL_DATE} onChange={onChange} />);

      const { dateInput } = getElements();
      await user.click(dateInput);

      await user.clear(dateInput);

      await user.type(dateInput, TARGET_DATE_STRING);

      await user.click(document.documentElement);

      expect(onChange).toHaveBeenCalledWith(TARGET_DATE);

      expect(dateInput).toHaveValue(TARGET_DATE_STRING);
    });

    test('should reset invalid date from input on outside click', async () => {
      const INVALID_DATE_STRING = '32-13-2025';

      const onChange = vi.fn();

      render(<TestApp value={TEST_DATES.INITIAL_DATE} onChange={onChange} />);

      const { dateInput } = getElements();
      await user.click(dateInput);

      await user.clear(dateInput);

      await user.type(dateInput, INVALID_DATE_STRING);

      await user.click(document.documentElement);

      expect(onChange).not.toHaveBeenCalled();

      expect(dateInput).toHaveValue(TEST_DATES.INITIAL_DATE_STRING);
    });

    test('should update popup calendar on valid input value', async () => {
      const TARGET_DATE = new Date(2025, 3, 25);
      const TARGET_DATE_SHORT = 'Apr 2025';
      const TARGET_DATE_STRING = '25-04-2025';
      const TARGET_DAY = '25';

      const onChange = vi.fn();

      render(<TestApp value={TEST_DATES.INITIAL_DATE} onChange={onChange} />);

      const { dateInput } = getElements();
      await user.click(dateInput);

      let popup = await screen.queryByTestId(DATA_TEST_IDS.DATEPICKER_POPUP);
      let popupMonth = await screen.queryByTestId(
        DATA_TEST_IDS.DATEPICKER_POPUP_MONTH
      );

      expect(popup).toBeInTheDocument();

      let selectedCell = screen
        .queryAllByTestId(DATA_TEST_IDS.DATEPICKER_POPUP_CELL)
        .find((item) => item.classList.contains('CalendarPanelItem--selected'));

      // check initial selected date
      expect(selectedCell).toHaveTextContent('1');
      expect(popupMonth).toHaveTextContent(TEST_DATES.INITIAL_SHORT_DATE);

      await user.clear(dateInput);
      await user.type(dateInput, TARGET_DATE_STRING);

      await user.click(document.documentElement);

      expect(onChange).toHaveBeenCalledWith(TARGET_DATE);

      expect(popup).not.toBeInTheDocument();

      // re-open popup
      await user.click(dateInput);

      popup = await screen.queryByTestId(DATA_TEST_IDS.DATEPICKER_POPUP);
      popupMonth = await screen.queryByTestId(
        DATA_TEST_IDS.DATEPICKER_POPUP_MONTH
      );

      expect(popup).toBeInTheDocument();

      selectedCell = screen
        .queryAllByTestId(DATA_TEST_IDS.DATEPICKER_POPUP_CELL)
        .find((item) => item.classList.contains('CalendarPanelItem--selected'));

      // check updated selected date
      expect(selectedCell).toHaveTextContent(TARGET_DAY);
      expect(popupMonth).toHaveTextContent(TARGET_DATE_SHORT);
    });
  });

  test('should show correct month in popup', async () => {
    render(<TestApp />);
    const { dateInput } = getElements();

    // show popup
    await user.click(dateInput);
    const { popup, popupMonth } = await getPopupElements();
    expect(popup).toBeInTheDocument();

    expect(popupMonth).toHaveTextContent(TEST_DATES.INITIAL_SHORT_DATE);
  });

  test('should move to the next month', async () => {
    const NEXT_MONTH_DATE = 'Feb 2025';
    const DOUBLE_NEXT_MONTH_DATE = 'Mar 2025';

    render(<TestApp />);
    const { dateInput } = getElements();

    // show popup
    await user.click(dateInput);
    const { popup, popupMonth, popupNextMonthHandler } =
      await getPopupElements();
    expect(popup).toBeInTheDocument();

    // check current
    expect(popupMonth).toHaveTextContent(TEST_DATES.INITIAL_SHORT_DATE);

    await user.click(popupNextMonthHandler);
    expect(popupMonth).toHaveTextContent(NEXT_MONTH_DATE);

    await user.click(popupNextMonthHandler);
    expect(popupMonth).toHaveTextContent(DOUBLE_NEXT_MONTH_DATE);
  });

  test('should move to the prev month', async () => {
    const PREV_MONTH_DATE = 'Dec 2024';
    const DOUBLE_PREV_MONTH_DATE = 'Nov 2024';

    render(<TestApp />);
    const { dateInput } = getElements();

    // show popup
    await user.click(dateInput);
    const { popup, popupMonth, popupPrevMonthHandler } =
      await getPopupElements();
    expect(popup).toBeInTheDocument();

    // check current
    expect(popupMonth).toHaveTextContent(TEST_DATES.INITIAL_SHORT_DATE);

    await user.click(popupPrevMonthHandler);
    expect(popupMonth).toHaveTextContent(PREV_MONTH_DATE);

    await user.click(popupPrevMonthHandler);
    expect(popupMonth).toHaveTextContent(DOUBLE_PREV_MONTH_DATE);
  });

  test('should move to the next year', async () => {
    const NEXT_YEAR_DATE = 'Jan 2026';
    const DOUBLE_NEXT_YEAR_DATE = 'Jan 2027';

    render(<TestApp />);
    const { dateInput } = getElements();

    // show popup
    await user.click(dateInput);
    const { popup, popupMonth, popupNextYearHandler } =
      await getPopupElements();
    expect(popup).toBeInTheDocument();

    // check current
    expect(popupMonth).toHaveTextContent(TEST_DATES.INITIAL_SHORT_DATE);

    await user.click(popupNextYearHandler);
    expect(popupMonth).toHaveTextContent(NEXT_YEAR_DATE);

    await user.click(popupNextYearHandler);
    expect(popupMonth).toHaveTextContent(DOUBLE_NEXT_YEAR_DATE);
  });

  test('should move to the prev year', async () => {
    const PREV_YEAR_DATE = 'Jan 2024';
    const DOUBLE_PREV_YEAR_DATE = 'Jan 2023';

    render(<TestApp />);
    const { dateInput } = getElements();

    // show popup
    await user.click(dateInput);
    const { popup, popupMonth, popupPrevYearHandler } =
      await getPopupElements();
    expect(popup).toBeInTheDocument();

    // check initial
    expect(popupMonth).toHaveTextContent(TEST_DATES.INITIAL_SHORT_DATE);

    await user.click(popupPrevYearHandler);
    expect(popupMonth).toHaveTextContent(PREV_YEAR_DATE);

    await user.click(popupPrevYearHandler);
    expect(popupMonth).toHaveTextContent(DOUBLE_PREV_YEAR_DATE);
  });

  describe('min/max', () => {
    test('should disable dates out of range', async () => {
      const onChange = vi.fn();

      render(
        <TestApp
          value={TEST_DATES.INITIAL_DATE}
          onChange={onChange}
          min={TEST_DATES.MIN_RANGE}
          max={TEST_DATES.MAX_RANGE}
        />
      );
      const { dateInput } = getElements();
      await user.click(dateInput);

      const { popup, popupPrevYearHandler, popupNextYearHandler } =
        await getPopupElements();

      expect(popup).toBeInTheDocument();

      // min - 1 year backwards click
      await user.click(popupPrevYearHandler);

      const minDateCells = await screen.queryAllByTestId(
        DATA_TEST_IDS.DATEPICKER_POPUP_CELL
      );

      expect(
        minDateCells.every((cell) =>
          cell.classList.contains('CalendarPanelItem--not-in-range')
        )
      ).toBe(true);

      await minDateCells.forEach((cell) => user.click(cell));
      expect(onChange).not.toBeCalled();

      // max - 2 years forward click
      await user.click(popupNextYearHandler);
      await user.click(popupNextYearHandler);

      const maxDateCells = await screen.queryAllByTestId(
        DATA_TEST_IDS.DATEPICKER_POPUP_CELL
      );

      const notInRangeCells = maxDateCells.filter((cell) =>
        cell.classList.contains('CalendarPanelItem--not-in-range')
      );

      await notInRangeCells.forEach((cell) => user.click(cell));

      // check click disabled
      expect(onChange).not.toBeCalled();

      // valid - going back to initial date
      await user.click(popupPrevYearHandler);

      const inRangeCells = await screen.queryAllByTestId(
        DATA_TEST_IDS.DATEPICKER_POPUP_CELL
      );

      const validCells = inRangeCells.filter((cell) => {
        return !cell.className
          .split(' ')
          .includes('CalendarPanelItem--not-in-range');
      });

      await user.click(validCells[0]);
      expect(onChange).toHaveBeenCalled();
    });

    test('should highlight invalid input', async () => {
      const MIN_DATE_STRING = '12-12-2024';
      const MAX_DATE_STRING = '01-01-2026';
      const VALID_DATE_STRING = '01-02-2025';

      render(<TestApp min={TEST_DATES.MIN_RANGE} max={TEST_DATES.MAX_RANGE} />);
      const { dateInput } = getElements();

      // min
      await user.clear(dateInput);
      await user.type(dateInput, MIN_DATE_STRING);
      expect(dateInput).toHaveClass('invalid');

      // max
      await user.clear(dateInput);
      await user.type(dateInput, MAX_DATE_STRING);
      expect(dateInput).toHaveClass('invalid');

      // in valid range
      await user.clear(dateInput);
      await user.type(dateInput, VALID_DATE_STRING);
      expect(dateInput).not.toHaveClass('invalid');
    });
  });
});
