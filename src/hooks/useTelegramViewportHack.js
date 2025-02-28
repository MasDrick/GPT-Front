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
    let initialHeight = window.visualViewport?.height || window.innerHeight;

    const onViewportChange = () => {
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

  return { isKeyboardOpen, keyboardHeight };
};

export default useTelegramViewportHack;
