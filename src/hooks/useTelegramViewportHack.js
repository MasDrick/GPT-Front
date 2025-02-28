import { useEffect, useState } from 'react';

const useTelegramViewportHack = (ref) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const initialHeight = window.innerHeight; // Запоминаем высоту экрана без клавиатуры

    const onResize = () => {
      const newHeight = window.innerHeight;
      const heightDiff = initialHeight - newHeight; // Вычисляем разницу
      if (heightDiff > 100) {
        setKeyboardHeight(heightDiff); // Если разница значительная, клавиатура открыта
      } else {
        setKeyboardHeight(0); // Клавиатура закрыта
      }
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (ref.current) {
      if (keyboardHeight > 0) {
        ref.current.classList.add('keyboard_open');
        ref.current.style.paddingBottom = `${keyboardHeight}px`;
      } else {
        ref.current.classList.remove('keyboard_open');
        ref.current.style.paddingBottom = '0px';
      }
    }
  }, [keyboardHeight, ref]);
};

export default useTelegramViewportHack;
