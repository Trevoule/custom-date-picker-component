export type DatePickerProps = {
  value: Date;
  onChange: (value: Date) => void;
  min?: Date;
  onChangeMin?: (value: Date) => void;
  max?: Date;
  onChangeMax?: (value: Date) => void;
};

export type DatePickerPopupContentProps = {
  selectedValue: Date;
  inputValueDate?: Date;
  onChange: (value: Date) => void;
  min?: Date;
  max?: Date;
};

export type DateCellItem = {
  date: number;
  month: number;
  year: number;
  type: 'prev' | 'current' | 'next';
};
