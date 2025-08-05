import clsx from 'clsx';
import React from 'react';

type DateInputControlProps = {
  id: string;
  label: string;
  value: string;
  type?: React.HTMLInputTypeAttribute;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onClick?: () => void;
  testId?: string;
  isValid?: boolean;
};

const DateInputControl = ({
  id,
  testId,
  label,
  value,
  type = 'text',
  isValid = true,
  onChange,
  onClick,
  onKeyDown,
}: DateInputControlProps) => (
  <div className="DatePicker--control">
    <label htmlFor={id}>{label}</label>
    <input
      data-testid={testId}
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onClick={onClick}
      className={clsx(!isValid && 'invalid')}
    />
    {!isValid && <p className={clsx(!isValid && 'invalid')}>*Invalid input</p>}
  </div>
);

export default DateInputControl;
