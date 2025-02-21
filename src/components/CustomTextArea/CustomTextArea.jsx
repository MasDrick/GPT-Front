import React, { useRef, useEffect, useState } from 'react';
import { Paperclip, ArrowUp } from 'lucide-react';
import styles from './CustomTextArea.module.scss';

const CustomTextArea = ({ placeholder, value, onChange }) => {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState(''); // Новое состояние для управления значением textarea
  const [isDarkTheme, setIsDarkTheme] = useState(
    Telegram.WebApp.themeParams?.dark_theme === 'true',
  ); // Состояние для темной темы

  const containerRef = useRef(null);
  const textareaRef = useRef(null);

  // Функция для автоматического изменения высоты textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const lineHeight = 20; // Высота строки
      const maxLines = 9; // Максимальное количество строк
      const maxHeight = lineHeight * maxLines;
      if (textarea.scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
      } else {
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }
  };

  // Отслеживание кликов вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActive(false); // Снимаем активное состояние, если клик был вне компонента
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Обработчик изменения темы
  useEffect(() => {
    const handleThemeChange = () => {
      setIsDarkTheme(Telegram.WebApp.themeParams?.dark_theme === 'true');
    };

    // Подписываемся на событие изменения темы
    Telegram.WebApp.onEvent('themeChanged', handleThemeChange);

    // Инициализация темы при монтировании компонента
    handleThemeChange();

    return () => {
      // Отписываемся от события при размонтировании компонента
      Telegram.WebApp.offEvent('themeChanged', handleThemeChange);
    };
  }, []);

  // Функция для отправки сообщения
  const handleSubmit = () => {
    if (message.trim() !== '') {
      console.log('Отправлено сообщение:', message); // Выводим сообщение в консоль
      setMessage(''); // Очищаем значение textarea
      textareaRef.current.focus();
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      const lineHeight = 20; // Высота строки
      const maxLines = 9; // Максимальное количество строк
      const maxHeight = lineHeight * maxLines; // Сбрасываем высоту textarea после очистки
    }
  };

  return (
    <div
      ref={containerRef}
      className={active ? `${styles.custom_textarea} ${styles.active}` : styles.custom_textarea}
      onClick={(e) => {
        e.stopPropagation(); // Предотвращаем распространение события наверх
        setActive(true); // Активируем состояние при клике на контейнер
      }}>
      <textarea
        ref={textareaRef}
        placeholder={placeholder || 'Спросить у InsuGPT'}
        className={styles.textarea}
        value={message} // Используем локальное состояние для управления значением
        onFocus={() => setActive(true)} // Активируем состояние при фокусе на textarea
        onBlur={() => setActive(false)} // Деактивируем состояние при потере фокуса
        onChange={(e) => {
          setMessage(e.target.value); // Обновляем локальное состояние при вводе текста
          adjustTextareaHeight(); // Вызываем функцию при изменении текста
        }}
      />
      <div className={styles.buttons}>
        <button className={isDarkTheme ? `${styles.btn}` : `${styles.btn} ${styles.isLight}`}>
          <Paperclip
            color={isDarkTheme ? '#ffffff' : '#000000'} // Изменяем цвет иконки в зависимости от темы
            size={18}
          />
        </button>
        <button
          className={message === '' ? styles.btn : `${styles.btn} ${styles.activeBtn}`}
          onClick={handleSubmit}>
          {/* Кнопка отправки вызывает handleSubmit */}
          <ArrowUp
            color={isDarkTheme ? '#ffffff' : '#000000'} // Изменяем цвет иконки в зависимости от темы
            size={18}
          />
        </button>
      </div>
    </div>
  );
};

export default CustomTextArea;
