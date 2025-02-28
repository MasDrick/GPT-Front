import { useState, useEffect, useCallback } from 'react';
import { useTelegram } from './useTelegram';

const useTelegramViewportHack = (ref) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { tg } = useTelegram();

  // Запоминаем начальную высоту экрана при загрузке
  const [initialHeight] = useState(window.visualViewport?.height || window.innerHeight);

  const onFocusIn = useCallback(() => {
    setIsKeyboardOpen(true);
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
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
      setTimeout(() => {
        const currentHeight = window.visualViewport?.height || window.innerHeight;
        const newKeyboardHeight = initialHeight - currentHeight;

        console.log(
          `initialHeight: ${initialHeight}, currentHeight: ${currentHeight}, keyboardHeight: ${newKeyboardHeight}`,
        );

        if (newKeyboardHeight > 0) {
          setIsKeyboardOpen(true);
          setKeyboardHeight(newKeyboardHeight);
        } else {
          setIsKeyboardOpen(false);
          setKeyboardHeight(0);
        }
      }, 50); // Небольшая задержка для корректного обновления
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onViewportChange);
    }

    tg.onEvent('viewportChanged', onViewportChange);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', onViewportChange);
      }
      tg.offEvent('viewportChanged', onViewportChange);
    };
  }, []);

  // 📌 Дополнительно: Исправляем редкие проблемы на iOS (не срабатывает viewportChanged)
  useEffect(() => {
    const onTouchStart = () => {
      setTimeout(() => {
        const currentHeight = window.visualViewport?.height || window.innerHeight;
        const newKeyboardHeight = initialHeight - currentHeight;

        if (newKeyboardHeight > 0) {
          setIsKeyboardOpen(true);
          setKeyboardHeight(newKeyboardHeight);
        }
      }, 50);
    };

    window.addEventListener('touchstart', onTouchStart);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
    };
  }, []);

  return { isKeyboardOpen, keyboardHeight };
};

export default useTelegramViewportHack;
