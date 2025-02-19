import React from 'react';

import s from './home.module.scss';
const tg = window.Telegram.WebApp;

const Home = () => {
  const onClose = () => {
    tg.close();
  };

  const handleClick = () => {
    alert('Ну нихуя ты фокусник!');
  };

  return (
    <div>
      <h1>Здарова, {tg.initDataUnsafe?.user?.username}</h1>
      <button onClick={handleClick} className={s.btn}>
        Нажми меня
      </button>
      <button onClick={onClose} className={s.btn}>
        Закрыть
      </button>
    </div>
  );
};

export default Home;
