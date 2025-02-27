import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { useTelegram } from './hooks/useTelegram';
import Home from './pages/Home/Home';
import Development from './pages/Develop/Development';
import { ConfigProvider } from 'antd';
import './App.css';

function App() {
  const { tg } = useTelegram();
  const [theme, setTheme] = useState({
    token: {
      colorPrimary: tg.themeParams?.button_color,
      colorInfo: tg.themeParams?.button_color,
      colorBgBase: tg.themeParams?.bg_color,
      colorTextBase: tg.themeParams?.text_color,
      colorLink: tg.themeParams?.link_color,
      colorPrimaryBg: tg.themeParams?.bg_color,
      colorBorder: tg.themeParams?.button_text_color,
    },
  });

  useEffect(() => {
    // Инициализация Telegram Mini App
    tg.ready();
    tg.expand();

    // Обновление темы при изменении
    tg.onEvent('themeChanged', () => {
      setTheme({ token: getTelegramColors(tg.themeParams) });
    });
  }, []);

  return (
    <ConfigProvider theme={theme}>
      <div id="app" className="app">
        {/* Основной контент с безопасными отступами */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/develop" element={<Development />} />
          </Routes>
        </div>
      </div>
    </ConfigProvider>
  );
}

// Функция для получения цветов из Telegram
const getTelegramColors = (themeParams) => ({
  colorPrimary: themeParams?.button_color,
  colorInfo: themeParams?.button_color,
  colorBgBase: themeParams?.bg_color,
  colorTextBase: themeParams?.text_color,
  colorLink: themeParams?.link_color,
  colorPrimaryBg: themeParams?.bg_color,
  colorBorder: themeParams?.button_text_color,
});

export default App;
