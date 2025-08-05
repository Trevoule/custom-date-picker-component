import { useCallback, useMemo, useRef, useState } from 'react';

import type { DatePickerProps } from '../types';
import {
  getDateFromInputValue,
  getInputValueFromDate,
  isInRange,
} from './utils';
import DatePickerPopupContent from './DatePickerPopupContent';
import { useLatest } from '../../hooks/useLatest';
import { DATA_TEST_IDS } from './constants';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import DateInputControl from './DateInputControl';
import { useDateInput } from './hooks/useDateInput';

export const DatePicker = ({
  value,
  min,
  max,
  onChange,
  onChangeMin,
  onChangeMax,
}: DatePickerProps) => {
  const selectedDateInput = useDateInput(value);
  const minDateInput = useDateInput(min, onChangeMin);
  const maxDateInput = useDateInput(max, onChangeMax);

  const latestInputValue = useLatest(selectedDateInput.inputValue);
  const latestValue = useLatest(value);

  const [showPopup, setShowPopup] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const onDatePickerInputClick = useCallback(() => {
    setShowPopup(true);
  }, []);

  const handleChange = useCallback(
    (value: Date) => {
      onChange(value);
      setShowPopup(false);
    },
    [onChange]
  );

  const updateWithValidDate = useCallback(
    (inputValue: string, latestValidDate: Date) => {
      const validDate = getDateFromInputValue(inputValue);
      const isDateInRange = validDate && isInRange(validDate, min, max);

      if (isDateInRange) {
        handleChange(validDate);
      } else {
        selectedDateInput.handleInputValue(
          getInputValueFromDate(latestValidDate)
        );
      }
      setShowPopup(false);
    },
    [min, max, handleChange, selectedDateInput]
  );

  const [inputValueDate, isValidInputValue] = useMemo(() => {
    const date = getDateFromInputValue(selectedDateInput.inputValue);

    if (!date) {
      return [undefined, false];
    }

    const isDateInRange = isInRange(date, min, max);

    return [date, isDateInRange];
  }, [max, min, selectedDateInput]);

  const handleMainDateKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      updateWithValidDate(selectedDateInput.inputValue, value);
    },
    [selectedDateInput.inputValue, value, updateWithValidDate]
  );

  useOutsideClick({
    element: elementRef.current,
    handleOutsideClick: () => {
      updateWithValidDate(latestInputValue.current, latestValue.current);

      if (min) {
        minDateInput.handleKeyDown();
      }

      if (max) {
        maxDateInput.handleKeyDown();
      }
    },
  });

  return (
    <div
      ref={elementRef}
      className="DatePicker"
      data-testid={DATA_TEST_IDS.DATEPICKER_VIEW}
    >
      <div className="DatePicker--controls">
        {min && (
          <DateInputControl
            testId={DATA_TEST_IDS.DATEPICKER_MIN_INPUT}
            id="min_date"
            label="Min range:"
            value={minDateInput.inputValue}
            onChange={minDateInput.handleInputChange}
            onKeyDown={minDateInput.handleKeyDown}
          />
        )}
        {max && (
          <DateInputControl
            testId={DATA_TEST_IDS.DATEPICKER_MAX_INPUT}
            id="max_date"
            label="Max range:"
            value={maxDateInput.inputValue}
            onChange={maxDateInput.handleInputChange}
            onKeyDown={maxDateInput.handleKeyDown}
          />
        )}
        <DateInputControl
          testId={DATA_TEST_IDS.DATEPICKER_INPUT}
          id="date"
          label="Date Picker (click to open)"
          onClick={onDatePickerInputClick}
          value={selectedDateInput.inputValue}
          onChange={selectedDateInput.handleInputChange}
          onKeyDown={handleMainDateKeyDown}
          isValid={isValidInputValue}
        />
      </div>
      {showPopup && (
        <div
          className="CalendarPanel--modal"
          data-testid={DATA_TEST_IDS.DATEPICKER_POPUP}
        >
          <DatePickerPopupContent
            selectedValue={value}
            onChange={handleChange}
            inputValueDate={inputValueDate}
            min={min}
            max={max}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
