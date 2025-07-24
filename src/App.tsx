import { useState } from 'react';
import DatePicker from './components/DatePicker';

import './App.css';

function App() {
  const [date, setDate] = useState(() => new Date());

  console.log(date);

  return (
    <div>
      <DatePicker value={date} onChange={setDate} />;
    </div>
  );
}

export default App;
