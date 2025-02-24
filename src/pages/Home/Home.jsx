import { useState, useEffect } from 'react';

import { useTelegram } from '../../hooks/useTelegram';

import Header from '../../components/Header/Header';
import ChatHistory from '../../components/ChatHistory/ChatHistory';
import CustomTextArea from '../../components/CustomTextArea/CustomTextArea';

import { useAtom } from 'jotai';
import { chatHistoryAtom, isClear } from '../../store/atoms';

import s from './home.module.scss';

const Home = () => {
  const { onClose, user } = useTelegram();

  const [chatHistory] = useAtom(chatHistoryAtom);
  const [clear] = useAtom(isClear);

  return (
    <div className={s.container}>
      <div className={s.header}>
        <Header />
      </div>

      <div className={s.chatHistory}>
        {chatHistory.length !== 0 ? (
          <ChatHistory chatHistory={chatHistory} />
        ) : (
          <div className={s.wrapHello}>
            {clear ? (
              <h1>Ну и зачем очистил?</h1>
            ) : (
              <h1>
                Привет, <span className={s.user}>{user?.first_name}</span> <br /> Чем я могу помочь?
              </h1>
            )}
          </div>
        )}
      </div>

      <div className={s.customTextarea}>
        <CustomTextArea />
      </div>
    </div>
  );
};

export default Home;
