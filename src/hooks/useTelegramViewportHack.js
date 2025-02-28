import { useState, useEffect, useCallback } from 'react';
import { useTelegram } from './useTelegram';

// Функция для проверки, что Mini App запущен на iOS
const isTMAiOS = () => {
  const tg = window.Telegram?.WebApp;
  return tg?.platform === 'ios';
};

const useTelegramViewportHack = (ref) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const { tg } = useTelegram();

  useEffect(() => {
    if (!isTMAiOS()) return; // Если не iOS, ничего не делаем

    const onFocusIn = () => {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      setIsKeyboardOpen(true);
    };

    const onFocusOut = () => {
      setIsKeyboardOpen(false);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      window.scrollTo(0, 0);
    };

    const element = ref?.current;
    if (element) {
      element.addEventListener('focusin', onFocusIn);
      element.addEventListener('focusout', onFocusOut);
    }

    return () => {
      if (element) {
        element.removeEventListener('focusin', onFocusIn);
        element.removeEventListener('focusout', onFocusOut);
      }
    };
  }, [ref]);

  useEffect(() => {
    if (!isTMAiOS()) return;

    const onViewportChange = () => {
      setIsKeyboardOpen(
        document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA',
      );
    };

    tg.onEvent('viewportChanged', onViewportChange);

    return () => {
      tg.offEvent('viewportChanged', onViewportChange);
    };
  }, []);

  return { isKeyboardOpen };
};

export default useTelegramViewportHack;
