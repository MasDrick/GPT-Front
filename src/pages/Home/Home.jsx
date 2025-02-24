import { useState, useEffect } from 'react';

import { useTelegram } from '../../hooks/useTelegram';

import Header from '../../components/Header/Header';
import ChatHistory from '../../components/ChatHistory/ChatHistory';
import CustomTextArea from '../../components/CustomTextArea/CustomTextArea';

import { useAtom } from 'jotai';
import { chatHistoryAtom } from '../../store/atoms';

import s from './home.module.scss';

const Home = () => {
  const { onClose, user } = useTelegram();

  const [chatHistory, setChatHistory] = useAtom(chatHistoryAtom);

  return (
    <div className={s.container}>
      <div className={s.header}>
        <Header />
      </div>

      <div className={s.chatHistory}>
        {chatHistory !== '' ? (
          <ChatHistory chatHistory={chatHistory} />
        ) : (
          <h1>
            Привет, <span className={s.user}>{user?.first_name}</span> <br /> Чем я могу помочь?
          </h1>
        )}
      </div>

      <div className={s.customTextarea}>
        <CustomTextArea />
      </div>
    </div>
  );
};

export default Home;
