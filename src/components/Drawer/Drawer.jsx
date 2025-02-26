import React, { useState } from 'react';
import { m } from 'framer-motion';
import { useAtom } from 'jotai';
import { openDrawer } from '../../store/atoms';
import { menuTextItems } from '../../messages';

import { useTelegram } from '../../hooks/useTelegram';

import s from './drawer.module.scss';

import { ChevronDown } from 'lucide-react';

const Drawer = () => {
  const [open, setOpen] = useAtom(openDrawer);

  const { tg } = useTelegram();

  // Состояние для отслеживания развернутых пунктов меню
  const [expandedKeys, setExpandedKeys] = useState([0]); // По умолчанию разворачиваем первый пункт

  // Состояние для отслеживания активных моделей
  const [activeModel, setActiveModel] = useState('1'); // По умолчанию активна модель с key: '1'

  // Обработчик клика по пункту меню
  const handleItemClick = (child) => {
    setActiveModel(child.key); // Обновляем активную модель
    console.log('Selected:', child.label);
    console.log(tg.initData);
  };

  // Обработчик клика по родительскому пункту
  const handleToggle = (index) => {
    setExpandedKeys((prevKeys) =>
      prevKeys.includes(index) ? prevKeys.filter((key) => key !== index) : [...prevKeys, index],
    );
  };

  return (
    <>
      {/* Боковая панель */}
      <m.div
        className={s.drawer}
        initial={{ x: '-100%' }}
        animate={{ x: open ? 0 : '-100%' }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}>
        <div className="null">
          <h4>Хз че сюда вставить</h4>
        </div>

        <div className={s.menuContainer}>
          {/* Рендеринг меню */}
          {menuTextItems.map((item, index) => (
            <div key={index} className={s.menuItem}>
              {/* Родительский пункт с анимацией */}
              <m.span
                whileTap={{ scale: 0.95 }} // Эффект нажатия
                onClick={() => handleToggle(index)}
                className={`${s.menuLabel} ${expandedKeys.includes(index) ? s.active : ''}`}>
                {item.label}
                <ChevronDown size={20} />
              </m.span>

              {/* Подменю с анимацией */}
              <m.ul
                variants={{
                  hidden: { opacity: 0, height: 0 },
                  visible: { opacity: 1, height: 'auto' },
                }}
                initial="hidden"
                animate={expandedKeys.includes(index) ? 'visible' : 'hidden'}
                transition={{ duration: 0.3 }}
                className={s.subMenu}>
                {item.children.map((child) => (
                  <li
                    key={child.key}
                    className={`${s.subMenuItem} ${activeModel === child.key ? s.activeModel : ''}`}
                    onClick={() => handleItemClick(child)}>
                    {child.label}
                  </li>
                ))}
              </m.ul>
            </div>
          ))}
        </div>

        <section className={s.user}>
          <div className={s.userInfo}>
            <img src="/masdrick.jpg" alt="avatar" className={s.avatar} />
            <div className={s.names}>
              <h4>BigMaksonchik</h4>
              <p>@MasDrick</p>
            </div>
          </div>
        </section>
      </m.div>

      {/* Фоновая затемненная область */}
      {open && <div onClick={() => setOpen(false)} className={s.overlay}></div>}
    </>
  );
};

export default Drawer;
