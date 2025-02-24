import React from 'react';
import s from './BotMessage.module.scss';

const BotMessage = ({ text }) => {
  return (
    <div className={`${style.messageBox} ${s.botMessage}`}>
      <p>{text}</p>
    </div>
  );
};

export default BotMessage;
