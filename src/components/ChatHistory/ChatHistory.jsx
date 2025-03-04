import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, RotateCw, CircleCheck, Reply, Clipboard } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { useTelegram } from '../../hooks/useTelegram';

import s from './ChatHistory.module.scss';

const ChatHistory = ({ chatHistory }) => {
  const [alert, setAlert] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const { tg } = useTelegram();

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
              <img src={message.image} alt="Изображение" className={s.messageImage} />
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className={s.syntaxHighlighterContainer}>
                        <Clipboard size={18} className={s.copyIcon} onClick={handleCopy} />
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
