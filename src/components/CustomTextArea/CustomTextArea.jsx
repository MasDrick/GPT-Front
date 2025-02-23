import React, { useRef, useEffect, useState } from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import { Paperclip, ArrowUp } from 'lucide-react';
import styles from './CustomTextArea.module.scss';

import { useAtom } from 'jotai';
import { answerBot, messageUser } from '../../store/atoms';
import axios from 'axios';

const CustomTextArea = ({ placeholder }) => {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState('');

  const containerRef = useRef(null);
  const textareaRef = useRef(null);

  const [, setMessageAtom] = useAtom(messageUser);
  const [, setAnswer] = useAtom(answerBot);

  const { tg, queryId } = useTelegram();

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

  // Функция для отправки сообщения
  const handleSubmit = () => {
    if (message.trim() !== '') {
      console.log('Отправлено сообщение:', message); // Выводим сообщение в консоль
      fetchData();
      setMessageAtom(message);
      // Очищаем значение textarea
      setMessage('');
      textareaRef.current.focus();

      // Сбрасываем высоту textarea после очистки
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
      }
    }
  };

  const fetchData = () => {
    axios
      .post(`http://127.0.0.1:8000/generate_text/?prompt=${message}&user_id=${queryId}`)
      .then((r) => {
        setAnswer(r.data.response);
      });
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
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            // Проверяем, была ли нажата клавиша Enter без Shift
            e.preventDefault(); // Предотвращаем перенос строки
            handleSubmit(); // Вызываем функцию отправки сообщения
          }
        }}
      />
      <div className={styles.buttons}>
        <button
          className={
            tg.themeParams.bg_color === '#ffffff' ? `${styles.btn} ${styles.isLight}` : styles.btn
          }>
          <Paperclip
            color={'#ffffff'} // Изменяем цвет иконки в зависимости от темы
            size={18}
          />
        </button>
        <button
          className={`${message === '' ? styles.btn : `${styles.btn} ${styles.activeBtn}`} ${
            tg.themeParams?.bg_color === '#ffffff' ? styles.isLight : ''
          }`}
          onClick={handleSubmit}>
          {/* Кнопка отправки вызывает handleSubmit */}
          <ArrowUp
            color={'#ffffff'} // Изменяем цвет иконки в зависимости от темы
            size={18}
          />
        </button>
      </div>
    </div>
  );
};

export default CustomTextArea;
