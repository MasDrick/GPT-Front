import { useEffect, useState } from 'react';

const useTelegramViewportHack = (ref) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const initialHeight = window.innerHeight;

    const onResize = () => {
      const newHeight = window.innerHeight;
      const heightDiff = initialHeight - newHeight;

      if (heightDiff > 20) {
        setKeyboardHeight(heightDiff);
      } else {
        setKeyboardHeight(0);
      }
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.paddingBottom = keyboardHeight > 0 ? `${keyboardHeight}px` : '0px';
    }
  }, [keyboardHeight, ref]);
};

export default useTelegramViewportHack;
