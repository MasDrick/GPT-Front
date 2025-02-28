import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { useAtom } from 'jotai';
import { openDrawer, activeModelAI } from '../../store/atoms';
import { menuTextItems } from '../../messages';

import { useTelegram } from '../../hooks/useTelegram';

import s from './drawer.module.scss';

import { ChevronDown } from 'lucide-react';

const Drawer = () => {
  const [open, setOpen] = useAtom(openDrawer);
  const { tg, user } = useTelegram();

  // Храним только один открытый пункт (по умолчанию первый)
  const [expandedKey, setExpandedKey] = useState(0);

  // Состояние активной модели
  const [activeModel, setActiveModel] = useState('1');
  const [currentModel, setCurrentModel] = useAtom(activeModelAI);

  // Функция очистки эмодзи из строки
  const removeEmoji = (text) =>
    text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();

  // Функция обработки выбора модели
  const handleItemClick = (child) => {
    setActiveModel(child.key);
    setCurrentModel(removeEmoji(child.label));
  };

  // Функция переключения родительского пункта (разворачиваем только один)
  const handleToggle = (index) => {
    setExpandedKey((prevKey) => (prevKey === index ? null : index));
  };

  // Логируем актуальную модель после обновления
  useEffect(() => {
    console.log('Selected:', currentModel);
  }, [currentModel]);

  return (
    <>
      {/* Боковая панель */}
      <m.div
        className={s.drawer}
        initial={{ x: '-100%' }}
        animate={{ x: open ? 0 : '-100%' }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}>
        <div className={s.title}>
          <h3>Выбор модели</h3>
        </div>

        <div className={s.menuContainer}>
          {/* Меню */}
          {menuTextItems.map((item, index) => (
            <div key={index} className={s.menuItem}>
              {/* Родительский пункт с анимацией */}
              <m.span
                whileTap={{ scale: 0.95 }}
                onClick={() => handleToggle(index)}
                className={`${s.menuLabel} ${expandedKey === index ? s.active : ''}`}>
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
                animate={expandedKey === index ? 'visible' : 'hidden'}
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

        {/* Блок с пользователем */}
        <section className={s.user}>
          <div className={s.userInfo}>
            <img src={user?.photo_url || '/john.jpg'} alt="avatar" className={s.avatar} />
            <div className={s.names}>
              <h4>{user?.first_name || 'firstName'}</h4>
              <p>@{user?.username || 'username'} </p>
            </div>
          </div>
        </section>
      </m.div>

      {/* Затемнение фона при открытом меню */}
      {open && <div onClick={() => setOpen(false)} className={s.overlay}></div>}
    </>
  );
};

export default Drawer;
