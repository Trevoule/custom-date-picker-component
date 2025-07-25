import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { DatePickerProps } from '../types';
import { getDateFromInputValue, getInputValueFromDate } from './utils';
import DatePickerPopupContent from './DatePickerPopupContent';
import { useLatest } from '../../hooks/useLatest';

export const DatePicker = ({ value, onChange }: DatePickerProps) => {
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

      if (validDate) {
        handleChange(validDate);
      } else {
        setInputValue(getInputValueFromDate(latestValidDate));
      }
      setShowPopup(false);
    },
    [handleChange]
  );

  const inputValueDate = useMemo(() => {
    return getDateFromInputValue(inputValue);
  }, [inputValue]);

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
