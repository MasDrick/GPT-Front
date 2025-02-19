import React, { useRef, useEffect, useState } from 'react';
import { Paperclip, ArrowUp } from 'lucide-react';
import styles from './CustomTextArea.module.scss';

const CustomTextArea = ({ placeholder, value, onChange }) => {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState(''); // Новое состояние для управления значением textarea
  const [isLightTheme, setIsLightTheme] = useState(false); // Состояние для темы

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
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
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

  // Определение темы при монтировании компонента
  useEffect(() => {
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
      const isDark = Telegram.WebApp.isDark; // Используем параметр isDark
      setIsLightTheme(!isDark); // Если тема темная, устанавливаем false
    }
  }, []);

  // Функция для отправки сообщения
  const handleSubmit = () => {
    if (message.trim() !== '') {
      console.log('Отправлено сообщение:', message); // Выводим сообщение в консоль
      setMessage(''); // Очищаем значение textarea
      textareaRef.current.focus();
      adjustTextareaHeight(); // Сбрасываем высоту после очистки
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
        <button className={`${styles.btn} ${isLightTheme ? styles.lightThemeBtn : ''}`}>
          <Paperclip color="#fff" size={18} />
        </button>
        <button
          className={
            message === ''
              ? styles.btn
              : `${styles.btn} ${styles.activeBtn} ${isLightTheme ? styles.lightThemeBtn : ''}`
          }
          onClick={handleSubmit}>
          {/* Кнопка отправки вызывает handleSubmit */}
          <ArrowUp color="#fff" size={18} />
        </button>
      </div>
    </div>
  );
};

export default CustomTextArea;
