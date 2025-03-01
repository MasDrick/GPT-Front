import { useState, useEffect, useCallback } from 'react';
import { useTelegram } from './useTelegram';

// Функция для проверки, что Mini App запущен на iOS
const isTMAiOS = () => {
  const tg = window.Telegram?.WebApp;
  const isIosTg = tg?.platform === 'ios';

  console.log('[useTelegramViewportHack] Определение платформы:');
  console.log(`  - tg.platform: ${tg?.platform}`);
  console.log(`  - navigator.userAgent: ${navigator.userAgent}`);
  console.log(`  - navigator.platform: ${navigator.platform}`);
  console.log(`  - Результат: ${isIosTg ? 'iOS (TMA)' : 'Не iOS'}`);

  return isIosTg;
};

const useTelegramViewportHack = (ref) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { tg } = useTelegram();

  useEffect(() => {
    if (!isTMAiOS()) return;

    const onFocusIn = () => {
      console.log('[useTelegramViewportHack] Фокус в поле ввода (keyboard open)');
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';

      // Вычисляем высоту клавиатуры
      if (tg.viewportStableHeight) {
        const height = window.innerHeight - tg.viewportStableHeight;
        setKeyboardHeight(height);
        console.log(`[useTelegramViewportHack] Высота клавиатуры: ${height}px`);
      }

      setIsKeyboardOpen(true);
    };

    const onFocusOut = () => {
      console.log('[useTelegramViewportHack] Потеря фокуса (keyboard close)');
      setIsKeyboardOpen(false);
      setKeyboardHeight(0);

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
      console.log('[useTelegramViewportHack] viewportChanged event');

      if (tg.viewportStableHeight) {
        const height = window.innerHeight - tg.viewportStableHeight;
        setKeyboardHeight(height);
        console.log(`[useTelegramViewportHack] Новая высота клавиатуры: ${height}px`);
      }

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

  return { isKeyboardOpen, keyboardHeight };
};

export default useTelegramViewportHack;
