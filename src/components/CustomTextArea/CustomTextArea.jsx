import React, { useRef, useEffect, useState } from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import { Paperclip, ArrowUp } from 'lucide-react';
import styles from './CustomTextArea.module.scss';
import { useAtom } from 'jotai';
import { chatHistoryAtom, activeModelAI } from '../../store/atoms';
import axios from 'axios';
import useTelegramViewportHack from '../../hooks/useTelegramViewportHack';

const CustomTextArea = ({ placeholder }) => {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState('');
  const containerRef = useRef(null);
  const textareaRef = useRef(null);
  const [chatHistory, setChatHistory] = useAtom(chatHistoryAtom);
  const [model] = useAtom(activeModelAI);
  const { tg, queryId, urlBack } = useTelegram();

  const { isKeyboardOpen, keyboardHeight } = useTelegramViewportHack(textareaRef);

  useEffect(() => {
    const adjustTextareaHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    adjustTextareaHeight();
  }, [message]);

  const handleSubmit = async () => {
    if (message.trim() === '') return;

    // Формируем URL с query-параметрами
    const apiUrl = `${urlBack}/generate/?prompt=${encodeURIComponent(message)}&model=${model}`;

    // Добавляем сообщение пользователя в чат
    setChatHistory((prev) => [...prev, { type: 'user', text: message }]);
    setMessage('');
    textareaRef.current.style.height = 'auto';

    try {
      // Отправляем запрос
      const response = await axios.post(apiUrl);
      const { response: botResponse, image_url: imageUrl } = response.data;

      // Добавляем ответ бота в чат
      setChatHistory((prev) => [
        ...prev,
        { type: 'bot', text: botResponse || '', image: imageUrl || '' },
      ]);
    } catch (error) {
      console.error('Ошибка при получении ответа:', error);
      setChatHistory((prev) => [
        ...prev,
        {
          type: 'bot',
          text: 'Произошла ошибка. Пожалуйста, попробуйте позже.',
        },
      ]);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        marginBottom: isKeyboardOpen ? `${keyboardHeight * 0.27}px` : '0',
      }}
      className={`${styles.custom_textarea} ${active ? styles.active : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        setActive(true);
      }}>
      <textarea
        ref={textareaRef}
        placeholder={placeholder || `Спросить у ${model}`}
        className={styles.textarea}
        value={message}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        onChange={(e) => setMessage(e.target.value)}
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
            tg.themeParams?.bg_color === '#ffffff' ? `${styles.btn} ${styles.isLight}` : styles.btn
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
