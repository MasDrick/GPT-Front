import React from 'react';
import { useAtom } from 'jotai';

import { openDrawer } from '../../store/atoms';

import s from './drawer.module.scss';

const Drawer = () => {
  const [, setOpen] = useAtom(openDrawer);
  return (
    <>
      <div className={s.drawer}>Тут будет суета, ждите</div>
      <div onClick={() => setOpen(false)} className={s.overlay}></div>
    </>
  );
};

export default Drawer;
