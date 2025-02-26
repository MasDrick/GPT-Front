import React, { useState } from 'react';
import { m } from 'framer-motion';
import { useAtom } from 'jotai';
import { openDrawer } from '../../store/atoms';
import s from './drawer.module.scss';

const Drawer = () => {
  const [open, setOpen] = useAtom(openDrawer);

  // Состояние для отслеживания развернутых пунктов меню
  const [expandedKeys, setExpandedKeys] = useState([]);

  // Данные для меню
  const menuItems = [
    {
      label: 'Текст',
      children: [
        { key: '1', label: 'gpt-4o' },
        { key: '2', label: 'gpt-4o-mini' },
        { key: '3', label: 'deepseek-R1' },
        { key: '4', label: 'evil' },
      ],
    },
  ];

  // Обработчик клика по пункту меню
  const handleItemClick = (key) => {
    console.log('Selected:', key);
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
        transition={{ type: 'spring', stiffness: 300, damping: 21 }}>
        <div className={s.menuContainer}>
          {/* Рендеринг меню */}
          {menuItems.map((item, index) => (
            <div key={index} className={s.menuItem}>
              {/* Родительский пункт с анимацией */}
              <m.span
                whileTap={{ scale: 0.95 }} // Эффект нажатия
                onClick={() => handleToggle(index)}
                className={s.menuLabel}>
                {item.label}
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
                    className={s.subMenuItem}
                    onClick={() => handleItemClick(child.key)}>
                    {child.label}
                  </li>
                ))}
              </m.ul>
            </div>
          ))}
        </div>
      </m.div>

      {/* Фоновая затемненная область */}
      {open && <div onClick={() => setOpen(false)} className={s.overlay}></div>}
    </>
  );
};

export default Drawer;
