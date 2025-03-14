import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, RotateCw, ArrowDownToLine, Clipboard } from 'lucide-react';
import LazyImage from '../LazyImage/LazyImage';

import s from './ChatHistory.module.scss';
import { useTelegram } from '../../hooks/useTelegram';
import { useDispatch, useSelector } from 'react-redux';

import { addMessage } from '../../slices/chatHistorySlice';
import { sendMessageThunk } from '../../slices/chatThunk';
import { repeatMessageThunk } from '../../slices/repeatThunk';

const ChatMessage = React.memo(({ message, handleCopy, handleCopyCode, customStyle }) => {
  const { tg } = useTelegram();
  const dispatch = useDispatch();

  const transformedText = message.text?.replace(/<think>([\s\S]*?)<\/think>/g, (_, content) =>
    content
      .trim()
      .split('\n')
      .map((line) => `> ${line.trim()}`)
      .join('\n'),
  );

  const handleRepeat = (message) => {
    // console.log(message.apiUrl, message.userPrompt, message.activeBrain);
    dispatch(
      repeatMessageThunk({
        apiUrl: message.apiUrl,
        userPrompt: message.userPrompt,
        activeBrain: message.activeBrain,
      }),
    );
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
          <ArrowDownToLine className={s.btn} size={16} title="Ответить" />
        </div>
      )}
    </>
  );
});

export default ChatMessage;
