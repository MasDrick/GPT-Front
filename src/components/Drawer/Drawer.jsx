import React from 'react';
import { useAtom } from 'jotai';

import { Menu } from 'antd';
import { Brain } from 'lucide-react';

import { openDrawer } from '../../store/atoms';

import { m } from 'framer-motion';

import s from './drawer.module.scss';

const Drawer = () => {
  const [open, setOpen] = useAtom(openDrawer);

  const items = [
    {
      key: 'sub4',
      label: 'Navigation Three',
      icon: <Brain />,
      children: [
        {
          key: '9',
          label: 'gpt-4o',
        },
        {
          key: '10',
          label: 'gpt-4o-mini',
        },
        {
          key: '11',
          label: 'deepseek-R1',
        },
        {
          key: '12',
          label: 'evil',
        },
      ],
    },
  ];

  const onClick = (e) => {
    console.log('click ', e);
  };
  return (
    <>
      <m.div
        className={s.drawer}
        initial={{ x: '-100%' }} // Начальное положение (за пределами экрана)
        animate={{ x: open ? 0 : '-100%' }} // Позиция при открытии/закрытии
        exit={{ x: '-100%' }} // Позиция при удалении из DOM
        transition={{ type: 'spring', stiffness: 300, damping: 21 }}>
        <Menu
          onClick={onClick}
          style={{
            minWidth: 0,
          }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          items={items}
        />
      </m.div>

      {/* Фоновая затемненная область */}
      {open && <div onClick={() => setOpen(false)} className={s.overlay}></div>}
    </>
  );
};

export default Drawer;
