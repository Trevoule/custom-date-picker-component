import { useState } from 'react';
import DatePicker from './components/DatePicker';

import './App.css';
import { formatDateNumeric } from './components/DatePicker/utils';

const MIN_DATE = new Date('2025-06-10');
const MAX_DATE = new Date('2025-07-30');

function App() {
  const [date, setDate] = useState(() => new Date());

  return (
    <div>
      <div>
        <p>Today: {formatDateNumeric(date)}</p>
        {MIN_DATE && <p>Min range: {formatDateNumeric(MIN_DATE)}</p>}
        {MAX_DATE && <p>Max range: {formatDateNumeric(MAX_DATE)}</p>}
      </div>
      <DatePicker
        value={date}
        onChange={setDate}
        min={MIN_DATE}
        max={MAX_DATE}
      />
    </div>
  );
}

export default App;
