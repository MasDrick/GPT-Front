import React, { useState, useEffect } from 'react';

import LazyImage from '../LazyImage/LazyImage';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Copy, RotateCw, CircleCheck, Reply, Clipboard } from 'lucide-react';

import { copyImageToClipboard } from 'copy-image-clipboard';


import { useTelegram } from '../../hooks/useTelegram';

import s from './ChatHistory.module.scss';
import {useSelector} from "react-redux";


const ChatHistory = () => {
  const [alert, setAlert] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const { tg } = useTelegram();

  const chatHistory = useSelector(state => state.chatHistory.chatHistory);


  // Сохраняем историю в localStorage при изменении `chatHistory`
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
        await copyImageToClipboard(message.image); // Копируем изображение по URL
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
    // background: '#232e3c',
  };

  return (
    <div className={s.chatHistory}>
      {chatHistory.map((message, index) => (
        <React.Fragment key={index}>
          <div
            className={`${s.messageBox} ${message.type === 'user' ? s.userMessage : s.botMessage}`}>
            {message.image ? (
              <LazyImage src={message.image} alt="Изображение" className={s.messageImage} />
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className={s.syntaxHighlighterContainer}>
                        <Clipboard
                          size={26}
                          className={s.copyIcon}
                          onClick={() => handleCopyCode(children)}
                        />
                        <SyntaxHighlighter
                          style={tg.themeParams?.bg_color === '#ffffff' ? oneLight : oneDark}
                          language={match[1]}
                          PreTag="div"
                          customStyle={customStyle}>
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className={className}>{children}</code>
                    );
                  },
                }}>
                {message.text}
              </ReactMarkdown>
            )}
          </div>
          {message.type === 'bot' && (message.text || message.image) && (
            <div className={s.buttons}>
              <Copy className={s.btn} size={16} onClick={() => handleCopy(message)} />
              <RotateCw className={s.btn} size={16} />
              <Reply className={s.btn} size={20} />
            </div>
          )}
        </React.Fragment>
      ))}

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
