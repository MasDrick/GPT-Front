import { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { useTelegram } from './hooks/useTelegram';
import useTelegramTheme from './hooks/useTelegramTheme';
import Home from './pages/Home/Home';
import Development from './pages/Develop/Development';

import { useWindowSize } from './hooks/useWindowSize.js';

import './App.css';

function App() {
  useTelegramTheme(); // Применяем тему Telegram
  useWindowSize();
  const { tg } = useTelegram();

  useEffect(() => {
    tg.ready();
    tg.expand();
  }, []);

  useEffect(() => {
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Update on load and resize
    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/develop" element={<Development />} />
    </Routes>
  );
}

export default App;
