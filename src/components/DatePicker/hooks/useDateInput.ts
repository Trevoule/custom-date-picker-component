import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { getDateFromInputValue, getInputValueFromDate } from '../utils';

export const useDateInput = (
  initialValue: Date | undefined,
  onValidDateChange?: (date: Date) => void
) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.trim();
      setInputValue(value);
    },
    []
  );

  const handleInputValue = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleKeyDown = useCallback(
    (e?: React.KeyboardEvent) => {
      if (e && e.key !== 'Enter') return;

      const validDate = getDateFromInputValue(inputValue);
      if (validDate && onValidDateChange) {
        onValidDateChange(validDate);
      } else if (initialValue) {
        // Reset to last valid value if invalid
        setInputValue(getInputValueFromDate(initialValue));
      }
    },
    [inputValue, onValidDateChange, initialValue]
  );

  const isValidInput = useMemo(() => {
    if (!inputValue) return true;
    return !!getDateFromInputValue(inputValue);
  }, [inputValue]);

  // Sync with external value changes
  useLayoutEffect(() => {
    if (initialValue) {
      setInputValue(getInputValueFromDate(initialValue));
    } else {
      setInputValue('');
    }
  }, [initialValue]);

  return {
    inputValue,
    handleInputChange,
    handleKeyDown,
    handleInputValue,
    isValidInput,
  };
};
