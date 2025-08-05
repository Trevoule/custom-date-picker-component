import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

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

export const DatePicker = ({
  value,
  min,
  max,
  onChange,
  onChangeMin,
  onChangeMax,
}: DatePickerProps) => {
  const [inputValue, setInputValue] = useState('');
  const [inputMinValue, setInputMinValue] = useState('');
  const [inputMaxValue, setInputMaxValue] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const latestInputValue = useLatest(inputValue);
  const latestValue = useLatest(value);

  const onDatePickerInputClick = () => {
    setShowPopup(true);
  };

  const onInputValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setInput: (value: string) => void
  ) => {
    const value = e.target.value.trim();
    setInput(value);
  };

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
        setInputValue(getInputValueFromDate(latestValidDate));
      }
      setShowPopup(false);
    },
    [min, max, handleChange]
  );

  const [inputValueDate, isValidInputValue] = useMemo(() => {
    const date = getDateFromInputValue(inputValue);

    if (!date) {
      return [undefined, false];
    }

    const isDateInRange = isInRange(date, min, max);

    return [date, isDateInRange];
  }, [max, min, inputValue]);

  const onKeyDownDate = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    updateWithValidDate(inputValue, value);
  };

  const onKeyDownMin = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    const validDate = getDateFromInputValue(inputMinValue);

    if (validDate) {
      onChangeMin?.(validDate);
      return;
    }

    if (min) {
      setInputMinValue(getInputValueFromDate(min));
    }
  };

  const onKeyDownMax = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    const validDate = getDateFromInputValue(inputMaxValue);

    if (validDate) {
      onChangeMax?.(validDate);
      return;
    }

    if (max) {
      setInputMaxValue(getInputValueFromDate(max));
    }
  };

  useLayoutEffect(() => {
    setInputValue(getInputValueFromDate(value));

    if (min) {
      setInputMinValue(getInputValueFromDate(min));
    }

    if (max) {
      setInputMaxValue(getInputValueFromDate(max));
    }
  }, [value, min, max]);

  useOutsideClick({
    element: elementRef.current,
    handleOutsideClick: () =>
      updateWithValidDate(latestInputValue.current, latestValue.current),
  });

  return (
    <div
      ref={elementRef}
      className="DatePicker"
      data-testid={DATA_TEST_IDS.DATEPICKER_VIEW}
    >
      <div className="DatePicker--controls">
        {inputMinValue && (
          <div className="DatePicker--control">
            <label htmlFor="min_date">Min range:</label>
            <input
              id="min_date"
              type="text"
              value={inputMinValue}
              onChange={(e) => onInputValueChange(e, setInputMinValue)}
              onKeyDown={onKeyDownMin}
            />
          </div>
        )}

        {inputMaxValue && (
          <div className="DatePicker--control">
            <label htmlFor="max_date">Max range: </label>
            <input
              id="max_date"
              type="text"
              value={inputMaxValue}
              onChange={(e) => onInputValueChange(e, setInputMaxValue)}
              onKeyDown={onKeyDownMax}
            />
          </div>
        )}
        <div className="DatePicker--control">
          <label htmlFor="date">
            <strong>Date Picker (click to open)</strong>
          </label>
          <input
            data-testid={DATA_TEST_IDS.DATEPICKER_INPUT}
            id="date"
            type="text"
            onClick={onDatePickerInputClick}
            value={inputValue}
            onChange={(e) => onInputValueChange(e, setInputValue)}
            onKeyDown={onKeyDownDate}
            className={clsx(!isValidInputValue && 'invalid')}
          />
        </div>
        {!isValidInputValue && (
          <p className={clsx(!isValidInputValue && 'invalid')}>
            *Invalid input
          </p>
        )}
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
