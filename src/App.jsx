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

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    tg.ready();
    tg.expand();

    const handleResize = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      let isKeyboardVisible = false;

      if (isIOS && window.visualViewport) {
        isKeyboardVisible = window.visualViewport.height < window.innerHeight;
      } else {
        isKeyboardVisible = window.innerHeight < screen.height;
      }

      setIsKeyboardOpen(isKeyboardVisible);

      if (isKeyboardVisible) {
        document.body.classList.add('keyboard-open');
      } else {
        document.body.classList.remove('keyboard-open');
      }
    };

    const handleFocus = (event) => {
      if (isKeyboardOpen) {
        setTimeout(() => {
          event.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('focusin', handleFocus); // Работает при фокусе на инпуте
    document.addEventListener('focusout', handleResize); // При скрытии клавиатуры

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleResize);
    };
  }, [isKeyboardOpen]);

  return (
    <ConfigProvider theme={theme}>
      <div id="app" className={`app ${isKeyboardOpen ? 'keyboard-open' : ''}`}>
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

export default App;
