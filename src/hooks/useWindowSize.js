import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {setOpenDrawer} from '../slices/headerSlice.js'; // Убедитесь, что путь правильный

export const useWindowSize = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1200) {
        dispatch(setOpenDrawer(false));
      } else {
        dispatch(setOpenDrawer(true));
      }
    };

    // Устанавливаем начальное состояние
    handleResize();

    // Добавляем обработчик события изменения размера окна
    window.addEventListener('resize', handleResize);

    // Убираем обработчик при размонтировании компонента
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch]);

};


