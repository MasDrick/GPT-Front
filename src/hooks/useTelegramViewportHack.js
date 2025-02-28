import { useState, useEffect, useCallback } from 'react';
import { useTelegram } from './useTelegram';

const useTelegramViewportHack = (ref) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { tg } = useTelegram();
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
    window.scrollTo(0, 0); // Исправляет смещение контента
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
    let initialHeight = window.innerHeight;

    const onViewportChange = () => {
      const currentHeight = window.innerHeight;
      const newKeyboardHeight = initialHeight - currentHeight;

      if (newKeyboardHeight > 0) {
        setIsKeyboardOpen(true);
        setKeyboardHeight(newKeyboardHeight);
      } else {
        setIsKeyboardOpen(false);
        setKeyboardHeight(0);
      }
    };

    tg.onEvent('viewportChanged', onViewportChange);

    return () => {
      tg.offEvent('viewportChanged', onViewportChange);
    };
  }, []);

  return { isKeyboardOpen, keyboardHeight };
};

export default useTelegramViewportHack;
