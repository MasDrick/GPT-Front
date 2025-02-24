import React from 'react';

import s from './ChatHistory.module.scss';

const ChatHistory = ({ chatHistory }) => {
  return (
    <div className={s.chatHistory}>
      {chatHistory.map((message, index) => (
        <div
          key={index}
          className={`${s.messageBox} ${message.type === 'user' ? s.userMessage : s.botMessage}`}>
          <p>{message.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
