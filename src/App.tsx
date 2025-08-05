import './App.css';

import { useState } from 'react';

import DatePicker from './components/DatePicker';
import { changeDaysFromDate } from './components/DatePicker/utils';

const TODAY = new Date();
const MIN_DATE = new Date(changeDaysFromDate(TODAY, -10));
const MAX_DATE = new Date(changeDaysFromDate(TODAY, 10));

function App() {
  const [date, setDate] = useState(TODAY);
  const [minDate, setMinDate] = useState(MIN_DATE);
  const [maxDate, setMaxDate] = useState(MAX_DATE);

  return (
    <div>
      <DatePicker
        value={date}
        onChange={setDate}
        min={minDate}
        onChangeMax={setMaxDate}
        max={maxDate}
        onChangeMin={setMinDate}
      />
    </div>
  );
}

export default App;
