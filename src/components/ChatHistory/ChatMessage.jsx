import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, RotateCw, ArrowDownToLine, Clipboard } from 'lucide-react';
import LazyImage from '../LazyImage/LazyImage';

import s from './ChatHistory.module.scss';
import { useTelegram } from '../../hooks/useTelegram';
import { useDispatch } from 'react-redux';
import { repeatMessageThunk } from '../../slices/chatThunk';

const ChatMessage = React.memo(({ message, handleCopy, handleCopyCode, customStyle }) => {
  const { tg } = useTelegram();
  const dispatch = useDispatch();

  // Преобразование <think> в цитаты Markdown
  const transformedText = message.text?.replace(/<think>([\s\S]*?)<\/think>/g, (_, content) =>
    content
      .trim()
      .split('\n')
      .map((line) => `> ${line.trim()}`)
      .join('\n'),
  );

  const handleRepeat = (message) => {
    dispatch(
      repeatMessageThunk({
        apiUrl: message.apiUrl,
        userPrompt: message.userPrompt,
        activeBrain: message.activeBrain,
      }),
    );
  };

  // ✅ Функция для скачивания изображения
  const handleDownloadImage = async (url, filename = 'image.jpg') => {
    try {
      const response = await fetch(url, { mode: 'cors' });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Ошибка при скачивании изображения:', error);
    }
  };

  return (
    <>
      <div className={`${s.messageBox} ${message.type === 'user' ? s.userMessage : s.botMessage}`}>
        {message.image ? (
          <LazyImage
            src={message.image}
            alt="Изображение"
            className={s.messageImage}
            prompt={s.usedPrompt}
            usedPrompt={message.used_prompt}
          />
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
              blockquote({ node, children }) {
                const [isExpanded, setIsExpanded] = useState(false);

                const handleClick = () => setIsExpanded(true);

                return (
                  <blockquote
                    className={`${s.blockquote} ${isExpanded ? s.expanded : ''}`}
                    onClick={handleClick}>
                    {children}
                  </blockquote>
                );
              },
            }}>
            {transformedText}
          </ReactMarkdown>
        )}
      </div>

      {message.type === 'bot' && (message.text || message.image) && (
        <div className={s.buttons}>
          <Copy
            className={s.btn}
            size={16}
            onClick={() => handleCopy(message)}
            title="Скопировать"
          />

          <RotateCw
            className={s.btn}
            size={16}
            onClick={() => handleRepeat(message)}
            title="Повторить запрос"
          />
          {message.image && (
            <ArrowDownToLine
              className={s.btn}
              size={16}
              title="Скачать"
              onClick={() => handleDownloadImage(message.image, `image-${Date.now()}.jpg`)}
            />
          )}
        </div>
      )}
    </>
  );
});

export default ChatMessage;
