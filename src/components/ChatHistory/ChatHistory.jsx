// components/ChatHistory/ChatHistory.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CircleCheck } from 'lucide-react';
import { copyImageToClipboard } from 'copy-image-clipboard';

import ChatMessage from './ChatMessage';
import s from './ChatHistory.module.scss';

const ChatHistory = () => {
  const [alert, setAlert] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const chatHistory = useSelector((state) => state.chatHistory.chatHistory);
  const loading = useSelector((state) => state.chatHistory.loading);
  const activeModel = useSelector((state) => state.activeModel.currentModel);

  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => setIsVisible(true), 10);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setAlert(null), 300);
    }, 2000);
  };

  const handleCopy = async (message) => {
    try {
      if (message.image) {
        await copyImageToClipboard(message.image);
        showAlert('Изображение скопировано!');
      } else if (message.text) {
        await navigator.clipboard.writeText(message.text);
        showAlert('Текст скопирован!');
      }
    } catch (error) {
      console.error('Ошибка копирования:', error);
      showAlert('Ошибка копирования');
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    showAlert('Код скопирован!');
  };

  const customStyle = {
    fontSize: '14px',
    borderRadius: '8px',
    padding: '10px',
  };

  // ✅ Мемоизация списка сообщений
  const renderedMessages = useMemo(() => {
    return chatHistory.map((message, index) => (
      <ChatMessage
        key={index}
        message={message}
        handleCopy={handleCopy}
        handleCopyCode={handleCopyCode}
        customStyle={customStyle}
      />
    ));
  }, [chatHistory]);

  return (
    <div className={s.chatHistory}>
      {renderedMessages}
      {loading && (
        <div className={`${s.messageBox} ${s.botMessage}`}>
          <div className={s.typingIndicator}>
            {activeModel} печатает
            <span className={s.dots}>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </div>
        </div>
      )}

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
