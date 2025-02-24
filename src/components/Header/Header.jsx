import React from 'react';
import { Menu, Eraser } from 'lucide-react';

import s from './header.module.scss';

const Header = () => {
  return (
    <div className={s.header}>
      <Menu />

      <Eraser />
    </div>
  );
};

export default Header;
