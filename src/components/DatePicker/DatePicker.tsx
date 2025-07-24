import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import type { DatePickerProps } from '../types';
import DatePickerPopup from './DatePickerPopup';

const getInputValueFromDate = (value: Date) => {
  const date = value.getDate();
  const monthValue = value.getMonth();
  const month = monthValue > 9 ? monthValue : `0${monthValue}`;
  const year = value.getFullYear();
  return `${date}-${month}-${year}`;
};

export const DatePicker = ({ value, onChange }: DatePickerProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // TODO: syncing external value state
  useLayoutEffect(() => {
    setInputValue(getInputValueFromDate(value));
  }, [value]);

  const onFocus = () => {
    setShowPopup(true);
  };

  const onInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // TO DO: add input validation
  };

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
      />
      {showPopup && (
        <div style={{ position: 'absolute', top: '100%', left: 0 }}>
          <DatePickerPopup value={value} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
