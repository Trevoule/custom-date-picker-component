import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import type { DatePickerProps } from '../types';
import { getDateFromInputValue, getInputValueFromDate } from './utils';
import DatePickerPopupContent from './DatePickerPopupContent';
import { useLatest } from '../../hooks/useLatest';

export const DatePicker = ({ value, onChange }: DatePickerProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const latestInputValue = useLatest(inputValue);

  const onInputClick = () => {
    setShowPopup(true);
  };

  const onInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInputValue(value);
  };

  const handleChange = (value: Date) => {
    onChange(value);
    setShowPopup(false);
  };

  const updateValueFromInputValue = () => {
    const date = getDateFromInputValue(inputValue);
    if (!date) return;
    handleChange(date);
  };

  const inputValueDate = useMemo(() => {
    return getDateFromInputValue(inputValue);
  }, [inputValue]);

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

      const dateFromInputValue = getDateFromInputValue(
        latestInputValue.current
      );

      if (dateFromInputValue) {
        onChange(dateFromInputValue);
      }
      setShowPopup(false);
    };

    document.addEventListener('click', onDocumentClick);

    return () => {
      document.removeEventListener('click', onDocumentClick);
    };
  }, [latestInputValue, onChange]);

  return (
    <div
      ref={elementRef}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <input
        type="text"
        onClick={onInputClick}
        value={inputValue}
        onChange={onInputValueChange}
        onKeyDown={onKeyDown}
      />
      {showPopup && (
        <div style={{ position: 'absolute', top: '100%', left: 0 }}>
          <DatePickerPopupContent
            selectedValue={value}
            onChange={handleChange}
            inputValueDate={inputValueDate}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
