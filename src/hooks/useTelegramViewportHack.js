import { useState, useEffect, useCallback } from 'react';
import { useTelegram } from './useTelegram';

// Надежное определение iOS
const isIOS = () => {
  const tgPlatform = window.Telegram?.WebApp?.platform;
  if (tgPlatform === 'ios') return true; // Проверяем Telegram API

  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Mac/i.test(navigator.platform))
  );
};

const useTelegramViewportHack = (ref) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const { tg } = useTelegram();

  if (!isIOS()) return { isKeyboardOpen: false }; // Если не iOS, хук не работает

  const onFocusIn = useCallback(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    setIsKeyboardOpen(true);
  }, []);

  const onFocusOut = useCallback(() => {
    setIsKeyboardOpen(false);
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const element = ref?.current;
    if (!element) return;

    element.addEventListener('focusin', onFocusIn);
    element.addEventListener('focusout', onFocusOut);

    return () => {
      element.removeEventListener('focusin', onFocusIn);
      element.removeEventListener('focusout', onFocusOut);
    };
  }, [ref, onFocusIn, onFocusOut]);

  useEffect(() => {
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
