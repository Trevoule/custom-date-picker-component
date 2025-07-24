export type DatePickerProps = {
  value: Date;
  onChange: (value: Date) => void;
  min?: Date;
  max?: Date;
};

export type DateCellItem = {
  date: number;
  month: number;
  year: number;
};
