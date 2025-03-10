import { useState, useEffect, useRef } from 'react';

import { useTelegram } from '../../hooks/useTelegram';

import Header from '../../components/Header/Header';
import ChatHistory from '../../components/ChatHistory/ChatHistory';
import CustomTextArea from '../../components/CustomTextArea/CustomTextArea';
import Drawer from '../../components/Drawer/Drawer';

import { useAtom } from 'jotai';
import { chatHistoryAtom, isClear, activeModelAI } from '../../store/atoms';


import { messages } from '../../messages';

import s from './home.module.scss';

const Home = () => {
  const { user } = useTelegram();

  // const [open, setOpen] = useAtom(openDrawer);
  const [chatHistory, setChatHistory] = useAtom(chatHistoryAtom);
  const [clear] = useAtom(isClear);
  const [randomMessage, setRandomMessage] = useState('');
  const [activeModel] = useAtom(activeModelAI);

  const homeRef = useRef(null);

  useEffect(() => {
    setRandomMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, [chatHistory.length === 0]);

    useEffect(() => {
        if (homeRef.current) {
            homeRef.current.scrollTo({
                top: homeRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [chatHistory]);

    return (
    <div className={s.home} ref={homeRef}>
      <div className={s.wrapper}>
        <Drawer />
      </div>
      <div className={s.header}>
        <Header />
      </div>
      <div className={s.container}>
        <div className={s.chatHistory}>
          {chatHistory.length !== 0 ? (
            <ChatHistory chatHistory={chatHistory} setChatHistory={setChatHistory} />
          ) : (
            <div className={s.wrapHello}>
              {clear ? (
                <h1>{randomMessage}</h1>
              ) : (
                <h1>
                  Привет, <span className={s.user}>{user?.first_name || 'Друг'}</span> <br /> Чем я
                  могу помочь?
                </h1>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={s.customTextarea}>
        <CustomTextArea />
        <p>{activeModel}</p>
      </div>
    </div>
  );
};

export default Home;
