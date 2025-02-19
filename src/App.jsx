import { useEffect } from 'react';

import { Route, Routes } from 'react-router';

import Home from './pages/Home/Home';
import Development from './pages/Develop/Development';

import './App.css';

const tg = window.Telegram.WebApp;

function App() {
  useEffect(() => {
    tg.ready();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/develop" element={<Development />} />
      </Routes>
    </>
  );
}

export default App;
