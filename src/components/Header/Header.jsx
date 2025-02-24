import React from 'react';
import { Menu } from 'lucide-react';

import s from './header.module.scss';

const Header = () => {
  return (
    <div className={s.header}>
      <Menu />

      <button>clear</button>
    </div>
  );
};

export default Header;
