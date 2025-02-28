import { useState, useEffect, useCallback } from 'react';

const useTelegramViewportHack = (ref) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

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

  return { isKeyboardOpen };
};

export default useTelegramViewportHack;
