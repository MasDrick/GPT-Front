import { useState } from 'react';

import { useTelegram } from '../../hooks/useTelegram';

import Header from '../../components/Header/Header';
import CustomTextArea from '../../components/CustomTextArea/CustomTextArea';

import s from './home.module.scss';

const Home = () => {
  const { onClose, user } = useTelegram();

  const [message, setMessage] = useState('');

  return (
    <div className={s.container}>
      <Header />
      <h1>
        Привет, <span className={s.user}>{user?.first_name}</span> <br /> Чем я могу помочь?
      </h1>

      <CustomTextArea />
    </div>
  );
};

export default Home;
