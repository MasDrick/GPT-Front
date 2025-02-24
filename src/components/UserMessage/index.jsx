import React from 'react';
import s from './UserMessage.module.scss';

const UserMessage = ({ text }) => {
  return (
    <div className={`${style.messageBox} ${s.userMessage}`}>
      <p>{text}</p>
    </div>
  );
};

export default UserMessage;
