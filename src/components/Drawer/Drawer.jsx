import {useState, useEffect} from 'react';
import {m} from 'framer-motion';

import {menuTextItems} from '../../messages';

import {Link} from 'react-router';


import {useTelegram} from '../../hooks/useTelegram';

import {useDispatch, useSelector} from 'react-redux';
import {setCurrentModel} from '../../slices/activeModelSlice.js';

import s from './drawer.module.scss';

import {ChevronDown, SquareArrowOutUpRight} from 'lucide-react';
import {setOpenDrawer} from "../../slices/headerSlice.js";

const Drawer = () => {

  const {user} = useTelegram();

  const dispatch = useDispatch();

  const currentModel = useSelector((state) => state.activeModel.currentModel);
  const openDrawer = useSelector((state) => state.headerSlice.open)

  // Храним только один открытый пункт (по умолчанию первый)
  const [expandedKey, setExpandedKey] = useState(0);

  // Состояние активной модели
  const [activeModel, setActiveModel] = useState('1');


  // Функция очистки эмодзи из строки
  const removeEmoji = (text) =>
    text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();


  // Функция обработки выбора модели

  const handleItemClick = async (child) => {
    setActiveModel(child.key);
    const selectedModel = removeEmoji(child.label);

    dispatch(setCurrentModel(selectedModel));
  };

  // Функция переключения родительского пункта (разворачиваем только один)
  const handleToggle = (index) => {
    setExpandedKey((prevKey) => (prevKey === index ? null : index));
  };

  return (
    <>
      {/* Боковая панель */}
      <m.div
        className={s.drawer}
        initial={{x: '-100%'}}
        animate={{x: openDrawer ? 0 : '-100%'}}
        exit={{x: '-100%'}}
        transition={{type: 'spring', stiffness: 350, damping: 20}}>
        <div className={s.title}>
          <h3>Выбор модели</h3>
        </div>

        <div className={s.menuContainer}>
          {/* Меню */}
          {menuTextItems.map((item, index) => (
            <div key={index} className={s.menuItem}>
              {/* Родительский пункт с анимацией */}
              <m.span
                whileTap={{scale: 0.95}}
                onClick={() => handleToggle(index)}
                className={`${s.menuLabel} ${expandedKey === index ? s.active : ''}`}>
                {item.label}
                <ChevronDown size={20}/>
              </m.span>

              {/* Подменю с анимацией */}
              <m.ul
                variants={{
                  hidden: {opacity: 0, height: 0},
                  visible: {opacity: 1, height: 'auto'},
                }}
                initial="hidden"
                animate={expandedKey === index ? 'visible' : 'hidden'}
                transition={{duration: 0.3}}
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
          <Link className={s.link} to="/develop">
            <span className={s.menuLabel}>
              Google Dino 🦖 <SquareArrowOutUpRight size={15} style={{marginRight: '2px'}}/>
            </span>
          </Link>
          <Link className={s.link} to="/develop">
            <span className={s.menuLabel}>
              Flappy Bird 🦜 <SquareArrowOutUpRight size={15} style={{marginRight: '2px'}}/>
            </span>
          </Link>
        </div>

        {/* Блок с пользователем */}
        <section className={s.user}>
          <div className={s.userInfo}>
            <img src={user?.photo_url || '/john.jpg'} alt="avatar" className={s.avatar}/>
            <div className={s.names}>
              <h4>{user?.first_name || 'firstName'}</h4>
              <p>@{user?.username || 'username'} </p>
            </div>
          </div>
        </section>
      </m.div>

      {/* Затемнение фона при открытом меню */}
      {openDrawer && <div onClick={() => dispatch(setOpenDrawer(false))} className={s.overlay}></div>}
    </>
  );
};

export default Drawer;
