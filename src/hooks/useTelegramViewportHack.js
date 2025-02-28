import { useState, useEffect, useCallback } from 'react';
import { useTelegram } from './useTelegram';

const useTelegramViewportHack = (ref) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { tg } = useTelegram();

  // Запоминаем начальную высоту экрана при загрузке
  const [initialHeight] = useState(window.visualViewport?.height || window.innerHeight);

  const onFocusIn = useCallback(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    setTimeout(() => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const newKeyboardHeight = initialHeight - currentHeight;

      console.log(
        `FOCUS IN -> initialHeight: ${initialHeight}, currentHeight: ${currentHeight}, keyboardHeight: ${newKeyboardHeight}`,
      );

      if (newKeyboardHeight > 0) {
        setIsKeyboardOpen(true);
        setKeyboardHeight(newKeyboardHeight);
      }
    }, 100); // Небольшая задержка для корректного обновления
  }, [initialHeight]);

  const onFocusOut = useCallback(() => {
    setIsKeyboardOpen(false);
    setKeyboardHeight(0);
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
          `VIEWPORT CHANGED -> initialHeight: ${initialHeight}, currentHeight: ${currentHeight}, keyboardHeight: ${newKeyboardHeight}`,
        );

        if (newKeyboardHeight > 0) {
          setIsKeyboardOpen(true);
          setKeyboardHeight(newKeyboardHeight);
        } else {
          setIsKeyboardOpen(false);
          setKeyboardHeight(0);
        }
      }, 50);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onViewportChange, { passive: true });
      window.visualViewport.addEventListener('scroll', onViewportChange, { passive: true });
    }

    tg.onEvent('viewportChanged', onViewportChange);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', onViewportChange);
        window.visualViewport.removeEventListener('scroll', onViewportChange);
      }
      tg.offEvent('viewportChanged', onViewportChange);
    };
  }, [initialHeight]);

  return { isKeyboardOpen, keyboardHeight };
};

export default useTelegramViewportHack;
