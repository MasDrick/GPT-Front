import { useEffect } from 'react';

import { Route, Routes } from 'react-router';
import { useTelegram } from './hooks/useTelegram';

import Home from './pages/Home/Home';
import Development from './pages/Develop/Development';

import './App.css';

const tg = window.Telegram.WebApp;

function App() {
  const { tg } = useTelegram();

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
