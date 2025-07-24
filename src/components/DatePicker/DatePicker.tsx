import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import type { DatePickerProps } from '../types';
import { getInputValueFromDate, isValidDateString } from './utils';
import DatePickerPopupContent from './DatePickerPopupContent';

export const DatePicker = ({ value, onChange }: DatePickerProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const onFocus = () => {
    setShowPopup(true);
  };

  const onInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInputValue(value);
  };

  const updateValueFromInputValue = () => {
    if (!isValidDateString(inputValue)) {
      return;
    }

    const [date, month, year] = inputValue
      .split('-')
      .map((v) => parseInt(v, 10));

    const dateObj = new Date(year, month - 1, date);
    onChange(dateObj);
  };

  const inputValueDate = useMemo(() => {
    if (!isValidDateString(inputValue)) {
      return;
    }

    const [date, month, year] = inputValue
      .split('-')
      .map((v) => parseInt(v, 10));

    const dateObj = new Date(year, month - 1, date);
    return new Date(dateObj);
  }, [inputValue]);

  const onBlur = () => {
    updateValueFromInputValue();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    updateValueFromInputValue();
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

      setShowPopup(false);
    };

    document.addEventListener('click', onDocumentClick);
  }, []);

  return (
    <div
      ref={elementRef}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <input
        type="text"
        onFocus={onFocus}
        value={inputValue}
        onChange={onInputValueChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
      {showPopup && (
        <div style={{ position: 'absolute', top: '100%', left: 0 }}>
          <DatePickerPopupContent
            selectedValue={value}
            onChange={onChange}
            inputValueDate={inputValueDate}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
