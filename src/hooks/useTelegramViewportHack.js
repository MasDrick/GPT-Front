import { useState, useEffect, useCallback } from 'react';
import { useTelegram } from './useTelegram';

const useTelegramViewportHack = (ref) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { tg } = useTelegram();

  const [initialHeight, setInitialHeight] = useState(window.innerHeight);

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
      console.log('viewportChanged fired');
      const currentHeight = window.innerHeight;
      console.log(`Initial height: ${initialHeight}, Current height: ${currentHeight}`);

      if (currentHeight < initialHeight) {
        const newKeyboardHeight = initialHeight - currentHeight;
        console.log(`Keyboard height detected: ${newKeyboardHeight}px`);
        setIsKeyboardOpen(true);
        setKeyboardHeight(newKeyboardHeight);
      } else {
        setIsKeyboardOpen(false);
        setKeyboardHeight(0);
        setInitialHeight(currentHeight); // Обновляем начальную высоту
      }
    };

    telegram.WebApp.onEvent('viewportChanged', onViewportChange);

    return () => {
      telegram.WebApp.offEvent('viewportChanged', onViewportChange);
    };
  }, [initialHeight]);

  return { isKeyboardOpen, keyboardHeight };
};

export default useTelegramViewportHack;
