import React from 'react';

import s from './header.module.scss';

const Header = () => {
  return (
    <div className={s.header}>
      <button>Burger</button>

      <button>clear</button>
    </div>
  );
};

export default Header;
