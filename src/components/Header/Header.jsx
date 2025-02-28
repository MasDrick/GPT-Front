import React from 'react';
import { useState } from 'react';
import { Menu, Eraser } from 'lucide-react';

import { useAtom } from 'jotai';
import { chatHistoryAtom, isClear, openDrawer, activeModelAI } from '../../store/atoms';

import s from './header.module.scss';

const Header = () => {
  const [history, setHistory] = useAtom(chatHistoryAtom);
  const [, setClear] = useAtom(isClear);
  const [, setOpen] = useAtom(openDrawer);
  const [openModal, setOpenModal] = useState(false);
  const [activeModel] = useAtom(activeModelAI);

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

      <h1>{activeModel}</h1>

      <Eraser
        className={`${s.btn} ${history.length === 0 ? s.unactive : ''}`}
        onClick={onClickEraser}
      />
      {openModal && (
        <div className={s.overlay}>
          <div className={s.modal}>
            <h2>Вы хотите удалить чат?</h2>
            <div className={s.btns}>
              <button onClick={clearHistory} className={s.yes}>
                да
              </button>
              <button onClick={() => setOpenModal(false)}>нет</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
