import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, RotateCw, Reply, Clipboard } from 'lucide-react';
import LazyImage from '../LazyImage/LazyImage';

import s from './ChatHistory.module.scss';
import { useTelegram } from '../../hooks/useTelegram';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessageThunk } from '../../slices/chatThunk';
// import { urlBack } from '../../hooks/useTelegram';

const ChatMessage = React.memo(({ message, handleCopy, handleCopyCode, customStyle }) => {
  const { tg } = useTelegram();
  const dispatch = useDispatch();
  const lastUserMessage = useSelector((state) => state.chatHistory.lastUserMessage);
  const model = useSelector((state) => state.activeModel.currentModel);
  const activeBrain = useSelector((state) => state.chatHistory.brain);
  const urlBack = 'https://fastapi-production-c93c.up.railway.app';

  const transformedText = message.text?.replace(/<think>([\s\S]*?)<\/think>/g, (_, content) =>
    content
      .trim()
      .split('\n')
      .map((line) => `> ${line.trim()}`)
      .join('\n'),
  );

  const handleRepeat = () => {
    if (lastUserMessage && lastUserMessage.trim()) {
      dispatch(
        sendMessageThunk({
          message: lastUserMessage,
          model,
          activeBrain,
          urlBack,
        }),
      );
    }
  };

  return (
    <>
      <div className={`${s.messageBox} ${message.type === 'user' ? s.userMessage : s.botMessage}`}>
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
          <RotateCw className={s.btn} size={16} onClick={handleRepeat} title="Повторить запрос" />
          <Reply className={s.btn} size={20} title="Ответить" />
        </div>
      )}
    </>
  );
});

export default ChatMessage;
