import React, { useState } from 'react';
import { Menu, Eraser } from 'lucide-react';
import { useAtom } from 'jotai';
import { m, AnimatePresence } from 'framer-motion'; // 🎯 Импорт анимации

import { chatHistoryAtom, isClear, openDrawer } from '../../store/atoms';
import s from './header.module.scss';

const Header = () => {
  const [history, setHistory] = useAtom(chatHistoryAtom);
  const [, setClear] = useAtom(isClear);
  const [, setOpen] = useAtom(openDrawer);
  const [openModal, setOpenModal] = useState(false);

  const onClickEraser = () => {
    if (history.length !== 0) {
      setOpenModal(true);
    }
  };
  const clearHistory = () => {
    setHistory([]);
    setClear(true);
    setOpenModal(false);
  };

  return (
    <div className={s.header}>
      <Menu onClick={() => setOpen(true)} className={s.btn} />

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
