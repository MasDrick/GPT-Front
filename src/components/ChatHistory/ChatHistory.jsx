import React, { useState } from 'react';
import { Copy, RotateCw, CircleCheck, Reply } from 'lucide-react';

import s from './ChatHistory.module.scss';

const ChatHistory = ({ chatHistory }) => {
  const [alert, setAlert] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const showAlert = (message) => {
    setAlert(message); // Добавляем элемент в DOM
    setTimeout(() => setIsVisible(true), 10); // Даем время на рендер перед анимацией

    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setAlert(null), 300); // Удаляем из DOM после анимации
    }, 2000);
  };

  const handleReply = (message) => {
    if (window.Telegram && window.Telegram.WebApp) {
      const data = JSON.stringify({ text: message.text, image: message.image });
      window.Telegram.WebApp.sendData(data);
      showAlert('Сообщение отправлено!');
    } else {
      showAlert('Ошибка: Telegram API не доступен');
    }
  };

  const handleCopy = async (message) => {
    try {
      if (message.image) {
        const response = await fetch(message.image);
        const blob = await response.blob();

        const imageBitmap = await createImageBitmap(blob);
        const canvas = document.createElement('canvas');
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imageBitmap, 0, 0);

        canvas.toBlob(async (pngBlob) => {
          try {
            const item = new ClipboardItem({ 'image/png': pngBlob });
            await navigator.clipboard.write([item]);
            showAlert('Изображение скопировано!');
          } catch (copyError) {
            console.error('Ошибка копирования:', copyError);
            showAlert('Ошибка копирования изображения');
          }
        }, 'image/png');
      } else if (message.text) {
        await navigator.clipboard.writeText(message.text);
        showAlert('Текст скопирован!');
      }
    } catch (error) {
      console.error('Ошибка копирования:', error);
      showAlert('Ошибка копирования');
    }
  };

  return (
    <div className={s.chatHistory}>
      {chatHistory.map((message, index) => (
        <React.Fragment key={index}>
          <div
            className={`${s.messageBox} ${message.type === 'user' ? s.userMessage : s.botMessage}`}>
            {message.image ? (
              <img src={message.image} alt="Изображение" className={s.messageImage} />
            ) : (
              <p>{message.text}</p>
            )}
          </div>
          {message.type === 'bot' && (message.text || message.image) && (
            <div className={s.buttons}>
              <Copy className={s.btn} size={16} onClick={() => handleCopy(message)} />
              <RotateCw className={s.btn} size={16} />
              <Reply className={s.btn} size={20} onClick={() => handleReply(message)} />
            </div>
          )}
        </React.Fragment>
      ))}

      {/* Уведомление без Framer Motion */}
      {alert !== null && (
        <div className={`${s.alert} ${isVisible ? s.visible : ''}`}>
          <CircleCheck size={20} className={s.icon} />
          {alert}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
