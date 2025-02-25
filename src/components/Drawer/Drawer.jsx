import React from 'react';
import { useAtom } from 'jotai';

import { openDrawer } from '../../store/atoms';

import { m } from 'framer-motion';

import s from './drawer.module.scss';

const Drawer = () => {
  const [open, setOpen] = useAtom(openDrawer);
  return (
    <>
      <m.div
        className={s.drawer}
        initial={{ x: '-100%' }} // Начальное положение (за пределами экрана)
        animate={{ x: open ? 0 : '-100%' }} // Позиция при открытии/закрытии
        exit={{ x: '-100%' }} // Позиция при удалении из DOM
        transition={{ type: 'spring', stiffness: 300, damping: 21 }}>
        Тут будет суета, ждите
      </m.div>

      {/* Фоновая затемненная область */}
      {open && <div onClick={() => setOpen(false)} className={s.overlay}></div>}
    </>
  );
};

export default Drawer;
