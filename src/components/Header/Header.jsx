import React from 'react';
import { Menu, Eraser } from 'lucide-react';

import { useAtom } from 'jotai';
import { chatHistoryAtom, isClear, openDrawer } from '../../store/atoms';

import s from './header.module.scss';

const Header = () => {
  const [history, setHistory] = useAtom(chatHistoryAtom);
  const [, setClear] = useAtom(isClear);
  const [, setOpen] = useAtom(openDrawer);

  const clearHistory = () => {
    if (history.length !== 0) {
      setHistory([]);
      setClear(true);
    }
  };

  return (
    <div className={s.header}>
      <Menu onClick={() => setOpen(true)} className={s.btn} />

      <Eraser className={s.btn} onClick={clearHistory} />
    </div>
  );
};

export default Header;
