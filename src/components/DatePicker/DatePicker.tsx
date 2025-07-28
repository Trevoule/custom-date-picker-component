import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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

export const DatePicker = ({ value, onChange, min, max }: DatePickerProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const latestInputValue = useLatest(inputValue);
  const latestValue = useLatest(value);

  const onInputClick = () => {
    setShowPopup(true);
  };

  const onInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInputValue(value);
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

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    updateWithValidDate(inputValue, value);
  };

  useLayoutEffect(() => {
    setInputValue(getInputValueFromDate(value));
  }, [value]);

  // handling outside click
  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const onDocumentClick = (e: MouseEvent) => {
      const target = e.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (element.contains(target)) {
        return;
      }

      // using latest value ref instead of value to not recreate the event listener on every value change
      updateWithValidDate(latestInputValue.current, latestValue.current);
    };

    document.addEventListener('click', onDocumentClick);

    return () => {
      document.removeEventListener('click', onDocumentClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateWithValidDate]);

  return (
    <div
      ref={elementRef}
      className="DatePicker"
      data-testid={DATA_TEST_IDS.DATEPICKER_VIEW}
    >
      <div className="DatePicker--control">
        <label htmlFor="date"></label>
        <input
          data-testid={DATA_TEST_IDS.DATEPICKER_INPUT}
          id="date"
          type="text"
          onClick={onInputClick}
          value={inputValue}
          onChange={onInputValueChange}
          onKeyDown={onKeyDown}
          className={clsx(!isValidInputValue && 'invalid')}
        />
      </div>
      {!isValidInputValue && (
        <p className={clsx(!isValidInputValue && 'invalid')}>*Invalid input</p>
      )}
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
