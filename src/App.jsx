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
    <ConfigProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/develop" element={<Development />} />
      </Routes>
    </ConfigProvider>
  );
}

export default App;
