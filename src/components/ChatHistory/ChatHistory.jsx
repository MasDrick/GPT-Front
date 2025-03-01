import React from 'react';
import s from './ChatHistory.module.scss';

const ChatHistory = ({ chatHistory }) => {
  return (
    <div className={s.chatHistory}>
      {chatHistory.map((message, index) => (
        <div
          key={index}
          className={`${s.messageBox} ${message.type === 'user' ? s.userMessage : s.botMessage}`}>
          {message.image ? (
            <img src={message.image} alt="Изображение" className={s.messageImage} />
          ) : (
            <p>{message.text}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
