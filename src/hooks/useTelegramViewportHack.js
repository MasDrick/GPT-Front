import { useEffect, useState } from 'react';

const useTelegramViewportHack = (ref) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    let initialHeight = window.visualViewport?.height || window.innerHeight;

    const onResize = () => {
      const newHeight = window.visualViewport?.height || window.innerHeight;
      const heightDiff = initialHeight - newHeight;

      if (heightDiff > 20) {
        setKeyboardHeight(heightDiff);
      } else {
        setKeyboardHeight(0);
        initialHeight = newHeight; // Обновляем базовую высоту при закрытии клавиатуры
      }
    };

    window.visualViewport?.addEventListener('resize', onResize);
    return () => window.visualViewport?.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!ref?.current) return; // Проверяем, что ref существует

    ref.current.style.paddingBottom = keyboardHeight > 0 ? `${keyboardHeight}px` : '0px';
  }, [keyboardHeight]);
};

export default useTelegramViewportHack;
