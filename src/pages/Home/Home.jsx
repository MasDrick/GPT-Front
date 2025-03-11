import { useState, useEffect, useRef } from 'react';

import { useTelegram } from '../../hooks/useTelegram';

import Header from '../../components/Header/Header';
import ChatHistory from '../../components/ChatHistory/ChatHistory';
import CustomTextArea from '../../components/CustomTextArea/CustomTextArea';
import Drawer from '../../components/Drawer/Drawer';


import { messages } from '../../messages';

import s from './home.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {setChatHistory} from "../../slices/chatHistorySlice.js";


const Home = () => {
  const { user } = useTelegram();

  const chatHistory = useSelector(state => state.chatHistory.chatHistory);

  const dispatch = useDispatch();

  const clear = useSelector(state => state.headerSlice.clearChat);

  const [randomMessage, setRandomMessage] = useState('');
  const activeModel = useSelector(state => state.activeModel.currentModel);

  const homeRef = useRef(null);


  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        console.log('Загруженная история из localStorage:', parsedHistory);
        dispatch(setChatHistory(parsedHistory));
      } catch (error) {
        console.error('Ошибка парсинга истории из localStorage:', error);
        dispatch(setChatHistory([]));
      }
    }
  }, [dispatch]);

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
            <ChatHistory />
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
