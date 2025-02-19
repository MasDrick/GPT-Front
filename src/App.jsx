import { useState } from 'react';

import { Route, Routes } from 'react-router';
import Development from './pages/Develop/Development';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<h1>Это главная</h1>} />
        <Route path="/develop" element={<Development />} />
      </Routes>
    </>
  );
}

export default App;
