import { useState, useEffect } from 'react';

import { useTelegram } from '../../hooks/useTelegram';

import Header from '../../components/Header/Header';
import ChatHistory from '../../components/ChatHistory/ChatHistory';
import CustomTextArea from '../../components/CustomTextArea/CustomTextArea';
import Drawer from '../../components/Drawer/Drawer';

import { useAtom } from 'jotai';
import { chatHistoryAtom, isClear, openDrawer } from '../../store/atoms';

import { messages } from '../../messages';

import s from './home.module.scss';

const Home = () => {
  const { user } = useTelegram();

  const [open, setOpen] = useAtom(openDrawer);

  const [chatHistory] = useAtom(chatHistoryAtom);
  const [clear] = useAtom(isClear);

  const [randomMessage, setRandomMessage] = useState('');

  // Функция для выбора случайного сообщения
  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  useEffect(() => {
    setRandomMessage(getRandomMessage());
  }, [chatHistory.length === 0]);

  return (
    <>
      <div className={s.wrapper}>
        <Drawer />
        <div className={s.header}>
          <Header />
        </div>
      </div>

      <div className={s.container}>
        <div className={s.chatHistory}>
          {chatHistory.length !== 0 ? (
            <ChatHistory chatHistory={chatHistory} />
          ) : (
            <div className={s.wrapHello}>
              {clear ? (
                <h1>{randomMessage}</h1>
              ) : (
                <h1>
                  Привет, <span className={s.user}>{user?.first_name}</span> <br /> Чем я могу
                  помочь?
                </h1>
              )}
            </div>
          )}
        </div>

        <div className={s.customTextarea}>
          <CustomTextArea />
        </div>
      </div>
    </>
  );
};

export default Home;
