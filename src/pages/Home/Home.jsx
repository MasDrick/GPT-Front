import { useState, useEffect } from 'react';

import { useTelegram } from '../../hooks/useTelegram';

import Header from '../../components/Header/Header';
import CustomTextArea from '../../components/CustomTextArea/CustomTextArea';

import { useAtom } from 'jotai';
import { messageUser, answerBot } from '../../store/atoms';

import s from './home.module.scss';

const Home = () => {
  const { onClose, user } = useTelegram();

  const [message] = useAtom(messageUser);
  const [answer] = useAtom(answerBot);

  return (
    <div className={s.container}>
      <Header />

      {message !== '' ? (
        <div className={s.content}>
          <div className={`${s.userMes} ${s.messageBox}`}>
            <p>{message}</p>
          </div>
          <div className={`${s.bot} ${s.messageBox}`}>
            <p>{answer}</p>
          </div>
        </div>
      ) : (
        <h1>
          Привет, <span className={s.user}>{user?.first_name}</span> <br /> Чем я могу помочь?
        </h1>
      )}

      <CustomTextArea />
    </div>
  );
};

export default Home;
