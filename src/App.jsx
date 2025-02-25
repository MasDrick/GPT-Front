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
      colorPrimary: tg.themeParams?.button_color, // Заглушка
      colorWarning: tg.themeParams?.destructive_text_color,
      colorText: tg.themeParams?.text_color,
      colorBgContainer: tg.themeParams?.secondary_bg_color,
    },
  });

  useEffect(() => {
    // Получаем цвета из Telegram

    // Обновляем цвета при изменении темы
    tg.onEvent('themeChanged', () => {
      setTheme({ token: getTelegramColors() });
    });
    console.log(theme.token);
    console.log(window.Telegram.WebApp.themeParams);
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
