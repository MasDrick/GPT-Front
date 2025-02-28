import React, { useRef, useEffect, useState } from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import { Paperclip, ArrowUp } from 'lucide-react';
import styles from './CustomTextArea.module.scss';
import { useAtom } from 'jotai';
import { chatHistoryAtom } from '../../store/atoms';
import axios from 'axios';
import useTelegramViewportHack from '../../hooks/useTelegramViewportHack';

const CustomTextArea = ({ placeholder }) => {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState('');
  const containerRef = useRef(null);
  const textareaRef = useRef(null);
  const [chatHistory, setChatHistory] = useAtom(chatHistoryAtom);
  const { tg, queryId, urlBack } = useTelegram();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Хук для исправления поведения клавиатуры в iOS Telegram
  useTelegramViewportHack(containerRef);

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

  // Обработчики для детектирования клавиатуры
  useEffect(() => {
    const handleFocus = () => setIsKeyboardOpen(true);
    const handleBlur = () => setIsKeyboardOpen(false);

    textareaRef.current?.addEventListener('focus', handleFocus);
    textareaRef.current?.addEventListener('blur', handleBlur);

    return () => {
      textareaRef.current?.removeEventListener('focus', handleFocus);
      textareaRef.current?.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Функция для отправки сообщения
  const handleSubmit = () => {
    if (message.trim() !== '') {
      setChatHistory((prev) => [...prev, { type: 'user', text: message }]);
      setMessage('');
      const textarea = textareaRef.current;
      if (textarea) textarea.style.height = 'auto';

      axios
        .post(`${urlBack}/generate_text/?prompt=${message}&user_id=${queryId}`)
        .then((response) => {
          const botResponse = response.data.response;
          setChatHistory((prev) => [...prev, { type: 'bot', text: botResponse }]);
        })
        .catch((error) => {
          console.error('Ошибка при получении ответа:', error);
          setChatHistory((prev) => [
            ...prev,
            { type: 'bot', text: 'Произошла ошибка. Пожалуйста, попробуйте позже.' },
          ]);
        });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.custom_textarea} ${active ? styles.active : ''} ${
        isKeyboardOpen ? styles.keyboard_open : ''
      }`}
      onClick={(e) => {
        e.stopPropagation();
        setActive(true);
      }}>
      <textarea
        ref={textareaRef}
        placeholder={'Спросить у InsuGPT'}
        className={styles.textarea}
        value={message}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        onChange={(e) => {
          setMessage(e.target.value);
          adjustTextareaHeight();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <div className={styles.buttons}>
        <button
          className={
            tg.themeParams.bg_color === '#ffffff' ? `${styles.btn} ${styles.isLight}` : styles.btn
          }>
          <Paperclip color={'#ffffff'} size={18} />
        </button>
        <button
          className={`${message === '' ? styles.btn : `${styles.btn} ${styles.activeBtn}`} ${
            tg.themeParams?.bg_color === '#ffffff' ? styles.isLight : ''
          }`}
          onClick={handleSubmit}>
          <ArrowUp color={'#ffffff'} size={18} />
        </button>
      </div>
    </div>
  );
};

export default CustomTextArea;
