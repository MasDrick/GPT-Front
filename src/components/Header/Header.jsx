import { useState } from 'react';
import { Menu, Eraser } from 'lucide-react';

import { m, AnimatePresence } from 'framer-motion'; // 🎯 Импорт анимации


import s from './header.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {setOpenDrawer, setClearChat} from "../../slices/headerSlice.js";
import {setChatHistory} from "../../slices/chatHistorySlice.js";

const Header = () => {

  const [openModal, setOpenModal] = useState(false);

  const history = useSelector((state) => state.chatHistory.chatHistory);

  const dispatch = useDispatch();

  const onClickEraser = () => {
    if (history.length !== 0) {
      setOpenModal(true);
    }
  };


  const clearHistory = () => {
    dispatch(setChatHistory([]));
      // setHistory([]);
    dispatch(setClearChat(true));
    setOpenModal(false);

    localStorage.removeItem('chatHistory'); // Удаляем из localStorage
  };

  return (
    <div className={s.header}>
      <Menu onClick={() => dispatch(setOpenDrawer(true))} className={s.btn} />

      <Eraser
        className={`${s.btn} ${history.length === 0 ? s.unactive : ''}`}
        onClick={onClickEraser}
      />

      {/* Анимация модального окна */}
      <AnimatePresence>
        {openModal && (
          <m.div
            className={s.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }} // Плавное исчезновение
          >
            <m.div
              className={s.modal}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }} // Анимация масштабирования
            >
              <h2>Вы хотите удалить чат?</h2>
              <div className={s.btns}>
                <button onClick={clearHistory} className={s.yes}>
                  да
                </button>
                <button onClick={() => setOpenModal(false)}>нет</button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
