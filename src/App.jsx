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
      colorPrimary: '#2196f3', // Заглушка
      colorSuccess: '#52c41a',
      colorError: '#ff4d4f',
      colorWarning: '#faad14',
      colorText: '#000000',
      colorBgContainer: tg.themeParams?.secondary_bg_color,
    },
  });

  useEffect(() => {
    // Получаем цвета из Telegram
    const tg = window.Telegram.WebApp;

    // Получаем цвета из tg.themeParams
    const getTelegramColors = () => ({
      colorPrimary: tg.themeParams?.accent_text_color, // Акцентный текст
      colorSuccess: tg.themeParams?.section_header_text_color, // Успешное действие
      colorError: tg.themeParams?.destructive_text_color, // Ошибка
      colorWarning: tg.themeParams?.link_color, // Предупреждение (используем цвет ссылки)
      colorText: tg.themeParams?.text_color, // Основной текст
      colorBgContainer: tg.themeParams?.secondary_bg_color, // Фон контейнера
    });

    // Применяем цвета при загрузке
    setTheme({ token: getTelegramColors() });

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
