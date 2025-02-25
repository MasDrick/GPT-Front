import { useState, useEffect } from 'react';

import { Route, Routes } from 'react-router';
import { useTelegram } from './hooks/useTelegram';

import Home from './pages/Home/Home';
import Development from './pages/Develop/Development';

import { ConfigProvider } from 'antd';
import './App.css';

const tg = window.Telegram.WebApp;

function App() {
  const { tg } = useTelegram();

  useEffect(() => {
    tg.ready();
  }, []);

  const [theme, setTheme] = useState({
    token: {
      colorPrimary: '#2196f3',
      colorSuccess: '#52c41a',
      colorError: '#ff4d4f',
      colorWarning: '#faad14',
      colorText: '#000000',
      colorBgContainer: '#ffffff',
    },
  });

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      const isValidColor = (color) => /^#([A-Fa-f0-9]{6})$/.test(color);

      const getTelegramColors = () => ({
        colorPrimary: isValidColor(tg.themeParams?.accent_text_color)
          ? tg.themeParams?.accent_text_color
          : '#2196f3',
        colorSuccess: isValidColor(tg.themeParams?.section_header_text_color)
          ? tg.themeParams?.section_header_text_color
          : '#52c41a',
        colorError: isValidColor(tg.themeParams?.destructive_text_color)
          ? tg.themeParams?.destructive_text_color
          : '#ff4d4f',
        colorWarning: isValidColor(tg.themeParams?.link_color)
          ? tg.themeParams?.link_color
          : '#faad14',
        colorText: isValidColor(tg.themeParams?.text_color)
          ? tg.themeParams?.text_color
          : '#000000',
        colorBgContainer: isValidColor(tg.themeParams?.secondary_bg_color)
          ? tg.themeParams?.secondary_bg_color
          : '#ffffff',
      });

      const updateTheme = () => {
        setTheme({ token: getTelegramColors() });
      };

      // Применяем тему при загрузке
      updateTheme();

      // Обновляем тему при изменении
      tg.onEvent('themeChanged', updateTheme);

      // Очистка подписки при размонтировании
      return () => {
        tg.offEvent('themeChanged', updateTheme);
      };
    }
  }, []);

  return (
    <>
      <ConfigProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/develop" element={<Development />} />
        </Routes>
      </ConfigProvider>
    </>
  );
}

export default App;
